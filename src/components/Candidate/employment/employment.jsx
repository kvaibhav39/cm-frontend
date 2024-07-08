import { Fragment, useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { omit } from "lodash";
import { Form, Formik, setNestedObjectValues } from "formik";
import { Box, Button, Divider, Typography, Stack, Alert } from "@mui/material";

import { SkipNextOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import { StyledBasePaper } from "../../base/styled";
import {
  newEmployment,
  newEmploymentGaps,
} from "../helpers/initialState/employment";
import { emplomentValidationSchema } from "../helpers/validationSchema/employment";
import HandleEmploymentsGapsFieldUpdate from "./components/HandleEmploymentsGapsFieldUpdate";
import { getSectionData } from "../utils/getSectionData";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
} from "../../../store/actions/actionTypes";
import {
  getCandidateEmploymentBonusTypes,
  getCandidateEmploymentCareerGapsTypes,
  getCandidateEmploymentReasonOfLeavingTypes,
  getCandidateEmploymentSalaryFreqTypes,
  getCandidateEmploymentTypes,
  getEmploymentHistoryData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import AlertMessageComponent from "./../../../common/AlertMessageComponent";
import { getFilteredDataForCacheSubmit } from "../utils/getFilteredDataForCacheSubmit";
import { removeTimeFromDate } from "../utils/removeTimeFromDate";
import { checkGaps } from "./utils/checkGaps";
import DisplayErrorsForMultipleFields from "../common/DisplayErrorsForMultipleFields";
import DisplaySectionListsForMultipleFields from "../common/DisplaySectionListsForMultipleFields";
import DisplayAddBtnForMultipleFields from "../common/DisplayAddBtnForMultipleFields";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import CandidateMultipleFieldsSectionLayout from "../common/CandidateMultipleFieldsSectionLayout";
import EmploymentFormDetails from "./components/EmploymentFormDetails";
import CircularLoader from "./../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateEmploymentPage = () => {
  const navigate = useNavigate();
  const employmentForm = useRef();
  const [empGap, setEmpGap] = useState([]);
  const dispatch = useDispatch();
  const toCacheValuesEmployment = useRef();
  const [disableBtn, setDisableBtn] = useState(false);

  const {
    loading,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    employmentHistoryData,
    candidateSectionLoading,
    bonusTypes,
    careerGapsTypes,
    reasonOfLeavingTypes,
    salaryFreq,
    employmentTypes,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const employmentHistoryDataRef = useRef();
  employmentHistoryDataRef.current = employmentHistoryData;

  const empGapRef = useRef();
  const pushNewEmpRef = useRef();

  useEffect(() => {

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getEmploymentHistoryData(logDetails));
    !bonusTypes && dispatch(getCandidateEmploymentBonusTypes(logDetails));
    !careerGapsTypes && dispatch(getCandidateEmploymentCareerGapsTypes(logDetails));
    !reasonOfLeavingTypes &&
      dispatch(getCandidateEmploymentReasonOfLeavingTypes(logDetails));
    !salaryFreq && dispatch(getCandidateEmploymentSalaryFreqTypes(logDetails));
    !employmentTypes && dispatch(getCandidateEmploymentTypes(logDetails));
  }, []);

  //updating & using 'empGapRef' for handleSubmit as 'empGap' state's updated value is not available in it
  useEffect(() => {
    empGapRef.current = empGap;
  }, [empGap]);

  let employments = useMemo(() => {
    if (employmentHistoryData) {
      let cachedEmploymentHistory =
        candidateCachedDetails &&
        candidateCachedDetails["EMPLOYMENT_HISTORY"] &&
        candidateCachedDetails["EMPLOYMENT_HISTORY"]?.candidatesEmployeeHistory;

      let tempEmpHistory =
        employmentHistoryData?.candidatesEmployeeHistory?.length === 0
          ? cachedEmploymentHistory?.length
            ? cachedEmploymentHistory
            : [newEmployment()]
          : employmentHistoryData?.candidatesEmployeeHistory;

      if (tempEmpHistory) {
        tempEmpHistory = tempEmpHistory.map((curr, index) => {
          let tempAtt = [...curr.attachments].map((att) => {
            return {
              ...att,
              status: "existing",
            };
          });
          return {
            ...curr,
            attachments: tempAtt || [],
            selectedTab: index === 0,
          };
        });
      }

      tempEmpHistory?.forEach((curr) => {
        if (curr.fromDate) {
          curr.fromDate = moment(curr.fromDate).toLocaleString();
        }
        if (curr.toDate) {
          curr.toDate = moment(curr.toDate).toLocaleString();
        }
        if (curr.cessationDate) {
          curr.cessationDate = moment(curr.cessationDate).toLocaleString();
        }
      });

      return tempEmpHistory;
    } else {
      return undefined;
    }
  }, [employmentHistoryData, candidateCachedDetails]);

  let employmentsGaps = useMemo(() => {
    if (employmentHistoryData) {
      return employmentHistoryData?.candidatesEmployeeHistory?.length === 0 &&
        employmentHistoryData?.candidateEmploymentGaps?.length === 0
        ? (candidateCachedDetails &&
            candidateCachedDetails["EMPLOYMENT_HISTORY"] &&
            candidateCachedDetails["EMPLOYMENT_HISTORY"]
              ?.candidateEmploymentGaps) || [newEmploymentGaps()]
        : employmentHistoryData?.candidateEmploymentGaps;
    } else {
      return undefined;
    }
  }, [employmentHistoryData, candidateCachedDetails]);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "EMPLOYMENT_HISTORY",
      candidateProfileSections,
      allowProfileEdit
    );

    //passing back url for the back btn present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_BACK_URL,
      payload: data?.urls?.backUrl,
    });

    return data;
  }, [candidateProfileSections]);

  useEffect(() => {
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () => {
        handleSubmit(employmentForm?.current?.values, employmentForm?.current);
      },
    });

    return async () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      // dispatch({
      //   type: EMPLOYMENT_HISTORY,
      //   payload: {
      //     candidatesEmployeeHistory: [],
      //     candidateEmploymentGaps: [],
      //   },
      // });

      //caching when dismounts
      if (
        (!employmentHistoryDataRef.current ||
          (employmentHistoryDataRef.current?.candidatesEmployeeHistory
            ?.length === 0 &&
            employmentHistoryDataRef.current?.candidateEmploymentGaps
              ?.length === 0)) &&
        toCacheValuesEmployment.current
      ) {
        
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );

        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            {
              candidatesEmployeeHistory: getFilteredDataForCacheSubmit(
                toCacheValuesEmployment.current?.employments
              ),
              candidateEmploymentGaps:
                toCacheValuesEmployment.current?.employmentsGaps,
            },
            "EMPLOYMENT_HISTORY"
          )
        );
      }
    };
  }, []);

  useEffect(() => {
    if (employments && employmentsGaps) {
      checkGaps({ employments, employmentsGaps }, sectionData, setEmpGap);
    }
  }, [employments, employmentsGaps, sectionData]);

  const handleSubmit = async (values, form) => {
    try {
      //we cannot make next btn in candidate nav section as type submit because it is not wrapped in formik form
      //so that's why to validate the form on onClick we have added validateForm()
      const validationErrors = await form.validateForm();

      //to stop the api call when there are errors , we will simply return
      if (Object.keys(validationErrors)?.length) {
        //since we are submitting our form on 'onClick' event on next btn fields wont get touched
        //so we have to explicitly touch them so that validation error msgs below fields can get displayed
        //and this can be achieved by using 'setTouched' &  'setNestedObjectValues' which is provided by formik
        return form.setTouched(setNestedObjectValues(validationErrors, true));
      }

      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      let employmentGapData = sectionData?.section?.validationScope?.checkGap
        ? empGapRef.current
        : [];

      let flag = employmentGapData.find((curr) =>
        !curr.reasonOfGapId ? true : false
      );

      //if reasonOfGapId is null then we will display the error msg and will return
      if (flag) {
        return dispatch(
          setToastNotification(
            ERROR,
            "Please select a reason for your gap(s)",
            logDetails
          )
        );
      }

      let finalEmploymentHistory = values.employments.map(
        (employment, index) => {
          let omitValues = [
            "candidatesEmploymentsId",
            "employmentgaps",
            "attachments",
            "appointmentLetters",
            "payslips",
            "isExpanded",
            "bonusAmount",
            "bonusCurrencyId",
            "bonusValues",
            "employmentTypeName",
            "employmentStatusName",
            "employerCountryName",
            "salaryFrequencyName",
            "salaryCurrencyName",
            "reasonOfLeavingName",
            "agencyCountryName",
            "selectedTab",
          ];

          if (
            employment.reasonForLeaving === 5 &&
            employment.wasResignationRequested === null
          ) {
            employment.wasResignationRequested = false;
          }

          if (!employment.jobTitle) {
            omitValues.push("jobTitle");
          }

          if (!employment.wasBonusReceived) {
            omitValues.push("bonus");
          }

          //to omit id from bonusData
          if (employment.wasBonusReceived) {
            employment.bonus.map((curr) => {
              delete curr.id;
              delete curr.bonusName;
              delete curr.candidatesEmploymentId;
              delete curr.bonusCurrencyName;
              delete curr.bonusId;
            });
          }

          if (employment.fromDate) {
            employment.fromDate = removeTimeFromDate(employment.fromDate);
          }

          if (employment.toDate) {
            employment.toDate = removeTimeFromDate(employment.toDate);
          }

          if (employment.cessationDate) {
            employment.cessationDate = removeTimeFromDate(
              employment.cessationDate
            );
          }

          const mEmployment = {
            ...omit(employment, omitValues),
          };

          mEmployment.candidateEmploymentHistoryAttachments =
            employment.attachments?.map((file) => {
              file = omit(file, [
                "candidatesEmploymentAttachmentsId",
                "candidatesEmploymentHistoryId",
                "icon",
                "status",
              ]);
              return file;
            }) || [];

          return mEmployment;
        }
      );

      let finalEmploymentGaps = sectionData?.section?.validationScope?.checkGap
        ? empGapRef.current?.map((curr) => {
            curr.gapStartDate = removeTimeFromDate(curr.gapStartDate);

            curr.gapEndDate = removeTimeFromDate(curr.gapEndDate);
            return curr;
          })
        : [];

      dispatch(
        submitCandidateDetails(
          {
            EMPLOYMENT_HISTORY: finalEmploymentHistory,
            EMPLOYMENT_GAPS: finalEmploymentGaps,
          },
          "employment-history",
          () => {
            toCacheValuesEmployment.current = {
              employments: [],
              employmentsGaps: [],
            };

            navigate(sectionData?.urls.nextUrl);
          },
          sectionData?.section?.onHold,
          sectionData?.section?.candidatesProfileSectionsId,
          navigate,
          logDetails
        )
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const havePastExp = async (form) => {
    // console.log("past", form, employments);
    if (form.values?.employments?.length === 0) {
      //add new employment
      form.setFieldValue("employments", [newEmployment()]);
      await Promise.resolve();
    }
    //to open the accordions
  };

  return (
    <Fragment>
      {!loading &&
      !candidateSectionLoading &&
      employmentHistoryData &&
      employments &&
      employmentsGaps &&
      employmentTypes?.length &&
      careerGapsTypes?.length &&
      reasonOfLeavingTypes?.length &&
      salaryFreq?.length &&
      bonusTypes?.length ? (
        <StyledBasePaper>
          <Formik
            // enableReinitialize
            initialValues={{
              isCareerGapPresent: false,
              employments,
              employmentsGaps,
            }}
            validationSchema={() =>
              emplomentValidationSchema(
                sectionData?.section?.validationScope?.checkGap
              )
            }
            // onSubmit={handleSubmit}
            innerRef={employmentForm}
          >
            {(form) => {
              toCacheValuesEmployment.current = {
                ...form.values,
                employments: form.values.employments.map((employment) => {
                  return {
                    ...employment,
                    fromDate: removeTimeFromDate(employment.fromDate),
                    toDate: removeTimeFromDate(employment.toDate),
                    cessationDate: removeTimeFromDate(employment.cessationDate),
                  };
                }),
              };

              return (
                <Form>
                  <CandidateMultipleFieldsSectionLayout
                    formHeadingComponent={
                      <>
                        <DisplaySectionHeading
                          icon={sectionData?.section?.sectionIcon}
                          text={sectionData?.section?.candidateRequiredInfoText}
                        />

                        <HandleEmploymentsGapsFieldUpdate
                          setEmpGap={setEmpGap}
                          empGap={empGap}
                        />

                        <Stack
                          mt={{ xs: 2, md: 4 }}
                          direction={{ xs: "column", md: "row" }}
                          alignItems={"center"}
                          spacing={{ xs: 2, md: 4 }}
                        >
                          <Typography>
                            If you do not have any previous work experience, you
                            can skip this step.
                          </Typography>
                          <Box
                            display="flex"
                            alignItems={"center"}
                            className="space-x-4"
                          >
                            <Button
                              color="primary"
                              variant="contained"
                              // startIcon={<Diversity1Outlined />}
                              onClick={() => havePastExp(form)}
                            >
                              I Have Past Experience
                            </Button>
                            <Button
                              color="primary"
                              variant="outlined"
                              endIcon={<SkipNextOutlined />}
                              onClick={() =>
                                navigate(sectionData?.urls?.nextUrl)
                              }
                            >
                              Skip
                            </Button>
                          </Box>
                        </Stack>

                        {/* we will display only those emp gaps dates whose reason of gap is not provided */}
                        {sectionData?.section?.validationScope?.checkGap &&
                          empGap?.length > 0 &&
                          form.values?.employmentsGaps?.some(
                            (gap) => !gap?.reasonOfGapId
                          ) && (
                            <Box mt={2}>
                              <Alert severity="error">
                                You seems to be missing employment details from{" "}
                                {empGap?.map(
                                  (gap, index) =>
                                    !gap?.reasonOfGapId && (
                                      <strong key={index}>
                                        <br />
                                        {moment(gap.gapStartDate).format(
                                          "DD MMM YYYY"
                                        ) !==
                                        moment(gap.gapEndDate).format(
                                          "DD MMM YYYY"
                                        )
                                          ? moment(gap.gapStartDate).format(
                                              "DD MMM YYYY"
                                            ) +
                                            " to " +
                                            moment(gap.gapEndDate).format(
                                              "DD MMM YYYY"
                                            )
                                          : moment(gap.gapStartDate).format(
                                              "DD MMM YYYY"
                                            )}
                                      </strong>
                                    )
                                )}
                              </Alert>
                            </Box>
                          )}

                        <DisplayErrorsForMultipleFields
                          errors={form.errors.employments}
                          touched={form.touched.employments}
                          section="Employment"
                          apiErrorMsg={apiErrorMsg}
                        />
                      </>
                    }
                    formListsComponent={
                      <>
                        {/*Employment lists */}
                        <DisplaySectionListsForMultipleFields
                          values={form?.values?.employments}
                          setFieldValue={form.setFieldValue}
                          fieldArrayName="employments"
                          sectionName="Employment"
                          runWhenSelected={() =>
                            form.setFieldValue("isCareerGapPresent", false)
                          }
                        />

                        {/* Add More Employment */}
                        <DisplayAddBtnForMultipleFields
                          values={form?.values?.employments}
                          fieldArrayName="employments"
                          form={form}
                          pushNewRef={pushNewEmpRef}
                          newFields={newEmployment}
                          runWhenNewAdd={() => {
                            form.setFieldValue("isCareerGapPresent", false);

                            checkGaps(
                              employmentForm.current.values,
                              sectionData,
                              setEmpGap
                            );
                          }}
                          addSectionText={() =>
                            form?.values?.employments?.length > 0
                              ? "Add More Employment"
                              : "Add Employment"
                          }
                        />

                        {/*Career gaps */}
                        {sectionData?.section?.validationScope?.checkGap &&
                        sectionData?.section?.validationScope
                          ?.gapDurationInMonths &&
                        form.values.employmentsGaps?.length ? (
                          <>
                            <Box my={3}>
                              <Divider />
                            </Box>

                            <Box
                              p={1}
                              mt={2}
                              sx={{
                                border: (theme) =>
                                  `1px solid ${theme.palette.grey[400]}`,
                                borderRadius: "5px",
                                background: (theme) =>
                                  form.values.isCareerGapPresent
                                    ? theme.palette.primary[100]
                                    : "none",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                form?.values?.employments?.forEach(
                                  (employment, ind) =>
                                    (employment.selectedTab = false)
                                );

                                form.setFieldValue(
                                  "employments",
                                  form?.values?.employments
                                );

                                form.setFieldValue("isCareerGapPresent", true);
                              }}
                            >
                              <Typography
                                fontSize="14px"
                                fontWeight="700"
                                textAlign="center"
                              >
                                Career Gaps{" "}
                              </Typography>
                            </Box>
                          </>
                        ) : null}

                        {/*save cache btn */}
                        {!employmentHistoryData ||
                        (employmentHistoryData?.candidatesEmployeeHistory
                          ?.length === 0 &&
                          employmentHistoryData?.candidateEmploymentGaps
                            ?.length === 0) ? (
                          <>
                            <Box my={3}>
                              <Divider />
                            </Box>
                            <AlertMessageComponent
                              cond={() => {
                                return (
                                  !employmentHistoryData ||
                                  (employmentHistoryData
                                    ?.candidatesEmployeeHistory?.length === 0 &&
                                    employmentHistoryData
                                      ?.candidateEmploymentGaps?.length === 0)
                                );
                              }}
                              toCacheValues={{
                                employmentsGaps:
                                  toCacheValuesEmployment.current
                                    ?.employmentsGaps,
                                employments: getFilteredDataForCacheSubmit(
                                  toCacheValuesEmployment.current?.employments
                                ),
                              }}
                              sectionDetails={employmentHistoryData}
                              ifSectionEmpHistory={true}
                              CONSTANT="EMPLOYMENT_HISTORY"
                              disableBtn={disableBtn}
                            />
                          </>
                        ) : null}
                      </>
                    }
                    formDetailsComponent={
                      <EmploymentFormDetails
                        form={form}
                        sectionData={sectionData}
                        empGap={empGap}
                        pushNewEmpRef={pushNewEmpRef}
                        employmentForm={employmentForm}
                        setEmpGap={setEmpGap}
                        setDisableBtn={setDisableBtn}
                        careerGapsTypes={careerGapsTypes}
                        employmentTypes={employmentTypes}
                        reasonOfLeavingTypes={reasonOfLeavingTypes}
                        bonusTypes={bonusTypes}
                        salaryFreq={salaryFreq}
                      />
                    }
                  />
                </Form>
              );
            }}
          </Formik>
        </StyledBasePaper>
      ) : (
        <CircularLoader />
      )}
    </Fragment>
  );
};

export { CandidateEmploymentPage };
