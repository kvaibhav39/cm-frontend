import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { PhoneNumberTextFieldLarge } from "../../../common/Form/PhoneNumberTextField/PhoneNumberTextFieldLarge";
import * as Yup from "yup";
import "yup-phone-lite";
import { Formik, Field, Form, FastField } from "formik";
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "common/AnimateButton";

import { registerUser } from "../../../store/actions/authorizationAction";
import ReCAPTCHA from "react-google-recaptcha";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

// ===========================|| REGISTER ||=========================== //

const userRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const recaptchaRef = React.createRef();

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          fname: "",
          email: "",
          phonenumber: "",
          termsAndConditions: false,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          fname: Yup.string()
            .min(3, "It's too short")
            .max(255)
            .required("Full name is required"),
          phonenumber: Yup.string()
            .phone("*", "Please enter a valid phone number")
            .required("A phone number is required"),
          termsAndConditions: Yup.string().oneOf(
            ["true"],
            "Accept terms & conditions"
          ),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const token = await recaptchaRef.current.executeAsync();
            if (token && scriptedRef.current) {
              let logDetails = getCurrentFileNameAndFunction(
                import.meta.url,
                "onSubmit"
              );
              
              dispatch(
                registerUser(
                  {
                    userName: values.fname,
                    loginEmail: values.email,
                    phoneNumber: values.phonenumber,
                    roleId: 2,
                  },
                  () => {
                    others.onRegisterSuccess(true);
                  },
                  (err) => {
                    setStatus({ success: false });
                    setSubmitting(false);
                  },
                  logDetails
                )
              );
            }
          } catch (err) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setSubmitting(false);
            }
          } finally {
            recaptchaRef.current.reset();
          }
        }}
        enableReinitialize
      >
        {({
          errors,
          handleBlur,
          handleChange,
          isSubmitting,
          touched,
          values,
        }) => (
          <Form>
            <FormControl
              fullWidth
              error={Boolean(touched.fname && errors.fname)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-fname-register">
                Full name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-fname-register"
                type="fname"
                value={values.fname || ""}
                name="fname"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.fname && errors.fname && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-fname-register"
                >
                  {errors.fname}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-register">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email || ""}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <Box mt={1}>
              <Field
                name="phonenumber"
                label="Enter Phone Number"
                placeholder="Enter Phone Number"
                error={errors?.phonenumber && touched?.phonenumber}
                required
                component={PhoneNumberTextFieldLarge}
              />
              {touched.phonenumber && errors.phonenumber && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-phonenumber-register"
                  sx={{ marginLeft: 2 }}
                >
                  {errors.phonenumber}
                </FormHelperText>
              )}
            </Box>

            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.checked}
                      name="termsAndConditions"
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="subtitle1">
                      By Signing up you are agreeing to our&nbsp;
                      <Typography
                        variant="subtitle1"
                        component={Link}
                        to="/terms-and-conditions"
                        target="_blank"
                      >
                        Terms & Conditions
                      </Typography>{" "}
                      and&nbsp;
                      <Typography
                        variant="subtitle1"
                        component={Link}
                        to="/cookies"
                        target="_blank"
                      >
                        Cookies Policy
                      </Typography>
                      .
                    </Typography>
                  }
                />
                {touched.termsAndConditions && errors.termsAndConditions && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-termsAndConditions-register"
                  >
                    {errors.termsAndConditions}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="error">{errors.submit}</Alert>
              </Box>
            )}
            <ReCAPTCHA
              sitekey="6Lel5SciAAAAAEqdiNV0d8xu_irimIFaPDBiQGbh"
              size="invisible"
              ref={recaptchaRef}
            />
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={!values?.termsAndConditions}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default userRegister;
