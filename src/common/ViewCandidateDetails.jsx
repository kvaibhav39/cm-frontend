import { Box, Card, Grid, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CustomTooltip from "../components/common/CustomTooltip";
import { InfoOutlined } from "@mui/icons-material";
import { IconPencil } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import CandidateProfileReviewComponent from "../components/Candidate/review/components/CandidateProfileReviewComponent";
import { HEADERS } from "../components/Candidate/review/helpers/reviewHeadersData";
import CandidateEmploymentHistoryAccordion from "../components/Candidate/review/components/CandidateEmploymentHistoryAccordion";
import { CHECKS } from "../store/constant";
import { checkConditionToDisplayExtraFields } from "../components/Candidate/utils/checkConditionToDisplayExtraFields";
import { FilePresent } from "@mui/icons-material";

const ViewCandidateDetails = ({ tabs, module = "", ...props }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const navigate = useNavigate();

  const {
    candidateDetails: candidateFilledDetails,
    candidateInitialDetails,
    checkCandidateSectionsAreSubmitted,
  } = useSelector((state) => state.candidate);

  const {
    candidateProfileSections,
    hrOrganizationName,
    doNotDisplayClientName,
  } = candidateInitialDetails;

  const { candidateDetailsById } = useSelector((state) => state.hr);

  let candidateDetails = useMemo(
    () => candidateFilledDetails || candidateDetailsById,
    [candidateFilledDetails, candidateDetailsById]
  );

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
    <Grid
      container
      mt={props?.hideBackBtn ? 0 : 3}
      gap={1}
      direction="row"
      justifyContent="center"
      alignItems="stretch"
    >
      <Grid
        item
        xs={12}
        lg={module === "candidate" ? 4.8 : 3.8}
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
                  : module === "candidate" &&
                    sectionName !== "Family Details" &&
                    checkCandidateSectionsAreSubmitted?.[
                      `${
                        candidateProfileSections?.find(
                          (curr) =>
                            curr.candidateProfileSectionDisplayName ===
                            sectionName
                        )?.candidateProfileSectionName
                      }`
                    ]
                  ? "#FDF4F4"
                  : "none",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedTab(sectionName);
            }}
          >
            {module === "candidate" ? (
              <Box width="100%" display="flex" alignItems="center">
                <Box width={{ xs: "20%", sm: "10%" }}>
                  {sectionName !== "Family Details" &&
                  checkCandidateSectionsAreSubmitted?.[
                    `${
                      candidateProfileSections?.find(
                        (curr) =>
                          curr.candidateProfileSectionDisplayName ===
                          sectionName
                      )?.candidateProfileSectionName
                    }`
                  ] ? (
                    <CustomTooltip title="Your submission for this section is pending. To submit, click the 'Next' button in the sidebar.">
                      <InfoOutlined
                        sx={{
                          color: (theme) => theme.palette.error.main,
                          marginTop: "5px",
                        }}
                      />
                    </CustomTooltip>
                  ) : null}
                </Box>
                <Box width={{ xs: "70%", sm: "80%" }}>
                  <Typography fontSize="14px" fontWeight="700">
                    {sectionName}
                  </Typography>
                </Box>
                <Box width="10%">
                  <IconPencil
                    cursor="pointer"
                    onClick={() =>
                      navigate(
                        candidateProfileSections?.find(
                          (curr) =>
                            curr.candidateProfileSectionDisplayName ===
                            sectionName
                        )?.sectionPath
                      )
                    }
                  />
                </Box>
              </Box>
            ) : (
              <Typography fontSize="14px" fontWeight="700">
                {sectionName}
              </Typography>
            )}
          </Box>
        ))}
      </Grid>
      <Grid item xs={12} lg={module === "candidate" ? 7 : 8}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          {module === "candidate" &&
          checkCandidateSectionsAreSubmitted?.[
            `${
              candidateProfileSections?.find(
                (curr) =>
                  curr.candidateProfileSectionDisplayName === selectedTab
              )?.candidateProfileSectionName
            }`
          ] ? (
            <Box p={3} fontWeight={600} textAlign="center">
              Data yet to be filled
            </Box>
          ) : (
            <>
              {selectedTab === "Personal Details" ? (
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName ===
                        "PERSONAL_PERTICULAR"
                    )?.candidateProfileSectionDisplayName || "Personal Details"
                  }
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
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName === "ADDRESS_DETAILS"
                    )?.candidateProfileSectionDisplayName || "Address Details"
                  }
                  items={candidateDetails?.ADDRESS_DETAILS}
                  itemHeader={(_, i) => `Address Details ${i + 1}`}
                  headers={HEADERS().ADDRESS_DETAILS}
                />
              ) : selectedTab === "Family Details" ? (
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName === "FAMILY_DETAILS"
                    )?.candidateProfileSectionDisplayName || "Family Details"
                  }
                  items={candidateDetails?.FAMILY_DETAILS}
                  headers={HEADERS().FAMILY_DETAILS}
                  conditionToDisplaySpouseFields={
                    conditionToDisplaySpouseFields
                  }
                />
              ) : selectedTab === "Employment History" ? (
                <CandidateEmploymentHistoryAccordion
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName ===
                        "EMPLOYMENT_HISTORY"
                    )?.candidateProfileSectionDisplayName ||
                    "Employment History"
                  }
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
                    HEADERS(!doNotDisplayClientName && hrOrganizationName)
                      .EMPLOYMENT_HISTORY
                  }
                  headersEmpGap={HEADERS().EMPLOYMENT_HISTORY_GAP}
                />
              ) : selectedTab === "Educational Qualifications" ? (
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName ===
                        "EDUCATIONAL_QUALIFICATIONS"
                    )?.candidateProfileSectionDisplayName ||
                    "Educational Qualifications"
                  }
                  items={candidateDetails?.EDUCATIONAL_QUALIFICATIONS}
                  itemHeader={(_, i) =>
                    `Educational Qualifications Details ${i + 1}`
                  }
                  headers={HEADERS().EDUCATIONAL_QUALIFICATIONS}
                />
              ) : selectedTab === "Professional License & Membership" ? (
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName ===
                        "PROFESSIONAL_QUALIFICATIONS"
                    )?.candidateProfileSectionDisplayName ||
                    "Professional License & Membership"
                  }
                  itemHeader={(_, i) =>
                    `Professional License & Membership Details ${i + 1}`
                  }
                  items={candidateDetails?.PROFESSIONAL_QUALIFICATIONS}
                  headers={HEADERS().PROFESSIONAL_QUALIFICATIONS}
                />
              ) : selectedTab === "Professional Reference" ? (
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName ===
                        "PROFESSIONAL_REFERENCE"
                    )?.candidateProfileSectionDisplayName ||
                    "Professional Reference"
                  }
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
              ) : selectedTab === "Identity Details" ? (
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName === "IDENTITY_DETAILS"
                    )?.candidateProfileSectionDisplayName || "Identity Details"
                  }
                  items={candidateDetails?.IDENTITY_DETAILS}
                  headers={HEADERS().IDENTITY_DETAILS}
                />
              ) : selectedTab === "Declaration" ? (
                <CandidateProfileReviewComponent
                  title={
                    candidateProfileSections?.find(
                      (curr) =>
                        curr.candidateProfileSectionName === "DECLARATION"
                    )?.candidateProfileSectionDisplayName || "Declaration"
                  }
                  items={
                    module === "candidate"
                      ? props?.questions
                      : props?.declarationQuestions()
                  }
                  itemHeader={(_, i) => `Question ${i + 1}`}
                  headers={HEADERS().DECLARATION}
                />
              ) : selectedTab === "Additional Information" ? (
                candidateDetails?.ADDITIONAL_INFORMATION?.every(
                  (curr) => curr?.savedFormName
                ) ? (
                  <CandidateProfileReviewComponent
                    title={
                      candidateProfileSections?.find(
                        (curr) =>
                          curr.candidateProfileSectionName ===
                          "ADDITIONAL_INFORMATION"
                      )?.candidateProfileSectionDisplayName ||
                      "Additional Information"
                    }
                    items={candidateDetails?.ADDITIONAL_INFORMATION}
                    itemHeader={(_, i) => `Additional Form Details ${i + 1}`}
                    headers={HEADERS().ADDITIONAL_INFORMATION}
                  />
                ) : (
                  <Box p={3} fontWeight={600} textAlign="center">
                    Submission is pending
                  </Box>
                )
              ) : !module && selectedTab === "Supporting Documents" ? (
                <CandidateProfileReviewComponent
                  title="Supporting Documents For Candidate"
                  items={candidateDetails?.supportingDocumentsForCandidate}
                  titleIcon={<FilePresent />}
                  headers={HEADERS().SUPPORTING_DOCUMENTS}
                />
              ) : !module && selectedTab === "Referee Response" ? (
                <CandidateProfileReviewComponent
                  title="Referee Response"
                  items={props?.refereeQuestions()}
                  itemHeader={(_, i) => `Referee Details ${i + 1}`}
                  headers={HEADERS().REFEFREE_RESPONSE}
                />
              ) : null}
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewCandidateDetails;
