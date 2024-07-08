import { store } from "../index";
import { get, post, put, deleteMethod } from "../../api/api";
import { routeUserAsPerRole } from "../../components/Authentication/AuthForms/Utils/routeUserAsPerRole";
import permissionKey from "../../components/constants/permissionKey";
import { checkActionPermission } from "../../utils/CheckPageAccess";
import { errorUtils } from "../../utils/ErrorUtils";
import {
  getAddMultipleCandidatesUrl,
  getAddCandidateInOrgTeamUrl,
  getAddTeamsUserUrl,
  getAllChecksUrl,
  getAllPackagesUrl,
  getAllQuestionnairesUrl,
  getCandidateServicesUrl,
  getChangePermissionsOrgUserUrl,
  getCompanBrandingUrl,
  getCustomFieldByOrgIdUrl,
  getCustomPackageUrl,
  getDeleteFailedCandidateDataUrl,
  getFailedToRegisterCandidatesUrl,
  getDeleteOrganizationTeamsUrl,
  getEditOrganizationUsersUrl,
  getEditTeamsUserUrl,
  getHrCandidatesByOrgIdUrl,
  getOrganizationQuestionnairesUpdateUrl,
  getOrganizationTeamsUrl,
  getOrganizationUsersUrl,
  getOrgIndustriesUrl,
  getPackageUrl,
  getSearchUsersUrl,
  getSubroles,
  getTerminateStatusOfCandidateUrl,
  getUserNotifications,
  getUpdateUserProfileActionUrl,
  getAddCandidateInOrgTeamUrlByOps,
  getAddMultipleCandidatesUrlByOps,
  getRemoveUserFromOrganizationUrl,
  getloginAsCandidateInVendorUrl,
} from "../../utils/UrlUtils";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import {
  SELECTED_QUESTIONNAIRE_NOT_ADDED,
  SELECTED_QUESTIONNAIRE_ADDED,
  GET_ORGANIZATION_TEAMS,
  GET_ORGANIZATION_USERS,
  GET_CANDIDATE_DETAILS_BY_ID,
  CLEAR_CANDIDATE_DETAILS_BY_ID,
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
  LOADING,
  GET_SUBROLES,
  GET_CANDIDATE_DETAILS_BY_ID_LOADING,
  GET_HR_CANDIDATES,
  ERRORS_WHEN_REMOVING_USER_FROM_ORG,
  AUTHENTICATED,
} from "../actions/actionTypes";
import { ERROR, SUCCESS, WARN } from "../constant";
import { currentUser, setToken } from "./authorizationAction";
import { initialCandidateDetails } from "./candidateAction";
import { setToastNotification } from "./toastNotificationActions";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

export const clearHrStore = () => {
  return {
    type: CLEAR_STORE,
  };
};

// simple action - add selected questionnaire
export const selectQuestionnaire = (data, logDetails) => {
  return (dispatch) => {
    if (data) {
      dispatch({ type: SELECTED_QUESTIONNAIRE_ADDED, payload: data });
    } else {
      dispatch({ type: SELECTED_QUESTIONNAIRE_NOT_ADDED });
      dispatch(setToastNotification(ERROR, "Something went wrong", logDetails));
    }
  };
};

//get - org teams
export const getOrganizationTeams = (params, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getOrganizationTeamsUrl(params), params);
      dispatch({ type: GET_ORGANIZATION_TEAMS, payload: response?.data?.data });
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

//get - org users
export const getOrganizationUsers = (params, logDetails) => {
  return async (dispatch) => {
    try {
      let permission = checkActionPermission(
        permissionKey.hrSettingsManageGetOrgUsers,
        store.getState()?.authorization?.permissions
      );

      if (permission) {
        const response = await get(getOrganizationUsersUrl(params));
        dispatch({
          type: GET_ORGANIZATION_USERS,
          payload: response?.data?.data,
        });
      }
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

//put - change user permission
export const changePermissionOrgUser = (
  params,
  body,
  handleClose,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await put(getChangePermissionsOrgUserUrl(params), body);
      dispatch(
        setToastNotification(SUCCESS, response.data.message, logDetails)
      );

      dispatch(getOrganizationUsers(params, logDetails));
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    } finally {
      handleClose();
    }
  };
};

//get - candidate details by id
export const getCandidateDetailsById = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_CANDIDATE_DETAILS_BY_ID_LOADING,
        payload: true,
      });

      const response = await get(getCandidateServicesUrl("details"), params);
      dispatch({
        type: GET_CANDIDATE_DETAILS_BY_ID,
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
    } finally {
      dispatch({
        type: GET_CANDIDATE_DETAILS_BY_ID_LOADING,
        payload: false,
      });
    }
  };
};

