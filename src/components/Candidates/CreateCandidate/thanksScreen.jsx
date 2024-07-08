import React from "react";
import SuccessSvg from "assets/images/common/success.svg";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const thanksScreen = () => {
  return (
    <Grid item md={12} sx={{ textAlign: "center" }}>
      <img src={SuccessSvg} width="200px" />
      <Typography
        variant="h2"
        color="#6AC668"
        fontWeight="600"
        fontSize="65px"
        lineHeight="90px"
      >
        Thank You
      </Typography>
      <Typography variant="h5" color="#555555" fontWeight="600" fontSize="35px">
        Candidate has been Registered Successfully
      </Typography>
      <Typography
        variant="h5"
        color="rgba(85, 82, 98, 0.58)"
        fontWeight="600"
        fontSize="25px"
        lineHeight="36px"
      >
        Candidate will be receiving a email with help instructions from our side
        for completing verification process!
      </Typography>
      <Typography
        variant="h5"
        color="#55535B"
        fontWeight="600"
        fontSize="22px"
        lineHeight="36px"
      >
        We will keep notifying about progress of verification as per your
      </Typography>
      <Typography
        component={Link}
        to="/hr/settings/manage-notifications"
        variant="subtitle1"
        fontWeight="600"
        fontSize="22px"
        lineHeight="36px"
        sx={{ textDecoration: "underline", color: "#527AFB" }}
      >
        Notifications settings
      </Typography>
      <Typography
        variant="h5"
        color="#55535B"
        fontWeight="600"
        fontSize="22px"
        lineHeight="36px"
      >
        You can anytime check real time progress and status of verification from
      </Typography>
      <Typography
        component={Link}
        to="/candidate"
        variant="subtitle1"
        fontWeight="600"
        fontSize="22px"
        lineHeight="36px"
        sx={{ textDecoration: "underline", color: "#527AFB" }}
      >
        Candidate Dashboard.
      </Typography>
    </Grid>
  );
};

export default thanksScreen;
