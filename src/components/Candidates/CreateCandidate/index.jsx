import { Box, Button, Grid } from "@mui/material";
import PanelCard from "../../../common/cards/PanelCard";
import RegisterCandidate from "./RegisterCandidate";
import { useState, useEffect, useRef, useMemo } from "react";
import { Form, Formik, setNestedObjectValues, useFormikContext } from "formik";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useSearchParams } from "react-router-dom";
import SelectPackage from "./SelectPackage";
import { useDispatch, useSelector } from "react-redux";
import { CandidateRegisterSchema } from "../helper/ValidationSchema/RegisterCandidate";
import { initialValues } from "../helper/InitialState/RegisterCandidate";
import { isEmpty } from "lodash";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import {
  addCandidateInOrgTeam,
  getAllChecks,
  getAllQuestionnaires,
  getCustomFieldByOrgId,
  getCustomPackages,
} from "../../../store/actions/hrActions";
import { getAllCountries } from "../../../store/actions/helperActions";
import { getOrgsListsByOpsUserId } from "./../../../store/actions/operationActions";
import {
  CLEAR_ALL_CHECKS,
  SET_OPS_COMPONENT,
} from "../../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

//to disable create candidate btn when no packages are selected/enabled
const DisableCreateCandidateBtn = ({ setDisableBtn }) => {
  const { values } = useFormikContext();
  useEffect(() => {
    let flag = true;

    values?.checks?.map((curr) => {
      if (curr?.checkEnabled === true) {
        return (flag = false);
      }
    });
    flag = values?.packageId ? false : flag;
    setDisableBtn(flag);
  }, [values]);
  return <></>;
};

//to strike out custom packages checks and to replace it with that of user selected check
const StrikeOutCustomPackages = ({ customPackages, setCustomPackages }) => {
  const { values } = useFormikContext();
  useEffect(() => {
    let tempCustomPackages = [...customPackages];
    values?.checks?.map((additionalCheck) => {
      tempCustomPackages?.map((customPkg) => {
        customPkg?.packageChecks?.map((pkgCheck) => {
          if (additionalCheck.checksId === pkgCheck.checksId) {
            if (additionalCheck.checkEnabled && !pkgCheck.checkAdded) {
              let tempCheckScopeDesc;

              if (additionalCheck.checksId === 12) {
                if (additionalCheck.checkScope.checkGap) {
                  tempCheckScopeDesc =
                    additionalCheck.checkScopeDescription.replace(
                      "$[checkGap]",
                      ""
                    );
                } else {
                  tempCheckScopeDesc =
                    additionalCheck.checkScopeDescription.split(
                      "$[checkGap]"
                    )[0];
                }
              } else {
                tempCheckScopeDesc = additionalCheck.checkScopeDescription;
              }

              for (let checkVal in additionalCheck.checkScope) {
                tempCheckScopeDesc = tempCheckScopeDesc.replace(
                  `$[${checkVal}]`,
                  additionalCheck.checkScope[checkVal]
                );
              }
              //to omit when submitting
              pkgCheck.strikeOut = true;
              pkgCheck.newCheckScopeDescription = tempCheckScopeDesc;
            } else {
              pkgCheck.strikeOut = false;
            }
          }
        });
      });
    });

    setCustomPackages(tempCustomPackages);
  }, [values.checks]);
  return <></>;
};