//simple action - clear candidate details
export const clearCandidateDetailsById = () => {
  return {
    type: CLEAR_CANDIDATE_DETAILS_BY_ID,
  };
};

//get - custom fields when registering a user by org id
export const getCustomFieldByOrgId = (queryObj, params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(getCustomFieldByOrgIdUrl(params), queryObj);
      dispatch({
        type: CUSTOM_FIELD_BY_ORG_ID,
        payload: response?.data?.data || [],
      });
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

//put - terminate status of candidate
export const terminateStatusOfCandidate = (
  params,
  body,
  onFetchCandidates,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await put(
        getTerminateStatusOfCandidateUrl(params.orgId, params.candidateCaseId),
        body
      );
      onFetchCandidates();
      dispatch(
        setToastNotification(
          SUCCESS,
          "Status terminated successfully!",
          logDetails
        )
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

//get - org pkgs
export const getOrganizationPackages = (params, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getCustomPackageUrl(params));
      dispatch({
        type: ORG_PACKAGES,
        payload: response?.data?.data || [],
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

//get - industries in org
export const getOrgIndustries = (params, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await get(getOrgIndustriesUrl(params));

      dispatch({
        type: ORG_INDUSTRIES,
        payload: res?.data?.data || [],
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

//get - search users
export const searchUsers = (data, currentUsers, callback, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getSearchUsersUrl(), data);

      let filteredUsers = response?.data?.data?.filter(
        (elem) =>
          !currentUsers?.find(
            ({ loginEmail }) => elem?.loginEmail == loginEmail
          )
      );

      callback(filteredUsers);
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

//get - candidates by org id
export const hrCandidatesByOrgId = (orgId, params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      let res = await get(getHrCandidatesByOrgIdUrl(orgId), params);
      dispatch({ type: GET_HR_CANDIDATES, payload: res.data });
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

//get - company branding details
export const getCompanyBranding = (
  params,
  setCompanyData,
  runWhenSuccess = () => {},
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await get(getCompanBrandingUrl(params));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "getCompanyBranding"
      );

      dispatch(currentUser(innerLogDetails));

      setCompanyData(response.data.data);
      runWhenSuccess(response.data.data);
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

//put - company branding details
export const updateCompanyBranding = (
  params,
  orgId,
  updateCompanyState,
  runWhenError = () => {},
  logDetails
) => {
  return async (dispatch) => {
    try {
      await put(getCompanBrandingUrl({ orgId }), params);
      updateCompanyState();
      dispatch(setToastNotification(SUCCESS, "Settings saved!", logDetails));
    } catch (error) {
      runWhenError(error);
      dispatch(
        setToastNotification(
          ERROR,
          "Error while updating settings!",
          logDetails
        )
      );
    }
  };
};

////----hr create candidate----/////

//get - fetches custom packages on create candidate
export const getCustomPackages = (param, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(getCustomPackageUrl(param));
      dispatch({ type: GET_CUSTOM_PKGS, payload: response.data.data });
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

//post - create candidate
export const addCandidateInOrgTeam = (
  data,
  params,
  roleId,
  navigate,
  run,
  logDetails
) => {
  return async (dispatch) => {
    try {
      let url =
        roleId === 4
          ? getAddCandidateInOrgTeamUrlByOps(params)
          : getAddCandidateInOrgTeamUrl(params);

      await post(url, data);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Candidate added successfully",
          logDetails
        )
      );
      navigate();
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      run();
    }
  };
};

///----hr users modal in hr settings under permissions----///

//get - fetch subroles
export const getSubrolesOfRole = (
  logDetails,
  params,
  setRoles = () => {},
  excludeOPsAdminRole = false
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(
        getSubroles(params),
        params.roleId === 2 ? { allowVendor: 1 } : {}
      );

      let subRoles = [];
      response.data.data?.forEach(({ subRoleName, usersSubRolesId }) => {
        subRoles.push({
          id: usersSubRolesId,
          title: subRoleName,
        });
      });

      if (excludeOPsAdminRole) {
        //allowing only OPS manager & OPS analyst
        subRoles = subRoles.filter((curr) => curr.id === 7 || curr.id === 9);
      }

      setRoles(subRoles);
      dispatch({ type: GET_SUBROLES, payload: subRoles });
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, `Could not fetch roles!`, logDetails)
      );
    } finally {
      dispatch({ type: LOADING, payload: false });
    }
  };
};

//post - add users to org
export const getAddCompanyUsers = (
  params,
  body,
  handleClose,
  updateCompanyDetails,
  logDetails
) => {
  return async (dispatch) => {
    try {
      delete params.orgId;
      await post(getOrganizationUsersUrl(params), body, params);
      dispatch(
        setToastNotification(SUCCESS, `User added to organization!`, logDetails)
      );

      updateCompanyDetails();
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      handleClose();
    }
  };
};

//post - add users to team -------change in name
export const getAddTeamsUser = (params, body, handleClose, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await post(getAddTeamsUserUrl(params), body);

      if (response.data.data?.userIsNotAllowedInTeams) {
        dispatch(
          setToastNotification(
            WARN,
            `User is not added in ${response.data.data?.userIsNotAllowedInTeams}`,
            logDetails
          )
        );
      } else {
        dispatch(
          setToastNotification(SUCCESS, `User added to team!`, logDetails)
        );
      }

      dispatch(getOrganizationTeams({ orgId: params.orgId }, logDetails));
      dispatch(getOrganizationUsers({ orgId: params.orgId }, logDetails));
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      handleClose();
    }
  };
};

//put - company users role
export const EditCompanyUsers = (
  params,
  body,
  handleClose,
  updateCompanyDetails,
  logDetails
) => {
  return async (dispatch) => {
    try {
      await put(getEditOrganizationUsersUrl(params), body, params);
      dispatch(
        setToastNotification(SUCCESS, `Organization user updated!`, logDetails)
      );
      updateCompanyDetails();
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      handleClose();
    }
  };
};

//put - team users role
export const EditTeamsUser = (params, body, handleClose, logDetails) => {
  return async (dispatch) => {
    try {
      await put(getEditTeamsUserUrl(params), body, params);

      dispatch(setToastNotification(SUCCESS, `Team user updated!`, logDetails));

      dispatch(
        getOrganizationTeams(
          {
            orgId: params.orgId,
          },
          logDetails
        )
      );
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      handleClose();
    }
  };
};

//delete - user from org
export const RemoveUserFromOrganization = (
  params,
  handleClose,
  updateCompanyDetails,
  logDetails
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: ERRORS_WHEN_REMOVING_USER_FROM_ORG,
        payload: null,
      });

      const res = await deleteMethod(getRemoveUserFromOrganizationUrl(params));

      if (res?.data?.errorsToDeleteUserFromOrganization?.length) {
        dispatch({
          type: ERRORS_WHEN_REMOVING_USER_FROM_ORG,
          payload: res?.data?.errorsToDeleteUserFromOrganization,
        });
      } else {
        dispatch(
          setToastNotification(
            SUCCESS,
            `User removed from organization!`,
            logDetails
          )
        );
        updateCompanyDetails();
      }
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      handleClose();
    }
  };
};

