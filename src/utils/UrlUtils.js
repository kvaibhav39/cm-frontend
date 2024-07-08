export const hostPath =
  process.env.REACT_APP_IP_ADDRESS || "http://13.250.32.18:3000/v1";
// export const hostPath = "http://localhost:5000/v1";

const urls = {
  login: "/login",
  register: "/signup",
  resetPassword: "/reset-password",
  forgotPassword: "/forget-password",
  currentUser: "/users/current",
  packages: "/packages",
  package: "/package",
  customPackages: "/packages-with-checks",
  countries: "/countries",
  checks: "/checks",
  capabilities: "/capabilities",
  questionnaires: "/questionnaires",
  industries: "/industries",
  organization: "/hr-organizations",
  organizationIndustries: "/organization-industries",
  hrOrganization: "/hr-organizations",
  hrInvitation: "/hr-user",
  users: "/users",
  userroles: "/user-roles",
  userPermissions: "/user-permissions",
  refreeQuestionnaire: "/refree/questionnaire",
  organizations: "/organizations",
  processStatus: "/verification-process-status",
  resultStatus: "/verification-result-status",
  submitOperation: "/operations/candidate-temp-report",
  candidateProfile: "/candidate-profile",
  systemAdmin: "/sysadmin",
  tokenValidation: "/check-token-validity",
  operations: "/operations",
};

export const getCandidateServicesUrl = (type) => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/${type}`;
};

export const getCandidateSubmitFeedback = () => {
  return `${hostPath}/user/feedback`;
};

export const getRefreeQuestionnaireUrl = (token) => {
  const basePath = `${urls.refreeQuestionnaire}?token=${token}`;
  return `${hostPath}${basePath}`;
};

export const getLoginUrl = () => {
  const basePath = urls.login;
  return `${hostPath}${basePath}`;
};

export const getChooseOtpMethodUrl = () => {
  return `${hostPath}/send-otp`;
};

export const getVerifyOtpUrl = () => {
  return `${hostPath}/verify-otp`;
};

export const getRegisterUrl = () => {
  const basePath = urls.register;
  return `${hostPath}${basePath}`;
};

export const getCurrentUserUrl = () => {
  const basePath = urls.currentUser;
  return `${hostPath}${basePath}`;
};

export const getPriceAndCurrency = (id) => {
  const basePath = urls.checks + urls.capabilities;
  return `${hostPath}${basePath}/${id}`;
};

export const getResetPasswordUrl = () => {
  const basePath = urls.resetPassword;
  return `${hostPath}${basePath}`;
};

export const getForgotPasswordUrl = () => {
  const basePath = urls.forgotPassword;
  return `${hostPath}${basePath}`;
};

export const getAllPackagesUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}${urls.packages}`;
};

export const getPackageUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}${urls.packages}`;
};

export const getCustomPackageUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}${urls.customPackages}`;
};

export const getAllCountriesUrl = () => {
  const basePath = urls.countries;
  return `${hostPath}${basePath}`;
};

export const getAllChecksUrl = () => {
  const basePath = urls.checks;
  return `${hostPath}${basePath}`;
};

export const getAllQuestionnairesUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}${urls.questionnaires}`;
};

export const getAllIndustriesUrl = () => {
  const basePath = urls.industries;
  return `${hostPath}${basePath}`;
};

export const getOrgIndustriesUrl = (params) => {
  const basePath = urls.industries;
  return `${hostPath}${basePath}/${params.orgId}`;
};

export const getOrganizationCreateUrl = () => {
  const basePath = urls.organization;
  return `${hostPath}${basePath}`;
};

export const getOrganizationIndustriesUrl = () => {
  const basePath = urls.organizationIndustries;
  return `${hostPath}${basePath}`;
};

export const getOrganizationsUrlLink = () => {
  const basePath = urls.organizations;
  return `${hostPath}${basePath}`;
};

export const getOrganizationIndustriesLink = (params) => {
  const basePath = urls.organization;
  return `${hostPath}${basePath}/${params.orgId}`;
};
export const getCompanBrandingUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}`;
};

export const getOrganizationUsersUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/users`;
};

export const getEditOrganizationUsersUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/users/${params.userId}`;
};

export const getSubroles = (params) => {
  const basePath = urls.userroles;
  return `${hostPath}${basePath}/${params.roleId}/users-subroles`;
};

