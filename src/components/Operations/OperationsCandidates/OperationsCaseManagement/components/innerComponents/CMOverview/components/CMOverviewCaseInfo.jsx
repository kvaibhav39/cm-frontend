import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { Description } from "@mui/icons-material";
import { getAllCountries } from "../../../../../../../../store/actions/helperActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CircularLoader from "../../../../../../../../common/CircularLoader";
import { caseInfoFields } from "./utils/caseInfoFields";
import { getCurrentFileNameAndFunction } from "../../../../../../../../utils/getCurrentFileNameAndFunction.js";

const CMOverviewCaseInfo = () => {
  const { allCountries } = useSelector((state) => state.helper);
  const { OpsBasicCandidateInfo } = useSelector((state) => state.operations);
  const dispatch = useDispatch();

  useEffect(() => {
    if (OpsBasicCandidateInfo?.hrOrganizationId) {
      //this api call covers the whole case management page so there's no need to call it again in certain components

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        getAllCountries(logDetails)
      );
    }
  }, [OpsBasicCandidateInfo?.hrOrganizationId]);

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
      <Box display="flex" alignItems="center">
        <Description />
        <Typography
          fontWeight={550}
          textAlign={{ xs: "center", md: "left" }}
          ml={1}
          sx={{ wordBreak: "break-all" }}
        >
          Case Information
        </Typography>
      </Box>
      {OpsBasicCandidateInfo ? (
        <>
          {caseInfoFields(OpsBasicCandidateInfo, allCountries)?.map((curr) => (
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
                  sx={{ wordBreak: "break-all", textTransform: "capitalize" }}
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

export default CMOverviewCaseInfo;
