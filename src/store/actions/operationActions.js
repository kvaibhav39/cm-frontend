import { get, post, put } from "../../api/api";
import { errorUtils } from "../../utils/ErrorUtils";
import {
  addCheckSubCheckUrl,
  addNewChecksUrl,
  createNewHrAsOpsUrl,
  getActionLogAdditionalCategoriesUrl,
  getActionLogCategoriesInputsUrl,
  getActionLogCategoriesUrl,
  getActionLogSubCategoriesUrl,
  getActionLogUrl,
  getCandidateCaseAuditTrailActivityUrl,
  getCandidateCaseSubChecksUrl,
  getCheckInternalStatusUrl,
  getOPSCandidateCaseChecksUrl,
  getOPSUserBySubRoleIdsUrl,
  getOPSbasicCandidateInfoUrl,
  getOPScandidatesUrl,
  getOPSsubCheckListsUrl,
  getOPsCandidatesByOrgIdUrl,
  getOpsStatisticsUrl,
  getOpsUsersByOrgIdUrl,
  getOrgsListsByOpsUserIdUrl,
  getProcessStatusUrlLink,
  getResultStatusUrlLink,
  getSubmitOperationUrlLink,
  getVerificationProcessStatusUrl,
  getVerificationResultStatusUrl,
  getloginAsCandidateInOpsUrl,
  getloginAsHrInOpsUrl,
  getupdateVerifiedEducationUrl,
  getupdateVerifiedEmploymentUrl,
  getupdateVerifiedProfessionalUrl,
  submitActionLogUrl,
  updateAssigneeForCandidateUrl,
  updateChecksDataUrl,
  updateOrgsAssignedToOpsUserUrl,
  updateSubCheckDataUrl,
  updateVerifierUrl,
} from "../../utils/UrlUtils";
import { ERROR, SUCCESS, WARN } from "../constant";
import {
  AUTHENTICATED,
  CLEAR_STORE,
  GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
  GET_ACTION_LOG_CATEGORIES,
  GET_ACTION_LOG_CATEGORIES_INPUTS,
  GET_ACTION_LOG_LISTS,
  GET_ACTION_LOG_SUB_CATEGORIES,
  GET_ALL_SUB_CHECKS_LIST,
  GET_CHECK_INTERNAL_STATUS,
  GET_OPS_AUDIT_TRAIL_ACTIVITY,
  GET_OPS_BASIC_CANDIDATE_INFO,
  GET_OPS_CANDIDATES,
  GET_OPS_CANDIDATE_CASE_CHECKS,
  GET_OPS_STATISTICS,
  GET_OPS_USERS_BY_SUBROLE_IDS,
  GET_OPS_USERS_BY_ORG,
  GET_ORGS_LISTS_BY_OPS_USER_ID,
  GET_PROCESS_STATUS,
  GET_RESULT_STATUS,
  GET_VERIFICATION_PROCESS_STATUS,
  GET_VERIFICATION_RESULT_STATUS,
  LOADING,
  LOAD_ADD_CHECK_UPDATE_BTN,
  LOAD_ALL_CHECKS_UPDATE_BTN,
  OPS_CANDIDATES_BY_ORG_ID,
  REMOVE_CHECK_AND_SUBCHECK,
  UPDATE_CANDIDATES_DATA_FOR_ASSIGNEE_IN_STORE,
  UPDATE_CHECK_DATA_IN_STORE,
  UPDATE_INTERNAL_CHECK_STATUS_IN_STORE,
  UPDATE_SUBCHECK_DATA_IN_STORE,
  GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA,
  UPDATE_SUB_CHECKS_LIST,
  ALLOW_ADD_CHECK_SUBCHECK,
  GET_OPS_SUBCHECK_LIST_TABLE_DATA,
} from "./actionTypes";
import { setToastNotification } from "./toastNotificationActions";
import { setToken } from "./authorizationAction";
import { routeUserAsPerRole } from "../../components/Authentication/AuthForms/Utils/routeUserAsPerRole";
import { getOrganizations } from "./organizationAction";
import { store } from "../index";
import { getCandidateDetailsById } from "./hrActions";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

export const clearOperationStore = () => {
  return {
    type: CLEAR_STORE,
  };
};

