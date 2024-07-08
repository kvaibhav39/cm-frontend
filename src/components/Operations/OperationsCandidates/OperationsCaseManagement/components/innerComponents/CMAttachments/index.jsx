import { Grid, Typography } from "@mui/material";
import { BaseAccordion } from "../../../../../../base/BaseAccordion";
import { useState } from "react";
import { useTheme } from "@mui/styles";
import AttachmentsTable from "./components/AttachmentsTable";

const CMAttachments = () => {
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
            Attachments
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
              All files uploaded by Client and Candidate are displaying here.
            </Typography>
          </Grid>
          <AttachmentsTable />
        </Grid>
      </BaseAccordion>
    </>
  );
};

export default CMAttachments;
