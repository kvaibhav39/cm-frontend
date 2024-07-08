import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
const DisplayCheckOrSubCheckDetails = ({ addedChecks, condition, title }) => {
  return (
    <>
      {addedChecks?.length && addedChecks?.find((check) => condition(check)) ? (
        <Grid
          container
          xs={12}
          display="flex"
          justifyContent="center"
          p={2}
          mb={title === "Sub-Checks" ? 2 : 0}
          sx={{
            borderTop: (theme) =>
              title === "Sub-Checks"
                ? addedChecks?.find(
                    (check) => check.checkId && !check.candidatesChecksMappingId
                  ) && `1px solid ${theme.palette.grey[400]}`
                : null,
          }}
        >
          <Grid item xs={12} mb={1}>
            <Typography fontWeight={550} textAlign="center" fontSize="16px">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {addedChecks?.map((check) => {
              if (!condition(check)) {
                return <></>;
              }
              let tempCheckScopeDesc;

              if (check.checkId === 12) {
                if (check.checkScope.checkGap) {
                  tempCheckScopeDesc = check.checkScopeDescription?.replace(
                    "$[checkGap]",
                    ""
                  );
                } else {
                  tempCheckScopeDesc =
                    check.checkScopeDescription?.split("$[checkGap]")[0];
                }
              } else {
                tempCheckScopeDesc = check.checkScopeDescription;
              }

              for (let checkVal in check.checkScope) {
                tempCheckScopeDesc = tempCheckScopeDesc?.replace(
                  `$[${checkVal}]`,
                  check.checkScope[checkVal]
                );
              }

              return (
                <Box display="flex" alignItems="center" ml={1} mb={1}>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="span"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={0.5}
                    >
                      <CircleIcon sx={{ width: "8px" }} />
                    </Box>
                    <Box>
                      <Typography fontWeight={500} whiteSpace="nowrap">
                        {check.checkDisplayName}{" "}
                      </Typography>
                    </Box>
                  </Box>
                  <Box ml={0.5}>
                    <Typography component="span">
                      {check.checkScopeDescription
                        ? ` : ${tempCheckScopeDesc}`
                        : null}
                      {check.displayExtra ? ` (${check.displayExtra})` : null}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

export default DisplayCheckOrSubCheckDetails;