//put - submit operation
export const submitOperation = (data, resetForm, logDetails) => {
  return async (dispatch) => {
    try {
      await put(getSubmitOperationUrlLink(), data);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Operation data submitted successfuly.",
          logDetails
        )
      );
      resetForm();
      window.location.reload(true);
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          "Operation data submission failed.",
          logDetails
        )
      );
    }
  };
};

//get - process status
export const getProcessStatus = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getProcessStatusUrlLink());
      dispatch({ type: GET_PROCESS_STATUS, payload: response?.data?.data });
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

//get - result status
export const getResultStatus = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getResultStatusUrlLink());
      dispatch({ type: GET_RESULT_STATUS, payload: response?.data?.data });
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

//get - candidates by org id for operations
export const OPsCandidatesByOrgId = (orgId, params = {}, logDetails) => {
  return async (dispatch) => {
    try {
      let res = await get(getOPsCandidatesByOrgIdUrl(orgId), params);
      dispatch({ type: OPS_CANDIDATES_BY_ORG_ID, payload: res?.data?.data });
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

//get - verification-process-status
export const getVerificationProcessStatus = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getVerificationProcessStatusUrl());
      dispatch({
        type: GET_VERIFICATION_PROCESS_STATUS,
        payload: response?.data?.data,
      });
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

//get - verification-result-status
export const getVerificationResultStatus = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getVerificationResultStatusUrl());
      dispatch({
        type: GET_VERIFICATION_RESULT_STATUS,
        payload: response?.data?.data,
      });
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

//get - get candidates lists
export const getOPScandidates = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(getOPScandidatesUrl(), params);
      dispatch({
        type: GET_OPS_CANDIDATES,
        payload: response?.data,
      });
    } catch (error) {
      dispatch({
        type: GET_OPS_CANDIDATES,
        payload: { data: [], totalCandidateCaseCount: 0 },
      });
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

//get - basic candidate info on case management
export const getBasicCandidateInfo = (params, navigate, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_OPS_BASIC_CANDIDATE_INFO,
        payload: null,
      });
      const response = await get(getOPSbasicCandidateInfoUrl(), params);
      dispatch({
        type: GET_OPS_BASIC_CANDIDATE_INFO,
        payload: response?.data?.data,
      });
      dispatch({
        type: GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA,
        payload: response?.data?.additionalData,
      });
    } catch (error) {
      navigate(-1);
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

//get - candidate case checks
export const getOPSCandidateCaseChecks = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_OPS_CANDIDATE_CASE_CHECKS,
        payload: null,
      });
      const response = await get(getOPSCandidateCaseChecksUrl(), params);
      dispatch({
        type: GET_OPS_CANDIDATE_CASE_CHECKS,
        payload: response?.data?.data,
      });

      //according to the checks, fetching their sub-checks
      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "getOPSCandidateCaseChecks"
      );

      dispatch(
        getCandidateCaseSubChecks(innerLogDetails, {
          candidateCaseId: params.candidateCaseId,
        })
      );
    } catch (error) {
      dispatch({
        type: GET_OPS_CANDIDATE_CASE_CHECKS,
        payload: [],
      });
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

//get - get ops user by subrole ids
export const getOPSUserBySubRoleIds = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(getOPSUserBySubRoleIdsUrl(), params);

      dispatch({
        type: GET_OPS_USERS_BY_SUBROLE_IDS,
        payload: response?.data?.data,
      });
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

//get - get check internal status dropdown values
export const getCheckInternalStatus = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getCheckInternalStatusUrl());
      dispatch({
        type: GET_CHECK_INTERNAL_STATUS,
        payload: response?.data?.data,
      });
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

//put - update case management checks data
export const updateCheckData = (
  payload,
  candidatesChecksMappingId,
  candidateCaseId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOAD_ALL_CHECKS_UPDATE_BTN,
        payload: { id: candidatesChecksMappingId, value: true },
      });
      const response = await put(
        updateChecksDataUrl(candidatesChecksMappingId),
        payload,
        { candidateCaseId }
      );
      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );

      setTimeout(() => {
        dispatch({
          type: UPDATE_INTERNAL_CHECK_STATUS_IN_STORE,
          payload: {
            candidatesChecksMappingId,
            verificationResultId: payload.verificationResultId,
            checkInternalStatusId: payload.checkInternalStatusId,
          },
        });
        dispatch({
          type: UPDATE_CHECK_DATA_IN_STORE,
          payload: { candidatesChecksMappingId, payload },
        });

        dispatch({
          type: LOAD_ALL_CHECKS_UPDATE_BTN,
          payload: { id: candidatesChecksMappingId, value: false },
        });
      }, 1);
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      dispatch({
        type: LOAD_ALL_CHECKS_UPDATE_BTN,
        payload: { id: candidatesChecksMappingId, value: false },
      });
    }
  };
};

