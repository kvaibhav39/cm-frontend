import { get, post } from "../../api/api";
import { errorUtils } from "../../utils/ErrorUtils";
import {
  getAllIndustriesUrl,
  getOrganizationCreateUrl,
  getOrganizationIndustriesLink,
  getOrganizationStatisticsUrl,
  getOrganizationsUrlLink,
} from "../../utils/UrlUtils";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";
import { ERROR } from "../constant";
import {
  GET_ORGANIZATIONS,
  GET_ALL_INDUSTRIES,
  CLEAR_STORE,
  HR_DASHBOARD_STATISTICS,
  LOADING,
} from "./actionTypes";
import { currentUser } from "./authorizationAction";
import { setToastNotification } from "./toastNotificationActions";

export const clearOrgStore = () => {
  return {
    type: CLEAR_STORE,
  };
};

//get - orgs
export const getOrganizations = (logDetails, params) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      const response = await get(getOrganizationsUrlLink(), params);
      dispatch({ type: GET_ORGANIZATIONS, payload: response?.data?.data });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      dispatch({ type: LOADING, payload: false });
    }
  };
};

//get - fetch all industries while creating organization
export const getAllIndustries = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getAllIndustriesUrl());
      dispatch({ type: GET_ALL_INDUSTRIES, payload: response?.data?.data });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//post - org
export const addOrganization = (
  credentials,
  navigate,
  runWhenError = () => {},
  logDetails
) => {
  return async (dispatch) => {
    try {
      let res = await post(getOrganizationCreateUrl(), credentials);

      //overwriting login token with new token coming from response
      let token = res?.headers["authorization"];

      let loginProfile = localStorage.getItem("loginProfile");
      let oldData = JSON.parse(localStorage.getItem(`${loginProfile}_login`));

      let newData = { ...oldData, token };

      localStorage.setItem(`${loginProfile}_login`, JSON.stringify(newData));

      //calling currentUser so that we can see the dashboard data when hr user logs in for the first time
      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "addOrganization"
      );

      dispatch(currentUser(innerLogDetails, navigate));
    } catch (error) {
      runWhenError(error);
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};

//get - org industries on packages section
export const getOrganizationIndustries = (
  params,
  setSelectedIndustries,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let res = await get(getOrganizationIndustriesLink(params));
      setSelectedIndustries(res.data.data?.industriesId);
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          `Some error occurred while loading industries!`,
          logDetails
        )
      );
    }
  };
};

//get - org graph statistics data on dashboard
export const getOrganizationStatistics = (data, param, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: HR_DASHBOARD_STATISTICS, payload: null });
      const response = await get(getOrganizationStatisticsUrl(param), data);
      dispatch({ type: HR_DASHBOARD_STATISTICS, payload: response.data.data });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    }
  };
};
