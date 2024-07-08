import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Field } from "formik";
import { SliderField } from "../../../../common/Form/SliderField/SliderField";
import { CounterField } from "../../../../common/Form/CounterField/CounterField";
import { useEffect, useState } from "react";

const AddressCheck = ({ checkOrderId, wrapperObject, checkId }) => {
  const [selectedYears, setSelectedYears] = useState();
  const [currentSelected, setCurrentSelected] = useState();
  const [maxAddr, setMaxAddr] = useState();

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
        <Grid item sm={6} xs={12}>
          <Typography variant="h5" gutterBottom>
            Selected {selectedYears} number of years will be used to check
            address.
          </Typography>
          <Field
            name={`checks[${checkOrderId}].checkScope.noOfYears`}
            setSelectedYears={setSelectedYears}
            noOfYears={currentSelected?.noOfYears}
            component={SliderField}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h5" gutterBottom>
            Maximum number of address to verify.
          </Typography>
          <Field
            name={`checks[${checkOrderId}].checkScope.noOfAddress`}
            component={CounterField}
            setRolesValue={(val) => setMaxAddr(val)}
          />
        </Grid>
      </Stack>
      <Grid item xs={12}>
        <Typography variant="subtitle2">
          *You may increase max no of {maxAddr} Address(es) to be verified for
          selected year range.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AddressCheck;
