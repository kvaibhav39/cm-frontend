import React, { useEffect } from "react";
import PanelCard from "../../../common/cards/PanelCard";
import { Button, Grid } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import { BaseSelect } from "../../base";
import { useDispatch } from "react-redux";
import {
  getEmailProviderSetting,
  updateEmailProviderSetting,
} from "../../../store/actions/systemAdminActions";
import { useSelector } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const EmailProviderSetting = () => {
  const dispatch = useDispatch();

  const { emailProviderSetting } = useSelector((state) => state.systemAdmin);

  let emailProviderLists = [
    { providerName: "Amazon Email Service", providerId: 1 },
    { providerName: "SendGrid Service", providerId: 2 },
  ];

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getEmailProviderSetting(logDetails));
  }, []);

  const handleUpdate = ({ providerId }, _) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdate"
    );

    dispatch(updateEmailProviderSetting(providerId, logDetails));
  };
  return (
    <PanelCard>
      <Formik
        initialValues={{
          providerId: emailProviderSetting?.providerId || null,
        }}
        onSubmit={handleUpdate}
        enableReinitialize
      >
        {(form) => (
          <Form>
            <Grid container mt={2} display="flex" justifyContent="center">
              <Grid item xs={6}>
                <FastField
                  component={BaseSelect}
                  name="providerId"
                  label="Select Email Provider*"
                  optionLabel="providerName"
                  optionValue="providerId"
                  options={emailProviderLists}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  type="submit"
                >
                  Update Email Provider
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </PanelCard>
  );
};

export default EmailProviderSetting;
