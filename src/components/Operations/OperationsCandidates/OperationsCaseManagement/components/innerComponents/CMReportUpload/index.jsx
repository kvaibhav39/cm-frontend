import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { BaseAccordion } from "../../../../../../base/BaseAccordion";
import { useState } from "react";
import { useTheme } from "@mui/styles";
import ReportMilestone from "./components/ReportMilestone";
import ReportUpdates from "./components/ReportUpdates";

const CMReportUpload = () => {
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
            Report Upload
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
              All below uploaded file(s) will be visible to Client immediately.
              Please make sure the report version you are uploading is approved
              by Senior Team Leader.
            </Typography>
          </Grid>
          <ReportMilestone />
          <ReportUpdates />
        </Grid>
      </BaseAccordion>
    </>
  );
};

export default CMReportUpload;
