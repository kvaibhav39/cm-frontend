import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Grid, Typography } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";

// api call using axios
import { useNavigate, useSearchParams } from "react-router-dom";

import YupPassword from "yup-password";

import AuthOrgSelectionField from "./Components/AuthOrgSelectionField";
import AuthCaptchaSubmitBtn from "./Components/AuthCaptchaSubmitBtn";
import AuthResetPwFields from "./Components/AuthResetPwFields";
import { authCaptchaSubmitHandler } from "./Utils/authCaptchaSubmitHandler";
import {
  checkTokenValidation,
  loginUser,
  resetUserPassword,
} from "../../../store/actions/authorizationAction";
import { routeUserAsPerRole } from "./Utils/routeUserAsPerRole";
import { getCurrentFileNameAndFunction } from "./../../../utils/getCurrentFileNameAndFunction";

YupPassword(Yup);
// ============================|| LOGIN ||============================ //

const AuthResetPassword = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recaptchaRef = React.createRef();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      checkTokenValidation(searchParams.get("token"), navigate, logDetails)
    );
  }, []);

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
              {step === 1
                ? "Please set a password that you will use to Login to Application"
                : "Please select your organization"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
          hrOrganizationId: null,
          orgListsLogin: [],
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .required("Password is required")
            .min(
              8,
              "password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special"
            )
            .minLowercase(
              1,
              "password must contain at least 1 lower case letter"
            )
            .minUppercase(
              1,
              "password must contain at least 1 upper case letter"
            )
            .minNumbers(1, "password must contain at least 1 number")
            .minSymbols(
              1,
              "password must contain at least 1 special character"
            ),
          confirmPassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password"), null], "Passwords must match"),
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
        })}
        onSubmit={(
          values,
          { setErrors, setStatus, setSubmitting, setFieldValue, setTouched }
        ) => {
          {
            /*
          step - 1 : resetting pw
          step - 2 : selecting multi org         
          */
          }

          let logDetails = getCurrentFileNameAndFunction(
            import.meta.url,
            "onSubmit"
          );

          if (step === 1) {
            //normal reset pw flow
            authCaptchaSubmitHandler(
              recaptchaRef,
              scriptedRef,
              dispatch,
              resetUserPassword,
              {
                password: values.password,
                confirmPassword: values.confirmPassword,
                token: searchParams.get("token"),
              },
              (res = "") => {
                //on success callback
                if (res?.selectOrg && res?.hrOrganizations?.length > 0) {
                  //if candidate is present in multiple orgs,
                  //then we would directly navigate user to org selection i.e step 2

                  setStep(2);
                  setFieldValue("orgListsLogin", res?.hrOrganizations);
                  setFieldValue("email", res?.loginEmail);
                  setTouched("hrOrganizationId", false);
                  setSubmitting(false);
                } else {
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
          } else if (step === 2) {
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

                //to route
                routeUserAsPerRole(res, navigate);
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
            {step === 1 ? (
              <AuthResetPwFields
                touched={touched}
                errors={errors}
                theme={theme}
                values={values}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            ) : step === 2 && values?.orgListsLogin?.length ? (
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
              isSubmitting={isSubmitting}
              submitText={step === 2 ? "Sign In" : "Reset Password"}
            />
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthResetPassword;
