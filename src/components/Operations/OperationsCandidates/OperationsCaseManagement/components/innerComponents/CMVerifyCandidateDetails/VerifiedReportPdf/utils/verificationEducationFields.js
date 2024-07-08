import moment from "moment";
import RiskLevelIcon from "../assets/RiskLevelIcon";
import { riskLevelColorsAndIcons } from "../assets/riskLevelColorsAndIcons";
import { getVerifierFieldsInVerificationCheck } from "./getVerifierFieldsInVerificationCheck";

export const verificationEducationFields = (data, matchedSubCheck) => {
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
        param: "Institute Name",
        paramCandidateValue: data?.nameOfSchoolCollegeUniversity || "-",
        paramVerifierValue: data?.verifiedNameOfSchoolCollegeUniversity || "-",
      },
      {
        param: "Country",
        paramCandidateValue: data?.countryName || "-",
        paramVerifierValue: data?.verifiedCountryName || "-",
      },
      {
        param: "Accreditation Status",
        paramCandidateValue: "-",
        paramVerifierValue: data?.accreditationStatus || "-",
      },
      {
        param: "Accreditation Organization Name",
        paramCandidateValue: "-",
        paramVerifierValue: data?.accreditationOrganizationName || "-",
      },
      {
        param: "Source",
        paramCandidateValue: "-",
        paramVerifierValue: data?.source || "-",
      },
      {
        param: "Qualification awarded",
        paramCandidateValue: data?.qualificationTypeName || "-",
        paramVerifierValue: data?.verifiedQualificationTypeName || "-",
      },
      {
        param: "Date of Attendance",
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
        param: "Graduation Date",
        paramCandidateValue: `${moment(data?.toDate).format("DD MMM YYYY")}`,
        paramVerifierValue: data?.verifiedToDate
          ? `${moment(data?.verifiedToDate).format("DD MMM YYYY")}`
          : "-",
      },
      {
        param: "Programme Type",
        paramCandidateValue: data?.educationTypeName || "-",
        paramVerifierValue: data?.verifiedEducationTypeName || "-",
      },
    ],
  };

  let verifierDetails = getVerifierFieldsInVerificationCheck(matchedSubCheck);

  if (verifierDetails) {
    fields.verifierDetails = verifierDetails;
  }

  return fields;
};
