import { Box,  Grid, Typography } from "@mui/material";
import React from "react";
import { PermIdentity } from "@mui/icons-material";
import { useSelector } from "react-redux";
import CircularLoader from "../../../../../../../../common/CircularLoader";
import { candidateInfoFields } from "./utils/candidateInfoFields";

const CMOverviewCandidateInfo = () => {
  const { OpsBasicCandidateInfo } = useSelector((state) => state.operations);

  return (
    <Grid
      item
      xs={12}
      md={5.9}
      border={(theme) => `1px solid ${theme.palette.grey[400]}`}
      borderRadius="5px"
      px={2.5}
      py={2}
      gap="10px"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent={{ xs: "center", md: "space-between" }}
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
      >
        <Box display="flex" alignItems="center">
          <PermIdentity />
          <Typography
            fontWeight={550}
            textAlign={{ xs: "center", md: "left" }}
            ml={1}
            sx={{ wordBreak: "break-all" }}
          >
            Basic Candidate Information
          </Typography>
        </Box>
        {/* <Button variant="contained">View Profile</Button> */}
      </Box>
      {OpsBasicCandidateInfo ? (
        <>
          {candidateInfoFields(OpsBasicCandidateInfo)?.map((curr) => (
            <Grid item xs={12} display="flex" alignItems="flex-start" mt={2}>
              <Grid item xs={7}>
                <Typography
                  key={curr.id}
                  fontSize={12}
                  color={(theme) => theme.palette.grey[500]}
                  sx={{ wordBreak: "break-all" }}
                >
                  {curr.fieldName}
                </Typography>
              </Grid>
              <Grid item xs={5} ml={3}>
                <Typography
                  key={curr.id}
                  fontSize={12}
                  fontWeight={550}
                  textAlign={{ xs: "center", md: "left" }}
                  sx={{ wordBreak: "break-all" }}
                >
                  {curr.fieldValue()}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </>
      ) : (
        <CircularLoader height="40vh" />
      )}
    </Grid>
  );
};

export default CMOverviewCandidateInfo;
