import { Box, ButtonBase, styled, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../common/Logo";

const StyledInnerBox = styled(Box)(({ theme }) => ({
  height: "100%",
  background: theme.palette.primary.light,
  position: "relative",
  overflow: "hidden", // Ensure pseudo-elements don't overflow
  "&::before, &::after": {
    content: "''",
    position: "absolute",
    width: "40px",
    height: "40px",
    background: "transparent",
    transition: "1s",
  },

  "&::before": {
    top: 0,
    left: 0,
    borderTop: `3px solid ${theme.palette.primary[800]}`,
    borderLeft: `3px solid ${theme.palette.primary[800]}`,
  },
  "&::after": {
    bottom: 0,
    right: 0,
    borderBottom: `3px solid ${theme.palette.primary[800]}`,
    borderRight: `3px solid ${theme.palette.primary[800]}`,
  },

  "&:hover::before, &:hover::after": {
    width: "100%",
    height: "100%",
  },
}));

const Unsubscribe = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box height="100vh">
      <Box px={3} py={2.5}>
        <Box
          sx={{
            width: 228,
            display: "flex",
            [theme.breakpoints.down("md")]: {
              width: "auto",
            },
          }}
        >
          <Box component="span" sx={{ flexGrow: 1 }}>
            <ButtonBase disableRipple onClick={() => navigate("/")}>
              <Logo />
            </ButtonBase>
          </Box>
        </Box>
      </Box>

      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        backgroundColor={theme.palette.primary.light}
      >
        <Box
          mt={8}
          maxHeight="70%"
          minWidth="60%"
          maxWidth="90%"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            borderRadius: 2,
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
          }}
          p={{ xs: 2, md: 5 }}
        >
          <StyledInnerBox>
            <Box sx={{ position: "relative", zIndex: 999 }}>
              <Box
                width="100%"
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                sx={{ borderBottom: `1px solid ${theme.palette.grey[700]}` }}
                p={2}
              >
                <Box
                  sx={{
                    fontWeight: "600",
                    color: theme.palette.grey[700],
                    fontSize: { xs: 18, md: 24 },
                  }}
                >
                  CheckMinistry Communication
                </Box>{" "}
                <Box>
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEj0lEQVR4nO1aXWwUVRQ+TxASwxNPQkx4QF8MCSFGTPTZJWq0ow0xplNrUMhuB1MRKFAUt7pRVGxIYWMh/qHYNtAIqRWBlr/abVlKy/L/UzHW+INFgoXAzr13jrnjjLtd7tbZmbtbEu6XfA9NZ+6933fOPffcyQIoKCgoKCgoKCgoKCgoKAhR8yFOqWsgb0Ubyal3NpGbsThB2azfSFCLmIFYFk5fL4uke8siphEycDLIQGu7OfezNjpcDNHZrP0guAHZXNNAzm1pTj8YSPzWDpyaOsuuXfrFws4ehk3NFDsOMuzqzc/mdurLgKpaOcKfrzHx8zaKqXMWHkrSkcZWvMe3AXu7aSsXz/nnXxZaFnrC5pbCTKiOyon+azGCh5LMFu9y+3esybcBg2fYFS5++Hfv4r0awPc8T3sZkV/wqolNLRRTZzPCXXYl6G++Ddj4pXlr4LSFI1cz6m/eQrx8BfHnXy3c18OwbU+G23czjDbK3cv/RyNKsCsxNuouOxMMjah5w7cBsTjBdz8meOGnjAF/jGQmGDxjYXwbxXKjdIJdPmeYuP4TioOnbxfOM+HTHdTODP5sIANicYKHk0xogEueCeG1pYv84jcI7j4sjjqvAbwWZD8v1YD+k/86nDsxj8SGLyg+W1084XzsdZsp8m0pEr91J7VPgdz3AhtwoC9jwFe7KC57j2B3vzgCHQcYvrxafja8tNLEXZ3iOXuOMVw5Th8R2ID4NopX/7ZsuqnOneb7TLSg/lOWvT9lZAMfg6/h6Alx1L9up/jC0vHHCGxALIu5g9d9RLB3UByZb/YyfHGFf/H6MtM+WURjH0kxXLvBW6YV1QAtYmLF6ya2dogXmkyxvO+NxzUNBPuOi8fkR27lcu9jFd0AzcOid3zvbdHczJZv85h5wvJlZskM0CKm3dnt3CcWkBhguHp9/jFWrCP4wzHxu+37GS5c5a+4SjOg3uOV1S1c9pHpoXAVo6A+vegaPlE1jPMrf5RnQG2BV9ZX6oh9exQJ48fo+1uozbxH6kFmj1FoxJ9aeBlD+tB/lGZAVa3/ljVf8yJikBabRz5bvDQDqgNeWXn7uqdbHOkxF5gehpEAbTVPe2kG1Eu8snLyiPJ2+biglebtNb9Gly8JNgff89IM0CSIFnFJPcH9vWzMBaYm5wLjl7ni70gDNOcjxtubiE332npXGaAVicoAXWUAqi2gqxqAqgjq6hRAdQzqqg9A1QjpATrBskh6dKI7u0L4zOLR23qAx/ULo/5b4XC6T/Yis7/UiLo26awYOhogA0xDpvjcLzWl4PzKS0t9GxAycLIWMQdkRb7U4kMVF0+GjPPBfipTvujGdBkmiL7UFFv8kxVD9wUS76L8TZykhc1qLZxO+C2MpdnzF6+H9KEkT/vAkVdQUFBQUCgIkwBgKgBMA4DpADATAB4AgNkAMMfhQw4fcfiYQ/dv9//u87OdMWY6Y05z5uBzTTimAMAMAOC/x52XJaZUnOfMPcNZS0lxPwA8OgGi85GvZVYpDZh1txtwJ2yBhydyC4AA2UXw3iIUQT6m9CL4D5SWL2rv/H1dAAAAAElFTkSuQmCC" />
                </Box>
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  textTransform: "capitalize",
                  fontWeight: "500",
                  color: theme.palette.grey[700],
                  fontSize: { xs: 12, md: 18 },
                }}
                my={3}
              >
                Your E-mail notification settings have been saved
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  textTransform: "capitalize",
                  fontWeight: "500",
                  color: theme.palette.grey[700],
                  fontSize: { xs: 10, md: 16 },
                  borderTop: `1px solid ${theme.palette.grey[700]}`,
                }}
                py={2}
              >
                Click{" "}
                <Box
                  component="span"
                  sx={{
                    textDecoration: "underline",
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/")}
                >
                  here
                </Box>{" "}
                to return and explore more.
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: "500",
                  color: theme.palette.grey[700],
                  fontSize: { xs: 10, md: 16 },
                }}
                my={2}
              >
                If you have any questions, feel free to reach out to us at{" "}
                <a href="mailto:info@checkministry.com">
                  info@checkministry.com
                </a>
              </Box>
            </Box>
          </StyledInnerBox>
        </Box>
      </Box>
    </Box>
  );
};

export default Unsubscribe;
