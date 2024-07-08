import { Box, Button, Card, Paper, Typography } from "@mui/material";
import SuccessImage from "../../../assets/images/message-share.png";

const AskConfirmationForReference = ({
  handleAcceptConfirmation,
  handleDeclineConfirmation,
}) => {
  return (
    <Box pt={2} height="90%" overflow="scroll">
      <Paper
        sx={{
          boxShadow: "0 7px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
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

              <Box maxWidth="50rem">
                <Typography
                  mt={1}
                  variant="h3"
                  color="#565261"
                  fontWeight={500}
                  textAlign="center"
                  lineHeight="2rem"
                >
                  {/* PLEASE CONFIRM THAT YOU ARE THE RIGHT PERSON FOR COMPLETING
                  THIS REFERENCE VERIFICATION AND WILLING TO PROVIDE THE
                  REFERENCE VERIFICATION, PLEASE START BY CLICKING "
                  <strong>I AGREE</strong>" BUTTON. IN CASE YOU RECEIVED THIS
                  EMAIL BY MISTAKE OR YOU ARE NOT WILLING TO COMPLETE THIS
                  REFERENCE VERIFICATION PLEASE CLICK ON "
                  <strong>I DECLINE</strong>" BUTTON. */}
                  I certify, that I am the individual named by the candidate,
                  the person mentioned in this application form. I understand
                  that any information provided by me in this reference check
                  will be solely used for the purpose of the Reference Check for
                  this candidate from their potential employer as part of the
                  Employment Background Check process. I further declare that
                  all the information in this declaration is correct, complete
                  and true to the best knowledge and belief. I understand that
                  any of the information in this declaration will be recorded
                  and will be shared with the potential employer of the
                  candidate.
                </Typography>

                <Box
                  display="flex"
                  flexDirection={{ xs: "column", md: "row" }}
                  justifyContent="center"
                  alignItems="center"
                  mt={3}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      alignSelf: { xs: "center", md: "end" },
                      ml: { xs: 0, md: 3 },
                      my: 1,
                    }}
                    onClick={handleAcceptConfirmation}
                  >
                    I AGREE
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    sx={{
                      alignSelf: { xs: "center", md: "end" },
                      ml: { xs: 0, md: 3 },
                      my: 1,
                    }}
                    onClick={handleDeclineConfirmation}
                  >
                    I DECLINE
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Paper>
    </Box>
  );
};

export default AskConfirmationForReference;
