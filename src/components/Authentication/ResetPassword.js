import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthCardWrapper from "./AuthCardWrapper";
import AuthResetPassword from "./AuthForms/AuthResetPassword";

// ===============================|| AUTH - ForgotPassword ||=============================== //

const ForgotPassword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AuthCardWrapper>
      <Grid item xs={12}>
        <AuthResetPassword />
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
            Click here to login now.
          </Typography>
        </Grid>
      </Grid>
    </AuthCardWrapper>
  );
};

export default ForgotPassword;
