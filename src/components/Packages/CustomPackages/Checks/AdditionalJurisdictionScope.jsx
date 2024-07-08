import { useState } from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Field } from "formik";
import { AutoCompleteWithChipsController } from "../../../../common/Form/AutoCompleteWithChipsController/AutoCompleteWithChipsController";
import { CounterField } from "../../../../common/Form/CounterField/CounterField";
import { YesNoField } from "../../../../common/Form/YesNoField/YesNoField";
import "../../../../assets/scss/Package.scss";

const AdditionalJurisdictionScope = ({
  wrapperObject,
  checkOrderId,
  checkId,
  countriesData,
  checksCategory,
}) => {
  const [checkYears, setCheckYears] = useState(false);

  return (
    <Grid item xs={12}>
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Grid spacing={2} columns={16}>
          <Grid
            display={"flex"}
            flexShrink={1}
            alignItems={"baseline"}
            justifyContent={"space-between"}
            maxWidth={"100%"}
            minWidth={"40%"}
            paddingRight={"5%"}
            flexWrap={"wrap"}
            columns={16}
          >
            <Typography variant="h5" gutterBottom>
              Please select No of Years to be searched
            </Typography>
            <Grid
              item
              alignItems={"center"}
              className={"flex-container text-center min-width-100"}
            >
              <Typography variant="inherit">
                All Jurisdiction in past &nbsp;
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
        </Grid>
        <Grid container className={"flex-container"} columns={16}>
          <Grid item xs={6} className={"min-width-100"}>
            <Typography variant="h5" gutterBottom>
              Do you want verification to be performed in all research country
              (based on Candidate Data) ?
            </Typography>
          </Grid>
          <Grid item xs={2} className={"min-width-100 text-center"}>
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
        {!checkYears && (
          <Field
            name={
              checksCategory === "extraChecks"
                ? `extraChecks[${checkOrderId}].checkScope.jurisdictionId`
                : `checks[${checkOrderId}].checkScope.jurisdictionId`
            }
            countriesData={countriesData}
            component={AutoCompleteWithChipsController}
            wrapperObject={wrapperObject}
            checkId={checkId}
            checkOrderId={checkOrderId}
          />
        )}
      </Stack>
    </Grid>
  );
};

export default AdditionalJurisdictionScope;
