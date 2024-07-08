import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Box, Card, Grid, Typography } from "@mui/material";
import CircularLoader from "../../../../../../../../common/CircularLoader.jsx";
import { opsCandidateDetailsHeaders } from "../utils/opsCandidateDetailsHeaders.js";
import OpsCandidateSectionDetail from "./OpsCandidateSectionDetail.jsx";
import { updateVerifiedSectionDetails } from "../../../../../../../../store/actions/operationActions.js";
import CandidateProfileReviewComponent from "./../../../../../../../Candidate/review/components/CandidateProfileReviewComponent";
import { HEADERS } from "./../../../../../../../Candidate/review/helpers/reviewHeadersData";
import {
  getCandidateEducationTypes,
  getCandidateEmploymentReasonOfLeavingTypes,
  getCandidateEducationalQualificationTypes,
  getCandidateProfessionalQualificationTypes,
  getCandidateEmploymentSalaryFreqTypes,
} from "../../../../../../../../store/actions/candidateAction.js";
import { checkConditionToDisplayExtraFields } from "../../../../../../../Candidate/utils/checkConditionToDisplayExtraFields.jsx";
import { CHECKS } from "../../../../../../../../store/constant.js";
import { FilePresent } from "@mui/icons-material";
import { getCurrentFileNameAndFunction } from "../../../../../../../../utils/getCurrentFileNameAndFunction.js";

