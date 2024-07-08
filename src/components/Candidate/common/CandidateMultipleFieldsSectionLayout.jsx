import { Box, Card, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CandidateMultipleFieldsSectionLayout = ({
  formHeadingComponent,
  formListsComponent,
  formDetailsComponent,
}) => {
  const theme = useTheme();
  const isSmallerDevice = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {isSmallerDevice ? (
        <>
          {formHeadingComponent}
          <Grid
            container
            mt={3}
            gap={1}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid
              item
              xs={12}
              sx={{
                border: (theme) => `1px solid ${theme.palette.grey[400]}`,
                borderRadius: "5px",
              }}
              p={2}
              height="100%"
            >
              {formListsComponent}
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                {formDetailsComponent}
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid
          container
          gap={2}
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid
            item
            xs={2.5}
            sx={{
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              borderRadius: "5px",
            }}
            p={2}
            height="100%"
          >
            {formListsComponent}
          </Grid>
          <Grid
            item
            xs={9}
            sx={{
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              borderRadius: "5px",
              height: {
                xxl: "85vh",
                md: "80vh",
                xs: "95vh",
              },
              overflow: "auto",
            }}
            p={2}
            height="100%"
            id="candidate-multiple-fields-scroll"
          >
            <Box mb={3}>{formHeadingComponent}</Box>

            <Card variant="outlined">{formDetailsComponent}</Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default CandidateMultipleFieldsSectionLayout;
