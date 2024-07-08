import { StyledBasePaper } from "../base/styled";
import { Box, Card, Divider, Rating, Typography } from "@mui/material";
import SuccessImage from "../../assets/images/message-share.png";
import { Field, Form, Formik } from "formik";
import { BaseTextField } from "../base";
import { LoadingButton } from "@mui/lab";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitCandidateFeedback } from "../../store/actions/candidateAction";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const PostSubmit = () => {
  const dispatch = useDispatch();

  const { loading, candidateDetails, candidateInitialDetails } = useSelector(
    (state) => state.candidate
  );
  const { allowFeedbackSubmit } = candidateInitialDetails;

  const initialValues = useMemo(() => {
    let temp = {
      comment: "",
      starRating: null,
      disableSubmit: true,
      feedbackAlreadySubmitted: false,
    };

    if (candidateDetails && allowFeedbackSubmit === false) {
      temp.comment = candidateDetails?.FEEDBACK?.feedbackComment;
      temp.starRating = +candidateDetails?.FEEDBACK?.feedbackRating;
      temp.feedbackAlreadySubmitted = true;
    }

    return temp;
  }, [candidateDetails, allowFeedbackSubmit]);

  const handleSubmit = async (values, form) => {
    try {
      
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      dispatch(
        submitCandidateFeedback(
          {
            feedbackRating: String(values.starRating),
            feedbackComment: values.comment,
          },
          (val) => form.setFieldValue("feedbackAlreadySubmitted", val),
          logDetails
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledBasePaper>
      {!loading && (
        <Box p={{ xs: 2, md: 8 }} pt={16}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 2, md: 8 },
              borderRadius: "12px",
              overflow: "visible",
            }}
          >
            <Box display="flex" alignItems="center" flexDirection="column">
              <Box display="inline-block" mt={{ xs: 0, md: -16 }}>
                <img src={SuccessImage} />
              </Box>

              <Box maxWidth="40rem">
                <Typography
                  mt={6}
                  variant="h1"
                  color={(theme) => theme.palette.dark[900]}
                  fontSize="2.5em"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Thank You
                </Typography>
                <Typography
                  mt={1}
                  variant="h3"
                  fontSize="1.75em"
                  fontWeight={500}
                  textAlign="center"
                >
                  Your Profile has been Successfully Submitted.
                </Typography>
                <Typography
                  mt={4}
                  color={(theme) => theme.palette.grey[500]}
                  fontSize="1.25em"
                  fontWeight={500}
                  textAlign="center"
                >
                  Your verification results will be directly shared to your
                  employer. If we need any additional information while
                  conducting your verification we will reach out to you on your
                  mentioned email address or phone number.
                </Typography>
              </Box>

              <Divider sx={{ my: 4, width: "100%" }} />

              <Box maxWidth="40rem">
                <Typography
                  mt={4}
                  fontSize="1.35em"
                  fontWeight={500}
                  textAlign="center"
                >
                  Please Let us know, Your Experience with our Web Portal for
                  submitting your details for Employment Verification.
                </Typography>

                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {(form) => (
                    <Form>
                      <Box textAlign="center" my={5} mx={"auto"}>
                        <Rating
                          name="size-large"
                          defaultValue={3}
                          size="large"
                          sx={{
                            fontSize: "3rem",
                          }}
                          value={form.values.starRating}
                          onChange={(event, newValue) => {
                            form.setFieldValue("starRating", newValue);
                            form.setFieldValue("disableSubmit", !newValue);
                          }}
                          precision={0.5}
                          disabled={form.values.feedbackAlreadySubmitted}
                        />
                      </Box>

                      <Box
                        display="flex"
                        alignItems="bottom"
                        flexDirection={{ xs: "column", md: "row" }}
                      >
                        <Field
                          multiline
                          rows={2}
                          component={BaseTextField}
                          name="comment"
                          label="We would love to hear any additional comments."
                          placeholder="If you want to send us a feedback message you can write here (within 250 words)"
                          disabled={form.values.feedbackAlreadySubmitted}
                        />
                        <LoadingButton
                          loading={form.isSubmitting}
                          type="submit"
                          color="primary"
                          variant="contained"
                          sx={{ alignSelf: "end", ml: 3, mb: 1 }}
                          disabled={
                            form.values.feedbackAlreadySubmitted ||
                            form.values.disableSubmit
                          }
                        >
                          Submit Feedback
                        </LoadingButton>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Box>
          </Card>
        </Box>
      )}
    </StyledBasePaper>
  );
};

export { PostSubmit };
