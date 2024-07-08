export const opsEmpToDisplayHeaders = (item, header, value) => {
  if (!item.wasBonusReceived) {
    if (header.value === "bonus") return false;
  }

  if (!item.wasOnPayrollOfAgency) {
    if (
      header.value === "agencyApartmentUnitHouseNumber" ||
      header.value === "agencyBuildingName" ||
      header.value === "agencyStreetAddressLine1" ||
      header.value === "agencyStreetAddressLine2" ||
      header.value === "agencyCityTownDistrict" ||
      header.value === "agencyStateProvince" ||
      header.value === "agencyZipPostalAreaCode" ||
      header.value === "agencyCountryName" ||
      header.value === "agencyPhoneCountryCode" ||
      header.value === "agencyPhoneNumber" ||
      header.value === "agencyName"
    )
      return false;
  }

  if (header.text.includes("State/Province")) {
    if (item.countryId === 101 || item.countryId === 132) {
      header.text = "State/Province";
    } else {
      header.text = "State/Province*";
    }
  }

  if (item.reasonForLeaving === 5) {
    if (!item.wasResignationRequested) {
      if (header.value === "reasonOfResignationRequested") return false;
    }
    if (header.value === "otherReasonForLeaving") return false;
  } else if (item.reasonForLeaving === 8) {
    if (header.value === "wasResignationRequested") return false;
    if (header.value === "reasonOfResignationRequested") return false;
  } else {
    if (header.value === "otherReasonForLeaving") return false;
    if (header.value === "wasResignationRequested") return false;
    if (header.value === "reasonOfResignationRequested") return false;
  }

  if (item.bonusTypeId !== 3) {
    if (header.value === "otherBonusTypeName") return false;
  }

  if (item.salaryFrequencyId !== 6) {
    if (header.value === "otherSalaryFrequency") return false;
  }

  if (item.canContactEmployer) {
    if (
      header.value === "cessationDate" ||
      header.value === "reasonOfChoosingLateCessationDate"
    ) {
      return false;
    }
  }

  if (item.reasonOfChoosingLateCessationDate === "") {
    if (header.value === "reasonOfChoosingLateCessationDate") {
      return false;
    }
  }

  if (
    item?.eligibleForRehire === "Yes" ||
    item?.eligibleForRehire === "" ||
    value?.eligibleForRehire === "Yes" ||
    !value?.eligibleForRehire
  ) {
    if (header.value === "reasonForNoRehire") {
      return false;
    }
  }

  return true;
};
