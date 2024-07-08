import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Box, Grid } from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { BaseSelect, BaseTextField } from "../../../base";
import { FastField, Formik } from "formik";
import { setToastNotification } from "../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../store/constant";
import { customEmailBodyInitialValues } from "../../helpers/InitialValues/CustomEmail";
import { customEmailSchema } from "../../helpers/Schema/CustomEmail";
import {
  EditCustomEmail,
  getCustomEmailCategories,
  submitCustomEmail,
} from "../../../../store/actions/systemAdminActions";
import CircularLoader from "../../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 70vw;
  min-height: 90vh;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const AddCustomEmailBodyModal = ({ open, handleClose, editId }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [emailBody, setEmailBody] = useState(null);
  const { selectedOrg, customEmailCategoriesLists, customEmailsLists } =
    useSelector((state) => state.systemAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getCustomEmailCategories({ isSchedulable: 0 }, logDetails));
  }, []);

  const handleSubmit = (values) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    if (String(emailBody).length <= 21) {
      dispatch(
        setToastNotification(
          ERROR,
          "Please Provide a valid email body!",
          logDetails
        )
      );
      return;
    }

    if (editId) {
      let body = {
        emailSubject: values.emailSubject,
        emailBody: emailBody,
      };

      dispatch(EditCustomEmail(body, editId, selectedOrg, logDetails));
    } else {
      let body = {
        emailCategoryId: values.fieldCategory,
        hrOrgId: selectedOrg,
        emailSubject: values.emailSubject,
        emailBody: emailBody,
      };

      dispatch(submitCustomEmail(body, logDetails));
    }
    handleClose();
  };

  let customEmailInitialValues = useMemo(() => {
    //if user clicks on edit after a email row , that email details
    //as initial values will be populated inside the modal
    if (editId) {
      let matchedEmailData;

      //finding respective email details from email lists using editId
      customEmailsLists.forEach((curr) => {
        if (curr.id === editId) {
          matchedEmailData = curr;
          return;
        }
      });

      //restoring the matched email body using htmlToDraft
      const blocksFromHtml = htmlToDraft(matchedEmailData.emailBody);
      const { contentBlocks, entityMap } = blocksFromHtml;

      //setting the state to the restored matched email body inside the Editor of react-draft-wysiwyg
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(contentBlocks, entityMap)
        )
      );

      //setting subject and category to that of matched email
      return {
        emailSubject: matchedEmailData.emailSubject,
        fieldCategory: matchedEmailData.emailCategoryId,
      };
    } else {
      //if user clicked on add email template button instead of the edit ,
      //we will simply initialize the default empty values
      return customEmailBodyInitialValues;
    }
  }, [editId, customEmailsLists]);

  //when a user inputs something inside the email editor , this useEffect will get called
  useEffect(() => {
    //we will get the email format using convertToRaw and draftToHtml
    let rawEmail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setEmailBody(`<html>${rawEmail}</html>`);
  }, [editorState]);

  return (
    <Formik
      initialValues={customEmailInitialValues}
      validationSchema={customEmailSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(form) => (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={false}
        >
          <HrModalBox>
            {customEmailCategoriesLists ? (
              <>
                <StyledDialogContent>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    flexDirection={{ xs: "column", md: "row" }}
                    justifyContent="space-around"
                  >
                    <Grid item xs={12} md={5}>
                      <FastField
                        component={BaseTextField}
                        name="emailSubject"
                        label="Email Subject*"
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <FastField
                        component={BaseSelect}
                        name="fieldCategory"
                        label="Select Category*"
                        optionLabel="emailCategoryName"
                        optionValue="id"
                        options={customEmailCategoriesLists}
                        disabled={editId || false}
                      />
                    </Grid>
                  </Grid>
                  <Editor
                    editorStyle={{
                      minHeight: "85vh",
                      backgroundColor: "rgb(239 239 239)",
                      padding: 10,
                    }}
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                  />
                </StyledDialogContent>
                <DialogActions>
                  <Button
                    variant="standard"
                    onClick={handleClose}
                    disableElevation
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    style={{
                      backgroundColor: selectedOrg ? "#527AFB" : "grey",
                      color: "#fff",
                      paddingLeft: "30px",
                      paddingRight: "30px",
                      marginLeft: "20px",
                      border: `1px solid ${selectedOrg ? "#527AFB" : "grey"}`,
                    }}
                    type="submit"
                    disableElevation
                    onClick={form.submitForm}
                    disabled={!selectedOrg}
                  >
                    {editId ? "Update" : "Add"}
                  </Button>
                </DialogActions>
              </>
            ) : (
              <Box height="75vh">
                <CircularLoader height="100%" size={50} />
              </Box>
            )}
          </HrModalBox>
        </Dialog>
      )}
    </Formik>
  );
};

export default AddCustomEmailBodyModal;