//get - get sub checks data
export const getCandidateCaseSubChecks = (
  logDetails,
  params,
  setSubCheckSelected = () => {}
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      dispatch({
        type: GET_ACTION_LOG_CATEGORIES_INPUTS,
        payload: [],
      });
      const response = await get(getCandidateCaseSubChecksUrl(), params);

      dispatch({
        type: GET_ALL_SUB_CHECKS_LIST,
        payload: response?.data?.data,
      });

      setSubCheckSelected(response?.data?.data[0]?.id);

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

//get - orgs list by ops user id
export const getOrgsListsByOpsUserId = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_ORGS_LISTS_BY_OPS_USER_ID,
        payload: null,
      });
      const response = await get(getOrgsListsByOpsUserIdUrl(), params);
      dispatch({
        type: GET_ORGS_LISTS_BY_OPS_USER_ID,
        payload: response?.data?.data,
      });
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

//put - update orgs assigned to ops
export const updateOrgsAssignedToOpsUser = (payload, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await put(updateOrgsAssignedToOpsUserUrl(), payload);

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updateOrgsAssignedToOpsUser"
      );

      dispatch(
        getOrgsListsByOpsUserId(
          { opsUserId: payload?.opsUserId },
          innerLogDetails
        )
      );

      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
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

//get - action log categories
export const getActionLogCategories = (logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getActionLogCategoriesUrl());
      dispatch({
        type: GET_ACTION_LOG_CATEGORIES,
        payload: response?.data?.data,
      });
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

//get - action log sub-categories
export const getActionLogSubCategories = (id, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getActionLogSubCategoriesUrl(id));
      dispatch({
        type: GET_ACTION_LOG_SUB_CATEGORIES,
        payload: response?.data?.data,
      });
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

//get - action log additional-categories
export const getActionLogAdditionalCategories = (id, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getActionLogAdditionalCategoriesUrl(id));
      dispatch({
        type: GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
        payload: response?.data?.data,
      });
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

//get - action log categories inputs
export const getActionLogCategoriesInputs = (id, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getActionLogCategoriesInputsUrl(id));
      dispatch({
        type: GET_ACTION_LOG_CATEGORIES_INPUTS,
        payload: response?.data?.data,
      });
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

//put - update sub check data
export const updateSubCheckData = (
  payload,
  candidatesChecksMappingId,
  subCheckId,
  candidateCaseId,
  initializeDropdownValues,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await put(
        updateSubCheckDataUrl(candidatesChecksMappingId, subCheckId),
        payload,
        { candidateCaseId }
      );
      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
      dispatch({
        type: UPDATE_SUBCHECK_DATA_IN_STORE,
        payload: { subCheckId, payload },
      });
      dispatch({
        type: UPDATE_SUB_CHECKS_LIST,
        payload: { subCheckId, payload, whichReduxStateToUse: "subChecksList" },
      });
      dispatch(getCandidateCaseAuditTrailActivity(candidateCaseId));
    } catch (error) {
      initializeDropdownValues();
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

//put - update sub check data
export const updateVerifierData = (
  payload,
  candidatesChecksMappingId,
  subCheckId,
  candidateCaseId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await put(
        updateVerifierUrl(candidatesChecksMappingId, subCheckId),
        payload,
        { candidateCaseId }
      );
      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
      dispatch({
        type: UPDATE_SUB_CHECKS_LIST,
        payload: {
          subCheckId,
          payload,
          whichReduxStateToUse: "subChecksListForVerifierSection",
        },
      });
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

//post - action log
export const submitActionLog = (payload, candidateCaseId, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_ACTION_LOG_CATEGORIES_INPUTS,
        payload: null,
      });
      const res = await post(submitActionLogUrl(), payload, {
        candidateCaseId,
      });
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
      dispatch({
        type: GET_ACTION_LOG_CATEGORIES_INPUTS,
        payload: [],
      });

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "submitActionLog"
      );

      dispatch(
        getActionLog(payload?.subCheckId, candidateCaseId, innerLogDetails)
      );
    } catch (error) {
      dispatch({
        type: GET_ACTION_LOG_CATEGORIES_INPUTS,
        payload: [],
      });
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

//get - action log
export const getActionLog = (subCheckId, candidateCaseId, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ACTION_LOG_LISTS, payload: null });
      const res = await get(getActionLogUrl(subCheckId), {
        candidateCaseId,
      });
      dispatch({ type: GET_ACTION_LOG_LISTS, payload: res?.data?.data });
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

