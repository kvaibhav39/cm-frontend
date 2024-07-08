import { useState } from "react";
import { Field, Formik, Form } from "formik";
import { Grid, Typography, Rating, Button } from "@mui/material";
import { InputTextField } from "../../common/Form/InputTextField/InputTextField";
import { useTheme } from "@mui/material/styles";

const feedbackInitialState = {
  userId: 1,
  feedbackRating: "5",
  feedbackComment: "Very Good application",
};

const ThankYouScreen = () => {
  const [rateValue, setRateValue] = useState(0);
  const theme = useTheme();
  return (
    <Grid
      container
      spacing={3}
      sx={{
        textAlign: "center",
        padding: "4rem",
        border: "1px solid #D6D6D6",
        borderRadius: "10px",
      }}
    >
      <Grid item xs={12}>
        <Typography
          variant="h1"
          color={theme.palette.dark[800]}
          fontSize="74px"
        >
          Thank You
        </Typography>
        <Typography variant="h3" fontSize="38px">
          Your Profile has been Successfully Submitted.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          fontSize="25px"
          color={theme.palette.grey[500]}
        >
          Your verification results will be directly shared to your employer. If
          we need any additional information while conducting your verification
          we will reach out to you on your mentioned email address or phone
          number.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" fontSize="27px">
          Please Let us know, Your Experience regarding our application for
          submitting your details for employment verification.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Rating
          name="simple-controlled"
          value={rateValue || ""}
          onChange={(event, newValue) => {
            setRateValue(newValue);
          }}
          sx={{ fontSize: "4rem" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Formik
          initialValues={{
            ...feedbackInitialState,
            feedbackRating: rateValue,
          }}
        >
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: "left" }}>
                <Typography variant="h6">Enter A Feedback</Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Field
                  name="feedbackComment"
                  placeholder="If you want to send us a feedback message you can write here (within 250 words)"
                  component={InputTextField}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  sx={{ width: "200px", height: "39px" }}
                  variant="contained"
                  type="submit"
                >
                  Submit Feedback
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Grid>
    </Grid>
  );
};

export default ThankYouScreen;
