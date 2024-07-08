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

import { BaseSelect } from "../../../base";
import { FastField, Formik } from "formik";
import { setToastNotification } from "../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../store/constant";
import { consentEmailBodyInitialValues } from "../../helpers/InitialValues/ConsentEmail.js";
import { consentEmailSchema } from "../../helpers/Schema/ConsentEmail.js";
import {
  EditConsentEmail,
  submitConsentEmail,
} from "../../../../store/actions/systemAdminActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

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

const AddConsentEmailBodyModal = ({ open, handleClose, editId }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [emailBody, setEmailBody] = useState(null);

  const { selectedOrg, consentEmailsLists } = useSelector(
    (state) => state.systemAdmin
  );

  const { orgPackagesLists } = useSelector((state) => state.hr);

  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    if (String(emailBody).length <= 21) {
      return dispatch(
        setToastNotification(
          ERROR,
          "Please Provide a valid email body!",
          logDetails
        )
      );
    }

    let body = {
      consentHtmlText: emailBody,
    };

    if (editId) {
      dispatch(EditConsentEmail(body, editId, selectedOrg, logDetails));
    } else {
      dispatch(
        submitConsentEmail(
          body,
          {
            orgId: selectedOrg,
            pkgId: values.packageId,
          },
          logDetails
        )
      );
    }
    handleClose();
  };

  let consentEmailInitialValues = useMemo(() => {
    //if user clicks on edit after a email row , that email details
    //as initial values will be populated inside the modal
    if (editId) {
      let matchedEmailData;

      //finding respective email details from email lists using editId
      consentEmailsLists.forEach((curr) => {
        if (curr.id === editId) {
          matchedEmailData = curr;
          return;
        }
      });

      //restoring the matched email body using htmlToDraft
      const blocksFromHtml = htmlToDraft(matchedEmailData.consentHtmlText);
      const { contentBlocks, entityMap } = blocksFromHtml;

      //setting the state to the restored matched email body inside the Editor of react-draft-wysiwyg
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(contentBlocks, entityMap)
        )
      );

      //setting subject and category to that of matched email
      return {
        packageId: matchedEmailData.packageId || "",
      };
    } else {
      //if user clicked on add email template button instead of the edit ,
      //we will simply initialize the default empty values
      return consentEmailBodyInitialValues;
    }
  }, [editId, consentEmailsLists]);

  //when a user inputs something inside the email editor , this useEffect will get called
  useEffect(() => {
    //we will get the email format using convertToRaw and draftToHtml
    let rawEmail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setEmailBody(`<html>${rawEmail}</html>`);
  }, [editorState]);

  return (
    <Formik
      initialValues={consentEmailInitialValues}
      validationSchema={consentEmailSchema}
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
                    component={BaseSelect}
                    name="packageId"
                    label="Select Package"
                    optionLabel="packageName"
                    optionValue="packagesId"
                    options={orgPackagesLists}
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
              <Button variant="standard" onClick={handleClose} disableElevation>
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
          </HrModalBox>
        </Dialog>
      )}
    </Formik>
  );
};

export default AddConsentEmailBodyModal;