export const getOrganizationTeamsUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/teams`;
};

export const getDeleteOrganizationTeamsUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/teams/${params.teamId}`;
};

// export const getAddTeamsUserUrl = (params) => {
//   const basePath = urls.hrOrganization;
//   return `${hostPath}${basePath}/${params.orgId}/teams/${params.teamId}/user`;
// };

//using new api
export const getAddTeamsUserUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/teams/user?teamId=${params.teamId}`;
};

export const getEditTeamsUserUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/teams/${params.teamId}/user/${params.userId}`;
};

export const getDeleteTeamsUserUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/teams/${params.teamId}/user/${params.userId}`;
};

export const getAddCandidateInOrgTeamUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/candidates`;
};

export const getOrganizationQuestionnairesUpdateUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/questionnaires/${params.questionnairesId}`;
};

export const getOrganizationStatisticsUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/summary-statistics`;
};

export const getUserNotifications = () => {
  const basePath = urls.users;
  return `${hostPath}${basePath}/notifications`;
};

export const getSearchUsersUrl = () => {
  const basePath = urls.users;
  return `${hostPath}${basePath}`;
};

export const getUsersUrl = () => {
  const basePath = "/user";
  return `${hostPath}${basePath}`;
};

export const getUserPermissionsUrl = () => {
  const basePath = urls.userPermissions;
  return `${hostPath}${basePath}`;
};

export const getProcessStatusUrlLink = () => {
  const basePath = urls.processStatus;
  return `${hostPath}${basePath}`;
};

export const getResultStatusUrlLink = () => {
  const basePath = urls.resultStatus;
  return `${hostPath}${basePath}`;
};

export const getSubmitOperationUrlLink = () => {
  const basePath = urls.submitOperation;
  return `${hostPath}${basePath}`;
};

export const getChangePermissionsOrgUserUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/user/${params.userId}`;
};

export const getCustomFieldByOrgIdUrl = (params) => {
  const basePath = urls.organizations;
  return `${hostPath}${basePath}/${params.orgId}/custom-fields`;
};

export const getRolesUrl = () => {
  const basePath = urls.userroles;
  return `${hostPath}${basePath}`;
};

export const getOrganizationsUrl = () => {
  const basePath = urls.organizations;
  return `${hostPath}${basePath}`;
};

export const getInternalUsersUrl = () => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/get-ops-users`;
};

export const getSubmitInternalUsersUrl = () => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/add-ops-user`;
};

export const getCustomFieldCategoriesUrl = () => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/get-custom-field-categories`;
};

export const getCustomFieldTypesUrl = () => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/get-custom-field-types`;
};

export const getSubmitCustomFieldUrl = (orgId) => {
  const basePath = urls.systemAdmin + urls.organizations;
  return `${hostPath}${basePath}/${orgId}/custom-fields`;
};

export const getDeleteCustomFieldUrl = (orgId, customFieldId) => {
  const basePath = urls.systemAdmin + urls.organizations;
  return `${hostPath}${basePath}/${orgId}/custom-fields/${customFieldId}`;
};

export const getTerminateStatusOfCandidateUrl = (orgId, candidateCaseId) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${orgId}/candidates/${candidateCaseId}/process-status`;
};

export const getCustomEmailsUrl = (orgId) => {
  const basePath = urls.systemAdmin + urls.organizations;
  return `${hostPath}${basePath}/custom-email-body`;
};

export const getCustomEmailCategoriesUrl = () => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/get-custom-email-categories`;
};

export const getSubmitCustomEmailUrl = () => {
  const basePath = urls.systemAdmin + urls.organizations;
  return `${hostPath}${basePath}/custom-email-body`;
};

export const getDeleteEditCustomEmailUrl = (id) => {
  const basePath = urls.systemAdmin + urls.organizations;
  return `${hostPath}${basePath}/custom-email-body/${id}`;
};

export const getConsentEmailsUrl = () => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/custom-consent-field`;
};

