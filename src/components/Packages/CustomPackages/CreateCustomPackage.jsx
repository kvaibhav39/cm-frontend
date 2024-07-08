import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Grid, InputAdornment, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FastField, Form, Formik } from "formik";
import CheckTypesList from "./Checks/CheckWidget/ChecksTypesList";
import { InputTextField } from "../../../common/Form/InputTextField/InputTextField";
import CheckItem from "./Checks/CheckWidget/CheckItem";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import { useDispatch, useSelector } from "react-redux";
import PanelCard from "../../../common/cards/PanelCard";
import { PackageValidationSchema } from "../PackagesHelper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import ScrollableGrid from "../../../common/ScrollableGrid";
import permissionKey from "../../constants/permissionKey";
import { checkActionPermission } from "../../../utils/CheckPageAccess";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomTooltip from "../../common/CustomTooltip";
import {
  createNewPackage,
  getAllChecks,
  getAllQuestionnaires,
  getPackage,
  updatePackage,
} from "../../../store/actions/hrActions";
import {
  getAllCountries,
  getCountryBasedResponse,
} from "../../../store/actions/helperActions";
import {
  CLEAR_ALL_CHECKS,
  CLEAR_PACKAGE_DATA,
  GET_ALL_CHECKS,
} from "../../../store/actions/actionTypes";
import CircularLoader from "../../../common/CircularLoader";
import { uniqueId } from "lodash";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const EditCustomPackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const usage = searchParams.get("screen");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCheckTypes, setSelectedCheckTypes] = useState([]);
  const [packageFormData, setPackageFormData] = useState({});
  const [countrySelect, setCountrySelect] = useState([]);
  const { packageId } = useParams();
  const [disableBtn, setDisableBtn] = useState(true);
  const [filterText, setFilterText] = useState(null);
  const loggedInUser = useSelector((state) => state.authorization);
  const { countriesDataAsPerOrg } = useSelector((state) => state.systemAdmin);
  const { allQuestionnaires, allChecksData, fetchedPackageData, loading } =
    useSelector((state) => state?.hr);
  const payloadRef = useRef();
  const tempRef = useRef();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (packageId) {
      dispatch(
        getPackage(
          {
            orgId: getLoggedInUserHrOrganizationId(),
            packageId: packageId,
          },
          getLoggedInUserHrOrganizationId(),
          logDetails
        )
      );
    } else {
      dispatch(getAllChecks(logDetails, getLoggedInUserHrOrganizationId()));
    }

    dispatch(
      getAllCountries(
        logDetails,
        { hrOrganizationId: getLoggedInUserHrOrganizationId() },
        true
      )
    );

    if (!allQuestionnaires) {
      dispatch(
        getAllQuestionnaires(
          {
            orgId: getLoggedInUserHrOrganizationId(),
          },
          logDetails
        )
      );
    }

    return () => {
      dispatch({ type: CLEAR_PACKAGE_DATA });
      dispatch({ type: CLEAR_ALL_CHECKS, payload: null });
    };
  }, []);

  //handle package data
  useEffect(() => {
    if (
      fetchedPackageData?.checks?.length &&
      allChecksData?.checks?.length &&
      !packageFormData?.checks?.length
    ) {
      // setFilteredData(allChecksData?.checks);
      setSelectedCheckTypes(
        allChecksData.checkTypes.map((checkType) => checkType.checkTypesId)
      );
      if (usage === "saveAs") {
        fetchedPackageData.packageName = "";
        fetchedPackageData.packageDescription = "";
      }
      let tempChecks = allChecksData?.checks?.map((defaultCheck) => {
        const exist = fetchedPackageData.checks.find(
          (check) => check.checkId === defaultCheck.checksId
        );
        return {
          ...defaultCheck,
          checkEnabled: exist ? true : false,
          defaultScope: exist ? exist.checkScope : defaultCheck.defaultScope,
        };
      });
      console.log("🚀 ~ useEffect ~ tempObject:", tempChecks);

      let tempObject = {
        ...fetchedPackageData,
        checks: getFormattedChecks(tempChecks),
      };
      console.log("🚀 ~ useEffect ~ tempObject:", tempObject);
      setPackageFormData(tempObject);
    } else if (
      !fetchedPackageData?.checks?.length &&
      allChecksData?.checks?.length &&
      !packageFormData?.checks?.length
    ) {
      setPackageFormData({
        packageName: "",
        packageDescription: "",
        checks: getFormattedChecks(allChecksData?.checks),
      });
      setSelectedCheckTypes(
        allChecksData.checkTypes.map((checkType) => checkType.checkTypesId)
      );
    } else if (packageFormData?.checks?.length) {
      setFilteredData(packageFormData.checks);
    }
  }, [fetchedPackageData, allChecksData?.checks, packageFormData?.checks]);

  const setCountry = async (id) => {
    tempRef.current = true;
    if (!id) {
      setCountrySelect([]);
      return;
    } else {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "setCountry"
      );

      dispatch(getCountryBasedResponse(id, setCountrySelect, logDetails));
    }
    setTimeout(() => {
      tempRef.current = false;
    }, 300);
  };
  const getCheckOrderId = (checks, checksId) => {
    return checks?.length
      ? checks?.findIndex((check) => check.checkId === checksId)
      : 0;
  };

  const getFormattedChecks = (checks) => {
    return checks?.map((check, index) => {
      return {
        ...check,
        checkId: check.checksId,
        checkScope: check.defaultScope,
      };
    });
  };

  const createPackage = async (values, { setSubmitting, resetForm }) => {
    try {
      let allowSubmit = true;
      payloadRef.current = JSON.parse(JSON.stringify(values));
      setDisableBtn(false);
      let finalPackage = { ...values };

      finalPackage.checksCount = Object.values(
        finalPackage.checks.reduce((c, { checkTypeId, checkEnabled }) => {
          if (checkEnabled === true) {
            c[checkTypeId] = c[checkTypeId] || {
              checkTypesId: checkTypeId,
              count: 0,
            };
            c[checkTypeId].count++;
          }
          return c;
        }, {})
      );
      finalPackage.checks = finalPackage.checks.filter(function (check) {
        if (check.checkEnabled === true) {
          delete check.checkEnabled;
          delete check.checkTypeId;
          return check;
        }
      });
      finalPackage.countryOfEmployment &&
        delete finalPackage.countryOfEmployment;
      delete finalPackage.extraChecks;

      finalPackage.checks.forEach((curr) => {
        if (curr?.checkId === 25) {
          if (curr?.checkScope?.allJurisdictionSearch) {
            curr.checkScope.jurisdictionId = [];
          } else {
            if (curr?.checkScope?.jurisdictionId?.length === 0) {
              allowSubmit = false;
              setDisableBtn(true);
            }
          }
        }
      });

      let data = {
        checks: finalPackage.checks.map((check) => {
          return {
            checkId: check.checkId,
            checkScope: check.checkScope,
          };
        }),
        checksCount: finalPackage.checksCount,
        packageDescription: finalPackage.packageDescription,
        packageName: finalPackage.packageName,
      };

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "createPackage"
      );

      if (allowSubmit) {
        if (usage === "saveAs") {
          dispatch(
            createNewPackage(
              data,
              {
                orgId: getLoggedInUserHrOrganizationId(),
              },
              logDetails
            )
          );
        } else if (packageId) {
          dispatch(
            updatePackage(
              data,
              {
                orgId: getLoggedInUserHrOrganizationId(),
                pkgId: packageId,
              },
              logDetails
            )
          );
        } else {
          dispatch(
            createNewPackage(
              data,
              {
                orgId: getLoggedInUserHrOrganizationId(),
              },
              logDetails
            )
          );
        }
        navigate("/hr/packages");
      }
    } catch (error) {
      resetForm({ values: { ...payloadRef?.current } });

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "createPackage"
      );
      dispatch(setToastNotification(ERROR, error, logDetails));
    }
  };

  const handleFilter = async (e) => {
    if (e === "empty") {
      setFilterText("");
      return setFilteredData(packageFormData.checks);
    }

    setFilterText(e.target.value);
    let temp = packageFormData.checks;

    if (e.target.value !== "") {
      temp = packageFormData.checks.filter((curr) =>
        curr.checkName.toLowerCase().includes(e.target.value.toLowerCase())
          ? curr
          : null
      );
    } else {
      setFilterText("");
    }

    setFilteredData(temp);
  };

  const hrPackageEditAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrPackageEdit,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const hrCreatePackageAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrPackageCreate,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const loadingCondition = () => {
    if (
      (searchParams.get("viewMode") || usage) &&
      !packageFormData?.checks?.length
    ) {
      return false;
    }

    return true;
  };

  return (
    <>
      {loadingCondition() &&
      allChecksData?.checks?.length &&
      packageFormData?.checks?.length &&
      countriesDataAsPerOrg ? (
        <Formik
          initialValues={packageFormData}
          validationSchema={PackageValidationSchema}
          enableReinitialize
          onSubmit={createPackage}
          validateOnChange={false}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <Form>
              <ScrollableGrid container spacing={2}>
                <Grid item md={2} xs={12} mt={{ xs: 10, md: 0 }}>
                  <PanelCard>
                    <CheckTypesList
                      checkTypes={allChecksData.checkTypes}
                      selectedCheckTypes={selectedCheckTypes}
                      onSelectCheckType={setSelectedCheckTypes}
                      checks={values.checks}
                      setDisableBtn={setDisableBtn}
                    />
                  </PanelCard>
                </Grid>

                <ScrollableGrid
                  item
                  md={10}
                  xs={12}
                  applyScrollToScreenAndBelow={false}
                >
                  <PanelCard>
                    {loading ? (
                      <CircularLoader />
                    ) : (
                      <>
                        <Typography variant="h4" mb={2}>
                          {searchParams.get("viewMode")
                            ? "View"
                            : usage === "edit"
                            ? "Update"
                            : "Add"}{" "}
                          Custom Package
                        </Typography>
                        <Grid
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Grid item xs={12} sm={6}>
                            <FastField
                              name="packageName"
                              label="Enter Package Name *"
                              error={
                                touched?.packageName && errors?.packageName
                              }
                              component={InputTextField}
                              disabled={searchParams.get("viewMode") || false}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} display="flex">
                            <Grid item xs={11}>
                              <Autocomplete
                                id="country-select-demo"
                                sx={{ height: "1.5em" }}
                                options={countriesDataAsPerOrg}
                                autoHighlight
                                onChange={(c, value) => {
                                  setCountry(value?.value);
                                }}
                                getOptionLabel={(option) => option.label}
                                disabled={searchParams.get("viewMode") || false}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Country of Research/Verification"
                                    inputProps={{
                                      ...params.inputProps,
                                      autoComplete: "new-password", // disable autocomplete and autofill
                                    }}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <CustomTooltip
                                title={`Please Note: Packages are independent of "Country Of Employment" and can be used with any Country and Jurisdiction. Here "Country of Employment" is only to check the availability and pricing of any check in the selected Country.`}
                                tooltipmaxwidth={310}
                              >
                                <IconButton>
                                  <InfoIcon />
                                </IconButton>
                              </CustomTooltip>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} my={1}>
                          <FastField
                            name="packageDescription"
                            error={
                              touched?.packageDescription &&
                              errors?.packageDescription
                            }
                            label="Package Description *"
                            placeholder={
                              "You may write a Package Description to help you remind in future why this custom package was created(upto 500 words)"
                            }
                            multiline
                            component={InputTextField}
                            disabled={searchParams.get("viewMode") || false}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ marginLeft: "auto" }}
                          mb={3}
                        >
                          <TextField
                            value={filterText}
                            placeholder="Type Check Name To Search..."
                            type="text"
                            fullWidth={true}
                            size="small"
                            variant="outlined"
                            onChange={handleFilter}
                            onBlur={handleBlur}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchOutlinedIcon
                                    style={{ marginLeft: "0.5rem" }}
                                  />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <ClearOutlinedIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleFilter("empty")}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid
                          container
                          item
                          xs={12}
                          spacing={2}
                          sx={{
                            maxHeight: { xxxl: "90vh", xl: "70vh", xs: "50vh" },
                            overflow: "auto",
                          }}
                        >
                          {filteredData?.length ? (
                            filteredData?.map((checkConfig) => {
                              if (
                                selectedCheckTypes.includes(
                                  checkConfig.checkTypeId
                                )
                              )
                                return (
                                  <CheckItem
                                    key={uniqueId()}
                                    checks={values?.checks}
                                    checkOrderId={getCheckOrderId(
                                      values?.checks,
                                      checkConfig.checksId
                                    )}
                                    defaultCheckConfig={checkConfig}
                                    selectedCountry={countrySelect}
                                    selectedCheckTypes={selectedCheckTypes}
                                    questionnairesData={allQuestionnaires}
                                    countriesData={countriesDataAsPerOrg}
                                    setDisableBtn={setDisableBtn}
                                    showCheckPrice={true}
                                    viewMode={
                                      searchParams.get("viewMode") || false
                                    }
                                    // disableCheck={
                                    //   !countrySelect?.find((checkVal) => {
                                    //     if (
                                    //       checkVal.checkId === checkConfig.checksId &&
                                    //       selectedCheckTypes.includes(
                                    //         checkConfig.checkTypeId
                                    //       )
                                    //     ) {
                                    //       return checkVal;
                                    //     }
                                    //   })?.isCapable
                                    // }
                                    tempRef={tempRef}
                                  />
                                );
                            })
                          ) : (
                            <Box p={2} my={5}>
                              <Typography variant="h4" textAlign="center">
                                No results found.
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                        <Grid
                          container
                          item
                          xs={12}
                          direction="row"
                          justifyContent={"flex-end"}
                          gap={2}
                          mt={2}
                        >
                          <Button
                            variant="outlined"
                            disableElevation
                            onClick={() => navigate("/hr/packages")}
                          >
                            <ArrowBackIcon /> Back
                          </Button>

                          {packageId &&
                          usage === "edit" &&
                          hrPackageEditAccess ? (
                            <Button
                              type="submit"
                              variant="contained"
                              disableElevation
                              disabled={
                                disableBtn || Object.keys(errors)?.length
                              }
                            >
                              Update Package
                            </Button>
                          ) : (
                            (!packageId || usage === "saveAs") &&
                            hrCreatePackageAccess && (
                              <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                disabled={
                                  disableBtn || Object.keys(errors)?.length
                                }
                              >
                                Add Package
                              </Button>
                            )
                          )}
                        </Grid>
                      </>
                    )}
                  </PanelCard>
                </ScrollableGrid>
              </ScrollableGrid>
            </Form>
          )}
        </Formik>
      ) : !allChecksData?.checks?.length && !loading ? (
        <Box p={2} my={5}>
          <Typography variant="h4" textAlign="center">
            There are no checks assigned with this organization. Please contact
            system admin if you want to add additional checks. If you have any
            questions, feel free to reach out to us at{" "}
            <a href="mailto:info@checkministry.com">info@checkministry.com</a>.
          </Typography>
        </Box>
      ) : (
        <CircularLoader />
      )}
    </>
  );
};

export default EditCustomPackage;