const OPsCandidateDetailsLayout = () => {
  const [dataPresent, setDataPresent] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);

  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  const { candidateDetailsById, candidateDetailsByIdLoading } = useSelector(
    (state) => state.hr
  );

  const {
    educationTypes,
    reasonOfLeavingTypes,
    salaryFreq,
    qualificationTypes,
    qualificationStatuses,
    candidateDetails: candidateFilledDetails,
    candidateInitialDetails,
  } = useSelector((state) => state.candidate);

  const { hrOrganizationName } = candidateInitialDetails;

  let candidateDetails = useMemo(
    () => candidateFilledDetails || candidateDetailsById,
    [candidateFilledDetails, candidateDetailsById]
  );

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    !educationTypes && dispatch(getCandidateEducationTypes(logDetails));
    !reasonOfLeavingTypes &&
      dispatch(getCandidateEmploymentReasonOfLeavingTypes(logDetails));
    !salaryFreq && dispatch(getCandidateEmploymentSalaryFreqTypes(logDetails));
    !qualificationTypes &&
      dispatch(getCandidateEducationalQualificationTypes(logDetails));
    !qualificationStatuses &&
      dispatch(getCandidateProfessionalQualificationTypes(logDetails));
  }, []);

  const declarationQuestions = useCallback(() => {
    return candidateDetails?.DECLARATION?.reduce((questions, declaration) => {
      return questions.concat(
        declaration.questionnaireQuestions.reduce(
          (innerQuestions, question) => {
            return innerQuestions.concat([
              {
                question: question.questionName,
                answer: question.answer,
                questionTypeName: question.questionTypeName,
                answerChoice: question.answerChoice,
              },
            ]);
          },
          []
        )
      );
    }, []);
  }, [candidateDetails]);

  const refereeQuestions = useCallback(() => {
    let finalQuestions = [];

    candidateDetails?.refereeQuestionsAnswers?.forEach((question) => {
      let obj = {
        refereeName: question?.refereeName,
        refereeEmail: question?.refereeEmail,
        companyName: question?.companyName,
        NotResponded: question?.NotResponded || false,
        isDeclined: question?.isDeclined || false,
        reasonOfDecline: question?.reasonOfDecline || null,
        questionsAnswers: [],
      };
      if (question?.questionsAnswers) {
        question?.questionsAnswers?.forEach((q) => {
          obj.questionsAnswers.push({
            question: q?.candidateRefereeQuestionnairesQuestions?.questionName,
            answer: q.answer,
            questionTypeName:
              q?.candidateRefereeQuestionnairesQuestions?.questionTypeName,
            candidateRefereeQuestionnairesQuestions:
              q?.candidateRefereeQuestionnairesQuestions,
          });
        });
      }

      finalQuestions.push(obj);
    });
    return finalQuestions;
  }, [candidateDetails]);

  useEffect(() => {
    if (
      candidateDetails?.PERSONAL_PERTICULAR ||
      candidateDetails?.ADDRESS_DETAILS?.length ||
      candidateDetails?.FAMILY_DETAILS ||
      candidateDetails?.EMPLOYMENT_HISTORY?.candidatesEmployeeHistory?.length ||
      candidateDetails?.EMPLOYMENT_HISTORY?.candidateEmploymentGaps?.length ||
      candidateDetails?.EDUCATIONAL_QUALIFICATIONS?.length ||
      candidateDetails?.PROFESSIONAL_QUALIFICATIONS?.length ||
      candidateDetails?.PROFESSIONAL_REFERENCE?.length ||
      candidateDetails?.IDENTITY_DETAILS ||
      (declarationQuestions() && declarationQuestions()[0]?.answer) ||
      candidateDetails?.ADDITIONAL_INFORMATION?.length ||
      candidateDetails?.supportingDocumentsForCandidate?.uploadedByCandidate
        ?.length ||
      candidateDetails?.supportingDocumentsForCandidate?.uploadedByOpsUser
        ?.length ||
      candidateDetails?.supportingDocumentsForCandidate?.uplodedByHr?.length
    ) {
      setDataPresent(true);
    }
  }, [candidateDetails]);

  const tabs = useMemo(() => {
    let temp = [];

    if (candidateDetails?.PERSONAL_PERTICULAR) {
      temp.push("Personal Details");
    }

    if (candidateDetails?.ADDRESS_DETAILS?.length) {
      temp.push("Address Details");
    }

    if (candidateDetails?.FAMILY_DETAILS) {
      temp.push("Family Details");
    }

    if (
      candidateDetails?.EMPLOYMENT_HISTORY?.candidatesEmployeeHistory?.length ||
      candidateDetails?.EMPLOYMENT_HISTORY?.candidateEmploymentGaps?.length
    ) {
      temp.push("Employment History");
    }

    if (candidateDetails?.EDUCATIONAL_QUALIFICATIONS?.length) {
      temp.push("Educational Qualifications");
    }
    if (candidateDetails?.PROFESSIONAL_QUALIFICATIONS?.length) {
      temp.push("Professional License & Membership");
    }
    if (candidateDetails?.PROFESSIONAL_REFERENCE?.length) {
      temp.push("Professional Reference");
    }
    if (candidateDetails?.IDENTITY_DETAILS) {
      temp.push("Identity Details");
    }
    if (declarationQuestions() && declarationQuestions()[0]?.answer) {
      temp.push("Declaration");
    }
    if (candidateDetails?.ADDITIONAL_INFORMATION?.length) {
      temp.push("Additional Information");
    }

    if (
      candidateDetails?.supportingDocumentsForCandidate?.uploadedByCandidate
        ?.length ||
      candidateDetails?.supportingDocumentsForCandidate?.uploadedByOpsUser
        ?.length ||
      candidateDetails?.supportingDocumentsForCandidate?.uplodedByHr?.length
    ) {
      temp.push("Supporting Documents");
    }

    if (
      candidateDetails?.PROFESSIONAL_REFERENCE?.length &&
      candidateDetails?.refereeQuestionsAnswers?.length
    ) {
      temp.push("Referee Response");
    }

    !selectedTab && setSelectedTab(temp[0]);

    return temp;
  }, [candidateDetails]);

  //personal details - driver license
  const conditionToDisplayDriverLicenseFields = useMemo(() => {
    if (candidateDetails) {
      //research country is China, India, Japan, Philippines, Taiwan & driver license check is present
      let countryIds = [46, 104, 113, 176, 218];
      let checkIds = [CHECKS.driverLicenceCheck];

      return checkConditionToDisplayExtraFields(
        candidateDetails,
        countryIds,
        checkIds
      );
    }
    return false;
  }, [candidateDetails]);

  //personal details - DIN number
  const conditionToDisplayDINnumberFields = useMemo(() => {
    if (candidateDetails) {
      //research country is India & director ship check is present
      let countryIds = [104];
      let checkIds = [CHECKS.directorshipCheck];

      return checkConditionToDisplayExtraFields(
        candidateDetails,
        countryIds,
        checkIds
      );
    }
    return false;
  }, [candidateDetails]);

  //family details - spouse
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

  return (
    <>
      {candidateDetails &&
      dataPresent &&
      tabs?.length &&
      reasonOfLeavingTypes?.length &&
      salaryFreq?.length &&
      qualificationTypes?.length &&
      educationTypes?.length &&
      qualificationStatuses?.length ? (
        <>
          <Grid
            container
            mt={1}
            gap={1}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            height="100%"
          >
            <Grid
              item
              xs={12}
              lg={3.8}
              sx={{
                border: (theme) => `1px solid ${theme.palette.grey[400]}`,
                borderRadius: "5px",
              }}
              p={2}
              height="100%"
            >
              {" "}
              {tabs?.map((sectionName, index) => (
                <Box
                  key={index}
                  p={1}
                  mb={1.5}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.grey[400]}`,
                    borderRadius: "5px",
                    background: (theme) =>
                      selectedTab === sectionName
                        ? theme.palette.primary[100]
                        : "none",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    //scrolling back to the top in fields section
                    const scrollContainer = document.querySelector(
                      "#ops-candidate-details-scroll"
                    );

                    if (scrollContainer) {
                      scrollContainer.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                    setSelectedTab(sectionName);
                  }}
                >
                  <Typography fontSize="14px" fontWeight="700">
                    {sectionName}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} lg={8}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                {selectedTab === "Personal Details" ? (
                  <CandidateProfileReviewComponent
                    title="Personal Details"
                    items={candidateDetails?.PERSONAL_PERTICULAR}
                    headers={HEADERS().PERSONAL_PERTICULAR}
                    conditionToDisplayDriverLicenseFields={
                      conditionToDisplayDriverLicenseFields
                    }
                    conditionToDisplayDINnumberFields={
                      conditionToDisplayDINnumberFields
                    }
                  />
                ) : selectedTab === "Address Details" ? (
                  <>
                    <CandidateProfileReviewComponent
                      title="Address Details"
                      items={candidateDetails?.ADDRESS_DETAILS}
                      itemHeader={(_, i) => `Address Details ${i + 1}`}
                      headers={HEADERS().ADDRESS_DETAILS}
                    />
                  </>
                ) : selectedTab === "Family Details" ? (
                  <>
                    {" "}
                    <CandidateProfileReviewComponent
                      title="Family Details"
                      items={candidateDetails?.FAMILY_DETAILS}
                      headers={HEADERS().FAMILY_DETAILS}
                      conditionToDisplaySpouseFields={
                        conditionToDisplaySpouseFields
                      }
                    />
                  </>
                ) : selectedTab === "Employment History" ? (
                  <OpsCandidateSectionDetail
                    title="Employment History"
                    itemHeader={(_, i) => `Employment History Details ${i + 1}`}
                    empHistory={
                      candidateDetails?.EMPLOYMENT_HISTORY
                        ?.candidatesEmployeeHistory
                    }
                    empGaps={
                      candidateDetails?.EMPLOYMENT_HISTORY
                        ?.candidateEmploymentGaps
                    }
                    headersEmpHistory={
                      opsCandidateDetailsHeaders({
                        hrOrganizationName,
                        reasonOfLeavingTypes,
                        salaryFreq,
                      }).EMPLOYMENT_HISTORY
                    }
                    headersEmpGap={
                      opsCandidateDetailsHeaders().EMPLOYMENT_HISTORY_GAP
                    }
                    sectionDetailsIdName="candidatesEmploymentsId"
                    payloadFieldName="verifiedEmploymentData"
                    updateActionHandler={(payload) =>
                      dispatch(
                        updateVerifiedSectionDetails(
                          payload,
                          params.get("candidatesCasesId"),
                          "EMPLOYMENT_HISTORY",
                          getCurrentFileNameAndFunction(
                            import.meta.url,
                            "updateActionHandler"
                          )
                        )
                      )
                    }
                  />
                ) : selectedTab === "Educational Qualifications" ? (
                  <OpsCandidateSectionDetail
                    title="Educational Qualifications"
                    items={candidateDetails?.EDUCATIONAL_QUALIFICATIONS}
                    itemHeader={(_, i) =>
                      `Educational Qualifications Details ${i + 1}`
                    }
                    sectionHeaders={
                      opsCandidateDetailsHeaders({
                        educationTypes,
                        qualificationTypes,
                      }).EDUCATIONAL_QUALIFICATIONS
                    }
                    sectionDetailsIdName="candidatesEducationsId"
                    payloadFieldName="verifiedEducationData"
                    updateActionHandler={(payload) =>
                      dispatch(
                        updateVerifiedSectionDetails(
                          payload,
                          params.get("candidatesCasesId"),
                          "EDUCATIONAL_QUALIFICATIONS",
                          getCurrentFileNameAndFunction(
                            import.meta.url,
                            "updateActionHandler"
                          )
                        )
                      )
                    }
                  />
                ) : selectedTab === "Professional License & Membership" ? (
                  <OpsCandidateSectionDetail
                    title="Professional License & Membership"
                    items={candidateDetails?.PROFESSIONAL_QUALIFICATIONS}
                    itemHeader={(_, i) =>
                      `Professional License & Membership Details ${i + 1}`
                    }
                    sectionHeaders={
                      opsCandidateDetailsHeaders({ qualificationStatuses })
                        .PROFESSIONAL_QUALIFICATIONS
                    }
                    sectionDetailsIdName="candidatesProfessionalQualificationsId"
                    payloadFieldName="verifiedProfessionalData"
                    updateActionHandler={(payload) =>
                      dispatch(
                        updateVerifiedSectionDetails(
                          payload,
                          params.get("candidatesCasesId"),
                          "PROFESSIONAL_QUALIFICATIONS",
                          getCurrentFileNameAndFunction(
                            import.meta.url,
                            "updateActionHandler"
                          )
                        )
                      )
                    }
                  />
                ) : selectedTab === "Professional Reference" ? (
                  <>
                    {" "}
                    <CandidateProfileReviewComponent
                      title="Professional Reference"
                      items={
                        candidateDetails?.PROFESSIONAL_REFERENCE &&
                        candidateDetails?.PROFESSIONAL_REFERENCE[0]
                          ?.referencedetails
                      }
                      itemHeader={(_, i) =>
                        `Professional Reference Details ${i + 1}`
                      }
                      headers={HEADERS().PROFESSIONAL_REFERENCE}
                      numOfReferences={
                        candidateDetails?.PROFESSIONAL_REFERENCE &&
                        candidateDetails?.PROFESSIONAL_REFERENCE[0]
                          ?.noOfProfessionalReference
                      }
                      noOfProfessionalReference={
                        candidateDetails?.PROFESSIONAL_REFERENCE &&
                        candidateDetails?.PROFESSIONAL_REFERENCE[0]
                          ?.reasonForLessNoOfReference
                      }
                    />
                  </>
                ) : selectedTab === "Identity Details" ? (
                  <>
                    {" "}
                    <CandidateProfileReviewComponent
                      title="Identity Details"
                      items={candidateDetails?.IDENTITY_DETAILS}
                      headers={HEADERS().IDENTITY_DETAILS}
                    />
                  </>
                ) : selectedTab === "Declaration" ? (
                  <>
                    <CandidateProfileReviewComponent
                      title="Declaration"
                      items={declarationQuestions()}
                      itemHeader={(_, i) => `Question ${i + 1}`}
                      headers={HEADERS().DECLARATION}
                    />
                  </>
                ) : selectedTab === "Additional Information" ? (
                  <>
                    <CandidateProfileReviewComponent
                      title="Additional Information"
                      items={candidateDetails?.ADDITIONAL_INFORMATION}
                      itemHeader={(_, i) => `Additional Form Details ${i + 1}`}
                      headers={HEADERS().ADDITIONAL_INFORMATION}
                    />
                  </>
                ) : selectedTab === "Supporting Documents" ? (
                  <CandidateProfileReviewComponent
                    title="Supporting Documents For Candidate"
                    items={candidateDetails?.supportingDocumentsForCandidate}
                    titleIcon={<FilePresent />}
                    headers={HEADERS().SUPPORTING_DOCUMENTS}
                  />
                ) : selectedTab === "Referee Response" ? (
                  <CandidateProfileReviewComponent
                    title="Referee Response"
                    items={refereeQuestions()}
                    itemHeader={(_, i) => `Referee Details ${i + 1}`}
                    headers={HEADERS().REFEFREE_RESPONSE}
                  />
                ) : (
                  <Box p={3} fontWeight={600} textAlign="center">
                    Submission is pending
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </>
      ) : !candidateDetailsByIdLoading && tabs?.length === 0 && !dataPresent ? (
        <Typography variant="h4" textAlign="center" fontWeight="700" mt={1}>
          Data Not Found
        </Typography>
      ) : (
        <CircularLoader height="80vh" size={50} />
      )}
    </>
  );
};

export default OPsCandidateDetailsLayout;