export const getDeleteEditConsentEmailUrl = (id) => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/custom-consent-field/${id}`;
};

export const getCheckTokenValidationUrl = () => {
  const basePath = urls.tokenValidation;
  return `${hostPath}${basePath}`;
};

export const getHrCandidatesByOrgIdUrl = (id) => {
  const basePath = urls.organization;
  return `${hostPath}${basePath}/${id}/candidates`;
};

export const getOPsCandidatesByOrgIdUrl = (id) => {
  return `${hostPath}/organization/${id}/candidates`;
};

export const getOrgOtherSettingsUrl = (id) => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/organization-other-settings/${id}`;
};

export const getAddMultipleCandidatesUrl = (id) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${id}/multiple-candidates`;
};
export const getFailedToRegisterCandidatesUrl = (id) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/get-failed-to-register-candidates/${id}`;
};

export const getDeleteFailedCandidateDataUrl = (orgId, id) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${orgId}/multiple-register-candidate?registrationId=${id}`;
};

export const getUpdateUserProfileActionUrl = () => {
  return `${hostPath}/user`;
};

export const getCheckCostsOfAllCountriesUrl = (checksId) => {
  const basePath = urls.checks;
  return `${hostPath}${basePath}/get-check-costs-of-all-country/${checksId}`;
};

export const getUpdateCheckCostsOfCountriesUrl = () => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/update-check-price`;
};

export const getCacheCandidateDetailsUrl = () => {
  return `${hostPath}/candidate-cache-data`;
};

export const getPersonalParticularUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/personal-particular`;
};

export const getAddressDetailsUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/address-details`;
};

export const getFamilyDetailsUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/family-details`;
};

export const getEmploymentHistoryUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/employment-history`;
};

export const getEducationalQualificationsUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/educational-qualification`;
};

export const getProfessionalQualificationsUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/professional-qualification`;
};

export const getProfessionalReferenceUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/professional-reference`;
};

export const getIdentityDataUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/identity-details`;
};

export const getDeclarationDataUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/declaration`;
};

export const getAdditionalInformationUrl = () => {
  const basePath = urls.candidateProfile;
  return `${hostPath}${basePath}/additional-information`;
};

export const getVerificationProcessStatusUrl = () => {
  return `${hostPath}/verification-process-status`;
};

export const getVerificationResultStatusUrl = () => {
  return `${hostPath}/verification-result-status`;
};

export const getUpdateResearchCountriesUrl = (id) => {
  const basePath = urls.systemAdmin;
  return `${hostPath}${basePath}/organization-research-country-juridiction-scope/${id}`;
};

export const getOPScandidatesUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-ops-candidates-cases`;
};

export const getOPSbasicCandidateInfoUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-candidatecase-basic-information`;
};

export const getOPSCandidateCaseChecksUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-candidatecase-checks-list`;
};

export const getOPSUserBySubRoleIdsUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-ops-users-by-subroleid`;
};

export const getCheckInternalStatusUrl = () => {
  return `${hostPath}/get-check-internal-status`;
};

export const getCandidateCaseSubChecksUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-candidatecase-sub-checks-list`;
};

export const getOrgsListsByOpsUserIdUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-organizations-by-ops-user-mapping`;
};

export const updateOrgsAssignedToOpsUserUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/assign-hr-organization-to-ops-user`;
};

export const updateChecksDataUrl = (candidatesChecksMappingId) => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/update-check-data/${candidatesChecksMappingId}`;
};

export const getActionLogCategoriesUrl = () => {
  return `${hostPath}/get-action-log-category-level1`;
};

export const getActionLogSubCategoriesUrl = (id) => {
  return `${hostPath}/get-action-log-category-level2/${id}`;
};

export const getActionLogAdditionalCategoriesUrl = (id) => {
  return `${hostPath}/get-action-log-category-level3/${id}`;
};

export const getActionLogCategoriesInputsUrl = (id) => {
  return `${hostPath}/get-action-log-category-inputs/${id}`;
};

export const updateSubCheckDataUrl = (
  candidatesChecksMappingId,
  subCheckId
) => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/update-sub-check-data/${candidatesChecksMappingId}/${subCheckId}`;
};

export const updateVerifierUrl = (candidatesChecksMappingId, subCheckId) => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/update-verifier-sub-check-data/${candidatesChecksMappingId}/${subCheckId}`;
};

export const submitActionLogUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/add-action-log`;
};

export const getActionLogUrl = (subCheckId) => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-action-logs/${subCheckId}`;
};

export const updateAssigneeForCandidateUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/update-candidatecase-data`;
};

