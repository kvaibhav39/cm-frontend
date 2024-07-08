import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import PanelCard from "../../../common/cards/PanelCard";
import ScrollableGrid from "../../../common/ScrollableGrid";
import SystemAdminSideBar from "./SystemAdminSideBar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

const navItems = [
  {
    name: "Add Internal Users",
    url: "/system-admin/system-settings/add-internal-users",
    icon: <PersonAddIcon />,
  },
  {
    name: "Email Provider Setting",
    url: "/system-admin/system-settings/email-provider-settings",
    icon: <ForwardToInboxIcon />,
  },
];

export const SystemSettingsLayout = () => {
  return (
    <ScrollableGrid
      scrollHeight={{ xs: "95vh", md: "90vh" }}
      container
      spacing={2}
      xs={12}
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "center" }}
      alignItems={{ xs: "center", md: "flex-start" }}
    >
      <Grid
        item
        md={2}
        xs={12}
        mt={{ xs: 10, md: 0 }}
        sx={{
          height: "90vh",
        }}
        width="100%"
      >
        <PanelCard sx={{ display: "flex", justifyContent: "center" }}>
          <SystemAdminSideBar key="system-settings" items={navItems} />
        </PanelCard>
      </Grid>
      <Grid
        item
        md={10}
        xs={12}
        sx={{
          height: "90vh",
        }}
        width="100%"
      >
        <Outlet />
      </Grid>
    </ScrollableGrid>
  );
};