//put - update assignee for a candidate
export const updateAssigneeForCandidate = (
  payload,
  candidateCaseId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await put(updateAssigneeForCandidateUrl(), payload, {
        candidateCaseId,
      });

      dispatch({
        type: UPDATE_CANDIDATES_DATA_FOR_ASSIGNEE_IN_STORE,
        payload: { payload, candidatesCasesId: candidateCaseId },
      });

      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
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

//get - action log
export const getOpsStatistics = (logDetails) => {
  return async (dispatch) => {
    try {
      const res = await get(getOpsStatisticsUrl());
      dispatch({ type: GET_OPS_STATISTICS, payload: res?.data?.data });
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

//post - add check
export const addNewChecks = (payload, candidateCaseId, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await post(addNewChecksUrl(), payload, {
        candidateCaseId,
      });

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "addNewChecks"
      );

      dispatch(
        getOPSCandidateCaseChecks(
          {
            candidateCaseId,
          },
          innerLogDetails
        )
      );

      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
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

//post - add check & subcheck
export const addCheckSubCheck = (
  logDetails,
  payload,
  candidateCaseId,
  allChecksData,
  purpose = "callFromAddResearchCountryInChecks",
  sendEmailFlag = 2
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOAD_ADD_CHECK_UPDATE_BTN,
        payload: { value: true, purpose },
      });

      const res = await post(addCheckSubCheckUrl(), payload, {
        candidateCaseId,
        sendEmailFlag,
      });
      dispatch({
        type: REMOVE_CHECK_AND_SUBCHECK,
        payload: "all",
      });

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "addCheckSubCheck"
      );

      dispatch(
        getOPSCandidateCaseChecks(
          {
            candidateCaseId,
          },
          innerLogDetails
        )
      );

      let failedCheckNames = [];
      let successCheckNames = [];
      let reasonForFailure;

      res?.data?.data?.faildCheckAndSubCheckData?.forEach((curr) => {
        reasonForFailure = curr?.reason;
        failedCheckNames.push(
          allChecksData?.checks?.find(
            (check) => check.checksId === curr.checkId
          )?.checkName
        );
      });

      res?.data?.data?.successCheckAndSubCheckData?.forEach((curr) => {
        successCheckNames.push(
          allChecksData?.checks?.find(
            (check) => check.checksId === curr.checkId
          )?.checkName
        );
      });

      if (failedCheckNames?.length && successCheckNames?.length) {
        dispatch(
          setToastNotification(
            WARN,
            `Failed to create subchecks of checks - ${failedCheckNames.join(
              ", "
            )} (${reasonForFailure})\n Sucessfully created subchecks of checks - ${successCheckNames.join(
              ", "
            )}`,
            logDetails
          )
        );
      } else if (failedCheckNames?.length) {
        dispatch(
          setToastNotification(
            ERROR,
            `Failed to create subchecks of checks - ${failedCheckNames.join(
              ", "
            )} (${reasonForFailure})`,
            logDetails
          )
        );
      } else {
        dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
      }
      dispatch({
        type: LOAD_ADD_CHECK_UPDATE_BTN,
        payload: { value: false, purpose },
      });

      //updating assignedChecks key to display updated check scope description in checks modal

      let oldAssignedChecks =
        store.getState()?.operations?.OpsBasicCandidateInfoAdditionalData
          ?.assignedChecks;
      let newAssignedChecks = res?.data?.data?.successCheckAndSubCheckData;

      oldAssignedChecks?.forEach((oldCheck) => {
        let ifPresent = newAssignedChecks?.find(
          (newCheck) => newCheck?.checkId === oldCheck?.checkId
        );

        if (ifPresent) {
          oldCheck.checkScope = ifPresent?.checkScope;
          oldCheck.checkScopeDescription = ifPresent?.checkScopeDescription;
        }
      });

      dispatch({
        type: GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA,
        payload: {
          ...store.getState()?.operations?.OpsBasicCandidateInfoAdditionalData,
          assignedChecks: oldAssignedChecks,
        },
      });

      dispatch({
        type: REMOVE_CHECK_AND_SUBCHECK,
        payload: "all",
      });

      //making false so that in 'AddedSubCheckDetails' due to the useEffect ,
      //'ADD_CHECK_AND_SUBCHECK' doesnot get called which again sets the 'addedChecksAndSubCheck'
      dispatch({
        type: ALLOW_ADD_CHECK_SUBCHECK,
        payload: false,
      });
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      dispatch({
        type: LOAD_ADD_CHECK_UPDATE_BTN,
        payload: { value: false, purpose },
      });
    }
  };
};

