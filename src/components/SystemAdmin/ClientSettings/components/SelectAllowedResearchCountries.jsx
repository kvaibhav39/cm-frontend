import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CheckItem from "../../../Packages/CustomPackages/Checks/CheckWidget/CheckItem";
import { Form, Formik } from "formik";
import { getCheckOrderId } from "./../../../Operations/OperationsCandidates/OperationsCaseManagement/components/innerComponents/CMCheckStatus/AddCheck/utils/getCheckOrderId";
import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import CircularLoader from "./../../../../common/CircularLoader";
import { LoadingButton } from "@mui/lab";
import {
  getAllowedResearchCountriesSettings,
  updateAllowedResearchCountriesSettings,
} from "../../../../store/actions/systemAdminActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const SelectAllowedResearchCountries = () => {
  const dispatch = useDispatch();
  const tempRef = useRef(true);
  const formRef = useRef();
  const [allCountriesState, setAllCountriesState] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectAll, setSelectAll] = useState(false);

  let pageSize = 25;

  const { selectedOrg, allowedCountriesSettingData } = useSelector(
    (state) => state.systemAdmin
  );
  const { allCountriesModified } = useSelector((state) => state.helper);

  useEffect(() => {
    if (selectedOrg) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getAllowedResearchCountriesSettings(selectedOrg, logDetails));
    }
  }, [selectedOrg]);

  //setting initial values
  useEffect(() => {
    if (allCountriesModified) {
      let countriesArr = allCountriesModified?.map((v) => ({
        ...v,
        checkName: v.label,
        checkEnabled: false,
        checkId: v.value,
        checksId: v.value,
      }));

      if (allowedCountriesSettingData?.length) {
        let count = 0;

        countriesArr = countriesArr?.map((v) => {
          let ifPresent = allowedCountriesSettingData?.find(
            (curr) => curr?.countryId === v.value
          );

          if (ifPresent) {
            count++;
            v.checkEnabled = true;
          } else {
            v.checkEnabled = false;
          }
          return v;
        });

        if (count === countriesArr.length) {
          setSelectAll((prev) => (prev = true));
        } else {
          setSelectAll((prev) => (prev = false));
        }
      } else {
        setSelectAll((prev) => (prev = false));
      }

      setAllCountriesState(countriesArr);
      setFilteredCountries(countriesArr);
    }
  }, [allowedCountriesSettingData, allCountriesModified]);

  //search country filter
  const handleFilter = (e) => {
    if (e === "empty") {
      setFilterText("");
      return setFilteredCountries(allCountriesState);
    }

    setFilterText(e.target.value);
    let temp = allCountriesState;

    if (e.target.value !== "") {
      temp = allCountriesState.filter((curr) =>
        curr.label.toLowerCase().includes(e.target.value.toLowerCase())
          ? curr
          : null
      );
    } else {
      setFilterText("");
    }

    setFilteredCountries(temp);
    setPageNumber(1);
  };

  //pagination
  const handlePageChange = (e, newPage) => {
    if (pageNumber !== newPage) {
      setPageNumber(newPage);
    }
  };

  //select & remove all btn handler
  const handleSelectionOfCountries = (setFieldValue) => {
    let countriesArr = allCountriesState?.map((v) => ({
      ...v,
      checkEnabled: !selectAll,
    }));

    setFieldValue("checks", countriesArr);
    setSelectAll((prev) => !prev);
  };

  //form submit handler
  const handleSubmit = (values, form) => {
    form.setSubmitting(true);
    let countryIds = [];

    values?.checks?.forEach((curr) => {
      if (curr.checkEnabled) {
        countryIds.push(curr.value);
      }
    });

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(
      updateAllowedResearchCountriesSettings(
        { countryIds },
        selectedOrg,
        () => form.setSubmitting(false),
        logDetails
      )
    );
  };

  return (
    <>
      <Box mb={3} position="relative">
        <Formik
          enableReinitialize
          initialValues={{ checks: allCountriesState }}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={1}
                mb={3}
                position="relative"
              >
                <Typography
                  textAlign="right"
                  fontWeight={550}
                  variant="h4"
                  mr={1}
                  color={(theme) => theme.palette.grey[900]}
                >
                  Allowed Research Countries Setup
                </Typography>
                <Box position={{ xs: "relative", md: "absolute" }} right={0}>
                  <LoadingButton
                    loading={!allowedCountriesSettingData || isSubmitting}
                    variant="contained"
                    size="small"
                    disableElevation
                    type="submit"
                  >
                    Update Settings
                  </LoadingButton>
                </Box>
              </Box>
              {allowedCountriesSettingData ? (
                <Grid container display="flex" justifyContent="center">
                  <Grid
                    container
                    xs={12}
                    md={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box mr={2}>
                      <TextField
                        value={filterText}
                        placeholder="Search Country..."
                        type="text"
                        fullWidth={true}
                        size="small"
                        variant="outlined"
                        onChange={handleFilter}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchOutlined
                                style={{ marginLeft: "0.5rem" }}
                              />
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
                    </Box>
                    <Button
                      color={selectAll ? "error" : "warning"}
                      variant="contained"
                      size="small"
                      disableElevation
                      onClick={() => handleSelectionOfCountries(setFieldValue)}
                      sx={{ marginTop: { xs: 2, md: 0 } }}
                    >
                      {selectAll ? "Remove" : "Select"} All
                    </Button>
                  </Grid>
                  {filteredCountries?.length ? (
                    <Grid
                      container
                      item
                      xs={12}
                      spacing={1}
                      display="grid"
                      gridTemplateColumns={{
                        xs: "repeat(1, 1fr)",
                        md: "repeat(5, 1fr)",
                      }}
                      alignItems="center"
                      alignContent="baseline"
                      my={1}
                    >
                      {filteredCountries
                        ?.slice(
                          (pageNumber - 1) * pageSize,
                          (pageNumber - 1) * pageSize + pageSize
                        )
                        ?.map((countryConfig) => (
                          <Grid container item xs={12}>
                            {" "}
                            {/* <Grid container item xs={3}> */}
                            <CheckItem
                              id={countryConfig.value}
                              checks={values.checks}
                              checkOrderId={getCheckOrderId(
                                values.checks,
                                countryConfig.value
                              )}
                              defaultCheckConfig={countryConfig}
                              key={countryConfig.value}
                              tempRef={tempRef}
                              hideCheckDetails={true}
                              hideInfoIcon={true}
                              titleSize="h6"
                            />
                          </Grid>
                        ))}
                    </Grid>
                  ) : (
                    <Grid container item xs={12} my={1} justifyContent="center">
                      <Typography fontWeight={550} textAlign="center" mt={2}>
                        No Results Found
                      </Typography>
                    </Grid>
                  )}
                  <Box display="flex" justifyContent="center" mt={1}>
                    <Pagination
                      size="small"
                      count={Math.ceil(filteredCountries?.length / pageSize)}
                      page={pageNumber}
                      onChange={handlePageChange}
                      showFirstButton
                      showLastButton
                    />{" "}
                  </Box>
                </Grid>
              ) : (
                <CircularLoader size={40} height="50vh" />
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default SelectAllowedResearchCountries;
