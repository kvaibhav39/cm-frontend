import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Grid, Box, useMediaQuery, Typography } from "@mui/material";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import { Field, Form, Formik } from "formik";
import { InputTextField } from "../../../../common/Form/InputTextField/InputTextField";
import { PhoneNumberTextField } from "../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileInitialValues } from "../helper/InitialValues/updateProfileInitialValues";
import { updateProfileSchema } from "../helper/ValidationSchema/updateProfileSchema";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PanelCard from "../../../../common/cards/PanelCard";
import { updateUserProfileAction } from "../../../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 55vh;
  min-width: 50vw;
  overflow-y: auto;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0px 10px;
`;

const UpdateProfileModal = ({ open, handleClose, userData }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { currentUser } = useSelector((state) => state.authorization);

  const handleSubmit = (values) => {

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(updateUserProfileAction(values, currentUser?.roleId,logDetails));
    handleClose();
  };

  let fieldValues = [
    {
      label: "Name",
      name: "userName",
      component: InputTextField,
      isMandatory: true,
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      component: PhoneNumberTextField,
      isMandatory: true,
    },
  ];

  return (
    <Grid item xs={12}>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxWidth: "none",
            maxHeight: "95vh",
            overflowY: "auto",
            backgroundColor: "#f8f8f8",
          },
        }}
      >
        <Formik
          enableReinitialize
          initialValues={updateProfileInitialValues(
            userData?.userName,
            userData?.phoneNumber
          )}
          validationSchema={updateProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setValues }) => (
            <>
              <Form>
                <HrModalBox>
                  <Box
                    sx={{
                      height: { xs: "25vh", xxl: "20vh" },
                      backgroundColor: theme.palette.primary.main,
                    }}
                    p={1}
                  >
                    <Box display="flex" justifyContent="flex-end">
                      <CloseIcon
                        onClick={handleClose}
                        sx={{
                          cursor: "pointer",
                          color: theme.palette.background.paper,
                        }}
                      />
                    </Box>
                    <Grid
                      item
                      xs={12}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box>
                        <AccountCircleIcon
                          sx={{
                            fontSize: { xxl: "10rem", md: "5rem", xs: "3rem" },
                            color: theme.palette.background.paper,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h4"
                        color={theme.palette.background.paper}
                      >
                        {userData?.userName}'s Profile Details
                      </Typography>
                    </Grid>
                  </Box>
                  {console.log("check", values, errors, touched)}
                  <Box sx={{ padding: "16px" }}>
                    <PanelCard sx={{ minHeight: { xs: "100%", xxl: "35vh" } }}>
                      <StyledDialogContent>
                        <Grid
                          item
                          xs={10}
                          mt={3}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          flexDirection="column"
                          gap={4}
                        >
                          {fieldValues?.map((fieldValue, index) => (
                            <Field
                              component={fieldValue.component}
                              label={fieldValue.label}
                              name={fieldValue.name}
                              id={index}
                              required={fieldValue.isMandatory}
                              error={
                                touched[fieldValue.name] &&
                                errors[fieldValue.name]
                              }
                            />
                          ))}
                        </Grid>
                      </StyledDialogContent>
                      <DialogActions
                        style={
                          smallScreen
                            ? { margin: "15px 0" }
                            : { margin: "15px 35px" }
                        }
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                        >
                          Update
                        </Button>
                      </DialogActions>
                    </PanelCard>
                  </Box>
                </HrModalBox>
              </Form>
            </>
          )}
        </Formik>
      </Dialog>
    </Grid>
  );
};

export default UpdateProfileModal;
