export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const ERROR = "error";
export const SUCCESS = "success";
export const WARN = "warning";
export const INFO = "info";
export const cacheTime = 300000;

export const VERIFICATION_RESULTS = [
  { id: 1, name: "Low Risk", description: "noDiscrepancy" },
  { id: 2, name: "Moderate Risk", description: "minorDiscrepancy" },
  { id: 3, name: "High Risk", description: "majorDiscrepancy" },
  { id: 4, name: "Unable to Verify", description: "unableToVerify" },
];

export const CHECK_INTERNAL_STATUS = [
  { id: 4, name: "Waiting Third Party", description: "waitingThirdParty" },
  { id: 13, name: "Completed Checks", description: "completed" },
];

export const INPUT_TYPES = {
  TEXTBOX: 1,
  DROPDOWN: 2,
  PHONE_INPUT: 3,
  EMAIL_INPUT: 4,
  DATE_TIME: 5,
  DATE: 6,
  TEXT_AREA: 7,
  CURRENCY_DROPDOWN: 8,
};

export const PERMISSION_TYPES = {
  ACTION_PERMISSION: "action_permission",
  PAGE_PERMISSION: "page_permission",
};

export const CHECKS = {
  addressCheck: 1,
  idCheck: 2,
  passportCheck: 3,
  driverLicenceCheck: 4,
  rightToWorkCheck: 5,
  civilLitigationCheck: 6,
  creditCheck: 7,
  declarationCheck: 8,
  bankruptcyCheck: 9,
  cvCheck: 10,
  educationCheck: 11,
  employmentCheck: 12,
  salaryVerificationCheck: 13,
  professionalCheck: 14,
  referenceCheck: 15,
  globalSanctionsAndPEPCheck: 16,
  directorshipCheck: 17,
  finacialRegulatoryCheck: 18,
  amcEnglishCheck: 19,
  amcLocalCheck: 20,
  socialMediaCheck: 21,
  criminalCheck: 22,
  insuranceRegulatoryCheck: 23,
  insuranceAgentCheck: 24,
  additionalJurisdictionCheck: 25,
  hkmaMandatoryReferenceCheck: 26,
};
