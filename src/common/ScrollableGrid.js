import React from "react";
import { Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ScrollableGrid = ({
  screen = "md",
  applyScrollToScreenAndBelow = true,
  scrollHeight = "90vh",
  ...props
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(screen));

  return (
    <Grid
      {...props}
      sx={
        (applyScrollToScreenAndBelow ? matches : !matches) && {
          height: scrollHeight,
          overflowY: "scroll",
          overflowX: "hidden"
        }
      }
    >
      {props.children}
    </Grid>
  );
};

export default ScrollableGrid;
