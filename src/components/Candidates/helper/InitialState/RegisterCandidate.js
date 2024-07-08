export const initialValues = (
  additionalChecks,
  extraChecks,
  customFieldByOrgId,
  collectCandidateRegistrationEmail,
  collectCandidateRegistrationPhoneNo
) => {
  let customFields = [];

  if (customFieldByOrgId?.length > 0) {
    customFieldByOrgId.map((curr, index) => {
      //have also added 'isMandatory' here so that in schema validation
      // we can access it there and can make fields mandatory or non-mandatory
      if (curr.customFieldTypeId === 1) {
        customFields.push({
          customFieldId: curr.id,
          customFieldTypeId: curr.customFieldTypeId,
          customFieldResponseText: "",
          isMandatory: curr.isMandatory,
        });
      } else if (curr.customFieldTypeId === 2) {
        customFields.push({
          customFieldId: curr.id,
          customFieldTypeId: curr.customFieldTypeId,
          customFieldValueId: null,
          isMandatory: curr.isMandatory,
        });
      }
    });
  }

  let finalValue = {
    additionalChecks: [],
    checks: additionalChecks,
    extraChecks,
    hrTeamId: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    hiringCountryId: "",
    hrTeamId: "",
    customFields,
  };

  if (!collectCandidateRegistrationEmail) {
    delete finalValue.candidateEmail;
  }

  if (!collectCandidateRegistrationPhoneNo) {
    delete finalValue.candidatePhone;
  }

  return finalValue;
};
