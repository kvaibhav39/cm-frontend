import React from "react";
import ScrollableGrid from "../../../common/ScrollableGrid";
import { Grid } from "@mui/material";
import PanelCard from "../../../common/cards/PanelCard";

const OperationsLayout = ({ SidebarComponent, MainComponent }) => {
  return (
    <ScrollableGrid maxWidth="2400px" margin="0 auto">
      <Grid
        container
        spacing={2}
        xs={12}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems={{ xs: "center", md: "flex-start" }}
      >
        <Grid
          item
          md={2}
          xs={12}
          sx={{
            height: { xs: "45vh", md: "90vh" },
            width: { xs: "100vw", md: "auto" },
          }}
          mt={{ xs: 10, md: 0 }}
        >
          <PanelCard>
            <ScrollableGrid screen="xxl" scrollHeight="85vh">
              {SidebarComponent}
            </ScrollableGrid>
          </PanelCard>
        </Grid>
        <Grid
          item
          md={10}
          xs={12}
          sx={{
            height: { xs: "45vh", md: "90vh" },
            width: { xs: "100vw", md: "auto" },
          }}
        >
          <PanelCard>
            <ScrollableGrid screen="xxxl" scrollHeight="85vh">
              {MainComponent}
            </ScrollableGrid>
          </PanelCard>
        </Grid>
      </Grid>
    </ScrollableGrid>
  );
};

export default OperationsLayout;
