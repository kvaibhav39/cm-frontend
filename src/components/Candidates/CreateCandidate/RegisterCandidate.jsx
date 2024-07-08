import { Box, Grid, Typography } from "@mui/material";
import { Field } from "formik";
import { InputTextField } from "../../../common/Form/InputTextField/InputTextField";
import { PhoneNumberTextField } from "../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationTeams } from "../../../store/actions/hrActions";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const RegisterCandidate = (props) => {
  const {
    touched,
    errors,
    countries,
    values,
    collectCandidateRegistrationEmail,
    collectCandidateRegistrationPhoneNo,
  } = props;
  const { organizationTeams: organizationTeamsData, customFieldByOrgId } =
    useSelector((state) => state?.hr);
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = {
      orgId: getLoggedInUserHrOrganizationId(),
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getOrganizationTeams(params,logDetails));
  }, []);

  return (
    <Grid
      container
      item
      md={12}
      sm={12}
      spacing={3}
      sx={{ justifyContent: "flex-start" }}
      mt={{ xs: 1, md: 0 }}
    >
      <Grid item sm={12}>
        <Typography variant="h4">
          Registering a New Candidate{" "}
          {searchParams.get("orgName")
            ? `(${searchParams.get("orgName")})`
            : null}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Field
          name="candidateName"
          label="Candidate Name"
          placeholder="Enter Candidate Name"
          error={
            errors?.candidateName && touched?.candidateName
              ? errors?.candidateName
              : ""
          }
          required
          component={InputTextField}
        />
      </Grid>
      {collectCandidateRegistrationEmail ? (
        <Grid item xs={12} sm={4}>
          <Field
            name="candidateEmail"
            label="Candidate Email"
            placeholder="Enter Candidate Email"
            error={
              errors?.candidateEmail && touched?.candidateEmail
                ? errors?.candidateEmail
                : ""
            }
            required
            component={InputTextField}
          />
        </Grid>
      ) : null}
      {collectCandidateRegistrationPhoneNo ? (
        <Grid item xs={12} sm={4}>
          <Field
            name="candidatePhone"
            label="Candidate Phone Number*"
            placeholder="Enter Phone Number"
            component={PhoneNumberTextField}
          />
        </Grid>
      ) : null}
      <Grid item xs={12} sm={6} md={4}>
        <Autocomplete
          id="country-select-hiring"
          sx={{
            height: "1.5em",
            marginBottom: "1rem",
            width: "100%",
          }}
          options={countries}
          autoHighlight
          onChange={(c, value) => {
            props.setFieldValue("hiringCountryId", value?.value || "");
          }}
          value={countries.find((c) => c.value === values.hiringCountryId)}
          getOptionLabel={(option) => option.label || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              name="hiringCountryId"
              required
              label="Country of Hiring"
              error={
                errors?.hiringCountryId && touched?.hiringCountryId
                  ? errors?.hiringCountryId
                  : ""
              }
              helperText={
                errors?.hiringCountryId && touched?.hiringCountryId
                  ? errors?.hiringCountryId
                  : ""
              }
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Autocomplete
          id="candidate-team"
          sx={{
            height: "1.5em",
            marginBottom: "1rem",
            width: "100%",
          }}
          options={organizationTeamsData}
          autoHighlight
          renderOption={(props, option, { selected }) => (
            <Box
              component="span"
              {...props}
              sx={{
                marginRight: "5px !important",
                whiteSpace: "normal !important",
                wordBreak: "break-word !important",
              }}
            >
              {option.hrTeamName}
            </Box>
          )}
          onChange={async (c, value) => {
            props.setFieldValue("hrTeamId", value?.hrTeamsId || "");
            await Promise.resolve();
          }}
          value={organizationTeamsData?.find(
            (h) => h.hrTeamsId === values.hrTeamId
          )}
          getOptionLabel={(option) => option.hrTeamName || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              name="hrTeamId"
              required
              label="Register Candidate in Team"
              error={
                errors?.hrTeamId && touched?.hrTeamId ? errors?.hrTeamId : ""
              }
              helperText={
                errors?.hrTeamId && touched?.hrTeamId ? errors?.hrTeamId : ""
              }
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
        />
      </Grid>
      {customFieldByOrgId?.length
        ? customFieldByOrgId?.map((customQ, index) => {
            if (customQ.customFieldTypeId === 1) {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name={`customFields.${index}.customFieldResponseText`}
                    label={
                      customQ.customFieldDescription ||
                      `Enter ${customQ.customFieldName}`
                    }
                    placeholder={`Enter ${customQ.customFieldName}`}
                    error={
                      errors.hasOwnProperty("customFields") &&
                      touched.hasOwnProperty("customFields") &&
                      errors?.customFields[index]?.customFieldResponseText &&
                      touched?.customFields[index]?.customFieldResponseText
                        ? errors?.customFields[index]?.customFieldResponseText
                        : ""
                    }
                    required={customQ.isMandatory}
                    component={InputTextField}
                  />
                </Grid>
              );
            } else if (customQ.customFieldTypeId === 2) {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                    id={`customFields.${index}.customFieldValue`}
                    sx={{
                      height: "1.5em",
                      marginBottom: "1rem",
                      width: "100%",
                    }}
                    options={customQ.customFields}
                    autoHighlight
                    onChange={async (c, value) => {
                      props.setFieldValue(
                        `customFields.${index}.customFieldValueId`,
                        value?.id || ""
                      );
                      await Promise.resolve();
                    }}
                    value={customQ.customFields?.find(
                      (h) =>
                        h.id ===
                        (values.hasOwnProperty("customFields")
                          ? values?.customFields[index]?.customFieldValueId
                          : 0)
                    )}
                    getOptionLabel={(option) => option.customFieldValue || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        name={`customFields.${index}.customFieldValueId`}
                        required={customQ.isMandatory}
                        label={
                          customQ.customFieldDescription ||
                          `Select ${customQ.customFieldName}`
                        }
                        error={
                          errors.hasOwnProperty("customFields") &&
                          touched.hasOwnProperty("customFields") &&
                          errors?.customFields[index]?.customFieldValueId &&
                          touched?.customFields[index]?.customFieldValueId
                            ? errors?.customFields[index]?.customFieldValueId
                            : ""
                        }
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Grid>
              );
            }
          })
        : null}
    </Grid>
  );
};

export default RegisterCandidate;
