import { rangeSelectors } from "../../components/constants/filterData";
import {
  SELECTED_QUESTIONNAIRE_NOT_ADDED,
  SELECTED_QUESTIONNAIRE_ADDED,
  GET_ORGANIZATION_TEAMS,
  GET_CANDIDATE_DETAILS_BY_ID,
  CLEAR_CANDIDATE_DETAILS_BY_ID,
  GET_ORGANIZATION_USERS,
  CUSTOM_FIELD_BY_ORG_ID,
  CLEAR_STORE,
  ORG_PACKAGES,
  ORG_INDUSTRIES,
  GET_FAILED_TO_REGISTER_CANDIDATES,
  HR_ALL_PACKAGES,
  GET_CUSTOM_PKGS,
  GET_QUESTIONNAIRES,
  GET_ALL_CHECKS,
  GET_PACKAGE_DATA,
  CLEAR_PACKAGE_DATA,
  LOADING,
  GET_SUBROLES,
  GET_CANDIDATE_DETAILS_BY_ID_LOADING,
  GET_HR_CANDIDATES,
  SET_HR_CANDIDATES_FILTER,
  ERRORS_WHEN_REMOVING_USER_FROM_ORG,
  CLEAR_ALL_CHECKS,
} from "../actions/actionTypes";

const initialState = {
  loading: true,
  selectedQuotionnaire: {},
  organizationTeams: [],
  candidateDetailsById: null,
  candidateDetailsByIdLoading: false,
  organizationUsers: [],
  customFieldByOrgId: [],
  orgPackagesLists: null,
  orgIndustriesLists: [],
  failedToRegisterCandidatesLists: [],
  allPackages: [],
  allCustomPackages: null,
  allQuestionnaires: null,
  allChecksData: null,
  fetchedPackageData: {
    packageName: "",
    packageDescription: "",
    checks: [],
  },
  subRolesLists: null,
  candidatesLists: null,
  totalCandidateCaseCount: null,
  HrCandidatesFilter: {
    hrTeamId: "All",
    pageNumber: 1,
    rangeValue: rangeSelectors[0],
    ...rangeSelectors[0]?.dates,
  },
  errorsDataWhenRemovingUserFromOrg: null,
};

export default function hrFunctions(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SELECTED_QUESTIONNAIRE_ADDED:
      return {
        ...state,
        selectedQuotionnaire: action.payload,
      };
    case SELECTED_QUESTIONNAIRE_NOT_ADDED:
      return {
        ...state,
        selectedQuotionnaire: {},
      };
    case GET_ORGANIZATION_TEAMS:
      return {
        ...state,
        organizationTeams: action.payload,
      };
    case GET_ORGANIZATION_USERS:
      return {
        ...state,
        organizationUsers: action.payload,
      };
    case GET_CANDIDATE_DETAILS_BY_ID:
      return {
        ...state,
        candidateDetailsById: action.payload,
      };
    case CLEAR_CANDIDATE_DETAILS_BY_ID:
      return {
        ...state,
        candidateDetailsById: null,
      };    
    case CUSTOM_FIELD_BY_ORG_ID:
      return {
        ...state,
        customFieldByOrgId: action.payload,
      };
    case ORG_PACKAGES:
      return {
        ...state,
        orgPackagesLists: action.payload,
      };
    case ORG_INDUSTRIES:
      return {
        ...state,
        orgIndustriesLists: action.payload,
      };
    case GET_FAILED_TO_REGISTER_CANDIDATES:
      return {
        ...state,
        failedToRegisterCandidatesLists: action.payload,
      };
    case HR_ALL_PACKAGES:
      return {
        ...state,
        allPackages: action.payload,
      };
    case GET_CUSTOM_PKGS:
      return {
        ...state,
        allCustomPackages: action.payload,
      };
    case GET_QUESTIONNAIRES:
      return {
        ...state,
        allQuestionnaires: action.payload,
      };
    case CLEAR_ALL_CHECKS:
      return {
        ...state,
        allChecksData: null,
      };
    case GET_ALL_CHECKS:
      let modifiedPayload = {
        ...action.payload,
        checks: action.payload.checks.map((check) => {
          return {
            ...check,
            checkEnabled: false,
          };
        }),
      };
      return {
        ...state,
        allChecksData: modifiedPayload,
      };
    case GET_PACKAGE_DATA:
      return {
        ...state,
        fetchedPackageData: action.payload,
      };
    case CLEAR_PACKAGE_DATA:
      return {
        ...state,
        fetchedPackageData: {
          packageName: "",
          packageDescription: "",
          checks: [],
        },
      };
    case GET_SUBROLES:
      return {
        ...state,
        subRolesLists: action.payload,
      };
    case CLEAR_STORE:
      return { ...initialState };
    case GET_CANDIDATE_DETAILS_BY_ID_LOADING:
      return {
        ...state,
        candidateDetailsByIdLoading: action.payload,
      };
    case GET_HR_CANDIDATES:
      let { data, totalCandidateCaseCount } = action.payload;
      return {
        ...state,
        candidatesLists: data,
        totalCandidateCaseCount: totalCandidateCaseCount,
      };
    case SET_HR_CANDIDATES_FILTER:
      return {
        ...state,
        HrCandidatesFilter: action.payload,
      };
    case ERRORS_WHEN_REMOVING_USER_FROM_ORG:
      return {
        ...state,
        errorsDataWhenRemovingUserFromOrg: action.payload,
      };
    default:
      return state;
  }
}
