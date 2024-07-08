import {
  AUTHENTICATED,
  CLEAR_STORE,
  GET_QUESTIONNAIRE_DATA,
  NOT_AUTHENTICATED,
} from "../actions/actionTypes";

const permissionsInitialState = {
  modulesPermissions: [],
  pagesPermissions: [],
  actionsPermissions: [],
};

const initialState = {
  authChecked: false,
  loggedIn: false,
  currentUser: null,
  permissions: permissionsInitialState,
  refreeQuestionnaireData: [],
  error: false,
};

export default function authorization(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        authChecked: true,
        loggedIn: true,
        currentUser: action.payload,
        permissions: action.permissions,
      };
    case NOT_AUTHENTICATED:
      return {
        authChecked: true,
        loggedIn: false,
        currentUser: null,
        permissions: permissionsInitialState,
        error: true,
      };
    case GET_QUESTIONNAIRE_DATA:
      return {
        ...state,
        refreeQuestionnaireData: action.payload,
      };
    case CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
