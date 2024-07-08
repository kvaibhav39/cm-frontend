import moment from "moment";

export const getVerifierFieldsInVerificationCheck = (matchedSubCheck) => {
  if (
    matchedSubCheck?.isVerifierAPersonOr3rdParty &&
    matchedSubCheck?.verifierDetails?.verifierName &&
    matchedSubCheck?.verifierDetails?.verifierTitle &&
    matchedSubCheck?.verifierDetails?.verifierContactDetails &&
    matchedSubCheck?.verifierDetails?.dateOfVerification
  ) {
    return {
      heading: "Verifier Details",
      values: [
        {
          param: "Verifier Name",
          paramValue: matchedSubCheck?.verifierDetails?.verifierName || "-",
        },
        {
          param: "Verifier Title ",
          paramValue: matchedSubCheck?.verifierDetails?.verifierTitle || "-",
        },
        {
          param: "Verifier Contact details",
          paramValue:
            matchedSubCheck?.verifierDetails?.verifierContactDetails || "-",
        },
        {
          param: "Date of Verification",
          paramValue:
            moment(matchedSubCheck?.verifierDetails?.dateOfVerification).format(
              "DD MMM YYYY"
            ) || "-",
        },
      ],
    };
  } else if (
    matchedSubCheck?.isVerifierAPersonOr3rdParty === false &&
    matchedSubCheck?.verifierDetails?.dateOfVerification &&
    matchedSubCheck?.verifierDetails?.verifierParty
  ) {
    return {
      heading: "Verifier Details",
      values: [
        {
          param: "Verifier Party",
          paramValue: matchedSubCheck?.verifierDetails?.verifierParty || "-",
        },
        {
          param: "Date of Verification",
          paramValue:
            moment(matchedSubCheck?.verifierDetails?.dateOfVerification).format(
              "DD MMM YYYY"
            ) || "-",
        },
      ],
    };
  } else {
    return null;
  }
};
