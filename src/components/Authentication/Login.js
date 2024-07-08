import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthCardWrapper from "./AuthCardWrapper";
import AuthLogin from "./AuthForms/AuthLogin";
import { useState } from "react";

const Login = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const [step, setStep] = useState(1);

  //step - 1 : entering email & password
  //step - 2 : selecting method via which otp would be sent
  //step - 3 : entering the otp to verify
  //step - 4 : selecting the org if the candidate is associated to multiple ones

  return (
    <AuthCardWrapper>
      <Grid item>
        <Stack alignItems="center" justifyContent="center" spacing={1}>
          <Typography
            color={theme.palette.secondary.main}
            gutterBottom
            variant={matchDownMD ? "h3" : "h2"}
            fontFamily="Nunito Sans, sans-serif"
          >
            Hi, Welcome Back
          </Typography>

          <Typography
            variant="caption"
            fontSize="16px"
            textAlign={matchDownMD ? "center" : "inherit"}
          >
            {step === 1
              ? "Enter your credentials to continue"
              : step === 2
              ? "Please select the option(s) through which you want to recieve the OTP"
              : step === 3
              ? "Please enter your OTP"
              : "Please select your organization"}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin
          step={step}
          setStep={setStep}
          matchDownMD={matchDownMD}
          theme={theme}
        />
      </Grid>

      <Grid item xs={12} my={2}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Grid item container direction="column" alignItems="center" xs={12}>
          <Typography
            component={Link}
            to="/signup"
            variant="subtitle1"
            sx={{ textDecoration: "none" }}
          >
            Don&apos;t have an account?
          </Typography>
        </Grid>
      </Grid>
    </AuthCardWrapper>
  );
};

export default Login;
