import { Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import OtpInput from "react-otp-input";
import { useTheme } from "@mui/material/styles";
import { chooseOtpMethod } from "../../../../store/actions/authorizationAction";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const AuthOTPVerificationFields = ({
  values,
  setSubmitting,
  dispatch,
  setFieldValue,
}) => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(120);
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("md"));
  const inputRef = useRef(null);

  //countdown timer of 2 mins
  useEffect(() => {
    let timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevState) => prevState - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  useEffect(() => {
    if (otp?.length === 6) {
      setSubmitting(false);
    } else {
      setSubmitting(false);
    }
  }, [otp]);

  const handleOTP = (value) => {
    setOtp(value);
    setFieldValue("otp", value);
  };

  const handleResendCode = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleResendCode"
    );
    dispatch(
      chooseOtpMethod(
        { otpVia: values.otpVia, token: values.token },
        (res) => {
          setSeconds(120);
          setFieldValue("secret", res?.secret);
          setFieldValue("token", res.token);
        },
        () => {},
        logDetails
      )
    );
  };

  const timer = () => {
    return `Didn't Receive? Retry in ${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  //will run when paste event is triggered
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const newOtp = paste.slice(0, 6);
    handleOTP(newOtp);
  };

  //to trigger handlePaste when ctrl+v is triggered
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <Grid container xs={12}>
      <OtpInput
        ref={inputRef}
        value={otp}
        onChange={handleOTP}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        numInputs={6}
        inputType="number"
        renderInput={(props) => <input {...props} />}
        containerStyle={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 0",
        }}
        inputStyle={{
          width: mobileDevice ? 30 : 50,
          height: mobileDevice ? 40 : 50,
          borderRadius: 5,
          border: `1px solid ${theme.palette.grey[700]}`,
          fontSize: 18,
        }}
      />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Typography variant="subtitle1" color="secondary">
          {seconds === 0 ? "Didn't receive the code?" : timer()}
        </Typography>
        {seconds === 0 ? (
          <Typography
            variant="subtitle1"
            color="secondary"
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={handleResendCode}
          >
            Resend
          </Typography>
        ) : null}
      </Stack>
    </Grid>
  );
};

export default AuthOTPVerificationFields;
