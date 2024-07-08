import { get, post } from "../../api/api";
import { errorUtils } from "../../utils/ErrorUtils";
import {
  getAllCountriesUrl,
  getPriceAndCurrency,
  getQueryOperationsUrl,
  hostPath,
  uploadLogsUrl,
} from "../../utils/UrlUtils";
import { ERROR } from "../constant";
import {
  GET_ALL_COUNTRIES,
  GET_CHECKS_DATA_BASED_ON_COUNTRY,
  GET_COUNTRIES_DATA_AS_PER_ORG,
  GET_QUERY_OPERATIONS_LISTS,
  GET_QUERY_OPERATION_RESULT_LISTS,
  LOADING,
} from "./actionTypes";
import { setToastNotification } from "./toastNotificationActions";
import { serialize } from "object-to-formdata";

//get - all countries
export const getAllCountries = (
  logDetails,
  params = undefined,
  getDataAsPerOrg = false
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_COUNTRIES_DATA_AS_PER_ORG, payload: null });

      const response = await get(getAllCountriesUrl(), params);

      //for Default Research countries setting section in system admin
      if (getDataAsPerOrg) {
        dispatch({
          type: GET_COUNTRIES_DATA_AS_PER_ORG,
          payload: response.data.data,
        });
      } else {
        dispatch({ type: GET_ALL_COUNTRIES, payload: response.data.data });
      }
    } catch (error) {
      dispatch({ type: GET_COUNTRIES_DATA_AS_PER_ORG, payload: [] });
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      throw errorUtils.getError(error);
    }
  };
};

//get - selected country data
export const getCountryBasedResponse = (id, setCountrySelect, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getPriceAndCurrency(id));
      dispatch({
        type: GET_CHECKS_DATA_BASED_ON_COUNTRY,
        payload: response.data.data,
      });
      setCountrySelect((prev) => (prev = response.data.data));
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

//upload file
export const uploadFileUtils = (
  logDetails,
  data,
  config = {},
  runWhenSuccess = () => {},
  query = {}
) => {
  return async (dispatch) => {
    try {
      const formData = serialize(data, { noFilesWithArrayNotation: true });
      let res = await post(
        `${hostPath}/upload-file${config.multiple ? "-multiple3" : ""}${
          config.category ? `/${config.category}` : ""
        }`,
        formData,
        query
      );

      if (res?.data?.errorMsg) {
        dispatch(setToastNotification(ERROR, res?.data?.errorMsg, logDetails));
        return undefined;
      }

      runWhenSuccess(res?.data?.data[0]);

      return res?.data?.data;
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      return undefined;
    }
  };
};

//get query operations lists
export const getQueryOperations = (logDetails, params) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      const response = await get(getQueryOperationsUrl(), params);

      if (params) {
        dispatch({
          type: GET_QUERY_OPERATION_RESULT_LISTS,
          payload: response.data.data,
        });
      } else {
        dispatch({
          type: GET_QUERY_OPERATIONS_LISTS,
          payload: response.data.data,
        });
      }

      dispatch({ type: LOADING, payload: false });
    } catch (error) {
      dispatch({ type: LOADING, payload: false });

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

//send success/error logs
export const uploadLogs = (payload) => {
  return async (dispatch) => {
    try {
      post(uploadLogsUrl(), payload);
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error"
        )
      );
    }
  };
};
