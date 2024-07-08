import { FastField, Form, Formik } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Box } from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { BaseTextField } from "../../../../base/BaseTextField.jsx";
import { createOrgInitialValues } from "../helpers/createOrgInitialValues.js";
import { createOrgInitialSchema } from "../helpers/createOrgInitialSchema.js";
import CircularLoader from "../../../../../common/CircularLoader.jsx";
import { AutoCompleteIndustry } from "../../../../../common/Form/AutoCompleteIndustries/AutoCompleteIndustries.jsx";
import { PhoneNumberTextField } from "../../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField.jsx";
import { createNewHrAsOps } from "../../../../../store/actions/operationActions.js";
import { LoadingButton } from "@mui/lab";
import { getCurrentFileNameAndFunction } from "../../../../../utils/getCurrentFileNameAndFunction.js";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 500px;
  min-height: 250px;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddHrModal = ({ open, handleClose }) => {
  const { allIndustries } = useSelector((state) => state.organizations);
  const dispatch = useDispatch();

  const handleSubmit = (values, form) => {
    form.setSubmitting(true);

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    if (values?.isVendor) {
      delete values.userName;
      delete values.loginEmail;
      delete values.phoneNumber;
    }

    dispatch(
      createNewHrAsOps(
        values,
        () => {
          form.setSubmitting(false);
        },
        handleClose,
        logDetails
      )
    );
  };

  return (
    <>
      {allIndustries ? (
        <Formik
          enableReinitialize
          initialValues={createOrgInitialValues}
          validationSchema={createOrgInitialSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            submitForm,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <Dialog open={open} onClose={handleClose}>
                <HrModalBox>
                  <DialogTitle>
                    <Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-around"
                      >
                        <Box>
                          <Typography
                            variant="h2"
                            style={{ fontWeight: "normal" }}
                          >
                            Create Organization
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mt={1}
                      >
                        <Box
                          p={1}
                          sx={{
                            background: (theme) =>
                              !values?.isVendor
                                ? theme.palette.primary.main
                                : "none",
                            color: !values?.isVendor ? "#FFF" : "none",
                            borderRadius: "5px 0 0 5px",
                            border: (theme) =>
                              `1px solid ${theme.palette.grey[400]}`,
                            cursor: "pointer",
                            fontWeight: "550",
                          }}
                          onClick={() => setFieldValue("isVendor", false)}
                        >
                          Organization
                        </Box>
                        <Box
                          p={1}
                          sx={{
                            background: (theme) =>
                              values?.isVendor
                                ? theme.palette.warning.main
                                : "none",
                            borderRadius: "0 5px 5px 0",
                            border: (theme) =>
                              `1px solid ${theme.palette.grey[400]}`,
                            cursor: "pointer",
                            fontWeight: "550",
                          }}
                          onClick={() => setFieldValue("isVendor", true)}
                        >
                          Vendor
                        </Box>
                      </Box>
                    </Box>
                  </DialogTitle>
                  <StyledDialogContent>
                    {!values?.isVendor ? (
                      <>
                        <FastField
                          component={BaseTextField}
                          name="userName"
                          label="Full Name*"
                        />
                        <FastField
                          component={BaseTextField}
                          name="loginEmail"
                          label="Email Address*"
                        />
                        <FastField
                          component={PhoneNumberTextField}
                          name="phoneNumber"
                          label="Phone Number*"
                        />
                      </>
                    ) : null}
                    <FastField
                      component={BaseTextField}
                      name="hrOrganizationName"
                      label="Organization Name*"
                    />

                    <FastField
                      name="industriesId"
                      component={AutoCompleteIndustry}
                      error={
                        errors?.industriesId && touched?.industriesId
                          ? errors?.industriesId
                          : ""
                      }
                      margin="none"
                    />
                    <FastField
                      component={BaseTextField}
                      name="hrTeamName"
                      label="Team Name"
                    />
                  </StyledDialogContent>{" "}
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleClose}
                      disableElevation
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      color={values?.isVendor ? "warning" : "primary"}
                      style={{
                        paddingLeft: "30px",
                        paddingRight: "30px",
                        marginLeft: "20px",
                        border: (theme) =>
                          `1px solid ${theme.palette.grey[400]}`,
                      }}
                      type="submit"
                      disableElevation
                      onClick={submitForm}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Add
                    </LoadingButton>
                  </DialogActions>
                </HrModalBox>
              </Dialog>
            </Form>
          )}
        </Formik>
      ) : (
        <CircularLoader />
      )}
    </>
  );
};

export default AddHrModal;
