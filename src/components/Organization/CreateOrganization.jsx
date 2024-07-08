// api call using axios
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// material-ui
import { Button, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AutoCompleteIndustry } from "../../common/Form/AutoCompleteIndustries/AutoCompleteIndustries";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import {
  addOrganization,
  getAllIndustries,
} from "../../store/actions/organizationAction";
import { InputTextField } from "../../common/Form/InputTextField/InputTextField";
import CircularLoader from "../../common/CircularLoader";
import { useEffect } from "react";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

// ===========================|| REGISTER ||=========================== //

const CreateOrganization = ({ ...others }) => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allIndustries } = useSelector((state) => state.organizations);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getAllIndustries(logDetails));
  }, []);

  return (
    <Grid item xs={12} md={6} xxl={4}>
      {allIndustries ? (
        <Formik
          initialValues={{
            industriesId: [],
            hrOrganizationName: "",
            hrTeamName: "Default Team",
          }}
          validationSchema={Yup.object().shape({
            hrOrganizationName: Yup.string()
              .max(255)
              .required("Organization name is required"),
            industriesId: Yup.array()
              .min(1, "Minimun of 1 is industry required")
              .max(3, "Maximum 3 industries are allowed")
              .required("Please select any industry"),
            hrTeamName: Yup.string().max(255).required("Team name is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                let logDetails = getCurrentFileNameAndFunction(
                  import.meta.url,
                  "onSubmit"
                );

                dispatch(
                  addOrganization(
                    {
                      hrOrganizationName: values.hrOrganizationName,
                      hrOrganizationDisplayName: values.hrOrganizationName,
                      hrTeamName: values.hrTeamName,
                      industriesId: values.industriesId,
                    },
                    navigate,
                    (err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err });
                      setSubmitting(false);
                    },
                    logDetails
                  )
                );
              }
            } catch (err) {
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err });
                setSubmitting(false);
              }
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
            <Form>
              <Grid
                item
                xs={12}
                sx={{
                  margin: "1rem",
                }}
              >
                <Field
                  name="hrOrganizationName"
                  label="Organization Name"
                  placeholder="Enter Organization Name"
                  error={
                    errors?.hrOrganizationName && touched?.hrOrganizationName
                      ? errors?.hrOrganizationName
                      : ""
                  }
                  component={InputTextField}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="industriesId"
                  component={AutoCompleteIndustry}
                  error={
                    errors?.industriesId && touched?.industriesId
                      ? errors?.industriesId
                      : ""
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  margin: "1rem",
                }}
              >
                <Field
                  name="hrTeamName"
                  label="Team Name"
                  placeholder="Enter Team Name"
                  error={
                    errors?.hrTeamName && touched?.hrTeamName
                      ? errors?.hrTeamName
                      : ""
                  }
                  helperText={
                    "We have given default team name, feel free to change it now or later."
                  }
                  component={InputTextField}
                />
              </Grid>
              <Grid
                container
                spacing={3}
                xs={12}
                sx={{
                  padding: "4rem",
                  marginLeft: "0rem",
                  borderRadius: "10px",
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
                  Start
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      ) : (
        <CircularLoader />
      )}
    </Grid>
  );
};

export default CreateOrganization;
