import {
  CLEAR_STORE,
  LOADING,
  GET_CONSENT_EMAILS,
  GET_CUSTOM_EMAILS,
  GET_CUSTOM_EMAIL_CATEGORIES,
  GET_CUSTOM_FIELD_CATEGORIES,
  GET_CUSTOM_FIELD_TYPES,
  GET_INTERNAL_USERS,
  GET_ORGS,
  GET_ROLES,
  SELECTED_ORG,
  GET_ORG_MSG_METHOD_STATUS,
  GET_CHECK_COST_FOR_ALL_COUNTRIES,
  GET_ORG_RELATIONSHIP,
  GET_ADDITIONAL_EMAIL_SETTINGS_DATA,
  GET_EMAIL_PROVIDER_SETTING,
  GET_ADDITIONAL_CHECKS_SETTING_DATA,
  GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
  GET_REMOVAL_PERMISSIONS_DATA,
  PERMISSION_TYPE_LOADING,
  GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA,
  GET_COUNTRIES_DATA_AS_PER_ORG,
  GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS,
  UPDATE_CHECK_PRICE_ACCORDION_LOADING
} from "../actions/actionTypes";

const initialState = {
  loading: true,
  rolesLists: null,
  orgsLists: null,
  selectedOrg: null,
  internalUsersLists: null,
  customFieldCategoriesLists: null,
  customFieldTypesLists: null,
  customEmailsLists: [],
  customEmailCategoriesLists: null,
  consentEmailsLists: [],
  orgMsgMethodStatus: null,
  checkCostsforAllCountries: null,
  getOrgRelationshipDetails: null,
  additionalEmailSettingsData: null,
  emailProviderSetting: null,
  additionalChecksSettingData: [],
  permissionsListAsPerPermissionType: null,
  removalPermissionsData: null,
  permissionTypeLoading: false,
  allowedCountriesSettingData: null,
  countriesDataAsPerOrg: null,
  candidateRegistrationFieldSettings: null,
  updateCheckPriceAccordionLoading:false
};

export default function systemAdminReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case GET_ROLES:
      return {
        ...state,
        rolesLists: action.payload,
      };
    case GET_ORGS:
      let allOrg = {
        hrOrganizationsId: null,
        hrOrganizationName: "All Organizations",
        allow2fAuthentication: false,
      };
      let temp = action.payload;

      if (
        temp.find((curr) => curr.hrOrganizationName !== "All Organizations")
      ) {
        temp = [allOrg, ...temp];
      }
      return {
        ...state,
        orgsLists: temp,
      };
    case SELECTED_ORG:
      return {
        ...state,
        selectedOrg: action.payload,
      };
    case GET_INTERNAL_USERS:
      return {
        ...state,
        internalUsersLists: action.payload,
      };

    case GET_CUSTOM_FIELD_CATEGORIES:
      return {
        ...state,
        customFieldCategoriesLists: action.payload,
      };

    case GET_CUSTOM_FIELD_TYPES: {
      //filtering out custom fields other than textbox & dropdown
      let temp = action.payload?.filter(
        (curr) => curr.id === 1 || curr.id === 2
      );
      return {
        ...state,
        customFieldTypesLists: temp,
      };
    }
    case GET_CUSTOM_EMAILS:
      return {
        ...state,
        customEmailsLists: action.payload,
      };
    case GET_CUSTOM_EMAIL_CATEGORIES:
      return {
        ...state,
        customEmailCategoriesLists: action.payload,
      };
    case GET_CONSENT_EMAILS:
      return {
        ...state,
        consentEmailsLists: action.payload,
      };
    case GET_ORG_MSG_METHOD_STATUS:
      return {
        ...state,
        orgMsgMethodStatus: action.payload,
      };
    case GET_CHECK_COST_FOR_ALL_COUNTRIES:
      return {
        ...state,
        checkCostsforAllCountries: action.payload,
      };
    case GET_ORG_RELATIONSHIP:
      return {
        ...state,
        getOrgRelationshipDetails: action.payload,
      };
    case GET_ADDITIONAL_EMAIL_SETTINGS_DATA:
      return {
        ...state,
        additionalEmailSettingsData: action.payload,
      };
    case GET_EMAIL_PROVIDER_SETTING:
      return {
        ...state,
        emailProviderSetting: action.payload,
      };
    case GET_ADDITIONAL_CHECKS_SETTING_DATA:
      return {
        ...state,
        additionalChecksSettingData: action.payload,
      };
    case GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE:
      return {
        ...state,
        permissionsListAsPerPermissionType: action.payload,
      };
    case GET_REMOVAL_PERMISSIONS_DATA:
      return {
        ...state,
        removalPermissionsData: action.payload,
      };
    case PERMISSION_TYPE_LOADING:
      return {
        ...state,
        permissionTypeLoading: action.payload,
      };
    case GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA:
      return {
        ...state,
        allowedCountriesSettingData: action.payload,
      };
    case GET_COUNTRIES_DATA_AS_PER_ORG:
      let tempModified = [];

      action.payload?.map((country) =>
        tempModified.push({
          label: country.name,
          value: country.countryMasterId,
        })
      );
      return {
        ...state,
        countriesDataAsPerOrg: tempModified,
      };
    case GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS:
      return {
        ...state,
        candidateRegistrationFieldSettings: action.payload,
      };
      case UPDATE_CHECK_PRICE_ACCORDION_LOADING:
        return {
          ...state,
          updateCheckPriceAccordionLoading: action.payload,
        };
    case CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
