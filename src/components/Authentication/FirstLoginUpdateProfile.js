import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// third party
import * as Yup from "yup";
import "yup-phone-lite";
import { Field, Formik } from "formik";

// project imports
import { updateUser } from "../../store/actions/authorizationAction";
import React from "react";
import { PhoneNumberTextField } from "../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import { InputTextField } from "../../common/Form/InputTextField/InputTextField";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

// ===========================|| REGISTER ||=========================== //

const FirstLoginUpdateProfile = ({ ...others }) => {
  const loggedInUser = useSelector((state) => state.authorization.currentUser);
  const dispatch = useDispatch();
  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          textAlign: "center",
          padding: "4rem",
          borderRadius: "10px",
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h1">Tell us about yourself</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        sx={{
          justifyContent: "center",
          padding: "1rem 4rem 4rem 4rem",
          borderRadius: "10px",
        }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            userName: loggedInUser?.userName || "",
            phoneNumber: loggedInUser?.phoneNumber || "",
          }}
          validationSchema={Yup.object().shape({
            userName: Yup.string().max(255).required("User name is required"),
            phoneNumber: Yup.string()
              .phone("*", "Please enter a valid phone number")
              .required("A phone number is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              let logDetails = getCurrentFileNameAndFunction(
                import.meta.url,
                "onSubmit"
              );

              dispatch(
                updateUser(
                  {
                    userName: values?.userName,
                    phoneNumber: values?.phoneNumber || null,
                  },
                  () => {
                    others.onNext();
                  },
                  (err) => {
                    setStatus({ success: false });
                    setErrors({ submit: err });
                    setSubmitting(false);
                  },
                  logDetails
                )
              );
            } catch (err) {
              setStatus({ success: false });
              setErrors({ submit: err });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form
              className="Organization-form"
              noValidate
              onSubmit={handleSubmit}
              {...others}
            >
              <Grid
                item
                sm={12}
                sx={{
                  margin: "1rem",
                  justifyContent: "center",
                }}
              >
                <Field
                  name="userName"
                  label="Your Name"
                  placeholder="Enter your name"
                  error={errors?.userName && touched?.userName}
                  required
                  component={InputTextField}
                />
              </Grid>
              <Grid
                item
                sm={12}
                sx={{
                  margin: "1rem",
                  justifyContent: "center",
                }}
              >
                <Field
                  name="phoneNumber"
                  label="Enter Phone Number"
                  placeholder="Enter Phone Number"
                  error={errors?.phoneNumber && touched?.phoneNumber}
                  required
                  component={PhoneNumberTextField}
                />
              </Grid>
              <Grid
                container
                spacing={3}
                xs={8}
                md={12}
                sx={{
                  padding: "4rem",
                  marginLeft: "0rem",
                  borderRadius: "10px",
                  justifyContent: "center",
                }}
              >
                <Button
                  disabled={isSubmitting}
                  disableElevation
                  type="submit"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    width: "100%",
                  }}
                >
                  Next
                </Button>
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
    </>
  );
};

export default FirstLoginUpdateProfile;
