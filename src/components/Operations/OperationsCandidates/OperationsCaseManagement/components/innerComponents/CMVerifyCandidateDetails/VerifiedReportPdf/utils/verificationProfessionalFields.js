import moment from "moment";
import RiskLevelIcon from "../assets/RiskLevelIcon";
import { riskLevelColorsAndIcons } from "../assets/riskLevelColorsAndIcons";
import { getVerifierFieldsInVerificationCheck } from "./getVerifierFieldsInVerificationCheck";

export const verificationProfessionalFields = (data, matchedSubCheck) => {
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
        paramCandidateValue: data?.qualifyingInstituteBodyName,
        paramVerifierValue: data?.verifiedQualifyingInstituteBodyName,
      },
      {
        param: "Country",
        paramCandidateValue: data?.countryName,
        paramVerifierValue: data?.verifiedCountryName,
      },
      {
        param: "Qualification awarded",
        paramCandidateValue: data?.professionalQualificationTitle,
        paramVerifierValue: data?.verifiedProfessionalQualificationTitle,
      },
      {
        param: "Period of Study",
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
        param: "Accreditation Date",
        paramCandidateValue: `${moment(data?.dateOfAccreditation).format(
          "DD MMM YYYY"
        )}`,
        paramVerifierValue: data?.verifiedDateOfAccreditation
          ? `${moment(data?.verifiedDateOfAccreditation).format("DD MMM YYYY")}`
          : "-",
      },
      {
        param: "Status",
        paramCandidateValue: data?.statusProfessionalQualificationName,
        paramVerifierValue:
          data?.verifiedStatusProfessionalQualificationName || "-",
      },
      {
        param: "Any disciplinary action against the candidate?",
        paramCandidateValue: "-",
        paramVerifierValue: data?.disciplinaryAction || "-",
      },
    ],
  };

  let verifierDetails = getVerifierFieldsInVerificationCheck(matchedSubCheck);

  if (verifierDetails) {
    fields.verifierDetails = verifierDetails;
  }

  return fields;
};
