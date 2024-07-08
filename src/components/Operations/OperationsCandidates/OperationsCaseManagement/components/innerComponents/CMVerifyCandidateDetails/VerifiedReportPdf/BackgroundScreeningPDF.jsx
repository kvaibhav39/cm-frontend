import { Document, Font } from "@react-pdf/renderer";
import CoverPagePdfSection from "./components/CoverPagePdfSection";
import CandidateInfoPdfSection from "./components/CandidateInfoPdfSection";
import CaseSummaryPdfSection from "./components/CaseSummaryPdfSection";
import CheckDetailsPdfSection from "./components/CheckDetailsPdfSection";
import AppendixPdfSection from "./components/AppendixPdfSection";
import { useMemo } from "react";
import { riskLevelColorsAndIcons } from "./assets/riskLevelColorsAndIcons";
import RiskLevelIcon from "./assets/RiskLevelIcon";
import useCommonStyles from "./utils/useCommonStyles";
import { verificationEducationFields } from "./utils/verificationEducationFields";
import { verificationEmploymentFields } from "./utils/verificationEmploymentFields";
import { verificationProfessionalFields } from "./utils/verificationProfessionalFields";
import { verificationReferenceFields } from "./utils/verificationReferenceFields";
import moment from "moment";

const BackgroundScreeningPDF = ({
  OpsBasicCandidateInfo,
  OpsCandidateCaseChecksList,
  allSubChecksLists,
  candidateDetailsById,
}) => {
  const commonStyles = useCommonStyles();

  Font.register({
    family: "Montserrat",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf",
        fontWeight: 700,
      },
      {
        src: "https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9aX9-p7K5ILg.ttf",
        fontStyle: "italic",
      },
    ],
  });

  //the css property " word-break:'break-all' " does not work in styling for long text in pdf
  //so a work around is to add a custom breaking using 'Font.registerHyphenationCallback'
  const chunkSubstr = (str, size) => {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }

    return chunks;
  };

  Font.registerHyphenationCallback((word) => {
    if (word.length > 12) {
      return chunkSubstr(word, 10);
    } else {
      return [word];
    }
  });

  let {
    identityChecks,
    integrityChecks,
    reputationChecks,
    verificationChecks,
  } = useMemo(() => {
    let identityChecks = [];
    let integrityChecks = [];
    let reputationChecks = [];
    let verificationChecks = [];

    if (OpsCandidateCaseChecksList?.length && allSubChecksLists?.length) {
      let identityChecksMappingIds = [];
      let integrityChecksMappingIds = [];
      let reputationChecksMappingIds = [];
      let verificationChecksMappingIds = [];

      //extracting checksMappingIds as per checkTypeName i.e Integrity, Verification, etc
      OpsCandidateCaseChecksList?.forEach((check) => {
        if (check?.checkTypeName === "Identity") {
          identityChecksMappingIds.push(check?.candidatesChecksMappingId);
        } else if (check?.checkTypeName === "Integrity") {
          integrityChecksMappingIds.push(check?.candidatesChecksMappingId);
        } else if (check?.checkTypeName === "Reputation") {
          reputationChecksMappingIds.push(check?.candidatesChecksMappingId);
        } else {
          verificationChecksMappingIds.push(check?.candidatesChecksMappingId);
        }
      });

      //segregating subChecks by matching checkMappingIds to separate them according to the checkTypes
      allSubChecksLists?.forEach((subCheck) => {
        subCheck = {
          ...subCheck,
          icon: (
            <RiskLevelIcon
              path={
                riskLevelColorsAndIcons(
                  subCheck?.subCheckVerificationResultStatusName || "Pending"
                ).icon
              }
            />
          ),
          value: subCheck?.subCheckVerificationResultStatusName || "Pending",
          hyperLinkId: subCheck?.id,
        };

        if (
          identityChecksMappingIds?.find(
            (curr) => curr === subCheck?.candidatesChecksMappingId
          )
        ) {
          identityChecks.push(subCheck);
        } else if (
          integrityChecksMappingIds?.find(
            (curr) => curr === subCheck?.candidatesChecksMappingId
          )
        ) {
          integrityChecks.push(subCheck);
        }
        if (
          reputationChecksMappingIds?.find(
            (curr) => curr === subCheck?.candidatesChecksMappingId
          )
        ) {
          reputationChecks.push(subCheck);
        } else if (
          verificationChecksMappingIds?.find(
            (curr) => curr === subCheck?.candidatesChecksMappingId
          )
        ) {
          verificationChecks.push(subCheck);
        }
      });
    }

    // //merge emp & salary verification check

    // let tempVerificationChecks = [];

    // verificationChecks?.forEach((verificationCheck) => {
    //   if (verificationCheck?.subCheckDisplayName?.includes("Employment")) {
    //     let extractedCompanyName =
    //       verificationCheck?.subCheckDisplayName?.split("Check-")[1];

    //     let respectiveSalaryVerification = verificationChecks?.find(
    //       (subCheck) => {
    //         if (
    //           subCheck?.subCheckDisplayName?.split("Check-")[1] ===
    //             extractedCompanyName &&
    //           subCheck?.subCheckDisplayName?.includes("Salary")
    //         ) {
    //           return subCheck;
    //         }
    //       }
    //     );

    //     // case 1 : both emp & salary verification check are present, then merge
    //     if (respectiveSalaryVerification) {
    //       tempVerificationChecks.push({
    //         ...verificationCheck,
    //         oldSubCheckDisplayName: verificationCheck?.subCheckDisplayName,
    //         subCheckDisplayName: `Employment and ${
    //           respectiveSalaryVerification?.subCheckDisplayName?.split("-")[0]
    //         }-${extractedCompanyName}`,
    //       });
    //     } else {
    //       // case 2 : only emp check is present ('gap' subchecks will get pushed)
    //       tempVerificationChecks.push(verificationCheck);
    //     }
    //   } else {
    //     // case 3 : other checks including salary verification & except emp check check,  will get pushed
    //     tempVerificationChecks.push(verificationCheck);
    //   }
    // });

    // //now tempVerificationChecks will contain both the merged check & salary verification check , so we will remove the salary verification check
    // let finalVerificationChecks = [];

    // let isMergedEmpSalaryCheckPresent = tempVerificationChecks?.find(
    //   (verificationCheck) =>
    //     verificationCheck?.subCheckDisplayName?.includes("Employment") &&
    //     verificationCheck?.subCheckDisplayName?.includes("Salary")
    // );

    // //only if the merged emp salary check is present , we will remove the already present salary check
    // if (isMergedEmpSalaryCheckPresent) {
    //   tempVerificationChecks?.forEach((verificationCheck) => {
    //     if (
    //       verificationCheck?.subCheckDisplayName?.includes("Employment") ||
    //       !verificationCheck?.subCheckDisplayName?.includes("Salary")
    //     ) {
    //       finalVerificationChecks.push(verificationCheck);
    //     }
    //   });
    // } else {
    //   finalVerificationChecks = tempVerificationChecks;
    // }

    return {
      identityChecks,
      integrityChecks,
      reputationChecks,
      verificationChecks
      // verificationChecks: finalVerificationChecks,
    };
  }, [
    OpsBasicCandidateInfo,
    OpsCandidateCaseChecksList,
    allSubChecksLists,
    candidateDetailsById,
  ]);

  const checkDetails = useMemo(() => {
    if (
      identityChecks?.length ||
      integrityChecks?.length ||
      reputationChecks?.length ||
      verificationChecks?.length
    ) {
      let commonFieldValue = (curr) => {
        return [
          {
            param: "Check Summary",
            paramValue: curr?.checkSummary || "Pending",
            paramIcon: (
              <RiskLevelIcon
                path={
                  riskLevelColorsAndIcons(
                    curr?.subCheckVerificationResultStatusName || "Pending"
                  ).icon
                }
              />
            ),
          },
          {
            param: "Source",
            paramValue: curr?.source || "-",
          },
          {
            param: "Check Results",
            paramValue: curr?.checkResult || "-",
          },
          {
            param: "Date of Search",
            paramValue: curr?.dateOfSearch
              ? moment(curr?.dateOfSearch).format("DD MMM YYYY")
              : "-",
          },
        ];
      };

      let temp = [
        {
          heading: "IDENTITY",
          icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Low").icon} />,
          values: identityChecks?.map((curr) => {
            return {
              ...curr,
              fieldValue: commonFieldValue(curr),
            };
          }),
        },
        {
          heading: "INTEGRITY",
          icon: (
            <RiskLevelIcon path={riskLevelColorsAndIcons("Moderate").icon} />
          ),
          values: integrityChecks?.map((curr) => {
            return {
              ...curr,
              fieldValue: commonFieldValue(curr),
            };
          }),
        },
        {
          heading: "REPUTATION",
          icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Low").icon} />,
          values: reputationChecks?.map((curr) => {
            return {
              ...curr,
              fieldValue: commonFieldValue(curr),
            };
          }),
        },
      ];

      let finalTemp = [];

      temp?.forEach((curr) => {
        if (curr?.values?.length) {
          finalTemp.push(curr);
        }
      });

      let verificationParams = {
        heading: "VERIFICATION",
        icon: <RiskLevelIcon path={riskLevelColorsAndIcons("Low").icon} />,
        values: [],
      };

      const toGetSubCheckMatchedValue = (toMatchValue) =>
        verificationChecks?.find(
          (subCheck) => subCheck?.detailsMappingId === toMatchValue
        );

      if (candidateDetailsById?.EDUCATIONAL_QUALIFICATIONS?.length) {
        candidateDetailsById?.EDUCATIONAL_QUALIFICATIONS?.forEach((data) => {
          let matchedSubCheck = toGetSubCheckMatchedValue(
            data?.candidatesEducationsId
          );

          matchedSubCheck &&
            verificationParams.values.push({
              ...verificationEducationFields(data, matchedSubCheck),
              id: matchedSubCheck?.id,
              hyperLinkId: matchedSubCheck?.hyperLinkId,
              subCheckDisplayName: matchedSubCheck?.subCheckDisplayName,
            });
        });
      }

      if (
        candidateDetailsById?.EMPLOYMENT_HISTORY?.candidatesEmployeeHistory
          ?.length
      ) {
        candidateDetailsById?.EMPLOYMENT_HISTORY?.candidatesEmployeeHistory?.forEach(
          (data, ind) => {
            let matchedSubCheck = toGetSubCheckMatchedValue(
              data?.candidatesEmploymentsId
            );

            matchedSubCheck &&
              verificationParams.values.push({
                ...verificationEmploymentFields(data, matchedSubCheck),
                id: matchedSubCheck?.id,
                hyperLinkId: matchedSubCheck?.hyperLinkId,
                subCheckDisplayName: matchedSubCheck?.subCheckDisplayName,
              });
          }
        );
      }

      if (candidateDetailsById?.PROFESSIONAL_QUALIFICATIONS?.length) {
        candidateDetailsById?.PROFESSIONAL_QUALIFICATIONS?.forEach(
          (data, ind) => {
            let matchedSubCheck = toGetSubCheckMatchedValue(
              data?.candidatesProfessionalQualificationsId
            );

            matchedSubCheck &&
              verificationParams.values.push({
                ...verificationProfessionalFields(data, matchedSubCheck),
                id: matchedSubCheck?.id,
                hyperLinkId: matchedSubCheck?.hyperLinkId,
                subCheckDisplayName: matchedSubCheck?.subCheckDisplayName,
              });
          }
        );
      }

      if (
        candidateDetailsById?.PROFESSIONAL_REFERENCE?.length &&
        candidateDetailsById?.PROFESSIONAL_REFERENCE[0]?.referencedetails
          ?.length
      ) {
        candidateDetailsById?.PROFESSIONAL_REFERENCE[0]?.referencedetails?.forEach(
          (data, ind) => {
            let matchedSubCheck = toGetSubCheckMatchedValue(
              data?.candidatesProfessionalReferencesDetailsId
            );

            matchedSubCheck &&
              verificationParams.values.push({
                ...verificationReferenceFields(
                  data,
                  matchedSubCheck,
                  commonStyles,
                  candidateDetailsById?.refereeQuestionsAnswers
                ),
                id: matchedSubCheck?.id,
                hyperLinkId: matchedSubCheck?.hyperLinkId,
                subCheckDisplayName: matchedSubCheck?.subCheckDisplayName,
              });
          }
        );
      }

      finalTemp.push(verificationParams);
      return finalTemp;
    }
    return [];
  }, [
    candidateDetailsById,
    identityChecks,
    integrityChecks,
    reputationChecks,
    verificationChecks,
  ]);

  return (
    <Document>
      <CoverPagePdfSection OpsBasicCandidateInfo={OpsBasicCandidateInfo} />
      <CandidateInfoPdfSection
        candidateDetailsById={candidateDetailsById}
        OpsBasicCandidateInfo={OpsBasicCandidateInfo}
        allSubChecksLists={allSubChecksLists}
      />
      <CaseSummaryPdfSection
        OpsBasicCandidateInfo={OpsBasicCandidateInfo}
        identityChecks={identityChecks}
        integrityChecks={integrityChecks}
        reputationChecks={reputationChecks}
        verificationChecks={verificationChecks}
      />
      <CheckDetailsPdfSection
        OpsBasicCandidateInfo={OpsBasicCandidateInfo}
        checkDetails={checkDetails}
      />
      <AppendixPdfSection OpsBasicCandidateInfo={OpsBasicCandidateInfo} />
    </Document>
  );
};

export default BackgroundScreeningPDF;
