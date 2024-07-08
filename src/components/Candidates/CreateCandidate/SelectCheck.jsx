import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import CheckItem from "../../Packages/CustomPackages/Checks/CheckWidget/CheckItem";
import { ClearOutlined, SearchOutlined } from "@mui/icons-material";

const SelectCheck = ({
  setFieldValue,
  values,
  countries,
  additionalChecks,
  displayPackages,
  setDisplayPackages,
  selectedCheckTypes,
  questionnairesData,
  filterPackages,
  setFilterPackages,
}) => {
  const tempRef = useRef(true);

  const getCheckOrderId = (checks, checksId) => {
    return checks?.length
      ? checks?.findIndex((check) => check?.checkId === checksId)
      : 0;
  };

  const handleFilter = async (e) => {
    if (e === "empty") {
      setFilterPackages("");
      return setDisplayPackages(additionalChecks);
    }

    setFilterPackages(e.target.value);
    let temp = additionalChecks;

    if (e.target.value !== "") {
      temp = additionalChecks.filter((curr) =>
        curr.checkName.toLowerCase().includes(e.target.value.toLowerCase())
          ? curr
          : null
      );
    } else {
      setFilterPackages("");
    }

    setDisplayPackages(temp);
  };

  return (
    <Grid
      container
      xs={12}
      justifyContent="center"
      alignContent="flex-start"
      height="100%"
    >
      <Grid container item xs={12} md={6} px={1} mb={1.5}>
        <TextField
          value={filterPackages}
          placeholder="Type Check Name To Search..."
          type="text"
          fullWidth={true}
          size="small"
          variant="outlined"
          onChange={handleFilter}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined style={{ marginLeft: "0.5rem" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ClearOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFilter("empty")}
                />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      {displayPackages?.length === 0 ? (
        <Typography variant="h4" textAlign="center" width="100%" mt={4}>
          No Checks Found
        </Typography>
      ) : (
        <Grid
          container
          item
          xs={12}
          spacing={1}
          sx={{
            height: "100%",
            overflow: "auto",
          }}
          px={1}
          alignContent="baseline"
        >
          {displayPackages?.map(
            (checkConfig) =>
              selectedCheckTypes.includes(checkConfig.checkTypeId) && (
                <CheckItem
                  id={checkConfig.checksId}
                  checks={values.checks}
                  checkOrderId={getCheckOrderId(
                    values.checks,
                    checkConfig.checksId
                  )}
                  defaultCheckConfig={checkConfig}
                  selectedCheckTypes={selectedCheckTypes}
                  questionnairesData={questionnairesData}
                  countriesData={countries}
                  key={checkConfig.checksId}
                  tempRef={tempRef}
                />
              )
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default SelectCheck;
