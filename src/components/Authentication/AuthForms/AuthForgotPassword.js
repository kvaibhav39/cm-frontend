import React, { useState } from "react";
import { useDispatch } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "common/AnimateButton";

// api call using axios
import ReCAPTCHA from "react-google-recaptcha";
import { forgotPassword } from "../../../store/actions/authorizationAction";
import { useEffect } from "react";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const recaptchaRef = React.createRef();
  const [success, setSuccess] = useState(false);
  const [seconds, setSeconds] = useState(120);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  //countdown timer
  useEffect(() => {
    let timer = setInterval(() => {
      if (seconds > 1 && success) {
        setSeconds((prevState) => prevState - 1);
      } else {
        setSuccess(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, success]);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} alignItems="center" justifyContent="center">
          <Box px={4} sx={{ mb: 2 }} textAlign="center">
            <Typography
              variant={matchDownSM ? "h3" : "h2"}
              color={theme.palette.secondary.main}
              fontFamily="Nunito Sans, sans-serif"
            >
              Forgot Password?
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box px={3} sx={{ mb: 2 }} textAlign="center">
            <Typography variant="caption" fontSize="16px">
              Enter your email address below and we'll send you password reset
              OTP.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const token = await recaptchaRef.current.executeAsync();

            let logDetails = getCurrentFileNameAndFunction(
              import.meta.url,
              "onSubmit"
            );

            if (token && scriptedRef.current) {
              dispatch(
                forgotPassword(
                  values,
                  () => {
                    setSuccess(true);
                    setSeconds(120);
                  },
                  logDetails
                )
              );
            }
          } catch (err) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
              setSuccess(false);
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
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email || ""}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>
            {success && (
              <Typography varient="p" sx={{ color: "red" }}>
                You should receive the email with the password reset link within
                2 minutes. The link in the email will be expired after 10
                minutes.
              </Typography>
            )}

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
                  disabled={isSubmitting || success}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  {success ? (
                    <Typography
                      color={theme.palette.grey[700]}
                      fontWeight={500}
                    >
                      Retry in {seconds}s
                    </Typography>
                  ) : (
                    "Send Mail"
                  )}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
