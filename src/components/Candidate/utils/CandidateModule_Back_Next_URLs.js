export const calculate_Back_Next_Urls = (
  currentSectionName,
  candidateProfileSections,
  allowProfileEdit
) => {
  let backUrl, nextUrl;

  //dealing with the case for added checks and sub-checks in operations
  if (allowProfileEdit === false) {
    candidateProfileSections = candidateProfileSections?.filter(
      (section) => section.onHold
    );
  }

  if (candidateProfileSections?.length) {
    candidateProfileSections?.forEach((sec, i) => {
      if (sec.candidateProfileSectionName === currentSectionName) {
        if (i === 0) {
          nextUrl = candidateProfileSections[i + 1]?.sectionPath;
        } else if (i === candidateProfileSections.length - 1) {
          backUrl = candidateProfileSections[i - 1]?.sectionPath;
        } else {
          backUrl = candidateProfileSections[i - 1]?.sectionPath;
          nextUrl = candidateProfileSections[i + 1]?.sectionPath;
        }
      }
    });

    return {
      backUrl,
      nextUrl,
    };
  }
};
