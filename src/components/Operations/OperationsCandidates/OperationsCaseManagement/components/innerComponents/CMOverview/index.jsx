import { Box,  Grid, Typography } from "@mui/material";
import React from "react";
import CMOverviewCaseInfo from "./components/CMOverviewCaseInfo";
import CMOverviewCandidateInfo from "./components/CMOverviewCandidateInfo";
import CMOverviewNotes from "./components/CMOverviewNotes";
import { useSelector } from "react-redux";
import CircularLoader from "../../../../../../../common/CircularLoader";
import { candidateOverviewFields } from "./components/utils/candidateOverviewFields";

const CMOverview = () => {
  const { OpsBasicCandidateInfo } = useSelector((state) => state.operations);  

  return (
    <>
      <Box
        display="flex"
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="center"
        flexDirection={{ xs: "column", md: "row" }}
        border={(theme) => `1px solid ${theme.palette.grey[400]}`}
        borderRadius="5px"
        px={2.5}
        py={2}
        flexWrap="wrap"
        gap="10px"
      >
        {OpsBasicCandidateInfo ? (
          <>
            {" "}
            {candidateOverviewFields(OpsBasicCandidateInfo)?.map((curr, index) => (
              <Box key={curr.id} display="flex" flexDirection="column">
                <Typography
                  fontSize={12}
                  color={(theme) => theme.palette.grey[500]}
                  mb={0.5}
                  sx={{ wordBreak: "break-all" }}
                >
                  {curr.fieldName}
                </Typography>
                {curr?.renderComponent ? (
                  curr.fieldValue()
                ) : (
                  <Typography
                    fontWeight={550}
                    textAlign={{ xs: "center", md: "left" }}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {curr.fieldValue(curr.createdAt)}
                  </Typography>
                )}
              </Box>
            ))}
          </>
        ) : (
          <CircularLoader height="10vh" size={40} />
        )}
      </Box>

      <Grid
        container
        xs={12}
        display="flex"
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="stretch"
        flexDirection={{ xs: "column", md: "row" }}
        flexWrap="wrap"
        mt={2}
        gap={{ xs: 2, md: 0 }}
      >
        <CMOverviewCaseInfo />
        <CMOverviewCandidateInfo />
        {/* <CMOverviewNotes /> */}
      </Grid>
    </>
  );
};

export default CMOverview;
