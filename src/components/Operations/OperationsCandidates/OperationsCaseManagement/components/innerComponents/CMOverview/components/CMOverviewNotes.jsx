import { Grid } from "@mui/material";
import React from "react";

const CMOverviewNotes = () => {
  return (
    <Grid
    item
      xs={12}
      md={2.9}
      border={(theme) => `1px solid ${theme.palette.grey[400]}`}
      borderRadius="5px"
      px={2.5}
      py={2}
      flexWrap="wrap"
      gap="10px"
    >
      CMOverviewNotes
    </Grid>
  );
};

export default CMOverviewNotes;
