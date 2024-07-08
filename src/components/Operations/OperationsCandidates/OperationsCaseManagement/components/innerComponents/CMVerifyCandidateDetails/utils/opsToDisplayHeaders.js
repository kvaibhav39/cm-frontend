export const opsTodisplayHeaders = (item, header, title, value) => {
  if (!item.otherNameExists) {
    if (header.text === "Other Names") {
      return false;
    }
  }

  if (item.otherNameLanguageId !== 185) {
    if (header.value === "pinyinName") {
      return false;
    }
  }

  if (!item.formerNameExists) {
    if (
      header.value === "formerName" ||
      header.value === "formerNameDateChange"
    ) {
      return false;
    }
  }

  if (!item.mothersMaidenNameExists) {
    if (header.value === "mothersMaidenName") {
      return false;
    }
  }

  if (title?.includes("Address") && header.text.includes("State/Province")) {
    if (item.countryId === 101 || item.countryId === 132) {
      header.text = "State/Province";
    } else {
      header.text = "State/Province*";
    }
  }

  if (
    title?.includes("Educational") &&
    header.text.includes("State/Province")
  ) {
    if (item.countryId === 101 || item.countryId === 132) {
      header.text = "State/Province";
    } else {
      header.text = "State/Province*";
    }
  }

  if (
    title?.includes("Professional") &&
    header.text.includes("State/Province")
  ) {
    if (item.countryId === 101 || item.countryId === 132) {
      header.text = "State/Province";
    } else {
      header.text = "State/Province*";
    }
  }

  if (item.statusProfessionalQualificationId !== 4) {
    if (header.value === "otherProffesionalQualificationStatus") {
      return false;
    }
  }

  if (item.educationTypeId !== 3) {
    if (header.value === "otherEducationType") {
      return false;
    }
  }

  if (item.qualificationTypeId !== 8) {
    if (header.value === "qualificationTypeOthers") {
      return false;
    }
  }

  if (
    header.value === "uploadedByCandidate" ||
    header.value === "uploadedByOpsUser" ||
    header.value === "uplodedByHr" ||
    header.value === "identityAttachments"
  ) {
    return item[header.value]?.length;
  }

  if (
    header.value === "identityDocumentType" ||
    header.value === "identityDocumentNumber"
  ) {
    return item[header.value];
  }

  return true;
};