//get - candidate cases audit trail activity
export const getCandidateCaseAuditTrailActivity = (
  candidateCaseId,
  logDetails
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_OPS_AUDIT_TRAIL_ACTIVITY, payload: null });
      const res = await get(getCandidateCaseAuditTrailActivityUrl(), {
        candidateCaseId,
      });
      dispatch({
        type: GET_OPS_AUDIT_TRAIL_ACTIVITY,
        payload: res?.data?.data,
      });
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

//post - login as candidate
export const loginAsCandidateInOps = (payload, navigate, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await post(getloginAsCandidateInOpsUrl(), payload);

      setToken(
        res?.headers["authorization"],
        JSON.stringify(res?.data?.data),
        "second"
      );

      dispatch({ type: AUTHENTICATED, payload: res?.data?.data });
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
      routeUserAsPerRole(res?.data?.data, navigate);

      window.location.reload();
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

//put - update verified
export const updateVerifiedSectionDetails = (
  payload,
  candidateCaseId,
  sectionDetailsFieldName,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let apiUrl;

      if (sectionDetailsFieldName === "EDUCATIONAL_QUALIFICATIONS") {
        apiUrl = getupdateVerifiedEducationUrl();
      } else if (sectionDetailsFieldName === "EMPLOYMENT_HISTORY") {
        apiUrl = getupdateVerifiedEmploymentUrl();
      } else if (sectionDetailsFieldName === "PROFESSIONAL_QUALIFICATIONS") {
        apiUrl = getupdateVerifiedProfessionalUrl();
      }

      let response = await put(apiUrl, payload, {
        candidateCaseId,
      });

      dispatch(
        getCandidateDetailsById({
          candidateCaseId,
          logDetails,
        })
      );

      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
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

//get - ops users by org id
export const getOpsUsersByOrgId = (hrOrganizationId, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await get(getOpsUsersByOrgIdUrl(), { hrOrganizationId });
      dispatch({ type: GET_OPS_USERS_BY_ORG, payload: res?.data?.data });
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

//post - create new hr as ops
export const createNewHrAsOps = (
  payload,
  runCustom,
  handleClose,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await post(createNewHrAsOpsUrl(), payload);

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "createNewHrAsOps"
      );

      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
      dispatch(getOrganizations(innerLogDetails, { isVendor: 1 }));
      handleClose();
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      runCustom();
    }
  };
};

//post - login as hr
export const loginAsHrInOps = (payload, navigate, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await post(getloginAsHrInOpsUrl(), payload);

      setToken(
        res?.headers["authorization"],
        JSON.stringify(res?.data?.data),
        "second"
      );

      dispatch({ type: AUTHENTICATED, payload: res?.data?.data });
      dispatch(setToastNotification(SUCCESS, res?.data?.message, logDetails));
      routeUserAsPerRole(res?.data?.data, navigate);

      window.location.reload();
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

//get - ops sub check lists
export const getOPSsubCheckLists = (params,logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(getOPSsubCheckListsUrl(), params);
      dispatch({
        type: GET_OPS_SUBCHECK_LIST_TABLE_DATA,
        payload: response?.data,
      });
    } catch (error) {
      dispatch({
        type: GET_OPS_SUBCHECK_LIST_TABLE_DATA,
        payload: { data: [], totalCandidateCaseCount: 0 },
      });
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
