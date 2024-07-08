import { uid } from "../../../base";

export const newEmployment = () => {
  return {
    companyName: "",
    isCurrentEmployer: false,
    fromDate: "",
    toDate: "",
    canContactEmployer: true,
    cessationDate: null,
    reasonOfChoosingLateCessationDate: "",
    employmentTypeId: null,
    employmentStatusId: null,
    employmentDepartment: "",
    jobTitle: "",
    employeeId: "",
    selectedTab: true,
    reasonForLeaving: null,
    otherReasonForLeaving: "",
    wasResignationRequested: false,
    reasonOfResignationRequested: "",
    employerStreetAddressLine1: "",
    employerStreetAddressLine2: "",
    employerCityTownDistrict: "",
    employerStateProvince: "",
    employerZipPostalAreaCode: "",
    employerCountryId: null,
    employerPhoneCountryCode: "",
    employerPhoneNumber: "",
    supervisorName: null,
    supervisorTitle: null,
    supervisorEmail: null,
    supervisorPhoneCountryCode: "",
    supervisorPhoneNumber: "",
    hrName: null,
    hrTitle: null,
    hrEmail: null,
    hrPhoneCountryCode: "",
    hrPhoneNumber: "",
    salaryFrequencyId: null,
    otherSalaryFrequency: "",
    salaryCurrencyId: null,
    salaryAmount: "",
    wasBonusReceived: false,
    otherRemuneration: "",
    wasOnPayrollOfAgency: false,
    agencyName: "",
    agencyStreetAddressLine1: "",
    agencyStreetAddressLine2: "",
    agencyCityTownDistrict: "",
    agencyStateProvince: "",
    agencyZipPostalAreaCode: "",
    agencyCountryId: null,
    agencyPhoneCountryCode: "",
    agencyPhoneNumber: "",
    attachments: [],
    isExpanded: true,
    bonus: [newBonusData()],
    candidatesEmploymentsId: uid(10),
  };
};

export const newBonusData = () => {
  return {
    bonusCurrencyId: null,
    otherBonusTypeName: "",
    bonusTypeId: null,
    bonusAmount: null,
    id: uid(10),
  };
};

export const newEmploymentGaps = () => {
  return {
    reasonOfGapId: null,
    additionalComments: "",
    candidatesEmploymentGapsId: uid(10),
  };
};
