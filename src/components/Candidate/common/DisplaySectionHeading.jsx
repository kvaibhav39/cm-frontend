import { Box, Typography } from "@mui/material";
import React from "react";
import { createElement } from "react";
import * as MuiIcons from "@mui/icons-material";

const DisplaySectionHeading = ({ icon, text }) => {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      {createElement(MuiIcons[icon])}
      <Typography variant="h4" marginLeft="0.5rem" textTransform="capitalize">
        {text}
      </Typography>
    </Box>
  );
};

export default DisplaySectionHeading;
