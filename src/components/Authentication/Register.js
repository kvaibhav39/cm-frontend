import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthCardWrapper from "./AuthCardWrapper";
import AuthRegister from "./AuthForms/AuthRegister";
import { useState } from "react";

// ===============================|| AUTH - REGISTER ||=============================== //

const Register = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [emailSent, setEmailSent] = useState(false);

  return (
    <AuthCardWrapper>
      <Grid item xs={12}>
        <Grid
          container
          direction={matchDownSM ? "column-reverse" : "row"}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Stack alignItems="center" justifyContent="center" spacing={1}>
              <Typography
                color={theme.palette.secondary.main}
                gutterBottom
                variant={matchDownSM ? "h3" : "h2"}
                fontFamily="Nunito Sans, sans-serif"
              >
                {emailSent ? "Almost There!" : "Sign up"}
              </Typography>
              <Typography
                variant="caption"
                fontSize="16px"
                textAlign={"center"}
              >
                {emailSent ? "Your Account activation link has been sent." : ""}
              </Typography>
              <Typography
                variant="subtitle1"
                fontSize="16px"
                textAlign={"center"}
              >
                Get Started with your awesome Screening journey with us.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      {!emailSent && (
        <>
          <Grid item xs={12}>
            <AuthRegister onRegisterSuccess={setEmailSent} />
          </Grid>
          <Grid item xs={12} my={2}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid item container direction="column" alignItems="center" xs={12}>
              <Typography
                component={Link}
                to="/login"
                variant="subtitle1"
                sx={{ textDecoration: "none" }}
                mt={0.5}
              >
                Already have an account?
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </AuthCardWrapper>
  );
};

export default Register;
