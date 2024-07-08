import { Link } from "react-router-dom";

// material-ui
import { Divider, Grid, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthCardWrapper from "./AuthCardWrapper";
import AuthForgotPassword from "./AuthForms/AuthForgotPassword";

// ===============================|| AUTH - ForgotPassword ||=============================== //

const ForgotPassword = () => {

  return (
    <AuthCardWrapper>
      <Grid item xs={12}>
        <AuthForgotPassword />
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
            Click here to Login now.
          </Typography>
        </Grid>
      </Grid>
    </AuthCardWrapper>
  );
};

export default ForgotPassword;
