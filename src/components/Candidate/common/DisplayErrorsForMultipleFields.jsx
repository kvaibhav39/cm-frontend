import { Alert, Box, Typography } from "@mui/material";
import React from "react";

const DisplayErrorsForMultipleFields = ({
  errors,
  touched,
  section = "Address",
  apiErrorMsg,
}) => {
  return (
    <>
      {errors?.map((errorValue, ind) => {
        if (errorValue && touched) {
          let errorValues = [];

          for (let errorObj in errorValue) {
            if (touched[ind] && touched[ind][errorObj]) {
              //bonus in employment is an array so we have to extract error texts from bonus array
              if (Array.isArray(errors[ind][errorObj])) {
                errors[ind][errorObj]?.forEach((arrErrorValue, index) => {
                  for (let arrErrorObj in arrErrorValue) {
                    errorValues.push(
                      `${index + 1}) ${arrErrorValue[arrErrorObj]}`
                    );
                  }
                });
              } else {
                errorValues.push(errors[ind][errorObj]);
              }
            }
          }

          return errorValues?.length ? (
            <Box mt={2}>
              <Alert severity="error">
                <strong>
                  For {section} {ind + 1} :&nbsp;
                </strong>
                {errorValues?.join(" , ")}{'.'}
              </Alert>

            </Box>
          ) : null;
        }
      })}
      {apiErrorMsg && (
        <Typography
          mt={2}
          color="error"
          style={{ textTransform: "capitalize" }}
        >
          {apiErrorMsg}*
        </Typography>
      )}
    </>
  );
};

export default DisplayErrorsForMultipleFields;
