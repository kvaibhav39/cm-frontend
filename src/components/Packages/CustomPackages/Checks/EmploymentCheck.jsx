import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Field } from "formik";
import { useState } from "react";
import { CounterField } from "../../../../common/Form/CounterField/CounterField";
import { MonthButtonController } from "../../../../common/Form/MonthButtonController/MonthButtonController";
import { SliderField } from "../../../../common/Form/SliderField/SliderField";
import { YesNoField } from "../../../../common/Form/YesNoField/YesNoField";
import "../../../../assets/scss/Package.scss";
import { useEffect } from "react";

const EmploymentCheck = ({ checkOrderId, wrapperObject, checkId }) => {
  const [checkGap, setGap] = useState(false);
  const [gapCount, setGapCount] = useState();
  const [selectedYears, setSelectedYears] = useState();
  const [rolesValue, setRolesValue] = useState();
  const [currentSelected, setCurrentSelected] = useState();

  useEffect(() => {
    let selected = wrapperObject?.find(
      (curr) => curr.checkId === checkId
    )?.checkScope;
    setCurrentSelected(selected);
    setSelectedYears(selected?.noOfYears);
  }, [checkOrderId, wrapperObject, checkId]);

  return (
    <Grid item xs={12}>
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Grid container className={"flex-container"} columns={16}>
          <Grid item xs={5} className={"min-width-100"}>
            <Typography variant="h5" gutterBottom>
              Please select no of years to verify.{" "}
            </Typography>
            <Typography variant="subtitle2">
              *You may increase max. no of roles upto {rolesValue} to be
              verified for selected years.
            </Typography>
          </Grid>
          <Grid item xs={5} textAlign={"center"} className={"min-width-100"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.noOfYears`}
              setSelectedYears={setSelectedYears}
              noOfYears={currentSelected?.noOfYears}
              component={SliderField}
            />
          </Grid>
          <Grid item xs={5} className={"min-width-100 text-center"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.noOfRoles`}
              setRolesValue={(val) => setRolesValue(val)}
              component={CounterField}
            />
            <p>max. no of roles to verify</p>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems={"baseline"}
          className={"flex-container"}
          columns={16}
        >
          <Grid item xs={8} className={"min-width-100"}>
            <Typography variant="h5" gutterBottom>
              Do You want to check any employment gaps in employment history of
              candidate?
            </Typography>
          </Grid>
          <Grid item xs={8} className={"min-width-100 text-center"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.checkGap`}
              onChange={(val) => setGap(val)}
              component={YesNoField}
            />
          </Grid>
        </Grid>
        {checkGap && (
          <Grid
            container
            alignItems={"baseline"}
            className={"flex-container"}
            columns={16}
          >
            <Grid item xs={8} className={"min-width-100"}>
              <Typography variant="h5" gutterBottom>
                {" "}
                Select Length of employment gap you want to investigate.
              </Typography>
            </Grid>
            <Grid item xs={8} className={"min-width-100 text-center"}>
              <Field
                name={`checks[${checkOrderId}].checkScope.gapDurationInMonths`}
                checkOrderID={checkOrderId}
                setGapCount={(val) => setGapCount(val)}
                component={MonthButtonController}
              />
            </Grid>
          </Grid>
        )}
      </Stack>
      <Grid container marginTop={"3%"} xs={12}>
        <Typography variant="subtitle2">
          Candidate's employment will be verified for last {selectedYears} Years
          for a maximum upto {rolesValue} Role(s).
        </Typography>
        {checkGap && (
          <Grid container xs={12}>
            <Typography variant="subtitle2">
              Candidate's employment will also be verified for any employment
              gap higher than {gapCount} month(s) duration.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default EmploymentCheck;
