//candidate action types
const LOADING = "LOADING";
const CANDIDATE_SECTION_LOADING = "CANDIDATE_SECTION_LOADING";
const CANDIDATE_SIDEBAR_STATE = "CANDIDATE_SIDEBAR_STATE";
const CANDIDATE_DETAILS = "CANDIDATE_DETAILS";
const CANDIDATE_INITIAL_DETAILS = "CANDIDATE_INITIAL_DETAILS";
const CANDIDATE_DISPLAY_API_ERROR = "CANDIDATE_DISPLAY_API_ERROR";
const CANDIDATE_CLEAR_API_ERROR = "CANDIDATE_CLEAR_API_ERROR";
const CANDIDATE_CACHED_DETAILS = "CANDIDATE_CACHED_DETAILS";
const PERSONAL_PARTICULAR = "PERSONAL_PARTICULAR";
const ADDRESS_DETAILS = "ADDRESS_DETAILS";
const FAMILY_DETAILS = "FAMILY_DETAILS";
const EMPLOYMENT_HISTORY = "EMPLOYMENT_HISTORY";
const EDUCATIONAL_QUALIFICATIONS = "EDUCATIONAL_QUALIFICATIONS";
const PROFESSIONAL_QUALIFICATIONS = "PROFESSIONAL_QUALIFICATIONS";
const PROFESSIONAL_REFERENCE = "PROFESSIONAL_REFERENCE";
const IDENTITY_DETAILS = "IDENTITY_DETAILS";
const DECLARATION = "DECLARATION";
const ADDITIONAL_INFORMATION = "ADDITIONAL_INFORMATION";
const CANDIDATE_SECTION_BACK_URL = "CANDIDATE_SECTION_BACK_URL";
const CANDIDATE_SECTION_SUBMIT_HANDLER = "CANDIDATE_SECTION_SUBMIT_HANDLER";
const CANDIDATE_SECTION_DISABLE_SUBMTI_BTN =
  "CANDIDATE_SECTION_DISABLE_SUBMTI_BTN";
const GET_CANDIDATE_EDUCATION_TYPES = "GET_CANDIDATE_EDUCATION_TYPES";
const GET_CANDIDATE_EMPLOYMENT_BONUS_TYPES =
  "GET_CANDIDATE_EMPLOYMENT_BONUS_TYPES";
const GET_CANDIDATE_EMPLOYMENT_CAREER_GAPS_TYPES =
  "GET_CANDIDATE_EMPLOYMENT_CAREER_GAPS_TYPES";
const GET_CANDIDATE_EMPLOYMENT_REASON_OF_LEAVING_TYPES =
  "GET_CANDIDATE_EMPLOYMENT_REASON_OF_LEAVING_TYPES";
const GET_CANDIDATE_EMPLOYMENT_SALARY_FREQUENCY_TYPES =
  "GET_CANDIDATE_EMPLOYMENT_SALARY_FREQUENCY_TYPES";
const GET_CANDIDATE_EMPLOYMENT_TYPES = "GET_CANDIDATE_EMPLOYMENT_TYPES";
const GET_CANDIDATE_PROFESSIONAL_RELATIONS_TYPES =
  "GET_CANDIDATE_PROFESSIONAL_RELATIONS_TYPES";
const GET_CANDIDATE_EDUCATION_QUALIFICATION_TYPES =
  "GET_CANDIDATE_EDUCATION_QUALIFICATION_TYPES";
const GET_CANDIDATE_PROFESSIONAL_QUALIFICATION_TYPES =
  "GET_CANDIDATE_PROFESSIONAL_QUALIFICATION_TYPES";
const GET_CURRENCIES = "GET_CURRENCIES";
const GET_LANGUAGES = "GET_LANGUAGES";
const GET_IDENTITY_DOCUMENT_TYPES_LISTS = "GET_IDENTITY_DOCUMENT_TYPES_LISTS";

//authorization action types
const AUTHENTICATED = "AUTHENTICATED";
const NOT_AUTHENTICATED = "NOT_AUTHENTICATED";
const GET_QUESTIONNAIRE_DATA = "GET_QUESTIONNAIRE_DATA";
const UPDATE_USER = "UPDATE_USER";

