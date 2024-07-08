import {  Grid, Typography } from "@mui/material";
import React from "react";
import { BaseAccordion } from "../../../../../../base/BaseAccordion";
import { useState } from "react";
import { useTheme } from "@mui/styles";
import InternalUploadsTable from "./components/InternalUploadsTable";

const InternalUploads = () => {
  const [accordionState, setAccordionState] = useState(true);
  const theme = useTheme();

  return (
    <>
      <BaseAccordion
        keepExpanded={true}
        expanded={accordionState}
        onChange={() => setAccordionState(!accordionState)}
        accordionborderradius="5px !important"
        headerbg={theme.palette.grey[400]}
        headerborderradius="none"
        bordercolor={theme.palette.grey[400]}
        noPaddingInAccordionDetails
        header={(header) => (
          <Typography fontWeight={550} textAlign="center">
            Upload (Internal Only)
          </Typography>
        )}
      >
        <Grid
        item
          display="flex"
          flexDirection="column"
          gap={4}
          xs={12}
          px={4}
          py={3}
        >
          <Grid>
            <Typography
              textAlign={{ xs: "center", md: "left" }}
              color={(theme) => theme.palette.primary.main}
              fontWeight={500}
            >
              Any file uploaded here will only visible to internal users only.
            </Typography>
          </Grid>
          <InternalUploadsTable />
        </Grid>
      </BaseAccordion>
    </>
  );
};

export default InternalUploads;
