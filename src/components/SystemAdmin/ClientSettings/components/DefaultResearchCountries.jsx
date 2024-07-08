import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";
import { AutoCompleteWithChipsController } from "./../../../../common/Form/AutoCompleteWithChipsController/AutoCompleteWithChipsController";
import { CounterField } from "./../../../../common/Form/CounterField/CounterField";
import { updateDefaultResearchCountriesSettings } from "../../../../store/actions/systemAdminActions";
import { YesNoField } from "./../../../../common/Form/YesNoField/YesNoField";
import { LoadingButton } from "@mui/lab";
import { getAllCountries } from "../../../../store/actions/helperActions";
import CircularLoader from "../../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const DefaultResearchCountries = () => {
  const dispatch = useDispatch();
  const { orgsLists, selectedOrg, countriesDataAsPerOrg } = useSelector(
    (state) => state.systemAdmin
  );
  const [researchCountry, setResearchCountry] = useState(null);

  useEffect(() => {
    if (selectedOrg) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        getAllCountries(logDetails, { hrOrganizationId: selectedOrg }, true)
      );

      let selectedOrgData = orgsLists?.find(
        (curr) => curr?.hrOrganizationsId === selectedOrg
      );

      setResearchCountry(selectedOrgData?.researchCountryJuridictionScope);
    }
  }, [orgsLists, selectedOrg]);

  const handleUpdate = (values, form) => {
    form.setSubmitting(true);
    delete values.countriesDataAsPerOrg;

    if (values?.allJurisdictionSearch) {
      values.jurisdictionId = [];
    }

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdate"
    );

    dispatch(
      updateDefaultResearchCountriesSettings(
        logDetails,
        values,
        selectedOrg,
        () => form.setSubmitting(false)
      )
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        allJurisdictionSearch: researchCountry
          ? researchCountry?.allJurisdictionSearch
          : true,
        noOfYearsForAdditionalJuridictionSearch:
          researchCountry?.noOfYearsForAdditionalJuridictionSearch || 3,
        jurisdictionId: researchCountry?.jurisdictionId || [],
        countriesDataAsPerOrg: countriesDataAsPerOrg || [],
      }}
      validationSchema={Yup.object().shape({
        noOfYearsForAdditionalJuridictionSearch: Yup.number()
          .integer()
          .required("Field is required"),
        allJurisdictionSearch: Yup.boolean().required("Field is required"),
        jurisdictionId: Yup.array().when("allJurisdictionSearch", {
          is: (allJurisdictionSearch) => !allJurisdictionSearch,
          then: (schema) => schema.min(1, "Field is required"),
        }),
      })}
      onSubmit={handleUpdate}
    >
      {(form) => (
        <Form>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            my={3}
            position="relative"
          >
            <Typography
              textAlign="right"
              fontWeight={550}
              variant="h4"
              mr={1}
              color={(theme) => theme.palette.grey[900]}
            >
              Default Research Countries Setup
            </Typography>
            <Box position={{ xs: "relative", md: "absolute" }} right={0}>
              <LoadingButton
                loading={form.isSubmitting || !countriesDataAsPerOrg?.length}
                variant="contained"
                size="small"
                disableElevation
                type="submit"
              >
                Update Settings
              </LoadingButton>
            </Box>
          </Box>

          {countriesDataAsPerOrg?.length ? (
            <Box p={1}>
              {" "}
              <Grid
                item
                xs={12}
                display="flex"
                alignItems="center"
                flexDirection={{ xs: "column", md: "row" }}
                mb={3}
              >
                <Typography
                  textAlign={{ xs: "center", md: "left" }}
                  fontWeight={550}
                  variant="h4"
                  mr={1}
                  color={(theme) => theme.palette.grey[900]}
                  mb={{ xs: 1, md: 0 }}
                >
                  Verification to be performed in all research countries :{" "}
                </Typography>
                <Field name="allJurisdictionSearch" component={YesNoField} />
              </Grid>
              {form?.values?.allJurisdictionSearch ? (
                <Grid
                  item
                  xs={12}
                  display="flex"
                  alignItems="center"
                  flexDirection={{ xs: "column", md: "row" }}
                  mb={3}
                >
                  <Typography
                    textAlign={{ xs: "center", md: "left" }}
                    fontWeight={550}
                    variant="h4"
                    mr={1}
                    color={(theme) => theme.palette.grey[900]}
                    mb={{ xs: 1, md: 0 }}
                  >
                    No. of years for additional jurisdiction search :
                  </Typography>
                  <Field
                    name="noOfYearsForAdditionalJuridictionSearch"
                    component={CounterField}
                  />
                </Grid>
              ) : null}
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems="center"
                ml={{ xs: 1, md: 0 }}
              >
                <Field
                  name="jurisdictionId"
                  countriesData={countriesDataAsPerOrg || []}
                  component={AutoCompleteWithChipsController}
                  jurisdictionId={researchCountry?.jurisdictionId}
                  disabled={form?.values?.allJurisdictionSearch}
                  showFormikError={true}
                  flipDropdown={true}
                />
              </Grid>
            </Box>
          ) : (
            <CircularLoader size={40} height="20vh" />
          )}
        </Form>
      )}
    </Formik>
  );
};

export default DefaultResearchCountries;
