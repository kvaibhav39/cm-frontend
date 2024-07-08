import { get, post, put } from "../../api/api";
import { errorUtils } from "../../utils/ErrorUtils";
import {
  getCheckTokenValidationUrl,
  getChooseOtpMethodUrl,
  getCurrentUserUrl,
  getForgotPasswordUrl,
  getLoginUrl,
  getRefreeQuestionnaireUrl,
  getRegisterUrl,
  getResetPasswordUrl,
  getUserPermissionsUrl,
  getUsersUrl,
  getVerifyOtpUrl,
} from "../../utils/UrlUtils";
import { ERROR, SUCCESS } from "../constant";
import {
  AUTHENTICATED,
  CLEAR_STORE,
  GET_QUESTIONNAIRE_DATA,
  NOT_AUTHENTICATED,
  UPDATE_USER,
} from "./actionTypes";
import { setToastNotification } from "./toastNotificationActions";
import { getExtractPathWithParams } from "../../utils/getExtractedPathWithParams";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

export const setToken = (token, CheckMinistryUser, loginProfile = "first") => {
  let obj = {
    token,
    CheckMinistryUser,
    lastLoginTime: new Date(Date.now()).getTime(),
  };

  if (loginProfile === "second") {
    let url = getExtractPathWithParams();

    if (url) {
      localStorage.setItem("switchBackUrl", JSON.stringify(url));
    } else {
      throw new Error(
        "Invalid path name for switch back account, please try again"
      );
    }
  } else {
    // deleting second login details when first login occurs
    localStorage.removeItem("second_login");
    localStorage.removeItem("switchBackUrl");
  }

  localStorage.setItem(`${loginProfile}_login`, JSON.stringify(obj));
  localStorage.setItem("loginProfile", loginProfile);
};

export const clearAuthorizationStore = () => {
  return {
    type: CLEAR_STORE,
  };
};

export const deleteToken = () => {
  let currentLoginProfile = localStorage.getItem("loginProfile");

  if (currentLoginProfile === "first") {
    localStorage.removeItem("first_login");
    localStorage.removeItem("second_login");
    localStorage.removeItem("loginProfile");
  } else if (currentLoginProfile === "second") {
    localStorage.removeItem("second_login");
    localStorage.setItem("loginProfile", "first");
  }

  localStorage.removeItem("switchBackUrl");
  localStorage.removeItem("OpsCandidateFilterUrl");
};

//post - register user
export const registerUser = (
  credentials,
  runWhenSuccess,
  runWhenError,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let res = await post(getRegisterUrl(), credentials);
      dispatch({ type: AUTHENTICATED, payload: res.data });
      runWhenSuccess();
    } catch (error) {
      runWhenError(error);
      dispatch({ type: NOT_AUTHENTICATED });
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

//post - login user
export const loginUser = (
  credentials,
  runWhenSuccess,
  runWhenError,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let res = await post(getLoginUrl(), credentials);
      if (
        !res?.data?.data?.selectOrg &&
        !res?.data?.data?.hrOrganizations &&
        !res?.data?.data?.token
      ) {
        setToken(
          res?.headers["authorization"],
          JSON.stringify(res?.data?.data),
          "first"
        );

        dispatch({ type: AUTHENTICATED, payload: res?.data?.data });
      }
      runWhenSuccess(res?.data?.data);
    } catch (error) {
      deleteToken();
      dispatch({ type: NOT_AUTHENTICATED });
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      runWhenError(errorUtils.getError(error));
    }
  };
};

export const chooseOtpMethod = (
  data,
  runWhenSuccess,
  runWhenError,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let res = await post(getChooseOtpMethodUrl(), data);
      dispatch(
        setToastNotification(SUCCESS, "OTP sent again successfully", logDetails)
      );
      runWhenSuccess(res?.data?.data);
    } catch (error) {
      deleteToken();
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      runWhenError(errorUtils.getError(error));
    }
  };
};

