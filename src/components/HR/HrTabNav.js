import { Tabs, Tab, styled } from "@mui/material";
import DefaultIcon from "@mui/icons-material/AdjustOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import WorkspacePremiumOutlined from "@mui/icons-material/WorkspacePremiumOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { checkPagePermission } from "../../utils/CheckPageAccess";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";

function tabProps(index) {
  return {
    id: `hr-tab-${index}`,
    "aria-controls": `hr-tabpanel-${index}`,
    iconPosition: "start",
    icon: <DefaultIcon />,
  };
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textAlign: "left",
  justifyContent: "flex-start",
  color: theme.palette.grey[700],
  fontSize: "14px",
  minHeight: "42px",
  wordBreak: "break-word",
  "&.Mui-selected": {
    backgroundColor: theme.palette.dark.darker,
    color: theme.palette.primary.main,
    borderRadius: "5px",
  },
}));

const HrTabNav = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = useSelector((state) => state.authorization);
  const theme = useTheme();

  const settingSideBarElements =
    useMemo(() => {
      let tempSidebarElements = [];
      checkPagePermission(
        "/hr/settings/company-branding",
        loggedInUser.permissions
      ) &&
        tempSidebarElements.push(
          <StyledTab
            label="Company Branding"
            onClick={(event) => {
              navigate("/hr/settings/company-branding");
            }}
            {...tabProps(0)}
            icon={<WorkspacePremiumOutlined />}
            style={
              location.pathname === "/hr/settings/company-branding"
                ? {
                    backgroundColor: theme.palette.dark.darker,
                    color: theme.palette.primary.main,
                    borderRadius: "5px",
                  }
                : null
            }
          />
        );

      checkPagePermission(
        "/hr/settings/manage-teams",
        loggedInUser.permissions
      ) &&
        tempSidebarElements.push(
          <StyledTab
            label="Org / Teams / Permissions"
            onClick={(event) => {
              navigate("/hr/settings/manage-teams");
            }}
            {...tabProps(1)}
            icon={<GroupsOutlined />}
            style={
              location.pathname === "/hr/settings/manage-teams"
                ? {
                    backgroundColor: theme.palette.dark.darker,
                    color: theme.palette.primary.main,
                    borderRadius: "5px",
                  }
                : null
            }
          />
        );

      return tempSidebarElements;
    }, [loggedInUser.permissions]) || [];

  return (
    <>
      {settingSideBarElements.length ? (
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={props.value || 0}
          onChange={(e) => console.log(e.target.value)}
          aria-label="Hr Tabs"
          indicatorColor="transparent"
        >
          {settingSideBarElements}
        </Tabs>
      ) : null}
    </>
  );
};

export default HrTabNav;
