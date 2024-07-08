import { Box, Grid, Typography } from "@mui/material";
import CreateOrganization from "../Organization/CreateOrganization";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FirstLoginUpdateProfile from "./FirstLoginUpdateProfile";
import { useEffect } from "react";

const FirstLogin = () => {
  const loggedInUser = useSelector((state) => state.authorization.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser?.userName && loggedInUser?.usersId) {
      navigate("/hr/dashboard");
    }
  }, [loggedInUser?.userName, navigate]);

  return (
    <>
      {loggedInUser?.usersId && (
        <>
          {loggedInUser?.usersId && !loggedInUser?.userName && (
            <FirstLoginUpdateProfile onNext={() => navigate("/hr/dashboard")} />
          )}
          {!loggedInUser?.hrOrganization && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              height="100vh"
            >
              <Grid
                container
                spacing={1}
                sx={{
                  textAlign: "center",
                  padding: {
                    md: "4rem 4rem 0rem 4rem",
                    xs: "0.5rem 0.5rem 0.5rem 0rem",
                  },
                  borderRadius: "10px",
                }}
              >
                <Grid item xs={12}>
                  <Typography
                    sx={{ typography: { xs: "h3", md: "h1" } }}
                    my={{ xs: 3, md: "none" }}
                  >
                    One last thing, Let us know about your organization
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={1}
                sx={{
                  justifyContent: "center",
                  padding: { md: "1rem 4rem 4rem 4rem", xs: "0.5rem" },
                  borderRadius: "10px",
                }}
              >
                <CreateOrganization />
              </Grid>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default FirstLogin;