//to push enabled additional checks in to the selected custom pkgs only when that additional check is not present in it
const PushAdditionalCheckToCustomPkgs = ({
  customPackages,
  setCustomPackages,
}) => {
  const { values } = useFormikContext();
  useEffect(() => {
    let tempCustomPackages = [...customPackages];
    values?.checks?.map((additionalCheck) => {
      tempCustomPackages?.map((customPkg) => {
        customPkg?.packageChecks?.map((pkgCheck) => {
          if (additionalCheck.checkEnabled) {
            let tempCheckScopeDesc;

            if (additionalCheck.checksId === 12) {
              if (additionalCheck.checkScope.checkGap) {
                tempCheckScopeDesc =
                  additionalCheck.checkScopeDescription.replace(
                    "$[checkGap]",
                    ""
                  );
              } else {
                tempCheckScopeDesc =
                  additionalCheck.checkScopeDescription.split("$[checkGap]")[0];
              }
            } else {
              tempCheckScopeDesc = additionalCheck.checkScopeDescription;
            }

            for (let checkVal in additionalCheck.checkScope) {
              tempCheckScopeDesc = tempCheckScopeDesc.replace(
                `$[${checkVal}]`,
                additionalCheck.checkScope[checkVal]
              );
            }

            additionalCheck.newCheckScopeDescription = tempCheckScopeDesc;

            let present = customPkg?.packageChecks?.find(
              (pkgCheck) => pkgCheck.checksId === additionalCheck.checksId
            );

            if (!present) {
              customPkg.packageChecks.push({
                ...additionalCheck,
                addedCheckScopeDescription: tempCheckScopeDesc,
                checkAdded: true,
              });
            } else if (additionalCheck.checksId === pkgCheck.checksId) {
              pkgCheck.addedCheckScopeDescription = tempCheckScopeDesc;
            }
          } else {
            customPkg.packageChecks.map((pkg) => {
              if (pkg.checksId === additionalCheck.checksId && pkg.checkAdded) {
                customPkg.packageChecks = [
                  ...customPkg.packageChecks.filter(
                    (curr) =>
                      !(
                        curr.checksId === additionalCheck.checksId &&
                        curr.checkAdded
                      )
                  ),
                ];
              }
            });
          }
        });
      });
    });

    setCustomPackages(tempCustomPackages);
  }, [values.checks]);
  return <></>;
};

