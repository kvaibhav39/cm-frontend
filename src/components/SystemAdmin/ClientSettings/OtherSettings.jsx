import React, { useEffect } from "react";
import { FastField, Form, Formik, useFormikContext } from "formik";
import SwitchToggleComponent from "../common/SwitchToggleComponent";
import {
  getOrgOtherSettings,
  updateOrgOtherSettings,
} from "../../../store/actions/systemAdminActions";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Grid, Typography } from "@mui/material";
import { otherSettingsSchema } from "../helpers/Schema/OtherSettings";
import { otherSettingsInitialValues } from "../helpers/InitialValues/OtherSettings";
import { BaseTextField } from "../../base";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const SwitchChangeListener = ({ methodName }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    //to turn off all the switches when two-auth-switch is turned off
    if (!values.allow2fAuthentication) {
      setFieldValue(`${methodName}`, false);
    }
  }, [values]);

  return <></>;
};

const OtherSettings = () => {
  const dispatch = useDispatch();
  const { selectedOrg, orgMsgMethodStatus } = useSelector(
    (state) => state.systemAdmin
  );

  useEffect(() => {
    if (selectedOrg) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getOrgOtherSettings(selectedOrg, logDetails));
    }
  }, [selectedOrg]);

  const handleUpdate = (values) => {
    let messageMethods = orgMsgMethodStatus?.messageMethods?.map(
      (msgMethod) => {
        return {
          messageMethodId: values[`${msgMethod.methodName}_Id`],
          isActive: values[msgMethod.methodName],
        };
      }
    );

    const dataForUpdate = {
      allow2fAuthentication: values.allow2fAuthentication,
      doNotDisplayClientName: values.doNotDisplayClientName,
      eligibleAddressDurationInMonth:
        values.eligibleAddressDurationInMonth || null,
      messageMethods,
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdate"
    );

    dispatch(updateOrgOtherSettings(dataForUpdate, selectedOrg, logDetails));
  };

  return (
    <>
      {selectedOrg ? (
        <Formik
          enableReinitialize
          initialValues={otherSettingsInitialValues(orgMsgMethodStatus)}
          validationSchema={otherSettingsSchema(orgMsgMethodStatus)}
          onSubmit={(values) => handleUpdate(values)}
        >
          {(form) => (
            <Form>
              <Grid
                container
                p={1}
                justifyContent={{ xs: "center", sm: "flex-end" }}
                sx={{ marginBottom: "1em" }}
              >
                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  type="submit"
                  disabled={!selectedOrg}
                >
                  Update Settings
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                p={1}
                sx={{ height: { xs: "60vh", xxl: "70vh", overflow: "auto" } }}
              >
                <Grid item xs={12}>
                  <Typography
                    textAlign="center"
                    variant="h4"
                    color={(theme) => theme.palette.grey[900]}
                    mb={4}
                  >
                    Message Settings
                  </Typography>
                  <SwitchToggleComponent
                    title="Enable Two-Factor Authentication"
                    fieldName="allow2fAuthentication"
                    error={form?.errors["allow2fAuthentication"]}
                    disabled={!selectedOrg}
                  />
                  {orgMsgMethodStatus?.messageMethods?.map((curr) => (
                    <>
                      <SwitchChangeListener methodName={curr?.methodName} />
                      <SwitchToggleComponent
                        title={curr?.methodName}
                        fieldName={curr?.methodName}
                        disabled={
                          !form.values.allow2fAuthentication || !selectedOrg
                        }
                        titleSize="h5"
                        orientation="reverse"
                        pt={1}
                        pl={5}
                      />
                    </>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid item xs={12}>
                  <Typography
                    textAlign="center"
                    variant="h4"
                    color={(theme) => theme.palette.grey[900]}
                    mb={4}
                  >
                    Display Client Name Settings
                  </Typography>
                  <SwitchToggleComponent
                    title="Do Not Display Client Name To Candidate"
                    fieldName="doNotDisplayClientName"
                    error={form?.errors["doNotDisplayClientName"]}
                    disabled={!selectedOrg}
                  />
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid item xs={12}>
                  <Typography
                    textAlign="center"
                    variant="h4"
                    color={(theme) => theme.palette.grey[900]}
                    mb={4}
                  >
                    Eligible Address Duration in Month(s) Settings
                  </Typography>
                  <Grid item xs={6}>
                    <FastField
                      component={BaseTextField}
                      type="number"
                      label="Enter Value in Month(s)*"
                      name="eligibleAddressDurationInMonth"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      ) : (
        <Typography textAlign="center" mt={4} fontWeight={600}>
          Please select an organization
        </Typography>
      )}
    </>
  );
};

export default OtherSettings;
