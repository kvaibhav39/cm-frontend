import { Box, Button, Grid, Typography } from "@mui/material";
import SelectPackageCheckTabs from "./SelectPackageCheck";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckItem from "../../Packages/CustomPackages/Checks/CheckWidget/CheckItem";
import AdditionalJurisdictionScopeCreateCandidate from "../../Packages/CustomPackages/Checks/AdditionalJurisdictionScopeCreateCandidate";
import { useTheme } from "@mui/material/styles";
import PanelCard from "../../../common/cards/PanelCard";
import { useDispatch } from "react-redux";
import { updatePackageForCandidate } from "../../../store/actions/hrActions";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import UploadCV from "./UploadCV";
import { useEffect, useState } from "react";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import { LoadingButton } from "@mui/lab";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const SelectPackage = ({
  setFieldValue,
  values,
  customPackages,
  countries,
  questionnairesData,
  additionalChecks,
  displayPackages,
  setDisplayPackages,
  selectedCheckTypes,
  createCandidate,
  disableBtn,
  setDisableBtn,
  setStep,
  updatePackage,
  candidateCaseId,
  savedCVfile,
  setSavedCVfile,
  filterPackages,
  setFilterPackages,
  isSubmitting,
  setSubmitting,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [CVcheckSelected, setCVcheckSelected] = useState(false);
  const getCheckOrderId = (checks, checksId) => {
    return checks?.length
      ? checks?.findIndex((check) => check?.checkId === checksId)
      : 0;
  };

  //to enable/disable upload btn when cv check is selected either from checks or present in selected package
  useEffect(() => {
    if (values?.checks?.length || customPackages?.length) {
      let getCVcheckStatusfromChecks = values?.checks?.find(
        (curr) => curr.checksId === 10
      )?.checkEnabled;

      let getCVcheckStatusfromPackages = values?.packageId
        ? customPackages?.find((curr) => curr?.packagesId === values?.packageId)
        : [];

      getCVcheckStatusfromPackages =
        getCVcheckStatusfromPackages?.packageChecks?.find(
          (curr) => curr.checksId === 10
        )
          ? true
          : false;

      if (getCVcheckStatusfromChecks || getCVcheckStatusfromPackages) {
        setCVcheckSelected(true);
        if (!savedCVfile) {
          setDisableBtn(true);
        }
      } else {
        setSavedCVfile(null);
        setCVcheckSelected(false);
      }
    }
  }, [values, customPackages, savedCVfile]);

  const handleUpdatePackage = (values) => {
    let errorFlag = false;
    let payload = {
      packageId: values?.packageId || null,
    };

    let params = {
      orgId: getLoggedInUserHrOrganizationId(),
    };

    let query = {
      candidateCaseId,
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdatePackage"
    );

    payload.additionalChecks = [...values.checks, ...values.extraChecks]
      .filter((check) => check.checkEnabled)
      .map(({ checksId, checkScope }) => {
        if (checksId === 8 || checksId === 15) {
          if (!checkScope?.questionnaireId) {
            errorFlag = true;
            dispatch(
              setToastNotification(
                ERROR,
                "Please select a valid questionnaire!",
                logDetails
              )
            );
          }
        }
        if (checksId === 25) {
          if (
            !checkScope?.jurisdictionId.length &&
            !checkScope.allJurisdictionSearch
          ) {
            errorFlag = true;
            dispatch(
              setToastNotification(
                ERROR,
                "Please select atleast 1 research country!",
                logDetails
              )
            );
          }
        }
        return { checksId: checksId, checkScope: checkScope };
      });

    if (errorFlag) {
      return setDisableBtn(true);
    }

    if (savedCVfile?.attachmentPath) {
      let tempCVCheck = payload?.additionalChecks?.find(
        (curr) => curr.checksId === 10
      );

      if (tempCVCheck) {
        payload.additionalChecks = payload?.additionalChecks?.map((curr) => {
          if (curr.checksId === 10) {
            return {
              checksId: 10,
              checkScope: {
                attachmentPath: savedCVfile?.attachmentPath,
                attachmentName: savedCVfile?.attachmentName,
                attachmentCategoryName: "CANDIDATE_DOCUMENT",
              },
            };
          }
          return curr;
        });
      } else {
        payload.additionalChecks = [
          ...payload.additionalChecks,
          {
            checksId: 10,
            checkScope: {
              attachmentPath: savedCVfile?.attachmentPath,
              attachmentName: savedCVfile?.attachmentName,
              attachmentCategoryName: "CANDIDATE_DOCUMENT",
            },
          },
        ];
      }
    }

    if (!payload?.packageId) {
      delete payload.packageId;
    }

    // console.log("updatePackage", temp, payload);
    dispatch(updatePackageForCandidate(payload, params, query, logDetails));
    navigate(-1);
  };

  return (
    <Box
      sx={{
        height: { xs: "95vh", md: "none" },
        overflow: { xs: "scroll", md: "hidden" },
      }}
      mt={{ xs: 10, md: 0 }}
    >
      <Grid
        xs={12}
        spacing={3}
        sx={{
          justifyContent: "flex-start",
        }}
      >
        <PanelCard
          sx={{
            padding: "8px",
            overflowY: { xs: "auto", md: "hidden" },
          }}
        >
          <Grid item sm={12} mb={2}>
            <Typography variant="h4">
              {updatePackage ? "Update " : "Select "}
              Package For Verification
            </Typography>
          </Grid>
          <Grid item sm={12} mb={2}>
            <SelectPackageCheckTabs
              packages={customPackages}
              selectPackage={setFieldValue}
              setFieldValue={setFieldValue}
              values={values}
              countries={countries}
              questionnairesData={questionnairesData}
              additionalChecks={additionalChecks}
              displayPackages={displayPackages}
              setDisplayPackages={setDisplayPackages}
              selectedCheckTypes={selectedCheckTypes}
              filterPackages={filterPackages}
              setFilterPackages={setFilterPackages}
            />
          </Grid>
        </PanelCard>
      </Grid>
      <PanelCard
        sx={{
          margin: "8px 0 12px 0",
          padding: "8px",
        }}
      >
        <Grid container xs={12} display="flex" justifyContent="space-between">
          <Grid
            item
            xs={12}
            md={7.8}
            sx={{
              marginLeft: "10px",
              height: { xxxl: "40vh", lg2: "23vh", md: "20vh" },
              overflow: "auto",
            }}
            p={1}
          >
            {values?.extraChecks?.map((checkConfig) => (
              <>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  direction="column"
                  backgroundColor={theme.palette.primary[100]}
                  p={1}
                >
                  <Typography variant="h4" gutterBottom textAlign="left">
                    {checkConfig?.checkName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {checkConfig?.checkDescription})
                  </Typography>
                </Grid>
                <AdditionalJurisdictionScopeCreateCandidate
                  wrapperObject={values?.extraChecks}
                  checkOrderId={getCheckOrderId(
                    values?.extraChecks,
                    checkConfig.checksId
                  )}
                  checkId={checkConfig.checksId}
                  checksCategory="extraChecks"
                />
              </>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            {CVcheckSelected && (
              <Grid xs={12}>
                <UploadCV
                  savedCVfile={savedCVfile}
                  setSavedCVfile={setSavedCVfile}
                  setDisableBtn={setDisableBtn}
                />
              </Grid>
            )}
            <Grid
              xs={12}
              display="flex"
              justifyContent={{ md: "flex-end", xs: "center" }}
              alignItems="center"
              my={{ xs: 2, md: 0 }}
            >
              <Button
                onClick={() => (updatePackage ? navigate(-1) : setStep(1))}
                variant="outlined"
                disableElevation
                sx={{ marginRight: "10px" }}
              >
                <ArrowBackIcon /> Back
              </Button>{" "}
              {updatePackage ? (
                <Button
                  variant="contained"
                  disableElevation
                  disabled={disableBtn}
                  onClick={() => handleUpdatePackage(values)}
                >
                  Update
                </Button>
              ) : (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={isSubmitting || disableBtn}
                  loading={isSubmitting}
                  onClick={() => createCandidate(values, setSubmitting)}
                >
                  Register
                </LoadingButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </PanelCard>
    </Box>
  );
};

export default SelectPackage;
