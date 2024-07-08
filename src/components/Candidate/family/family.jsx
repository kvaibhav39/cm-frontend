import { omit } from "lodash";
import { FastField, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { BaseAccordion, IOSSwitch, BaseTextField } from "../../base";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { Fragment } from "react";
import { StyledBasePaper } from "../../base/styled";
import { newFamilyDetails } from "../helpers/initialState/family";
import { familyValidationSchema } from "../helpers/validationSchema/family";
import { getSectionData } from "../utils/getSectionData";
import { useTheme } from "@mui/material/styles";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
  FAMILY_DETAILS,
} from "../../../store/actions/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  getFamilyDetailsData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import { useRef } from "react";
import { useEffect } from "react";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import CircularLoader from "../../../common/CircularLoader";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import { CHECKS } from "../../../store/constant";
import { checkConditionToDisplayExtraFields } from "./../utils/checkConditionToDisplayExtraFields";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateFamilyPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const toCacheValues = useRef();
  const {
    loading,
    candidateDetails,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    familyDetailsData,
    candidateSectionLoading,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const familyDetailsDataRef = useRef();
  familyDetailsDataRef.current = familyDetailsData;

  const familyForm = useRef();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );
    dispatch(getFamilyDetailsData(logDetails));
  }, []);

  const familyDetails = useMemo(() => {
    if (!familyDetailsData)
      return (
        (candidateCachedDetails && candidateCachedDetails["FAMILY_DETAILS"]) ||
        newFamilyDetails()
      );
    return familyDetailsData;
  }, [familyDetailsData, candidateCachedDetails]);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "FAMILY_DETAILS",
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
      payload: () =>
        handleSubmit(familyForm?.current?.values, familyForm?.current),
    });
    return () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });
      dispatch({ type: FAMILY_DETAILS, payload: null });

      //caching when dismounts
      if (!familyDetailsDataRef.current && toCacheValues.current) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );

        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            toCacheValues.current,
            "FAMILY_DETAILS"
          )
        );
      }
    };
  }, []);

  const conditionToDisplaySpouseFields = useMemo(() => {
    if (candidateDetails) {
      //research country is India & civil litigation or criminal check is present
      let countryIds = [104];
      let checkIds = [CHECKS.civilLitigationCheck, CHECKS.criminalCheck];

      return checkConditionToDisplayExtraFields(
        candidateDetails,
        countryIds,
        checkIds
      );
    }
    return false;
  }, [candidateDetails]);

  const handleSubmit = async (values, form) => {
    try {
      //now to show the error message below empty mandatory fields when a user
      Object.keys(values).forEach((field) => {
        form.setFieldTouched(field, true);
      });

      form.validateForm();

      //to stop the api call when there are errors , we will simply return
      if (Object.keys(form.errors)?.length) {
        return;
      }

      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      const body = omit(
        values,
        "candidatesFamilyDetailsId",
        "candidateCaseId",
        "deleteCandidateId"
      );
      if (!body.mothersMaidenNameExists) {
        delete body.mothersMaidenName;
      }

      body.mothersMaidenNameExists = Boolean(body.mothersMaidenNameExists);

      dispatch(
        submitCandidateDetails(
          { FAMILY_DETAILS: body },
          "family-details",
          () => {
            toCacheValues.current = {};
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

  return (
    <Fragment>
      {!loading && !candidateSectionLoading ? (
        <StyledBasePaper>
          <Formik
            enableReinitialize
            initialValues={familyDetails}
            validationSchema={familyValidationSchema}
            onSubmit={handleSubmit}
            innerRef={familyForm}
          >
            {(form) => {
              toCacheValues.current = form?.values;
              return (
                <>
                  <Box mb={2}>
                    {!familyDetailsData ? (
                      <AlertMessageComponent
                        cond={() => {
                          return !familyDetailsData;
                        }}
                        CONSTANT="FAMILY_DETAILS"
                        toCacheValues={toCacheValues.current}
                        sectionDetails={familyDetailsData}
                      />
                    ) : null}
                  </Box>
                  <DisplaySectionHeading
                    icon={sectionData?.section?.sectionIcon}
                    text={sectionData?.section?.candidateRequiredInfoText}
                  />

                  <Form>
                    <Card variant="outlined" sx={{ borderRadius: "12px" }}>
                      <Box p={{ xs: 2, md: 4 }}>
                        <Grid container spacing={{ xs: 1, md: 4 }}>
                          <Grid item xs={12} sm={6} md={4}>
                            <FastField
                              component={BaseTextField}
                              name="fathersFirstName"
                              label="Father's First Name"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <FastField
                              component={BaseTextField}
                              name="fathersMiddleName"
                              label="Father's Middle Name"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <FastField
                              component={BaseTextField}
                              name="fathersLastName"
                              label="Father's Last Name"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <FastField
                              component={BaseTextField}
                              name="mothersFirstName"
                              label="Mother's First Name"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <FastField
                              component={BaseTextField}
                              name="mothersMiddleName"
                              label="Mother's Middle Name"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <FastField
                              component={BaseTextField}
                              name="mothersLastName"
                              label="Mother's Last Name"
                            />
                          </Grid>
                          {conditionToDisplaySpouseFields ? (
                            <>
                              <Grid item xs={12} sm={6} md={4}>
                                <FastField
                                  component={BaseTextField}
                                  name="spouseFirstName"
                                  label="Spouse's First Name"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <FastField
                                  component={BaseTextField}
                                  name="spouseMiddleName"
                                  label="Spouse's Middle Name"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <FastField
                                  component={BaseTextField}
                                  name="spouseLastName"
                                  label="Spouse's Last Name"
                                />
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                      </Box>
                    </Card>

                    <Box mt={{ xs: 2, md: 6 }}>
                      <BaseAccordion
                        expandIcon={false}
                        headerbg="#F2F5FE"
                        bordercolor={theme.palette.grey[400]}
                        expanded={form.values.mothersMaidenNameExists ? 1 : 0}
                        onChange={(e) =>
                          form.setFieldValue("mothersMaidenNameExists", e)
                        }
                        header={(header) => (
                          <Box
                            width={"100%"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            xs={{ fontSize: "12px" }}
                          >
                            <span id="family-did-your-mother-text">
                              Does your mother have any maiden name?
                            </span>
                            <IOSSwitch checked={header.expanded} />
                          </Box>
                        )}
                      >
                        <FastField
                          component={BaseTextField}
                          name="mothersMaidenName"
                          label="Mother's Maiden Name*"
                        />
                      </BaseAccordion>
                    </Box>
                    {apiErrorMsg && (
                      <Typography
                        mt={2}
                        color="error"
                        style={{ textTransform: "capitalize" }}
                      >
                        {apiErrorMsg}*
                      </Typography>
                    )}
                  </Form>
                </>
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

export { CandidateFamilyPage };