//hr action types
const SELECTED_QUESTIONNAIRE_ADDED = "SELECTED_QUESTIONNAIRE_ADDED";
const SELECTED_QUESTIONNAIRE_NOT_ADDED = "SELECTED_QUESTIONNAIRE_NOT_ADDED";
const GET_ORGANIZATION_TEAMS = "GET_ORGANIZATION_TEAMS";
const GET_ORGANIZATION_USERS = "GET_ORGANIZATION_USERS";
const GET_FAILED_TO_REGISTER_CANDIDATES = "GET_FAILED_TO_REGISTER_CANDIDATES";
const GET_CANDIDATE_DETAILS_BY_ID = "GET_CANDIDATE_DETAILS_BY_ID";
const CLEAR_CANDIDATE_DETAILS_BY_ID = "CLEAR_CANDIDATE_DETAILS_BY_ID";
const CUSTOM_FIELD_BY_ORG_ID = "CUSTOM_FIELD_BY_ORG_ID";
const HR_ALL_PACKAGES = "HR_ALL_PACKAGES";
const GET_CUSTOM_PKGS = "GET_CUSTOM_PKGS";
const GET_QUESTIONNAIRES = "GET_QUESTIONNAIRES";
const GET_ALL_CHECKS = "GET_ALL_CHECKS";
const CLEAR_ALL_CHECKS = "CLEAR_ALL_CHECKS";
const GET_PACKAGE_DATA = "GET_PACKAGE_DATA";
const CLEAR_PACKAGE_DATA = "CLEAR_PACKAGE_DATA";
const GET_PROCESS_STATUS = "GET_PROCESS_STATUS";
const GET_RESULT_STATUS = "GET_RESULT_STATUS";
const ORG_PACKAGES = "ORG_PACKAGES";
const ORG_INDUSTRIES = "ORG_INDUSTRIES";
const GET_CHECKS_DATA_BASED_ON_COUNTRY = "GET_CHECKS_DATA_BASED_ON_COUNTRY";
const GET_SUBROLES = "GET_SUBROLES";
const GET_CANDIDATE_DETAILS_BY_ID_LOADING =
  "GET_CANDIDATE_DETAILS_BY_ID_LOADING";
const GET_HR_CANDIDATES = "GET_HR_CANDIDATES";
const SET_HR_CANDIDATES_FILTER = "SET_HR_CANDIDATES_FILTER";
const HR_DASHBOARD_STATISTICS = "HR_DASHBOARD_STATISTICS";
const ERRORS_WHEN_REMOVING_USER_FROM_ORG = "ERRORS_WHEN_REMOVING_USER_FROM_ORG";

//operations action types
const GET_VERIFICATION_PROCESS_STATUS = "GET_VERIFICATION_PROCESS_STATUS";
const GET_VERIFICATION_RESULT_STATUS = "GET_VERIFICATION_RESULT_STATUS";
const GET_OPS_CANDIDATES = "GET_OPS_CANDIDATES";
const OPS_CANDIDATES_BY_ORG_ID = "OPS_CANDIDATES_BY_ORG_ID";
const GET_OPS_BASIC_CANDIDATE_INFO = "GET_OPS_BASIC_CANDIDATE_INFO";
const GET_OPS_CANDIDATE_CASE_CHECKS = "GET_OPS_CANDIDATE_CASE_CHECKS";
const GET_OPS_USERS_BY_SUBROLE_IDS = "GET_OPS_USERS_BY_SUBROLE_IDS";
const GET_CHECK_INTERNAL_STATUS = "GET_CHECK_INTERNAL_STATUS";
const GET_SUB_CHECKS_LIST = "GET_SUB_CHECKS_LIST";
const GET_ORGS_LISTS_BY_OPS_USER_ID = "GET_ORGS_LISTS_BY_OPS_USER_ID";
const GET_ACTION_LOG_CATEGORIES = "GET_ACTION_LOG_CATEGORIES";
const GET_ACTION_LOG_SUB_CATEGORIES = "GET_ACTION_LOG_SUB_CATEGORIES";
const GET_ACTION_LOG_ADDITIONAL_CATEGORIES =
  "GET_ACTION_LOG_ADDITIONAL_CATEGORIES";
const GET_ACTION_LOG_CATEGORIES_INPUTS = "GET_ACTION_LOG_CATEGORIES_INPUTS";

const GET_ACTION_LOG_LISTS = "GET_ACTION_LOG_LISTS";
const GET_OPS_STATISTICS = "GET_OPS_STATISTICS";
const UPDATE_INTERNAL_CHECK_STATUS_IN_STORE =
  "UPDATE_INTERNAL_CHECK_STATUS_IN_STORE";