//delete - user from team
export const DeleteTeamsUser = (params, handleClose, logDetails) => {
  return async (dispatch) => {
    try {
      await deleteMethod(getEditTeamsUserUrl(params), params);

      dispatch(
        getOrganizationTeams(
          {
            orgId: params.orgId,
          },
          logDetails
        )
      );
      dispatch(
        getOrganizationUsers(
          {
            orgId: params.orgId,
          },
          logDetails
        )
      );

      dispatch(
        setToastNotification(SUCCESS, `User removed from team!`, logDetails)
      );
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
    } finally {
      handleClose();
    }
  };
};

////---hr teams modal in hr settings under permissions---////

//post - add team
export const AddCompanyTeam = (params, body, runWhenSuccess, logDetails) => {
  return async (dispatch) => {
    try {
      await post(getOrganizationTeamsUrl(params), body, params);

      dispatch(
        setToastNotification(SUCCESS, "Team added successfully!", logDetails)
      );

      dispatch(
        getOrganizationTeams(
          {
            orgId: params.orgId,
          },
          logDetails
        )
      );
      runWhenSuccess();
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Team could not be added!",
          logDetails
        )
      );
    }
  };
};

//delete - delete team
export const DeleteCompanyTeam = (params, runWhenSuccess, logDetails) => {
  return async (dispatch) => {
    try {
      await deleteMethod(getDeleteOrganizationTeamsUrl(params), params);

      dispatch(
        setToastNotification(SUCCESS, "Team deleted successfully!", logDetails)
      );
      dispatch(
        getOrganizationTeams(
          {
            orgId: params.orgId,
          },
          logDetails
        )
      );
      dispatch(
        getOrganizationUsers(
          {
            orgId: params.orgId,
          },
          logDetails
        )
      );
      runWhenSuccess();
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Team could not be deleted!",
          logDetails
        )
      );
    }
  };
};

