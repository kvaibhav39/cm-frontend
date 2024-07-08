import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project imports
import Header from "./Header";
import { drawerWidth } from "store/constant";

// assets
import { SET_MENU } from "../../store/actions/actionTypes";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, location }) => ({
    ...theme.typography.mainContent,
    marginTop:
      location.pathname === "/hr/first-login"
        ? "0px"
        : theme.typography.mainContent.marginTop, //for first login hr users , margin top becomes 0
    marginLeft:
      location.pathname === "/hr/first-login"
        ? "0px !important"
        : theme.typography.mainContent.marginLeft,
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up("md")]: {
        // marginLeft: -(drawerWidth - 20),
        marginLeft: "0px",
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down("md")]: {
        // marginLeft: "20px",
        marginLeft: "0px",
        width: `calc(100% - ${drawerWidth}px)`,
        padding: "8px",
      },
      [theme.breakpoints.down("sm")]: {
        // marginLeft: "10px",
        width: `calc(100% - ${drawerWidth}px)`,
        // padding: "16px",
        // marginRight: "10px",
      },
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
      },
    }),
  })
);

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));

  const { currentUser } = useSelector((state) => state.authorization);

  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  useEffect(() => {
    dispatch({ type: SET_MENU, opened: !matchDownMd });
  }, [matchDownMd]);

  //to check if second login is present or not
  const isSecondLoginProfilePresent = localStorage.getItem("second_login");

  const secondLoginBannerText = useMemo(() => {
    let text =
      "You are currently logged in on behalf of candidate, please perceive all screen messages as your candidate would have perceived while filling the forms.";

    if (currentUser?.roleId === 2) {
      text =
        "You are currently logged in on behalf of HR super admin, please perceive all screen messages as your HR super admin would have perceived.";
    }

    return text;
  }, [currentUser]);

  return (
    <>
      {isSecondLoginProfilePresent ? (
        <Box
          sx={{
            position: "fixed",
            zIndex: 999,
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <Typography
            sx={{
              backgroundColor: (theme) => theme.palette.error.main,
              fontWeight: 550,
              textAlign: "center",
              fontSize: { xs: "8px", md: "12px" },
              color: "#fff",
              padding: "1px 0",
            }}
          >
            {secondLoginBannerText}
          </Typography>
        </Box>
      ) : null}
      <Box display="flex">
        {/* header */}
        {location.pathname !== "/hr/first-login" && (
          <>
            <CssBaseline />
            <AppBar
              enableColorOnDark
              position="fixed"
              color="inherit"
              elevation={0}
              sx={{
                bgcolor: theme.palette.background.default,
                transition: leftDrawerOpened
                  ? theme.transitions.create("width")
                  : "none",
                top: isSecondLoginProfilePresent
                  ? { xs: "10px", lg: "5px" }
                  : 0,
                zIndex: isSecondLoginProfilePresent ? 100 : 999,
              }}
            >
              <Toolbar>
                <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
              </Toolbar>
            </AppBar>
          </>
        )}

        <Main theme={theme} open={leftDrawerOpened} location={location}>
          <Outlet />
        </Main>
      </Box>
    </>
  );
};

export default MainLayout;
