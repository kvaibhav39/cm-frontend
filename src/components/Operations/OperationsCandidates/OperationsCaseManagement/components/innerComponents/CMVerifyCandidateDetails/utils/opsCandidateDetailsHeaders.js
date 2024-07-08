import { HEADERS } from "../../../../../../../Candidate/review/helpers/reviewHeadersData";
import {
  verifierEmploymentHistoryExtraFieldsForPDF,
  verifierEmploymentHistoryFields,
} from "./opsEmploymentVerifierFields";
import {
  verifierEducationFields,
  verifierEducationExtraFieldsForPDF,
} from "./opsEducationVerifierFields";
import {
  verifierProfessionalQualExtraFieldsForPDF,
  verifierProfessionalQualFields,
} from "./opsProfessionalQualVerifierFields";

export const opsCandidateDetailsHeaders = (props) => {
  //storing original headers in tempHeaders
  let tempHeaders = HEADERS(props?.hrOrganizationName);

  //checks in which verifier fields are to be added
  let verifierFieldsFor = [
    {
      name: "EMPLOYMENT_HISTORY",
      verifierFieldsToReplaceOriginalFields: verifierEmploymentHistoryFields(
        props?.reasonOfLeavingTypes,
        props?.salaryFreq
      ),
      verifierExtraFieldsForPDF: verifierEmploymentHistoryExtraFieldsForPDF,
    },
    {
      name: "EDUCATIONAL_QUALIFICATIONS",
      verifierFieldsToReplaceOriginalFields: verifierEducationFields(
        props?.qualificationTypes,
        props?.educationTypes
      ),
      verifierExtraFieldsForPDF: verifierEducationExtraFieldsForPDF,
    },
    {
      name: "PROFESSIONAL_QUALIFICATIONS",
      verifierFieldsToReplaceOriginalFields: verifierProfessionalQualFields(
        props?.qualificationStatuses
      ),
      verifierExtraFieldsForPDF: verifierProfessionalQualExtraFieldsForPDF,
    },
  ];

  //function to add verifier fields
  const populateVerifierFields = (
    name,
    verifierFieldsToReplaceOriginalFields,
    verifierExtraFieldsForPDF
  ) => {
    let finalFields = [];

    //replacing original fields with verifier fields
    finalFields = tempHeaders[name]?.map((originalField) => {
      let verifierFieldIsPresent = verifierFieldsToReplaceOriginalFields?.find(
        (verifierField) => verifierField?.value === originalField?.value
      );

      return verifierFieldIsPresent || originalField;
    })

    //adding extra pdf fields
    return [...finalFields, ...verifierExtraFieldsForPDF];
  };

  //adding verifier fields to tempHeaders
  verifierFieldsFor?.forEach(
    ({
      name,
      verifierFieldsToReplaceOriginalFields,
      verifierExtraFieldsForPDF,
    }) => {
      tempHeaders[name] = populateVerifierFields(
        name,
        verifierFieldsToReplaceOriginalFields,
        verifierExtraFieldsForPDF
      );
    }
  );

  return tempHeaders;
};