////----hr questionnaire----////

//post - add questionnaire
export const getAddOrganizationQuestionnaire = (
  _params,
  runWhenSuccess = () => {},
  runWhenFailure = () => {},
  logDetails
) => {
  return async (dispatch) => {
    try {
      const params = {
        questionnaireName: _params.questionnaireName,
        questionnaireDescription: _params.questionnaireDescription,
        questions: _params.questions,
      };
      const response = await post(getAllQuestionnairesUrl(_params), params);
      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
      runWhenSuccess();
    } catch (error) {
      runWhenFailure();
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

//put - edit questionnaire
export const getEditOrganizationQuestionnaire = (
  _params,
  runWhenSuccess = () => {},
  runWhenFailure = () => {},
  logDetails
) => {
  return async (dispatch) => {
    try {
      const params = {
        questionnaireName: _params.questionnaireName,
        questionnaireDescription: _params.questionnaireDescription,
        questions: _params.questions,
      };
      delete params.orgId;
      delete params.questionnairesId;
      const response = await put(
        getOrganizationQuestionnairesUpdateUrl(_params),
        params
      );
      dispatch(
        setToastNotification(SUCCESS, response?.data?.message, logDetails)
      );
      runWhenSuccess();
    } catch (error) {
      runWhenFailure();
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

//delete - delete a questionnaire
export const getDeleteOrganizationQuestionnaire = (
  params,
  fetchQuestions,
  logDetails
) => {
  return async (dispatch) => {
    try {
      const response = await deleteMethod(
        getOrganizationQuestionnairesUpdateUrl(params)
      );
      dispatch(
        setToastNotification(
          SUCCESS,
          `Questionnaire deleted successfully!`,
          logDetails
        )
      );
      fetchQuestions();
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, `Cannot delete questionnaire!`, logDetails)
      );
    }
  };
};

////----hr notifications----////

//get - all notifications
export const getAllNotications = (setNotifications, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getUserNotifications());
      setNotifications(response.data.data?.userNotification);
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, `Cannot get notifications`, logDetails)
      );
    }
  };
};

//put - update notification
export const getUpdateNotication = (params, logDetails) => {
  return async (dispatch) => {
    try {
      await put(getUserNotifications(params), params);
      dispatch(
        setToastNotification(
          SUCCESS,
          `Notification status successfully updated!`,
          logDetails
        )
      );
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          `Cannot update notifications status`,
          logDetails
        )
      );
    }
  };
};

////----hr packages----////