const UPDATE_CHECK_DATA_IN_STORE = "UPDATE_CHECK_DATA_IN_STORE";
const UPDATE_SUBCHECK_DATA_IN_STORE = "UPDATE_SUBCHECK_DATA_IN_STORE";
const UPDATE_CANDIDATES_DATA_FOR_ASSIGNEE_IN_STORE =
  "UPDATE_CANDIDATES_DATA_FOR_ASSIGNEE_IN_STORE";
const ADD_CHECK_AND_SUBCHECK = "ADD_CHECK_AND_SUBCHECK";
const ALLOW_ADD_CHECK_SUBCHECK = "ALLOW_ADD_CHECK_SUBCHECK";
const REMOVE_CHECK_AND_SUBCHECK = "REMOVE_CHECK_AND_SUBCHECK";
const HANDLE_CV_CHECK_ADDED_FILE = "HANDLE_CV_CHECK_ADDED_FILE";
const DISABLE_UPDATE_ADD_CHECK_BTN = "DISABLE_UPDATE_ADD_CHECK_BTN";
const GET_OPS_AUDIT_TRAIL_ACTIVITY = "GET_OPS_AUDIT_TRAIL_ACTIVITY";
const LOAD_ADD_CHECK_UPDATE_BTN = "LOAD_ADD_CHECK_UPDATE_BTN";
const LOAD_ALL_CHECKS_UPDATE_BTN = "LOAD_ALL_CHECKS_UPDATE_BTN";
const HIDE_OPS_CM_SECTION = "HIDE_OPS_CM_SECTION";
const GET_ALL_SUB_CHECKS_LIST = "GET_ALL_SUB_CHECKS_LIST";
const GET_OPS_USERS_BY_ORG = "GET_OPS_USERS_BY_ORG";
const SET_OPS_COMPONENT = "SET_OPS_COMPONENT";
const GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA =
  "GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA";
const UPDATE_SUB_CHECKS_LIST = "UPDATE_SUB_CHECKS_LIST";
const UPDATE_CHECK_SELECTED_STATE = "UPDATE_CHECK_SELECTED_STATE";
const UPDATE_SUBCHECK_SELECTED_STATE = "UPDATE_SUBCHECK_SELECTED_STATE";
const GET_OPS_SUBCHECK_LIST_TABLE_DATA = "GET_OPS_SUBCHECK_LIST_TABLE_DATA";

//system admin action types
const GET_ROLES = "GET_ROLES";
const GET_ORGS = "GET_ORGS";
const SELECTED_ORG = "SELECTED_ORG";
const GET_INTERNAL_USERS = "GET_INTERNAL_USERS";
const GET_CUSTOM_FIELD_CATEGORIES = "GET_CUSTOM_FIELD_CATEGOR";
const GET_CUSTOM_FIELD_TYPES = "GET_CUSTOM_FIELD_TYPES";
const GET_CUSTOM_EMAILS = "GET_CUSTOM_EMAILS";
const GET_CUSTOM_EMAIL_CATEGORIES = "GET_CUSTOM_EMAIL_CATEGORIES";
const GET_CONSENT_EMAILS = "GET_CONSENT_EMAILS";
const GET_ORG_MSG_METHOD_STATUS = "GET_ORG_MSG_METHOD_STATUS";
const GET_CHECK_COST_FOR_ALL_COUNTRIES = "GET_CHECK_COST_FOR_ALL_COUNTRIES";
const GET_ORG_RELATIONSHIP = "GET_ORG_RELATIONSHIP";
const GET_ADDITIONAL_EMAIL_SETTINGS_DATA = "GET_ADDITIONAL_EMAIL_SETTINGS_DATA";
const GET_EMAIL_PROVIDER_SETTING = "GET_EMAIL_PROVIDER_SETTING";
const GET_ADDITIONAL_CHECKS_SETTING_DATA = "GET_ADDITIONAL_CHECKS_SETTING_DATA";
const GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE =
  "GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE";
const GET_REMOVAL_PERMISSIONS_DATA = "GET_REMOVAL_PERMISSIONS_DATA";
const PERMISSION_TYPE_LOADING = "PERMISSION_TYPE_LOADING";
const GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA =
  "GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA";
