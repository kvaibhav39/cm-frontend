import moment from "moment";
import RiskLevelIcon from "../assets/RiskLevelIcon";
import { riskLevelColorsAndIcons } from "../assets/riskLevelColorsAndIcons";
import { getVerifierFieldsInVerificationCheck } from "./getVerifierFieldsInVerificationCheck";

export const verificationEmploymentFields = (data, matchedSubCheck) => {
  let fields = {
    startFromNewPage: true,
    fieldValue: [
      {
        param: "Check Summary",
        paramValue: matchedSubCheck?.checkSummary || "Pending",
        paramIcon: (
          <RiskLevelIcon
            path={
              riskLevelColorsAndIcons(
                matchedSubCheck?.subCheckVerificationResultStatusName ||
                  "Pending"
              ).icon
            }
          />
        ),
      },
      {
        param: "Entity Name",
        paramValue: matchedSubCheck?.entityName || "-",
      },
      {
        param: "Supplement Information",
        paramValue: data?.supplementInformation || "-",
      },
    ],
    candidateInputPresent: true,
    verifierInputPresent: true,
    verificationDetails: [
      {
        param: "Verification Details",
        paramCandidateValue: "Provided information",
        paramVerifierValue: "Verified information",
      },
      {
        param: "Company Name",
        paramCandidateValue: data?.companyName || "-",
        paramVerifierValue: data?.verifiedCompanyName || "-",
      },
      {
        param: "Country",
        paramCandidateValue: data?.employerCountryName || "-",
        paramVerifierValue: data?.verifiedEmployerCountryName || "-",
      },
      {
        param: "Agency Name",
        paramCandidateValue: data?.wasOnPayrollOfAgency
          ? data?.agencyName
          : "Not Applicable",
        paramVerifierValue: data?.verifiedAgencyName || "-",
      },
      {
        param: "Dates of Employment",
        paramCandidateValue: `${moment(data?.fromDate).format(
          "DD MMM YYYY"
        )} to ${moment(data?.toDate).format("DD MMM YYYY")}`,
        paramVerifierValue:
          data?.verifiedFromDate && data?.verifiedToDate
            ? `${moment(data?.verifiedFromDate).format(
                "DD MMM YYYY"
              )} to ${moment(data?.verifiedToDate).format("DD MMM YYYY")}`
            : "-",
      },
      {
        param: "Functional/Corporate Title",
        paramCandidateValue: data?.jobTitle || "-",
        paramVerifierValue: data?.verifiedJobTitle || "-",
      },
      {
        param: "Last Salary",
        paramCandidateValue: `${data?.salaryCurrencyName} ${data?.salaryAmount} ${data?.salaryFrequencyName}`,
        paramVerifierValue:
          data?.verifiedSalaryCurrencyName &&
          data?.verifiedSalaryAmount &&
          data?.verifiedSalaryFrequencyName
            ? `${data?.verifiedSalaryCurrencyName} ${data?.verifiedSalaryAmount} ${data?.verifiedSalaryFrequencyName}`
            : "-",
      },
      {
        param: "Last Bonus",
        paramCandidateValue: data?.bonus?.length
          ? data?.bonus?.map(
              (curr, ind) =>
                `${ind ? ", " : ""}${curr?.bonusCurrencyName || ""} ${
                  curr?.bonusAmount || ""
                }`
            )
          : "-",
        paramVerifierValue: data?.bonus?.length
          ? data?.bonus?.map(
              (curr, ind) =>
                `${ind ? ", " : ""}${curr?.verifiedBonusCurrencyName || ""} ${
                  curr?.verifiedBonusAmount || ""
                }`
            )
          : "-",
      },
      {
        param: "Other Remuneration",
        paramCandidateValue: data?.otherRemuneration || "-",
        paramVerifierValue: data?.verifiedOtherRemuneration || "-",
      },
      {
        param: "Reason for leaving",
        paramCandidateValue: data?.reasonOfLeavingName
          ? `${data?.reasonOfLeavingName} ${
              data?.reasonOfLeavingName === 8
                ? `- ${data?.otherReasonForLeaving}`
                : ""
            }`
          : "-",
        paramVerifierValue: data?.verifiedReasonForLeaving
          ? `${data?.verifiedReasonForLeaving} ${
              data?.reasonOfLeavingName === 8
                ? `- ${data?.verifiedOtherReasonForLeaving}`
                : ""
            }`
          : "-",
      },
      {
        param: "Last Supervisor and Title",
        paramCandidateValue:
          data?.supervisorName && data?.supervisorTitle
            ? `${data?.supervisorName}, ${data?.supervisorTitle}`
            : "-",
        paramVerifierValue:
          data?.verifiedSupervisorName && data?.verifiedSupervisorTitle
            ? `${data?.verifiedSupervisorName}, ${data?.verifiedSupervisorTitle}`
            : "-",
      },
      {
        param: "Employment Status",
        paramCandidateValue: data?.employmentStatusName || "-",
        paramVerifierValue: data?.verifiedEmploymentStatusName || "-",
      },
      // {
      //   param: "Eligible for rehire?",
      //   paramCandidateValue: "-",
      //   paramVerifierValue:
      //     data?.eligibleForRehire === "Yes"
      //       ? data?.eligibleForRehire
      //       : data?.eligibleForRehire === "No"
      //       ? `No - ${data?.reasonForNoRehire}`
      //       : "-",
      // },
      {
        param: "Eligible for rehire?",
        paramCandidateValue: "-",
        paramVerifierValue: data?.eligibleForRehire,
      },
      {
        param: "Any disciplinary action / infringement against the candidate?",
        paramCandidateValue: "-",
        paramVerifierValue: data?.disciplinaryAction || "-",
      },
    ],
  };

  //verifier details
  let verifierDetails = getVerifierFieldsInVerificationCheck(matchedSubCheck);

  if (verifierDetails) {
    fields.verifierDetails = verifierDetails;
  }

  //fields acc to subcheck Name
  let includeVerificationDetails = [];

  if (
    matchedSubCheck?.subCheckDisplayName?.includes("Employment") &&
    matchedSubCheck?.subCheckDisplayName?.includes("Salary")
  ) {
    includeVerificationDetails = [
      "Company Name",
      "Country",
      "Agency Name",
      "Dates of Employment",
      "Functional/Corporate Title",
      "Last Salary",
      "Last Bonus",
      "Other Remuneration",
      "Reason for leaving",
      "Last Supervisor and Title",
      "Employment Status",
      "Eligible for rehire?",
      "Any disciplinary action / infringement against the candidate?",
    ];
  } else if (matchedSubCheck?.subCheckDisplayName?.includes("Employment")) {
    includeVerificationDetails = [
      "Company Name",
      "Country",
      "Agency Name",
      "Dates of Employment",
      "Functional/Corporate Title",
      "Reason for leaving",
      "Last Supervisor and Title",
      "Employment Status",
      "Eligible for rehire?",
      "Any disciplinary action / infringement against the candidate?",
    ];
  } else if (matchedSubCheck?.subCheckDisplayName?.includes("Salary")) {
    includeVerificationDetails = [
      "Company Name",
      "Country",
      "Dates of Employment",
      "Last Salary",
      "Last Bonus",
      "Other Remuneration",
    ];
  }

  let finalFields = {
    ...fields,
    verificationDetails: fields?.verificationDetails?.filter((allField) =>
      includeVerificationDetails?.find(
        (includeField) => allField?.param === includeField
      )
    ),
  };

  return finalFields;
};