//get - all packages
export const getAllPackages = (params, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(getAllPackagesUrl(params));
      dispatch({ type: HR_ALL_PACKAGES, payload: response.data.data });
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

//get - get package data by package id
export const getPackage = (params, orgId, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      const response = await get(
        `${getAllPackagesUrl(params)}/${params.packageId}`
      );
      dispatch({ type: GET_PACKAGE_DATA, payload: response.data.data });
      dispatch({ type: LOADING, payload: false });

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "getPackage"
      );

      orgId && dispatch(getAllChecks(innerLogDetails, orgId));
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

//post - create new package
export const createNewPackage = (data, params, logDetails) => {
  return async (dispatch) => {
    try {
      let res = await post(getPackageUrl(params), data);

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "createNewPackage"
      );
      dispatch(
        getAllPackages(
          { orgId: getLoggedInUserHrOrganizationId() },
          innerLogDetails
        )
      );
      dispatch(setToastNotification(SUCCESS, res.data.message, logDetails));
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

//put - update package
export const updatePackage = (data, params, logDetails) => {
  return async (dispatch) => {
    try {
      let res = await put(`${getPackageUrl(params)}/${params.pkgId}`, data);

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updatePackage"
      );

      dispatch(
        getAllPackages(
          { orgId: getLoggedInUserHrOrganizationId() },
          innerLogDetails
        )
      );
      dispatch(setToastNotification(SUCCESS, res.data.message, logDetails));
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

//delete - package
export const deletePackage = (params, logDetails) => {
  return async (dispatch) => {
    try {
      await deleteMethod(
        `${getPackageUrl({
          orgId: getLoggedInUserHrOrganizationId(),
        })}/${params}`
      );

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "deletePackage"
      );

      dispatch(
        getAllPackages(
          { orgId: getLoggedInUserHrOrganizationId() },
          innerLogDetails
        )
      );

      dispatch(
        setToastNotification(
          SUCCESS,
          `Package deleted successfully!`,
          logDetails
        )
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

//get - all checks
export const getAllChecks = (logDetails, orgId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });

      const response = await get(
        getAllChecksUrl(),
        orgId ? { orgId } : undefined
      );
      dispatch({ type: GET_ALL_CHECKS, payload: response.data.data });
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

//get - all questionnaires
export const getAllQuestionnaires = (param, logDetails) => {
  return async (dispatch) => {
    try {
      const response = await get(getAllQuestionnairesUrl(param));
      let modifiedData = response.data.data;

      modifiedData = modifiedData.map((ques) => {
        return {
          ...ques,
          label: ques.questionnaireName,
          value: ques.questionnairesId,
        };
      });

      dispatch({ type: GET_QUESTIONNAIRES, payload: modifiedData });
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

export const addMultipleCandidates = (
  data,
  logDetails,
  resetOpsCandidatesTableFilters = () => {}
) => {
  return async (dispatch) => {
    try {
      let id = getLoggedInUserHrOrganizationId();

      let currentLoginProfile = localStorage.getItem("loginProfile");

      let { CheckMinistryUser } = JSON.parse(
        localStorage.getItem(`${currentLoginProfile}_login`)
      );

      const loggedUser = JSON.parse(CheckMinistryUser);

      let url =
        loggedUser?.roleId === 4
          ? getAddMultipleCandidatesUrlByOps(id)
          : getAddMultipleCandidatesUrl(id);

      const res = await post(url, data);
      dispatch(setToastNotification(SUCCESS, res.data.message));
      resetOpsCandidatesTableFilters();
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

export const getFailedToRegisterCandidates = (logDetails) => {
  return async (dispatch) => {
    try {
      let id = getLoggedInUserHrOrganizationId();
      let res = await get(getFailedToRegisterCandidatesUrl(id));
      dispatch({
        type: GET_FAILED_TO_REGISTER_CANDIDATES,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

export const deleteFailedCandidateData = (id, setDeleteModal, logDetails) => {
  return async (dispatch) => {
    try {
      let orgId = getLoggedInUserHrOrganizationId();
      const res = await deleteMethod(
        getDeleteFailedCandidateDataUrl(orgId, id)
      );
      dispatch(setToastNotification(SUCCESS, res.data.message, logDetails));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "deleteFailedCandidateData"
      );

      dispatch(getFailedToRegisterCandidates(innerLogDetails));
      setDeleteModal(false);
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//update user profile
export const updateUserProfileAction = (data, roleId, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await put(getUpdateUserProfileActionUrl(), data);
      dispatch(setToastNotification(SUCCESS, res.data.message, logDetails));

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updateUserProfileAction"
      );

      dispatch(currentUser(innerLogDetails));

      //only for candidates
      if (roleId === 3) {
        dispatch(initialCandidateDetails(innerLogDetails));
      }
    } catch (error) {
      dispatch(
        setToastNotification(ERROR, errorUtils.getError(error), logDetails)
      );
    }
  };
};

//update package
export const updatePackageForCandidate = (data, params, query, logDetails) => {
  return async (dispatch) => {
    try {
      await put(getAddCandidateInOrgTeamUrl(params), data, query);
      dispatch(
        setToastNotification(
          SUCCESS,
          "Package Updated Successfully!",
          logDetails
        )
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

//post - login as candidate in vendor
export const loginAsCandidateInVendor = (payload, navigate, logDetails) => {
  return async (dispatch) => {
    try {
      const res = await post(getloginAsCandidateInVendorUrl(), payload);

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
