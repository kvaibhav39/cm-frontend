import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Grid, Box } from "@mui/material";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import { Field, Form, Formik } from "formik";
import { MultipleCandidateInitialValues } from "../../helper/InitialState/MultipleCandidates";
import { MultipleCandidatesSchema } from "../../helper/ValidationSchema/MultipleCandidates";
import { InputTextField } from "../../../../common/Form/InputTextField/InputTextField";
import { PhoneNumberTextField } from "../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import { useDispatch } from "react-redux";
import { addMultipleCandidates } from "../../../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
  min-height: 55vh;
  min-width: 50vw;
  overflow-y: scroll;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SetInitialValuesWithSelectedFailedData = ({
  columns,
  selectedFailedData,
  setValues,
}) => {
  //we will extract fieldNames & customfield from the row data
  useEffect(() => {
    let temp = {};

    for (let key in selectedFailedData) {
      if (columns.find((curr) => curr.field === key && curr.field !== "id")) {
        temp[key] = selectedFailedData[key];
      }
    }

    temp.customFields = selectedFailedData?.customFields;
    setValues([temp]);
  }, [columns, selectedFailedData]);

  return <></>;
};

const UpdateFailedDataModal = ({
  open,
  handleClose,
  selectedFailedData,
  columns,
  smallScreen,
  resetOpsCandidatesTableFilters,
}) => {
  const [failedDataFields, setFailedDataFields] = useState([]);
  const dispatch = useDispatch();

  //to display field names & custom fields on ui
  useEffect(() => {
    let resultedArr = [];

    for (let key in selectedFailedData) {
      let temp = {};
      if (columns.find((curr) => curr.field === key && curr.field !== "id")) {
        temp.columnName = key;
        temp.columnValue = selectedFailedData[key];
        temp.mandatory = true;
        resultedArr.push(temp);
      }
    }

    let customFields = [];
    selectedFailedData?.customFields?.forEach((customField) => {
      let temp = {};

      for (let key in customField) {
        temp.columnName = key;
        temp.columnValue = customField[key];
        temp.mandatory = true;
        customFields.push(temp);
      }
    });
    resultedArr.push({ columnName: "customFields", columnValue: customFields });
    setFailedDataFields((prev) => (prev = resultedArr));
  }, []);

  const handleSubmit = (values) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(addMultipleCandidates(values, logDetails,resetOpsCandidatesTableFilters));
    handleClose();
  };

  return (
    <Grid container xs={12}>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxWidth: "none",
            maxHeight: "95vh",
            overflowY: "scroll",
          },
        }}
      >
        <Formik
          enableReinitialize
          initialValues={MultipleCandidateInitialValues}
          validationSchema={MultipleCandidatesSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setValues }) => (
            <Form>
              <SetInitialValuesWithSelectedFailedData
                columns={columns}
                selectedFailedData={selectedFailedData}
                setValues={setValues}
              />
              <HrModalBox>
                <Grid mt={2} display="flex" justifyContent="flex-end">
                  <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
                </Grid>

                <StyledDialogContent>
                  <Box
                    display="grid"
                    gridTemplateColumns={{
                      xs: "repeat(1, 1fr)",
                      md: "repeat(2, 1fr)",
                    }}
                    columnGap={2}
                  >
                    {failedDataFields?.map((curr, index) => (
                      <>
                        {curr.columnName !== "customFields" ? (
                          <Box mt={3}>
                            <Field
                              component={
                                curr?.columnName === "candidatePhone"
                                  ? PhoneNumberTextField
                                  : InputTextField
                              }
                              label={curr.columnName}
                              name={`0.${curr.columnName}`}
                              id={index}
                              required={curr.mandatory}
                              error={
                                Object.keys(touched).length &&
                                touched[0][curr?.columnName] &&
                                Object.keys(errors).length &&
                                errors[0][curr?.columnName]
                              }
                            />
                          </Box>
                        ) : (
                          curr?.columnValue?.map((customField, ind) => (
                            <Box mt={3}>
                              <Field
                                component={
                                  customField?.columnName?.includes("phone")
                                    ? PhoneNumberTextField
                                    : InputTextField
                                }
                                label={customField.columnName}
                                name={`0.customFields[${ind}].${customField.columnName}`}
                                id={index}
                                required={customField.mandatory}
                              />
                            </Box>
                          ))
                        )}
                      </>
                    ))}
                  </Box>
                </StyledDialogContent>
              </HrModalBox>
              <DialogActions
                style={
                  smallScreen ? { margin: 0 } : { margin: "0px 35px 35px" }
                }
              >
                <Button color="primary" variant="contained" type="submit">
                  Register
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Grid>
  );
};

export default UpdateFailedDataModal;
