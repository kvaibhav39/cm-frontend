import React from "react";
import SwitchField from "../../../common/SwitchField";
import { FormHelperText, Grid, Typography } from "@mui/material";
import { Field } from "formik";
import { useTheme } from "@mui/styles";

const SwitchToggleComponent = ({
  title,
  titleSize = "h4",
  fieldName,
  error = "",
  disabled = false,
  orientation = "none",
  pt = 0,
  pr = 2,
  pb = 1,
  pl = 2,
}) => {
  const theme = useTheme();
  return (
    <Grid>
      <Grid
        item
        xs={12}
        pt={pt}
        pr={pr}
        pb={pb}
        pl={pl}
        display="flex"
        alignItems="center"
        justifyContent={{ xs: "center", md: "flex-start" }}
      >
        {orientation === "reverse" ? (
          <>
            {" "}
            <Grid item xs={0.5}>
              <Field
                name={fieldName}
                id={`${fieldName}-id`}
                component={SwitchField}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={11.5}>
              <Typography
                variant={titleSize}
                ml={3}
                color={
                  disabled ? theme.palette.grey[500] : theme.palette.grey[900]
                }
              >
                {title}
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={4.5}>
              <Typography
                variant={titleSize}
                mr={3}
                color={
                  disabled ? theme.palette.grey[500] : theme.palette.grey[900]
                }
              >
                {title}
              </Typography>
            </Grid>
            <Grid item xs={6.5}>
              <Field
                name={fieldName}
                id={`${fieldName}-id`}
                component={SwitchField}
                disabled={disabled}
              />
            </Grid>
          </>
        )}
      </Grid>
      {error && (
        <FormHelperText error sx={{ marginLeft: 2 }}>
          {error}
        </FormHelperText>
      )}
    </Grid>
  );
};

export default SwitchToggleComponent;
