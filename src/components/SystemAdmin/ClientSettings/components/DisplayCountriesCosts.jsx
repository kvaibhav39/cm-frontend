import { Box, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import CustomTooltip from "../../../common/CustomTooltip";
import { Close, Edit, ReplayOutlined, Save } from "@mui/icons-material";

const DisplayCountriesCosts = ({
  check,
  checkCosts,
  theme,
  toEditCountryId,
  setToEditCountryId,
  enteredCost,
  setEnteredCost,
  enteredCurrency,
  setEnteredCurrency,
  handleUpdateCost,
  updatedCost,
  handleRevertChanges,
}) => {
  return (
    <Grid
      item
      xs={12}
      md={3.8}
      p={1}
      display="flex"
      justifyContent={{
        xs: "center",
        md: "space-around",
      }}
      alignItems="center"
      flexDirection={{
        xs: "column",
        md: "row",
      }}
      textAlign="center"
      border="1px solid #c4c4c4"
    >
      <Grid item xs={6.5}>
        <Typography
          fontWeight={500}
          color="#000"
          textAlign={{ md: "left", xs: "center" }}
        >
          {checkCosts?.countryName}
        </Typography>
      </Grid>
      <Grid
        item
        xs={5.5}
        display="flex"
        justifyContent={{
          xs: "center",
          md: "space-around",
        }}
        alignItems="center"
        flexDirection={{
          xs: "column",
          md: "row",
        }}
      >
        {toEditCountryId === checkCosts?.countryId ? (
          <Box
            display="flex"
            justifyContent={{
              xs: "center",
              md: "space-between",
            }}
            alignItems={{
              xs: "center",
              md: "space-around",
            }}
            flexDirection="column"
            rowGap={1}
          >
            <TextField
              label="Cost"
              type="number"
              value={enteredCost || ""}
              onChange={(e) => setEnteredCost(+e.target.value)}
              autoFocus
              size="small"
              inputProps={{
                style: {
                  height: "10px",
                },
              }}
            />
            <TextField
              label="Currency"
              type="text"
              value={enteredCurrency}
              // onChange={(e) => setEnteredCurrency(e.target.value)}
              autoFocus
              size="small"
              inputProps={{
                style: {
                  height: "10px",
                },
              }}
              disabled
            />
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            <Typography
              color={checkCosts.oldCost ? "#4caf50" : ""}
              sx={{ wordBreak: "break-all" }}
            >
              {checkCosts?.cost || "No Data"}
            </Typography>
            {checkCosts.oldCost ? (
              <Typography
                color="error"
                ml={0.5}
                sx={{ wordBreak: "break-all" }}
              >
                {checkCosts.oldCost || "No Data"}
              </Typography>
            ) : null}
            <Typography ml={0.5}>
              ({checkCosts?.costCurrencyISOCode || "-"})
            </Typography>
          </Box>
        )}
        {toEditCountryId === checkCosts?.countryId ? (
          <>
            <CustomTooltip title="Save Edit" placement="top">
              <Box>
                <Save
                  ml={1}
                  onClick={() => {
                    handleUpdateCost(checkCosts);
                  }}
                  sx={{
                    transform: "scale(0.8)",
                    cursor: "pointer",
                    color: theme.palette.success.main,
                  }}
                />
              </Box>
            </CustomTooltip>
            <CustomTooltip title="Close" placement="top">
              <Box>
                <Close
                  ml={1}
                  onClick={() => {
                    setToEditCountryId(null);
                  }}
                  sx={{
                    transform: "scale(0.8)",
                    cursor: "pointer",
                    color: theme.palette.error.light,
                  }}
                />
              </Box>
            </CustomTooltip>
          </>
        ) : (
          <>
            <CustomTooltip title="Edit Cost" placement="top">
              <Box>
                <Edit
                  ml={1}
                  onClick={() => {
                    setToEditCountryId(checkCosts?.countryId);
                    setEnteredCost(checkCosts?.cost);
                  }}
                  sx={{
                    transform: "scale(0.8)",
                    cursor: "pointer",
                    color: theme.palette.warning.dark,
                  }}
                />
              </Box>
            </CustomTooltip>
            {updatedCost.find(
              (curr) =>
                curr.countryId === checkCosts.countryId &&
                curr.checkId === check.checksId
            ) ? (
              <CustomTooltip title="Revert Changes" placement="top">
                <Box>
                  <ReplayOutlined
                    ml={1}
                    onClick={() => handleRevertChanges(checkCosts)}
                    sx={{
                      transform: "scale(0.8)",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              </CustomTooltip>
            ) : null}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default DisplayCountriesCosts;
