import { Box, ButtonBase, useTheme } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../common/Logo";
import { useMemo } from "react";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toShowLogoUrls = [
    "/terms-and-conditions",
    "/data-privacy-policy",
    "/cookies",
    "/refree/questionnaire",
  ];

  let toDisplayLogoHeader = useMemo(
    () => toShowLogoUrls?.includes(location.pathname),
    [location]
  );

  return (
    <Box height="100vh">
      {toDisplayLogoHeader ? (
        <Box px={3} py={2.5}>
          <Box
            sx={{
              width: 228,
              display: "flex",
              [theme.breakpoints.down("md")]: {
                width: "auto",
              },
            }}
          >
            <Box component="span" sx={{ flexGrow: 1 }}>
              <ButtonBase
                disableRipple
                onClick={() =>
                  location.pathname?.includes("/refree/questionnaire")
                    ? {}
                    : navigate("/")
                }
              >
                <Logo />
              </ButtonBase>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Box
        sx={{
          backgroundColor: toDisplayLogoHeader
            ? theme.palette.primary.light
            : "none",
        }}
        height="100%"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MinimalLayout;
