import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

const AuthOtpViaOptions = ({ values, setFieldValue }) => {
  const [activeMethods, setActiveMethods] = useState([]);

  useEffect(() => {
    //taking only those methods who are active
    let temp = values?.messageMethods?.filter((curr) => curr.isActive);
    setActiveMethods((prev) => (prev = temp));

    //setting the 0th index's id into the otpVia as 0th index is our default checked
    handleChange(temp[0]?.messageMethodId);
  }, []);

  const handleChange = (selectedMethod) => {
    let otpMethods = values?.otpVia?.includes(selectedMethod)
      ? values?.otpVia?.filter((v) => v !== selectedMethod)
      : [...values?.otpVia, selectedMethod];

    setFieldValue("otpVia", otpMethods);
  };

  return (
    <Grid container xs={12} display="flex" justifyContent="center">
      {activeMethods?.length ? (
        <Grid item display="flex" flexDirection="column" ml={2}>
          {activeMethods?.map((messageMethod, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  value={messageMethod.messageMethodId}
                  onChange={(e) => handleChange(+e.target.value)}
                  defaultChecked={index === 0}
                  //the first active method will be our default check
                />
              }
              label={messageMethod.methodName}
            />
          ))}
        </Grid>
      ) : null}
    </Grid>
  );
};

export default AuthOtpViaOptions;
