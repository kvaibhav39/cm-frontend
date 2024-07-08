import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { opsCandidateDetailsHeaders } from "./../../../CMVerifyCandidateDetails/utils/opsCandidateDetailsHeaders";
import { updateVerifiedSectionDetails } from "../../../../../../../../../store/actions/operationActions";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getCandidateEducationTypes,
  getCandidateEducationalQualificationTypes,
  getCandidateEmploymentReasonOfLeavingTypes,
  getCandidateEmploymentSalaryFreqTypes,
  getCandidateProfessionalQualificationTypes,
} from "../../../../../../../../../store/actions/candidateAction";
import { HEADERS } from "../../../../../../../../Candidate/review/helpers/reviewHeadersData";
import CandidateProfileReviewComponent from "./../../../../../../../../Candidate/review/components/CandidateProfileReviewComponent";
import OpsCandidateSectionDetail from "./../../../CMVerifyCandidateDetails/components/OpsCandidateSectionDetail";
import CircularLoader from "../../../../../../../../../common/CircularLoader";
import { Box, Divider } from "@mui/material";
import { FactCheck } from "@mui/icons-material";
import CommonHeadingComponent from "./innerComponents/CommonHeadingComponent";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../utils/getCurrentFileNameAndFunction";

const ViewFilledDetailsAndUpdateVerifierDetails = () => {
  const [open, setOpen] = useState(false);
  const [params, _] = useSearchParams();
  const { subChecksList, selectedSubCheckId, OpsCandidateCaseChecksList } =
    useSelector((state) => state.operations);
  const { candidateDetailsById } = useSelector((state) => state.hr);
  const {
    educationTypes,
    reasonOfLeavingTypes,
    salaryFreq,
    qualificationTypes,
    qualificationStatuses,
    candidateInitialDetails,
  } = useSelector((state) => state.candidate);

  const { hrOrganizationName } = candidateInitialDetails;
  const dispatch = useDispatch();

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

  let selectedSubCheck = useMemo(() => {
    return subChecksList?.find((curr) => curr.id === selectedSubCheckId);
  }, [subChecksList, selectedSubCheckId]);

  let subCheckFilledDetailsComponent = useMemo(() => {
    if (
      selectedSubCheck &&
      candidateDetailsById &&
      educationTypes?.length &&
      reasonOfLeavingTypes?.length &&
      salaryFreq?.length &&
      qualificationTypes?.length &&
      qualificationStatuses?.length
    ) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "subCheckFilledDetailsComponent"
      );

      //common list
      let checkDetailsToDisplay = [
        {
          key: "Education",
          candidateDetailsKey: "EDUCATIONAL_QUALIFICATIONS",
          toMatchWithId: "candidatesEducationsId",
          dropDownLists: {
            educationTypes,
            qualificationTypes,
          },
          payloadFieldName: "verifiedEducationData",
        },
        {
          key: "Professional",
          candidateDetailsKey: "PROFESSIONAL_QUALIFICATIONS",
          toMatchWithId: "candidatesProfessionalQualificationsId",
          dropDownLists: {
            qualificationStatuses,
          },
          payloadFieldName: "verifiedProfessionalData",
        },
        {
          key: "Address",
          candidateDetailsKey: "ADDRESS_DETAILS",
          toMatchWithId: "candidatesAddressesId",
        },
        {
          key: "Reference",
          candidateDetailsKey: "PROFESSIONAL_REFERENCE",
          toMatchWithId: "candidatesProfessionalReferencesDetailsId",
        },
        {
          key: "Employment + Salary",
          candidateDetailsKey: "EMPLOYMENT_HISTORY",
          toMatchWithId: "candidatesEmploymentsId",
          dropDownLists: {
            hrOrganizationName,
            reasonOfLeavingTypes,
            salaryFreq,
          },
          payloadFieldName: "verifiedEmploymentData",
        },
        {
          key: "Employment",
          candidateDetailsKey: "EMPLOYMENT_HISTORY",
          toMatchWithId: "candidatesEmploymentsId",
          dropDownLists: {
            hrOrganizationName,
            reasonOfLeavingTypes,
            salaryFreq,
          },
          payloadFieldName: "verifiedEmploymentData",
        },
      ];

      //finding matched subCheck from common list
      let matchedVal = checkDetailsToDisplay?.find((curr) =>
        selectedSubCheck?.subCheckDisplayName?.includes(curr?.key)
      );

      //if matched value is present
      if (matchedVal?.candidateDetailsKey && matchedVal?.toMatchWithId) {
        //extracting section details data as per section
        let finalExtractedCandidateDetails =
          matchedVal?.candidateDetailsKey === "EMPLOYMENT_HISTORY"
            ? candidateDetailsById[matchedVal?.candidateDetailsKey]
                ?.candidatesEmployeeHistory
            : matchedVal?.candidateDetailsKey === "PROFESSIONAL_REFERENCE"
            ? candidateDetailsById[matchedVal?.candidateDetailsKey][0]
                ?.referencedetails
            : candidateDetailsById[matchedVal?.candidateDetailsKey];

        //extracting matching section details with subcheck
        let selectedCandidateDetails = finalExtractedCandidateDetails?.find(
          (curr) =>
            curr[matchedVal?.toMatchWithId] ===
            selectedSubCheck?.detailsMappingId
        );

        //defining props
        let componentProps = {
          title: selectedSubCheck?.subCheckDisplayName,
          items: [selectedCandidateDetails],
          itemHeader: (_, i) =>
            `${selectedSubCheck?.subCheckDisplayName}`,
          sectionHeaders: opsCandidateDetailsHeaders(matchedVal?.dropDownLists)[
            matchedVal?.candidateDetailsKey
          ],
          headers: HEADERS()[matchedVal?.candidateDetailsKey],
        };

        //verifier details section
        if (matchedVal?.payloadFieldName) {
          delete componentProps.headers;

          componentProps = {
            ...componentProps,
            sectionDetailsIdName: matchedVal?.toMatchWithId,
            payloadFieldName: matchedVal?.payloadFieldName,
            updateActionHandler: (payload) =>
              dispatch(
                updateVerifiedSectionDetails(
                  payload,
                  params.get("candidatesCasesId"),
                  matchedVal?.candidateDetailsKey,
                  logDetails
                )
              ),
          };

          //if subcheck is of emp history
          if (matchedVal?.candidateDetailsKey === "EMPLOYMENT_HISTORY") {
            componentProps.empHistory = [selectedCandidateDetails];
            componentProps.headersEmpHistory = componentProps.sectionHeaders;

            delete componentProps.items;
            delete componentProps.sectionHeaders;
          }

          return { verifierDetailsComponent: true, componentProps };
        }
        return { verifierDetailsComponent: false, componentProps };
      }
    }
    return null;
  }, [
    selectedSubCheckId,
    selectedSubCheck,
    candidateDetailsById,
    educationTypes,
    reasonOfLeavingTypes,
    salaryFreq,
    qualificationTypes,
    qualificationStatuses,
  ]);

  let toDisplay = useMemo(
    () =>
      OpsCandidateCaseChecksList?.find(
        (check) =>
          check?.checkTypeName === "Verification" &&
          check?.candidatesChecksMappingId ===
            selectedSubCheck?.candidatesChecksMappingId
      ),
    [selectedSubCheck]
  );

  return (
    <>
      {selectedSubCheck?.detailsMappingId && toDisplay ? (
        <>
          <Divider
            sx={{
              width: "95%",
              margin: "10px auto",
              color: "#000",
              height: "4px",
            }}
          />
          <Box px={2} py={1} gap={1}>
            <CommonHeadingComponent
              open={open}
              setOpen={setOpen}
              IconComponent={<FactCheck />}
              title="Provided and Verified Details"
            />
          </Box>

          {selectedSubCheck &&
          candidateDetailsById &&
          educationTypes?.length &&
          reasonOfLeavingTypes?.length &&
          salaryFreq?.length &&
          qualificationTypes?.length &&
          qualificationStatuses?.length ? (
            <>
              {subCheckFilledDetailsComponent && open ? (
                subCheckFilledDetailsComponent?.verifierDetailsComponent ? (
                  <OpsCandidateSectionDetail
                    key={selectedSubCheckId}
                    {...subCheckFilledDetailsComponent?.componentProps}
                  />
                ) : (
                  <CandidateProfileReviewComponent
                    key={selectedSubCheckId}
                    {...subCheckFilledDetailsComponent?.componentProps}
                  />
                )
              ) : null}
            </>
          ) : (
            <CircularLoader size={20} height="10vh" />
          )}
        </>
      ) : null}
    </>
  );
};

export default ViewFilledDetailsAndUpdateVerifierDetails;
