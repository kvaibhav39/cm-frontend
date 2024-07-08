import { combineReducers } from "redux";

// reducer import
import authorizationReducer from "./reducers/authorizationReducer";
import customizationReducer from "./reducers/customizationReducer";
import hrReducer from "./reducers/hrReducer";
import operationReducer from "./reducers/operationReducer";
import organizationsReducer from "./reducers/organizationReducer";
import systemAdminReducer from "./reducers/systemAdminReducer";
import toastNotificationReducer from "./reducers/toastNotificationReducer";
import candidateReducer from "./reducers/candidateReducer";
import helperReducer from "./reducers/helperReducer";
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  authorization: authorizationReducer,
  hr: hrReducer,
  toastNotification: toastNotificationReducer,
  organizations: organizationsReducer,
  operations: operationReducer,
  systemAdmin:systemAdminReducer,
  candidate:candidateReducer,
  helper:helperReducer
});

export default reducer;