const GET_COUNTRIES_DATA_AS_PER_ORG = "GET_COUNTRIES_DATA_AS_PER_ORG";
const GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS =
  "GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS";
const UPDATE_CHECK_PRICE_ACCORDION_LOADING =
  "UPDATE_CHECK_PRICE_ACCORDION_LOADING";

//organization action types
const GET_ORGANIZATIONS = "GET_ORGANIZATIONS";
const GET_ALL_INDUSTRIES = "GET_ALL_INDUSTRIES";

//helper action types
const GET_ALL_COUNTRIES = "GET_ALL_COUNTRIES";
const GET_QUERY_OPERATIONS_LISTS = "GET_QUERY_OPERATIONS_LISTS";
const GET_QUERY_OPERATION_RESULT_LISTS = "GET_QUERY_OPERATION_RESULT_LISTS";
const SET_SELECTED_QUERY_OPERATION = "SET_SELECTED_QUERY_OPERATION";

//others or common action types
const SET_TOAST_NOTIFICATION = "SET_TOAST_NOTIFICATION";
const HIDE_TOAST_NOTIFICATION = "HIDE_TOAST_NOTIFICATION";
const CLEAR_NOTIFICATION_STORE = "CLEAR_NOTIFICATION_STORE";
const CLEAR_STORE = "CLEAR_STORE";
const SET_MENU = "@customization/SET_MENU";
const MENU_TOGGLE = "@customization/MENU_TOGGLE";
const MENU_OPEN = "@customization/MENU_OPEN";

