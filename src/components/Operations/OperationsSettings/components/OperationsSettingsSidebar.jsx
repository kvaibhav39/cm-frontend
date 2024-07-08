import { Tabs, Tab, styled } from "@mui/material";

import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Group, CorporateFare } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { checkPagePermission } from "../../../../utils/CheckPageAccess";

function tabProps(index) {
  return {
    id: `hr-tab-${index}`,
    "aria-controls": `hr-tabpanel-${index}`,
    iconPosition: "start",
    icon: <Home />,
  };
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textAlign: "left",
  justifyContent: "flex-start",
  color: "#5E5873",
  fontSize: "14px",
  minHeight: "42px",
  wordBreak: "break-word",
  "&.Mui-selected": {
    backgroundColor: "rgba(104, 137, 255, 0.1)",
    color: "rgba(82, 122, 251, 1)",
    borderRadius: "5px",
  },
}));

const OperationsSettingsSidebar = ({ items, disabled = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const loggedInUser = useSelector((state) => state.authorization);

  let allNavItems = [
    {
      name: "General",
      url: "/ops/settings/general",
      icon: <Home />,
    },
    {
      name: "Operations Users",
      url: "/ops/settings/ops-users",
      icon: <Group />,
    },
    {
      name: "Organizations",
      url: "/ops/settings/hr/create",
      icon: <CorporateFare />,
    },
  ];

  let navItems = [];
  allNavItems.forEach((item) => {
    if (checkPagePermission(item.url, loggedInUser.permissions)) {
      navItems.push(item);
    }
  });

  return (
    <Box>
      {navItems?.length > 0 &&
        navItems.map((item, index) => (
          <Tabs
            id={item?.url}
            orientation="vertical"
            variant="scrollable"
            value={false}
            aria-label="Hr Tabs"
            indicatorColor="transparent"
            key={index}
          >
            <StyledTab
              disabled={disabled}
              label={item?.name}
              onClick={(event) => {
                navigate(item?.url);
              }}
              {...tabProps(0)}
              icon={item?.icon}
              style={
                location.pathname === item?.url
                  ? {
                      backgroundColor: "rgba(104, 137, 255, 0.1)",
                      color: "rgba(82, 122, 251, 1)",
                      borderRadius: "5px",
                    }
                  : null
              }
            />
          </Tabs>
        ))}
    </Box>
  );
};

export default OperationsSettingsSidebar;
