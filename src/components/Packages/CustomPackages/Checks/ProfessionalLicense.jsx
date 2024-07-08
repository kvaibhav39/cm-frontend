import {Divider, Grid, Stack, Typography} from "@mui/material";
import {Field} from "formik";
import {useState} from "react";
import {CounterField} from "../../../../common/Form/CounterField/CounterField";
import "../../../../assets/scss/Package.scss";

const ProfessionalLicense = ({ checkOrderId }) => {
  const [rolesValue, setRolesValue] = useState();

  return (
    <Grid item xs={12}>
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Grid container className={"flex-container"} columns={16}>
          <Grid item xs={8} className={"min-width-100"}>
            <Typography variant="h5" gutterBottom>
              Please select number of Professional License/membership to be
              verified.
            </Typography>
            <Typography variant="subtitle2">
              * Highest {rolesValue} Professional License/membership(s) of candidate will be verified.
            </Typography>
          </Grid>
          <Grid item xs={4} className={"min-width-100 text-center"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.noOfHighestProfessionalLicense`}
              setRolesValue={(val) => setRolesValue(val)}
              component={CounterField}
            />
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default ProfessionalLicense;
