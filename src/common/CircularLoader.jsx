import React from "react";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { Grid } from "@mui/material";

const CircularLoader = ({ height = "75vh", size = 70 }) => {
  return (
    <Grid
      item
      xs={12}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height, overflow: "hidden" }}
      width="100%"
    >
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => theme.palette.primary.main,
          animationDuration: "550ms",
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={size}
        thickness={4}
      />
    </Grid>
  );
};

export default CircularLoader;
