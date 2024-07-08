import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { Box, Grid, Typography } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";

// api call using axios
import { useNavigate } from "react-router-dom";

import AuthOrgSelectionField from "./Components/AuthOrgSelectionField";
import AuthLoginFields from "./Components/AuthLoginFields";
import AuthCaptchaSubmitBtn from "./Components/AuthCaptchaSubmitBtn";
import { authCaptchaSubmitHandler } from "./Utils/authCaptchaSubmitHandler";
import AuthOTPVerificationFields from "./Components/AuthOTPVerificationFields";
import AuthOtpViaOptions from "./Components/AuthOtpViaOptions";
import {
  chooseOtpMethod,
  loginUser,
  verifyOtp,
} from "../../../store/actions/authorizationAction";
import { ERROR, SUCCESS } from "../../../store/constant";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { routeUserAsPerRole } from "./Utils/routeUserAsPerRole";
import { saveUserCredentialsOnRememberMe } from "./Utils/saveUserCredentialsOnRememberMe";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

// ============================|| LOGIN ||============================ //

const AuthLogin = ({ step, setStep, matchDownMD, theme, ...others }) => {
  const scriptedRef = useScriptRef();
  const [checked, setChecked] = useState(
    localStorage.getItem("RememberedEmail") &&
      localStorage.getItem("RememberedPassword")
      ? true
      : false
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recaptchaRef = React.createRef();
  const [showPassword, setShowPassword] = useState(false);

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
          {step === 1 ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Sign in with Email address
              </Typography>
            </Box>
          ) : step === 3 ? (
            <Typography variant="subtitle1">OTP Verification</Typography>
          ) : null}
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: localStorage.getItem("RememberedEmail") || "",
          password: localStorage.getItem("RememberedPassword") || "",
          hrOrganizationId: null,
          orgListsLogin: [],
          otp: "",
          secret: "",
          otpVia: [],
          token: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required")
            .typeError("Email is required"),
          password: Yup.string()
            .max(255)
            .required("Password is required")
            .typeError("Password is required"),
          hrOrganizationId: Yup.number()
            .nullable()
            .when("orgListsLogin", {
              is: (orgListsLogin) => {
                if (orgListsLogin?.length > 1) {
                  return true;
                }
                return false;
              },
              then: (schema) => schema.required("Organization is required"),
            }),
          otp: Yup.string().when("secret", {
            is: true,
            then: (schema) =>
              schema.required("OTP is required").typeError("OTP is required"),
          }),
        })}
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting, setFieldValue, setTouched }
        ) => {
          {
            /*
          step - 1 : entering email & password
          step - 2 : selecting method via which otp would be sent
          step - 3 : entering the otp to verify
          step - 4 : selecting the org if the candidate is associated with multiple ones 
          */
          }

          let logDetails = getCurrentFileNameAndFunction(
            import.meta.url,
            "onSubmit"
          );

          if (step === 1) {
            //email & password
            dispatch(
              loginUser(
                {
                  email: values.email,
                  password: values.password,
                },
                (res = "") => {
                  //on success callback

                  if (res?.selectOrg && res?.hrOrganizations?.length > 0) {
                    //if candidate is present in multiple orgs,
                    //then we would directly navigate user to org selection i.e step 4

                    setStep(4);
                    setFieldValue("orgListsLogin", res?.hrOrganizations);
                    setTouched("hrOrganizationId", false);
                  } else if (!res?.token) {
                    //if user is only affiliated with one org and no token is present that means
                    //org doesnt have the two-factor authentication enabled ,
                    //so we would simply login the user

                    //remember me check
                    saveUserCredentialsOnRememberMe(checked, values);

                    //to route
                    routeUserAsPerRole(res, navigate);
                  } else {
                    //if user is affiliated with only one org and token is present means
                    //the org has the two-factor auth enabled, so we would move onto the otp verification process

                    setFieldValue("token", res.token);
                    setFieldValue(
                      "messageMethods",
                      res.organizationMessageMethodWithStatus?.messageMethods
                    );
                    setStep(2);
                  }
                },
                (err = "") => {
                  //on failure callback
                  setStatus({ success: false });
                  setErrors({ submit: err });
                  setSubmitting(false);
                },
                logDetails
              )
            );
          } else if (step === 2) {
            if (values.otpVia.length === 0) {
              dispatch(
                setToastNotification(
                  ERROR,
                  "Please select atleast 1 otp method",
                  logDetails
                )
              );
            } else {
              //select otp method
              dispatch(
                chooseOtpMethod(
                  {
                    otpVia: values.otpVia,
                    token: values.token,
                  },
                  (res = "") => {
                    //on success callback
                    setStep(3);
                    setFieldValue("secret", res?.secret);
                    setFieldValue("token", res.token);
                    setSubmitting(true);
                    dispatch(
                      setToastNotification(
                        SUCCESS,
                        "OTP sent successfully",
                        logDetails
                      )
                    );
                  },
                  (err = "") => {
                    //on failure callback
                    setStatus({ success: false });
                    setErrors({ submit: err });
                    setSubmitting(false);
                  },
                  logDetails
                )
              );
            }
          } else if (step === 3) {
            //verify otp
            authCaptchaSubmitHandler(
              recaptchaRef,
              scriptedRef,
              dispatch,
              verifyOtp,
              {
                otp: values.otp,
                secret: values.secret,
                token: values.token,
              },
              (res = "") => {
                //on success callback

                //remember me check
                saveUserCredentialsOnRememberMe(checked, values);

                //to route
                routeUserAsPerRole(res, navigate);
              },
              (err = "") => {
                //on failure callback
                dispatch(setToastNotification(ERROR, err, logDetails));
                setStatus({ success: false });
                setErrors({ submit: err });
                setSubmitting(false);
              },
              logDetails
            );
          } else if (step === 4) {
            //candidate is in multiple orgs
            authCaptchaSubmitHandler(
              recaptchaRef,
              scriptedRef,
              dispatch,
              loginUser,
              {
                email: values.email,
                password: values.password,
                hrOrganizationId: values.hrOrganizationId,
              },
              (res = "") => {
                //on success callback

                if (res?.token) {
                  setFieldValue("token", res.token);
                  setFieldValue(
                    "messageMethods",
                    res.organizationMessageMethodWithStatus?.messageMethods
                  );
                  setStep(2);
                } else {
                  //remember me check
                  saveUserCredentialsOnRememberMe(checked, values);

                  //to route
                  routeUserAsPerRole(res, navigate);
                }
              },
              (err = "") => {
                //on failure callback
                setStatus({ success: false });
                setErrors({ submit: err });
                setSubmitting(false);
              },
              logDetails
            );
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
          setFieldValue,
          setErrors,
          setTouched,
          setSubmitting,
          setStatus,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/*
            //step - 1 : entering email & password
            //step - 2 : selecting method via which otp would be sent
            //step - 3 : entering the otp to verify
            //step - 4 : selecting the org if the candidate is associated with multiple ones 
          */}

            {step === 1 ? (
              <AuthLoginFields
                touched={touched}
                errors={errors}
                theme={theme}
                values={values}
                handleBlur={handleBlur}
                handleChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                checked={checked}
                setChecked={setChecked}
              />
            ) : step === 2 ? (
              <AuthOtpViaOptions
                values={values}
                setFieldValue={setFieldValue}
              />
            ) : step === 3 ? (
              <AuthOTPVerificationFields
                values={values}
                setSubmitting={setSubmitting}
                dispatch={dispatch}
                setFieldValue={setFieldValue}
              />
            ) : step === 4 && values?.orgListsLogin?.length ? (
              <AuthOrgSelectionField
                orgLists={values.orgListsLogin}
                id="org-selection"
                fieldName="hrOrganizationId"
                fieldItemLabel="hrOrganizationName"
                fieldItemValue="hrOrganizationId"
                fieldTextFieldLabel="Organization"
              />
            ) : null}
            <AuthCaptchaSubmitBtn
              recaptchaRef={recaptchaRef}
              isSubmitting={step === 3 ? false : isSubmitting}
              submitText={
                step === 2 ? "Send OTP" : step === 3 ? "Verify" : "Sign in"
              }
            />
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