export const verifyOtp = (data, runWhenSuccess, runWhenError, logDetails) => {
  return async (dispatch) => {
    try {
      let res = await post(getVerifyOtpUrl(), data);

      setToken(
        res?.headers["authorization"],
        JSON.stringify(res?.data?.data),
        "first"
      );

      dispatch({ type: AUTHENTICATED, payload: res?.data?.data });
      runWhenSuccess(res?.data?.data);
    } catch (error) {
      deleteToken();
      dispatch({ type: NOT_AUTHENTICATED });
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      runWhenError(errorUtils.getError(error));
    }
  };
};

export const resetUserPassword = (
  credentials,
  runWhenSuccess,
  runWhenError,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let payload = {
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
      };

      let res = await put(getResetPasswordUrl(), payload, {
        token: credentials.token,
      });

      if (!res?.data?.data?.selectOrg) {
        setToken(
          res?.headers["authorization"],
          JSON.stringify(res?.data?.data),
          "first"
        );
      }
      dispatch({ type: AUTHENTICATED, payload: res.data });
      runWhenSuccess(res?.data?.data);
    } catch (error) {
      deleteToken();
      dispatch({ type: NOT_AUTHENTICATED });
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      runWhenError(errorUtils.getError(error));
    }
  };
};

//get - refree questionnaire
export const getRefreeQuestionnaireData = (
  token,
  setErrMsg = () => {},
  logDetails = ""
) => {
  return async (dispatch) => {
    try {
      let res = await get(getRefreeQuestionnaireUrl(token));
      dispatch({ type: GET_QUESTIONNAIRE_DATA, payload: res?.data?.data });
    } catch (error) {
      setErrMsg("errMsg");

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

//put - refree questionnaire
export const submitRefreeQuestionnaireData = (data, token, logDetails) => {
  return async (dispatch) => {
    try {
      await put(getRefreeQuestionnaireUrl(token), data);
      dispatch(getRefreeQuestionnaireData(token));
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

//get - get current user & user permissions
export const currentUser = (logDetails = "", navigate = "") => {
  return async (dispatch) => {
    try {
      let resCurrentUser = await get(getCurrentUserUrl());
      let resUserPerms = await get(getUserPermissionsUrl());

      const currentLoginProfile = localStorage.getItem("loginProfile");

      let previousLoginDetails = JSON.parse(
        localStorage.getItem(`${currentLoginProfile}_login`)
      );

      localStorage.setItem(
        `${currentLoginProfile}_login`,
        JSON.stringify({
          ...previousLoginDetails,
          CheckMinistryUser: JSON.stringify(resCurrentUser?.data?.data),
        })
      );

      dispatch({
        type: AUTHENTICATED,
        payload: resCurrentUser?.data?.data,
        permissions: resUserPerms?.data?.data,
      });
      if (navigate) {
        navigate("/hr/dashboard");
      }
    } catch (error) {
      dispatch({ type: NOT_AUTHENTICATED });
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

//put - update user
export const updateUser = (
  data,
  runWhenSuccess = () => {},
  runWhenError = () => {},
  logDetails
) => {
  return async (dispatch) => {
    try {
      let res = await put(getUsersUrl(), data);
      dispatch({ type: UPDATE_USER, payload: res.data.data });

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updateUser"
      );

      dispatch(currentUser(innerLogDetails));
      runWhenSuccess();
    } catch (error) {
      runWhenError(error);
      dispatch({ type: NOT_AUTHENTICATED });
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

//post - forgot pw
export const forgotPassword = (data, runWhenSuccess, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await post(getForgotPasswordUrl(), data);
      runWhenSuccess();
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

//get - token validation
export const checkTokenValidation = (token, navigate, logDetails) => {
  return async (dispatch) => {
    try {
      await get(getCheckTokenValidationUrl(), {}, token);
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          "Link or token got expired , please generate new link.",
          logDetails
        )
      );
      navigate("/forgot-password");
      return errorUtils.getError(error);
    }
  };
};
