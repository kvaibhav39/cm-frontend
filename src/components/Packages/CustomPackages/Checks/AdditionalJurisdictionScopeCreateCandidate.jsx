import { useEffect, useState } from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Field } from "formik";
import { AutoCompleteWithChipsController } from "../../../../common/Form/AutoCompleteWithChipsController/AutoCompleteWithChipsController";
import { CounterField } from "../../../../common/Form/CounterField/CounterField";
import { YesNoField } from "../../../../common/Form/YesNoField/YesNoField";
import "../../../../assets/scss/Package.scss";
import { getAllCountries } from "../../../../store/actions/helperActions";
import { getLoggedInUserHrOrganizationId } from "../../../../utils/UserHelper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const AdditionalJurisdictionScopeCreateCandidate = ({
  wrapperObject,
  checkOrderId,
  checkId,
  checksCategory,
}) => {
  const [checkYears, setCheckYears] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getAllCountries(
        logDetails,
        {
          hrOrganizationId: getLoggedInUserHrOrganizationId(),
        },
        true
      )
    );
  }, []);
  const { countriesDataAsPerOrg: countriesData } = useSelector(
    (state) => state.systemAdmin
  );

  return (
    <Grid item xs={11} pb={4} mx="auto">
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Grid
          container
          className={"flex-container"}
          alignItems="center"
          xs={12}
          mt={1}
        >
          <Grid item md={10} xs={12}>
            <Typography variant="h5" gutterBottom textTransform="capitalize">
              Do you want verification to be performed in all research countries
              (based on Candidate Data) ?
            </Typography>
          </Grid>
          <Grid item md={2} xs={12} display="flex" justifyContent="flex-end">
            <Field
              name={
                checksCategory === "extraChecks"
                  ? `extraChecks[${checkOrderId}].checkScope.allJurisdictionSearch`
                  : `checks[${checkOrderId}].checkScope.allJurisdictionSearch`
              }
              onChange={(val) => setCheckYears(val)}
              component={YesNoField}
            />
          </Grid>
        </Grid>
        <Grid spacing={2} columns={16} display="flex" direction="column">
          {!checkYears ? (
            <Grid item xs={12} mb={1}>
              <Field
                name={
                  checksCategory === "extraChecks"
                    ? `extraChecks[${checkOrderId}].checkScope.jurisdictionId`
                    : `checks[${checkOrderId}].checkScope.jurisdictionId`
                }
                countriesData={countriesData || []}
                component={AutoCompleteWithChipsController}
                wrapperObject={wrapperObject}
                checkId={checkId}
                checkOrderId={checkOrderId}
                flipDropdown={true}
              />
            </Grid>
          ) : null}
          {checkYears ? (
            <Grid
              display={"flex"}
              flexShrink={1}
              alignItems={"baseline"}
              justifyContent={{ md: "space-between", xs: "center" }}
              flexWrap={"wrap"}
              xs={12}
            >
              <Typography variant="h5" gutterBottom textTransform="capitalize">
                Please select No of Years to be searched
              </Typography>
              <Grid
                item
                alignItems={"center"}
                className={"flex-container text-center min-width-100"}
              >
                <Typography variant="inherit" textTransform="capitalize">
                  All Jurisdiction in Past &nbsp;
                </Typography>
                <Field
                  name={
                    checksCategory === "extraChecks"
                      ? `extraChecks[${checkOrderId}].checkScope.noOfYearsForAdditionalJuridictionSearch`
                      : `checks[${checkOrderId}].checkScope.noOfYearsForAdditionalJuridictionSearch`
                  }
                  component={CounterField}
                />
                <Typography variant="inherit">&nbsp; Years</Typography>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Stack>
    </Grid>
  );
};

export default AdditionalJurisdictionScopeCreateCandidate;
