import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Paper, Typography } from "@mui/material";
import SuccessImage from "../../../assets/images/message-share.png";

const Thankyou = ({
  allowAccept = false,
  token = "",
  reasonOfDecline = "",
}) => {
  const navigate = useNavigate();

  const retryHandler = () => {
    navigate(`/refree/questionnaire?token=${token}&accept=TRUE`);
  };

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

              <Box maxWidth="40rem">
                <Typography
                  mt={6}
                  variant="h1"
                  color="#250A9C"
                  fontSize="2.5em"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Thank You
                </Typography>
                <Typography
                  mt={1}
                  variant="h3"
                  color="#565261"
                  fontSize="1.75em"
                  fontWeight={500}
                  textAlign="center"
                >
                  Your Response has been Successfully Submitted.
                </Typography>
                {reasonOfDecline && (
                  <Box
                    mt={6}
                    p={3}
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.grey[400]}`,
                      borderRadius: "5px",
                      position: "relative",
                    }}
                  >
                    <Box position="absolute" top={-15} left={0} right={0}>
                      <Typography
                        variant="h3"
                        color="#565261"
                        fontWeight={550}
                        textAlign="center"
                      >
                        <span style={{ background: "#fff" }}>
                          Reason for Decline
                        </span>
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="#565261" fontWeight={500} sx={{wordBreak:'break-word'}}>
                      {reasonOfDecline}
                    </Typography>
                  </Box>
                )}
                {allowAccept && (
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", md: "row" }}
                    justifyContent="center"
                    alignItems="center"
                    mt={3}
                  >
                    <Typography
                      variant="h3"
                      color="#565261"
                      fontSize="1.25em"
                      fontWeight={500}
                      textAlign="center"
                    >
                       Do you want to submit the reference again?
                    </Typography>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        alignSelf: { xs: "center", md: "end" },
                        ml: {xs:0,md:3},
                        my: 1,
                      }}
                      onClick={retryHandler}
                    >
                      Click here
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Box>
      </Paper>
    </Box>
  );
};
export default Thankyou;
