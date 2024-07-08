import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import config from "../../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MENU_OPEN,
  SET_OPS_COMPONENT,
} from "../../../../store/actions/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  checkModulePermission,
  checkPagePermission,
} from "../../../../utils/CheckPageAccess";
import { initialCandidateDetails } from "../../../../store/actions/candidateAction";
import { useState } from "react";
import { OPSurls, hrUrls, systemAdminUrls } from "./navigattionUrls";
import { deleteToken } from "../../../../store/actions/authorizationAction";
import CustomTooltip from "./../../../../components/common/CustomTooltip";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const NavigationSection = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const loggedInUser = useSelector((state) => state.authorization);
  const { loading, candidateInitialDetails } = useSelector(
    (state) => state.candidate
  );
  const { allowProfileEdit, candidateConsentSubmitted } =
    candidateInitialDetails;
  const [anchorElNav, setAnchorElNav] = useState(null);

  //to check if second login is present or not
  const isSecondLoginProfilePresent = localStorage.getItem("second_login");

  //extracting first login details
  const switchAccountDetails =
    localStorage.getItem(`first_login`) &&
    JSON.parse(localStorage.getItem(`first_login`));

  const switchAccountLoggedInDetails =
    switchAccountDetails && JSON.parse(switchAccountDetails?.CheckMinistryUser);

  //extracting switch back url
  let switchBackUrl = JSON.parse(localStorage.getItem("switchBackUrl"));

  useEffect(() => {
    if (
      (candidateConsentSubmitted === null || allowProfileEdit === null) &&
      loading
    ) {
      
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(initialCandidateDetails(logDetails));
    }
  }, []);

  let pagesToShow = [];

  //setting nav section to be displayed on the header
  if (loggedInUser?.currentUser?.roleId === 2) {
    pagesToShow = hrUrls.filter(
      (value) =>
        checkModulePermission(value.id, loggedInUser.permissions) &&
        checkPagePermission(value.url, loggedInUser.permissions)
    );
  } else if (loggedInUser?.currentUser?.roleId === 1) {
    // pagesToShow = systemAdminUrls;
    pagesToShow = systemAdminUrls.filter((value) =>
      checkModulePermission(value.id, loggedInUser.permissions)
    );
  } else if (loggedInUser?.currentUser?.roleId === 4) {
    // pagesToShow = OPSurls;
    pagesToShow = OPSurls.filter(
      (value) =>
        checkModulePermission(value.id, loggedInUser.permissions) &&
        checkPagePermission(value.url, loggedInUser.permissions)
    );
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (id, url) => {
    // console.log("id,url", id, url);

    setAnchorElNav(null);
    dispatch({ type: MENU_OPEN, id });
    dispatch({ type: SET_OPS_COMPONENT, payload: "ops-screen" });

    if (!checkPagePermission(url, loggedInUser.permissions)) {
      if (url === "/hr/settings/company-branding") {
        checkPagePermission(
          "/hr/settings/manage-teams",
          loggedInUser.permissions
        )
          ? navigate("/hr/settings/manage-teams")
          : checkPagePermission(
              "/hr/settings/manage-notifications",
              loggedInUser.permissions
            )
          ? navigate("/hr/settings/manage-notifications")
          : url !== "backdropClick" && navigate("/not-found");
      } else if (url !== "backdropClick") {
        navigate("/not-found");
      }
    } else {
      navigate(`${config.basename}${url}`);
    }
  };

  const handleSwitchAccount = () => {
    //to make frequent switched between two saved logins

    // let currentLoginProfile = localStorage.getItem("loginProfile");
    // localStorage.setItem(
    //   "loginProfile",
    //   currentLoginProfile === "second" ? "first" : "second"
    // );

    //switch button will only be displayed for second login, so deleteToken will execute for currentLoginProfile as 'second'
    deleteToken();
  };

  return (
    <>
      {/* For mobile devices */}
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          {pagesToShow?.map((page) => (
            <MenuItem
              key={page.id}
              onClick={() => handleCloseNavMenu(page.id, page.url)}
            >
              <Typography textAlign="center">{page.title}</Typography>
            </MenuItem>
          ))}

          {/*switch button for first login in candidates*/}
          {isSecondLoginProfilePresent && (
            <MenuItem onClick={handleSwitchAccount}>
              <CustomTooltip title={switchAccountLoggedInDetails?.loginEmail}>
                <Typography
                  textAlign="center"
                  component="a"
                  href={switchBackUrl}
                >
                  {" "}
                  Switch Account to {switchAccountLoggedInDetails?.subRoleName}
                </Typography>
              </CustomTooltip>
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* For large devices */}
      <Box sx={{ flexGrow: 1, gap: 2, display: { xs: "none", md: "flex" } }}>
        {pagesToShow.map((page) => {
          const isSettingsPage =
            page.url.split("/").includes("settings") &&
            location.pathname.split("/").includes("settings");
          // const isSelected = location.pathname === page.url || isSettingsPage;
          let isSelected =
            location.pathname?.includes(page?.url) || isSettingsPage;
          //customization.isOpen.findIndex((id) => id === page.id) > -1;

          return (
            <Button
              key={page.id}
              onClick={() =>
                handleCloseNavMenu(page.id, page?.routeToUrl || page.url)
              }
              startIcon={page.icon}
              variant={isSelected ? "contained" : "text"}
              color="secondary"
              disabled={
                !allowProfileEdit &&
                candidateConsentSubmitted &&
                page.id === "CANDIDATE-PROFILE"
              }
            >
              {page.title}
            </Button>
          );
        })}

        {/*switch button for first login in candidates */}
        {isSecondLoginProfilePresent ? (
          <CustomTooltip title={switchAccountLoggedInDetails?.loginEmail}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleSwitchAccount}
              component="a"
              href={switchBackUrl}
              sx={{ textAlign: "center",fontSize:'12px' }}
            >
              Switch to {switchAccountLoggedInDetails?.subRoleName}
            </Button>
          </CustomTooltip>
        ) : null}
      </Box>
    </>
  );
};
export default NavigationSection;
