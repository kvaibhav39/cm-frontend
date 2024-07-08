import { Box, Divider, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import CircularLoader from "./../../../../common/CircularLoader";
import {
  getRegisterCandidateFieldSettings,
  updateRegisterCandidateFieldSettings,
} from "../../../../store/actions/systemAdminActions";
import SwitchField from "../../../../common/SwitchField";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const CandidateRegistraionFieldsSettings = () => {
  const { selectedOrg, candidateRegistrationFieldSettings } = useSelector(
    (state) => state.systemAdmin
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedOrg) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getRegisterCandidateFieldSettings(selectedOrg, logDetails));
    }
  }, [selectedOrg]);

  let initialValues = useMemo(() => {
    let defaultSettings = {
      collectCandidateRegisterationName: true,
      collectCandidateRegistrationEmail:
        candidateRegistrationFieldSettings?.collectCandidateRegistrationEmail ||
        false,
      collectCandidateRegistrationPhoneNo:
        candidateRegistrationFieldSettings?.collectCandidateRegistrationPhoneNo ||
        false,
      collectCandidateRegisterationHiringCountry: true,
      collectCandidateRegisterationTeamName: true,
    };

    return defaultSettings;
  }, [candidateRegistrationFieldSettings, candidateRegistrationFieldSettings]);

  const handleUpdate = (values, form) => {
    form.setSubmitting(true);

    let payload = {
      collectCandidateRegistrationEmail:
        values?.collectCandidateRegistrationEmail,
      collectCandidateRegistrationPhoneNo:
        values?.collectCandidateRegistrationPhoneNo,
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdate"
    );

    dispatch(
      updateRegisterCandidateFieldSettings(
        payload,
        selectedOrg,
        () => {
          form.setSubmitting(false);
        },
        logDetails
      )
    );
  };

  let switchBtnsArr = [
    {
      label: "Candidate Registration Name",
      name: "collectCandidateRegisterationName",
      disabled: true,
    },
    {
      label: "Candidate Registration Email",
      name: "collectCandidateRegistrationEmail",
      disabled: false,
    },
    {
      label: "Candidate Registration Phone Number",
      name: "collectCandidateRegistrationPhoneNo",
      disabled: false,
    },
    {
      label: "Candidate Registration Hiring Country",
      name: "collectCandidateRegisterationHiringCountry",
      disabled: true,
    },
    {
      label: "Candidate Registration Team Name",
      name: "collectCandidateRegisterationTeamName",
      disabled: true,
    },
  ];

  return (
    <Box position="relative">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleUpdate}
      >
        {(form) => (
          <Form>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
              mb={3}
              position="relative"
            >
              <Typography
                textAlign="right"
                fontWeight={550}
                variant="h4"
                mr={1}
                color={(theme) => theme.palette.grey[900]}
              >
                Candidate Registraion Filter Settings
              </Typography>
              <Box position={{ xs: "relative", md: "absolute" }} right={0}>
                <LoadingButton
                  loading={
                    !candidateRegistrationFieldSettings || form.isSubmitting
                  }
                  variant="contained"
                  size="small"
                  disableElevation
                  type="submit"
                >
                  Update Settings
                </LoadingButton>
              </Box>
            </Box>

            {candidateRegistrationFieldSettings ? (
              <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                {" "}
                {switchBtnsArr?.map((curr) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    border={(theme) => `1px solid ${theme.palette.grey[400]}`}
                    borderRadius="5px"
                    p={1}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        mr={3}
                        color={(theme) =>
                          curr?.disabled
                            ? theme.palette.grey[500]
                            : theme.palette.grey[900]
                        }
                      >
                        {curr?.label}
                      </Typography>
                    </Box>
                    <Box>
                      <Field
                        name={curr?.name}
                        id={`${curr?.name}-id`}
                        component={SwitchField}
                        disabled={curr?.disabled}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <CircularLoader size={40} height="30vh" />
            )}
          </Form>
        )}
      </Formik>
      <Box py={3}>
        <Divider />
      </Box>
    </Box>
  );
};

export default CandidateRegistraionFieldsSettings;