export const getOpsStatisticsUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-summary-statistics`;
};

export const addNewChecksUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/add-new-check`;
};

export const addCheckSubCheckUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/add-new-check-and-sub-check`;
};

export const getUpdateRelationshipUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/update-relationship-with-client`;
};

export const getRelationshipDetailsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/get-relationship-with-client`;
};

export const getCandidateCaseAuditTrailActivityUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-candidatecase-audit-trail-activity`;
};

export const getloginAsCandidateInOpsUrl = () => {
  return `${hostPath}/ops-login-as-candidate`;
};

export const getupdateVerifiedEducationUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/update-verified-education-data`;
};

export const getupdateVerifiedEmploymentUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/update-verified-employment-data`;
};

export const getupdateVerifiedProfessionalUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/update-verified-professional-data`;
};

export const getQueryOperationsUrl = () =>
  `${hostPath}/get-query-types-and-query-results`;

export const getAdditionalEmailDetailsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/get-additional-email-settings`;
};

export const getPostAdditionalEmailDetailsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/add-additional-email-settings`;
};

export const getPutAdditionalEmailDetailsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/update-additional-email-settings`;
};

export const getDeleteAdditionalEmailDetailsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/delete-additional-email-settings`;
};

export const getOpsUsersByOrgIdUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/get-ops-users-by-organization`;
};

export const getEmailProviderSettingUrl = () => {
  const systemAdmin = urls.systemAdmin;
  return `${hostPath}${systemAdmin}/get-email-provider-setting`;
};

export const getUpdateEmailProviderSettingUrl = () => {
  const systemAdmin = urls.systemAdmin;
  return `${hostPath}${systemAdmin}/update-email-provider-setting`;
};

export const getAddCandidateInOrgTeamUrlByOps = (params) => {
  const organizations = urls.hrOrganization;
  const operations = urls.operations;
  return `${hostPath}${operations}${organizations}/${params.orgId}/candidates`;
};

export const getAddMultipleCandidatesUrlByOps = (id) => {
  const organizations = urls.hrOrganization;
  const operations = urls.operations;
  return `${hostPath}${operations}${organizations}/${id}/multiple-candidates`;
};

export const createNewHrAsOpsUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/signup`;
};

export const getloginAsHrInOpsUrl = () => {
  return `${hostPath}/ops-login-as-hr`;
};

export const getRemoveUserFromOrganizationUrl = (params) => {
  const basePath = urls.hrOrganization;
  return `${hostPath}${basePath}/${params.orgId}/user/${params.userId}`;
};

export const getAdditionalCheckSettingsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/get-additional-checks-setting`;
};

export const updateAdditionalCheckSettingsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/update-additional-checks-setting`;
};

export const getloginAsCandidateInVendorUrl = () => {
  return `${hostPath}/vendor-login-as-candidate`;
};

export const getSupportDocumentsByCountryUrl = (iso) => {
  return `${hostPath}/get-supporting-documents-by-country/${iso}`;
};

export const getPermissionsPerPermissionTypeUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/get-permissions`;
};

export const getRemovalPermissionsDataUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/get-removal-permissions-setting`;
};

export const getAddRemovalPermissionsDataUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/add-permissions-removal-setting`;
};

export const getDeleteRemovalPermissionsDataUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/delete-removal-permissions-setting`;
};

export const updateAllowedResearchCountriesSettingsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/update-research-countries-setting`;
};

export const getAllowedResearchCountriesSettingsUrl = () => {
  const systemAdmin = urls.systemAdmin;
  const organizations = urls.organizations;
  return `${hostPath}${systemAdmin}${organizations}/get-research-countries-setting`;
};

export const getRegisterCandidateFieldSettingsUrl = (id) => {
  const systemAdmin = urls.systemAdmin;
  return `${hostPath}${systemAdmin}/organization-candidate-registration-field-settings/${id}`;
};

export const updateRegisterCandidateFieldSettingsUrl = (id) => {
  const systemAdmin = urls.systemAdmin;
  return `${hostPath}${systemAdmin}/organization-update-candidate-field-settings/${id}`;
};

export const uploadLogsUrl = () => `${hostPath}/upload-logs`;

export const getOPSsubCheckListsUrl = () => {
  const basePath = urls.operations;
  return `${hostPath}${basePath}/get-ops-sub-checks-list`;
};
