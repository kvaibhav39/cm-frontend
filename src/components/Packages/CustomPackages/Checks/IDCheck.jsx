import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Field } from "formik";
import { useState } from "react";
import { CounterField } from "../../../../common/Form/CounterField/CounterField";
import "../../../../assets/scss/Package.scss";

const IDCheck = ({ checkOrderId }) => {
  const [rolesValue, setRolesValue] = useState();

  return (
    <Grid item xs={12}>
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Grid container className={"flex-container"} columns={16}>
          <Grid item xs={5} className={"min-width-100"}>
            <Typography variant="h5" gutterBottom>
              Please select number of Identification documents to be verified.
            </Typography>
            <Typography variant="subtitle2">
              *{rolesValue} Identity Document(s) of candidate will be verified.
            </Typography>
          </Grid>
          <Grid item xs={5} className={"min-width-100 text-center"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.noOfIdentitiesToVerify`}
              setRolesValue={(val) => setRolesValue(val)}
              component={CounterField}
            />
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default IDCheck;