export {
  AUTHENTICATED,
  NOT_AUTHENTICATED,
  SELECTED_QUESTIONNAIRE_ADDED,
  SELECTED_QUESTIONNAIRE_NOT_ADDED,
  SET_TOAST_NOTIFICATION,
  HIDE_TOAST_NOTIFICATION,
  UPDATE_USER,
  GET_QUESTIONNAIRE_DATA,
  SET_MENU,
  MENU_TOGGLE,
  MENU_OPEN,
  GET_ORGANIZATION_TEAMS,
  GET_ORGANIZATION_USERS,
  GET_ORGANIZATIONS,
  GET_PROCESS_STATUS,
  GET_RESULT_STATUS,
  GET_CANDIDATE_DETAILS_BY_ID,
  CLEAR_CANDIDATE_DETAILS_BY_ID,
  CUSTOM_FIELD_BY_ORG_ID,
  CLEAR_STORE,
  GET_ROLES,
  GET_ORGS,
  SELECTED_ORG,
  GET_INTERNAL_USERS,
  GET_CUSTOM_FIELD_CATEGORIES,
  GET_CUSTOM_FIELD_TYPES,
  GET_CUSTOM_EMAIL_CATEGORIES,
  GET_CUSTOM_EMAILS,
  GET_CONSENT_EMAILS,
  ORG_PACKAGES,
  ORG_INDUSTRIES,
  CANDIDATE_DETAILS,
  LOADING,
  CANDIDATE_SECTION_LOADING,
  CANDIDATE_INITIAL_DETAILS,
  CANDIDATE_DISPLAY_API_ERROR,
  CANDIDATE_CLEAR_API_ERROR,
  HR_ALL_PACKAGES,
  GET_ALL_COUNTRIES,
  GET_CUSTOM_PKGS,
  GET_QUESTIONNAIRES,
  GET_ALL_CHECKS,
  GET_PACKAGE_DATA,
  CLEAR_PACKAGE_DATA,
  GET_ORG_MSG_METHOD_STATUS,
  GET_ALL_INDUSTRIES,
  GET_FAILED_TO_REGISTER_CANDIDATES,
  GET_CHECKS_DATA_BASED_ON_COUNTRY,
  GET_CHECK_COST_FOR_ALL_COUNTRIES,
  CANDIDATE_CACHED_DETAILS,
  PERSONAL_PARTICULAR,
  ADDRESS_DETAILS,
  FAMILY_DETAILS,
  EMPLOYMENT_HISTORY,
  EDUCATIONAL_QUALIFICATIONS,
  PROFESSIONAL_QUALIFICATIONS,
  PROFESSIONAL_REFERENCE,
  IDENTITY_DETAILS,
  DECLARATION,
  ADDITIONAL_INFORMATION,
  GET_VERIFICATION_PROCESS_STATUS,
  GET_VERIFICATION_RESULT_STATUS,
  GET_OPS_CANDIDATES,
  OPS_CANDIDATES_BY_ORG_ID,
  GET_SUBROLES,
  GET_OPS_BASIC_CANDIDATE_INFO,
  GET_OPS_CANDIDATE_CASE_CHECKS,
  GET_OPS_USERS_BY_SUBROLE_IDS,
  GET_CHECK_INTERNAL_STATUS,
  GET_SUB_CHECKS_LIST,
  GET_ORGS_LISTS_BY_OPS_USER_ID,
  GET_ACTION_LOG_CATEGORIES,
  GET_ACTION_LOG_SUB_CATEGORIES,
  GET_ACTION_LOG_LISTS,
  GET_OPS_STATISTICS,
  UPDATE_INTERNAL_CHECK_STATUS_IN_STORE,
  UPDATE_CHECK_DATA_IN_STORE,
  UPDATE_SUBCHECK_DATA_IN_STORE,
  UPDATE_CANDIDATES_DATA_FOR_ASSIGNEE_IN_STORE,
  ADD_CHECK_AND_SUBCHECK,
  REMOVE_CHECK_AND_SUBCHECK,
  CANDIDATE_SIDEBAR_STATE,
  HANDLE_CV_CHECK_ADDED_FILE,
  DISABLE_UPDATE_ADD_CHECK_BTN,
  GET_ORG_RELATIONSHIP,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
  GET_OPS_AUDIT_TRAIL_ACTIVITY,
  CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
  LOAD_ADD_CHECK_UPDATE_BTN,
  LOAD_ALL_CHECKS_UPDATE_BTN,
  HIDE_OPS_CM_SECTION,
  GET_CANDIDATE_DETAILS_BY_ID_LOADING,
  GET_ALL_SUB_CHECKS_LIST,
  GET_QUERY_OPERATIONS_LISTS,
  GET_QUERY_OPERATION_RESULT_LISTS,
  SET_SELECTED_QUERY_OPERATION,
  GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
  GET_ACTION_LOG_CATEGORIES_INPUTS,
  GET_ADDITIONAL_EMAIL_SETTINGS_DATA,
  GET_OPS_USERS_BY_ORG,
  GET_HR_CANDIDATES,
  SET_HR_CANDIDATES_FILTER,
  HR_DASHBOARD_STATISTICS,
  GET_EMAIL_PROVIDER_SETTING,
  SET_OPS_COMPONENT,
  CLEAR_NOTIFICATION_STORE,
  GET_CANDIDATE_EDUCATION_TYPES,
  GET_CANDIDATE_EMPLOYMENT_BONUS_TYPES,
  GET_CANDIDATE_EMPLOYMENT_CAREER_GAPS_TYPES,
  GET_CANDIDATE_EMPLOYMENT_REASON_OF_LEAVING_TYPES,
  GET_CANDIDATE_EMPLOYMENT_SALARY_FREQUENCY_TYPES,
  GET_CANDIDATE_EMPLOYMENT_TYPES,
  GET_CANDIDATE_PROFESSIONAL_RELATIONS_TYPES,
  GET_CANDIDATE_EDUCATION_QUALIFICATION_TYPES,
  GET_CANDIDATE_PROFESSIONAL_QUALIFICATION_TYPES,
  GET_CURRENCIES,
  GET_LANGUAGES,
  ERRORS_WHEN_REMOVING_USER_FROM_ORG,
  GET_ADDITIONAL_CHECKS_SETTING_DATA,
  CLEAR_ALL_CHECKS,
  GET_IDENTITY_DOCUMENT_TYPES_LISTS,
  GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA,
  GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
  GET_REMOVAL_PERMISSIONS_DATA,
  PERMISSION_TYPE_LOADING,
  GET_ALLOWED_RESEARCH_COUNTRIES_SETTING_DATA,
  GET_COUNTRIES_DATA_AS_PER_ORG,
  GET_CANDIDATE_REGISTRATION_FIELD_SETTINGS,
  UPDATE_CHECK_PRICE_ACCORDION_LOADING,
  UPDATE_SUB_CHECKS_LIST,
  UPDATE_CHECK_SELECTED_STATE,
  UPDATE_SUBCHECK_SELECTED_STATE,
  ALLOW_ADD_CHECK_SUBCHECK,
  GET_OPS_SUBCHECK_LIST_TABLE_DATA,
};