const CreateCandidate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    customFieldByOrgId,
    allCustomPackages,
    allQuestionnaires,
    allChecksData,
  } = useSelector((state) => state?.hr);
  const { allCountriesModified } = useSelector((state) => state.helper);
  const { OpsBasicCandidateInfo, orgsListsByOpsUserId } = useSelector(
    (state) => state.operations
  );
  const { currentUser } = useSelector((state) => state.authorization);
  const [step, setStep] = useState(1);
  const [disableBtn, setDisableBtn] = useState(false);
  const [customPackages, setCustomPackages] = useState(null);
  const [countries, setCountries] = useState([]);
  const [additionalChecks, setAdditionalChecks] = useState([]);
  const [displayPackages, setDisplayPackages] = useState(null);
  const [selectedCheckTypes, setSelectedCheckTypes] = useState([]);
  const [extraChecks, setExtraChecks] = useState([]);
  const [savedCVfile, setSavedCVfile] = useState(null);
  const [filterPackages, setFilterPackages] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  let currentLoginProfile = localStorage.getItem("loginProfile");

  let { CheckMinistryUser } = JSON.parse(
    localStorage.getItem(`${currentLoginProfile}_login`)
  );

  const loggedUser = JSON.parse(CheckMinistryUser);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (OpsBasicCandidateInfo) {
      dispatch(
        getAllChecks(logDetails, OpsBasicCandidateInfo?.hrOrganizationId)
      );
    } else if (getLoggedInUserHrOrganizationId()) {
      dispatch(getAllChecks(logDetails, getLoggedInUserHrOrganizationId()));
    }
  }, [OpsBasicCandidateInfo]);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getCustomFieldByOrgId(
        { fieldCategoryName: "CANDIDATE-REGISTRATION" },
        {
          orgId: getLoggedInUserHrOrganizationId(),
        },
        logDetails
      )
    );

    dispatch(getAllCountries(logDetails));

    dispatch(
      getCustomPackages(
        {
          orgId: getLoggedInUserHrOrganizationId(),
        },
        logDetails
      )
    );
    return () => dispatch({ type: CLEAR_ALL_CHECKS, payload: null });
  }, []);

  //all countries
  useEffect(() => {
    if (allCountriesModified) {
      setCountries(allCountriesModified);
    }
  }, [allCountriesModified]);

  //custom packages
  useEffect(() => {
    if (allCustomPackages) {
      setCustomPackages(allCustomPackages);
    }
  }, [allCustomPackages]);

  //questionnaires
  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getAllQuestionnaires(
        {
          orgId: getLoggedInUserHrOrganizationId(),
        },
        logDetails
      )
    );
  }, []);

  //all checks
  useEffect(() => {
    if (allChecksData) {
      const checksArr = allChecksData.checks.map((v) => ({
        ...v,
        checkEnabled: false,
        checkScope: v.defaultScope,
        checkId: v.checksId,
      }));
      setAdditionalChecks(checksArr);
      setDisplayPackages(checksArr);
      // setFieldValue("checks", checksArr);
      setSelectedCheckTypes(
        allChecksData.checkTypes.map((checkType) => checkType.checkTypesId)
      );

      const extraChecksArr = allChecksData.extraCheck.map((v) => ({
        ...v,
        checkEnabled: true,
        checkScope: v.defaultScope,
        checkId: v.checksId,
      }));
      setExtraChecks(extraChecksArr);
    }
  }, [allChecksData]);

  //edit package param
  useEffect(() => {
    if (
      searchParams.get("updatePackage") &&
      searchParams.get("candidateCaseId")
    ) {
      setStep(2);
    }
  }, [searchParams.get("updatePackage"), searchParams.get("candidateCaseId")]);

  //fetching org lists for create candidate in ops
  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getOrgsListsByOpsUserId({ opsUserId: currentUser?.usersId }, logDetails)
    );
  }, [currentUser]);

  let {
    collectCandidateRegistrationEmail,
    collectCandidateRegistrationPhoneNo,
  } = useMemo(() => {
    let finalValue;

    //for ops
    if (+searchParams.get("orgId") && orgsListsByOpsUserId) {
      finalValue = orgsListsByOpsUserId?.find(
        (curr) => curr?.hrOrganizationsId === +searchParams.get("orgId")
      );
    } else if (currentUser?.hrOrganization) {
      //for hr
      finalValue = currentUser?.hrOrganization;
    } else {
      //default
      finalValue = {
        collectCandidateRegistrationEmail: true,
        collectCandidateRegistrationPhoneNo: true,
      };
    }

    let {
      collectCandidateRegistrationEmail,
      collectCandidateRegistrationPhoneNo,
    } = finalValue;
    return {
      collectCandidateRegistrationEmail,
      collectCandidateRegistrationPhoneNo,
    };
  }, [currentUser, orgsListsByOpsUserId, searchParams.get("orgId")]);

  const handleNext = (validateForm, setTouched) => {
    validateForm().then((errors) => {
      !isEmpty(errors) && setTouched(setNestedObjectValues(errors, true));
      isEmpty(errors) && setStep(2);
    });
  };

  const createCandidate = async (values, setSubmitting) => {
    // console.log("values1234", values);
    setSubmitting(true);

    let errorFlag = false;
    let payload = { ...values };

    payload.additionalChecks = [...payload.checks, ...payload.extraChecks]
      .filter((check) => check.checkEnabled)
      .map(({ checksId, checkScope }) => {
        if (checksId === 8 || checksId === 15) {
          if (!checkScope?.questionnaireId) {
            errorFlag = true;
          }
        }
        if (checksId === 25) {
          if (checkScope?.allJurisdictionSearch) {
            checkScope.jurisdictionId = [];
          }

          if (
            !checkScope?.jurisdictionId.length &&
            !checkScope.allJurisdictionSearch
          ) {
            errorFlag = true;
          }
        }
        return { checksId: checksId, checkScope: checkScope };
      });

    if (errorFlag) {
      return setSubmitting(false);
    }

    if (!payload?.packageId) {
      delete payload.packageId;
    }

    // delete values.checks;
    // delete values.extraChecks;
    delete payload.checks;
    delete payload.extraChecks;

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

    if (!payload?.additionalChecks?.length) {
      delete payload.additionalChecks;
    }

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "createCandidate"
    );

    dispatch(
      addCandidateInOrgTeam(
        payload,
        {
          orgId: getLoggedInUserHrOrganizationId(),
        },
        loggedUser?.roleId,
        handleNavigateBack,
        () => {
          setDisableBtn(true);
          setSubmitting(false);
        },
        logDetails
      )
    );
  };

  const handleNavigateBack = (fromBackButton = false) => {
    //if role is 'ops' for register candidate functionality
    if (loggedUser?.roleId === 4) {
      fromBackButton ? navigate(-2) : navigate("/ops/candidates");
    } else {
      navigate("/hr/candidates");
    }
  };

  return (
    <Grid item xs={12} sx={{ height: "100vh" }}>
      {additionalChecks.length === 0 && !customFieldByOrgId ? (
        <></>
      ) : (
        <Formik
          initialValues={initialValues(
            additionalChecks,
            extraChecks,
            customFieldByOrgId,
            collectCandidateRegistrationEmail,
            collectCandidateRegistrationPhoneNo
          )}
          validationSchema={() =>
            CandidateRegisterSchema(
              collectCandidateRegistrationEmail,
              collectCandidateRegistrationPhoneNo
            )
          }
          enableReinitialize
          onSubmit={() => {}}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setSubmitting,
            touched,
            values,
            setFieldValue,
            setTouched,
            validateForm,
          }) => (
            <Form>
              <DisableCreateCandidateBtn setDisableBtn={setDisableBtn} />
              {customPackages ? (
                <>
                  <StrikeOutCustomPackages
                    customPackages={customPackages}
                    setCustomPackages={setCustomPackages}
                  />
                  <PushAdditionalCheckToCustomPkgs
                    customPackages={customPackages}
                    setCustomPackages={setCustomPackages}
                  />
                </>
              ) : null}

              {step === 1 && (
                <PanelCard>
                  <Box
                    height="80vh"
                    overflow={{ xs: "scroll", md: "hidden" }}
                    mt={{ xs: 10, md: 0 }}
                  >
                    <RegisterCandidate
                      setFieldValue={setFieldValue}
                      touched={touched}
                      errors={errors}
                      countries={countries}
                      values={values}
                      collectCandidateRegistrationEmail={
                        collectCandidateRegistrationEmail
                      }
                      collectCandidateRegistrationPhoneNo={
                        collectCandidateRegistrationPhoneNo
                      }
                    />
                    <Grid
                      container
                      item
                      xs={12}
                      direction="row"
                      justifyContent={{
                        xs: "space-between",
                        sm: "flex-end",
                      }}
                      gap={2}
                      sx={{ marginTop: "1rem" }}
                    >
                      <Button
                        onClick={() => handleNavigateBack(true)}
                        variant="outlined"
                        disableElevation
                      >
                        <ArrowBackIcon /> Back
                      </Button>

                      <Button
                        variant="contained"
                        disableElevation
                        onClick={() => handleNext(validateForm, setTouched)}
                        type="button"
                      >
                        Next <ArrowForwardIcon />
                      </Button>
                    </Grid>
                  </Box>
                </PanelCard>
              )}
              {step === 2 && (
                <SelectPackage
                  setFieldValue={setFieldValue}
                  values={values}
                  customPackages={customPackages}
                  countries={countries}
                  questionnairesData={allQuestionnaires}
                  additionalChecks={additionalChecks}
                  displayPackages={displayPackages}
                  setDisplayPackages={setDisplayPackages}
                  selectedCheckTypes={selectedCheckTypes}
                  createCandidate={createCandidate}
                  disableBtn={disableBtn}
                  setDisableBtn={setDisableBtn}
                  setStep={setStep}
                  updatePackage={searchParams.get("updatePackage")}
                  candidateCaseId={searchParams.get("candidateCaseId")}
                  savedCVfile={savedCVfile}
                  setSavedCVfile={setSavedCVfile}
                  filterPackages={filterPackages}
                  setFilterPackages={setFilterPackages}
                  isSubmitting={isSubmitting}
                  setSubmitting={setSubmitting}
                />
              )}
            </Form>
          )}
        </Formik>
      )}
    </Grid>
  );
};

export default CreateCandidate;
