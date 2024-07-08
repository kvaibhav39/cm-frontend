export const checkConditionToDisplayExtraFields = (
  candidateDetails,
  countryIds,
  checkIds
) => {
  let { assignedChecksIds, researchCountryData } = candidateDetails;

  if (!assignedChecksIds?.length || !researchCountryData?.length) {
    return false;
  }

  let ifCountryPresent = researchCountryData?.find((curr) =>
    countryIds?.find((country) => country === curr.countryMasterId)
  );

  let ifCheckPresent = assignedChecksIds?.find((curr) =>
    checkIds?.find((checkId) => checkId === curr)
  );

  if (ifCountryPresent && ifCheckPresent) {
    return true;
  }

  return false;
};
