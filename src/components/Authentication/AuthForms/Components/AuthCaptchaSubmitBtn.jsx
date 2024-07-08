import { Box, Button } from "@mui/material";

import AnimateButton from "common/AnimateButton";

import ReCAPTCHA from "react-google-recaptcha";

const AuthCaptchaSubmitBtn = ({ recaptchaRef, isSubmitting, submitText }) => {
  return (
    <>
      <ReCAPTCHA
        sitekey="6Lel5SciAAAAAEqdiNV0d8xu_irimIFaPDBiQGbh"
        size="invisible"
        ref={recaptchaRef}
      />

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            disableElevation
            disabled={isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            {submitText}
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
};

export default AuthCaptchaSubmitBtn;
