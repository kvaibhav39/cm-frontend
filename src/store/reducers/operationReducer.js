import RiskLevelIcon from "../../components/Operations/OperationsCandidates/OperationsCaseManagement/components/innerComponents/CMVerifyCandidateDetails/VerifiedReportPdf/assets/RiskLevelIcon";
import { riskLevelColorsAndIcons } from "../../components/Operations/OperationsCandidates/OperationsCaseManagement/components/innerComponents/CMVerifyCandidateDetails/VerifiedReportPdf/assets/riskLevelColorsAndIcons";
import {
  CLEAR_STORE,
  GET_OPS_CANDIDATES,
  GET_PROCESS_STATUS,
  GET_RESULT_STATUS,
  GET_VERIFICATION_PROCESS_STATUS,
  GET_VERIFICATION_RESULT_STATUS,
  OPS_CANDIDATES_BY_ORG_ID,
  GET_OPS_BASIC_CANDIDATE_INFO,
  GET_OPS_CANDIDATE_CASE_CHECKS,
  GET_OPS_USERS_BY_SUBROLE_IDS,
  GET_CHECK_INTERNAL_STATUS,
  GET_SUB_CHECKS_LIST,
  GET_ORGS_LISTS_BY_OPS_USER_ID,
  LOADING,
  GET_ACTION_LOG_CATEGORIES,
  GET_ACTION_LOG_SUB_CATEGORIES,
  GET_ACTION_LOG_LISTS,
  GET_OPS_STATISTICS,
  UPDATE_INTERNAL_CHECK_STATUS_IN_STORE,
  UPDATE_SUBCHECK_DATA_IN_STORE,
  UPDATE_CHECK_DATA_IN_STORE,
  UPDATE_CANDIDATES_DATA_FOR_ASSIGNEE_IN_STORE,
  ADD_CHECK_AND_SUBCHECK,
  REMOVE_CHECK_AND_SUBCHECK,
  HANDLE_CV_CHECK_ADDED_FILE,
  DISABLE_UPDATE_ADD_CHECK_BTN,
  GET_OPS_AUDIT_TRAIL_ACTIVITY,
  LOAD_ADD_CHECK_UPDATE_BTN,
  LOAD_ALL_CHECKS_UPDATE_BTN,
  HIDE_OPS_CM_SECTION,
  GET_ALL_SUB_CHECKS_LIST,
  GET_ACTION_LOG_ADDITIONAL_CATEGORIES,
  GET_ACTION_LOG_CATEGORIES_INPUTS,
  GET_OPS_USERS_BY_ORG,
  SET_OPS_COMPONENT,
  GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA,
  UPDATE_SUB_CHECKS_LIST,
  UPDATE_CHECK_SELECTED_STATE,
  UPDATE_SUBCHECK_SELECTED_STATE,
  ALLOW_ADD_CHECK_SUBCHECK,
  GET_OPS_SUBCHECK_LIST_TABLE_DATA,
} from "../actions/actionTypes";

import { CHECK_INTERNAL_STATUS, VERIFICATION_RESULTS } from "../constant";

const initialState = {
  loading: true,
  processStatus: [],
  resultStatus: [],
  totalCandidateCaseCount: null,
  OpsCandidatesList: null,
  OPsCandidatesByOrgIdLists: [],
  verificationProcessStatusData: null,
  verificationResultStatusData: null,
  OpsBasicCandidateInfo: null,
  OpsCandidateCaseChecksList: null,
  OpsUserBySubRoleIds: null,
  checkInternalStatusLists: null,
  subChecksList: null,
  subChecksListForVerifierSection: null,
  orgsListsByOpsUserId: null,
  actionLogCategories: null,
  actionLogSubCategories: [],
  actionLogAdditionalCategories: [],
  actionLogCategoriesInputs: [],
  actionLogLists: null,
  opsStatistics: null,
  addedChecksAndSubCheck: [],
  uploadedCVFileDetails: null,
  disableUpdateAddCheckBtn: false,
  OpsAuditTrailActivity: null,
  loadUpdateAddCheckBtn: false,
  loadUpdateSingleCheckBtn: null,
  toHideOpsCMSection: null,
  allSubChecksLists: null,
  opsUsersByOrg: null,
  opsComponent: "ops-screen",
  OpsBasicCandidateInfoAdditionalData: null,
  selectedCheckId: null,
  selectedSubCheckId: null,
  allowAddCheckAndSubCheck: true,
  opsSubcheckListTableData: null,
};

export default function operationReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case GET_PROCESS_STATUS:
      return {
        ...state,
        processStatus: action.payload,
      };
    case GET_RESULT_STATUS:
      return {
        ...state,
        resultStatus: action.payload,
      };

    case GET_OPS_CANDIDATES:
      let { data, totalCandidateCaseCount } = action.payload;
      return {
        ...state,
        OpsCandidatesList: data,
        totalCandidateCaseCount: totalCandidateCaseCount,
      };
    case GET_VERIFICATION_PROCESS_STATUS:
      return {
        ...state,
        verificationProcessStatusData: action.payload,
      };

    case GET_VERIFICATION_RESULT_STATUS:
      return {
        ...state,
        verificationResultStatusData: action.payload,
      };

    case OPS_CANDIDATES_BY_ORG_ID:
      return {
        ...state,
        OPsCandidatesByOrgIdLists: action.payload,
      };
    case GET_OPS_BASIC_CANDIDATE_INFO:
      return {
        ...state,
        OpsBasicCandidateInfo: action.payload,
      };
    case GET_OPS_CANDIDATE_CASE_CHECKS:
      return {
        ...state,
        OpsCandidateCaseChecksList: action.payload,
      };
    case GET_OPS_USERS_BY_SUBROLE_IDS:
      return {
        ...state,
        OpsUserBySubRoleIds: action.payload,
      };

    case GET_CHECK_INTERNAL_STATUS:
      return {
        ...state,
        checkInternalStatusLists: action.payload,
      };

    case GET_SUB_CHECKS_LIST:
      return {
        ...state,
        subChecksList: action.payload,
        subChecksListForVerifierSection: action.payload,
      };

    case GET_ORGS_LISTS_BY_OPS_USER_ID:
      let allOrg = {
        hrOrganizationsId: 0,
        hrOrganizationName: "All Organizations",
      };

      let temp = action.payload;

      if (
        temp?.find((curr) => curr.hrOrganizationName !== "All Organizations")
      ) {
        temp = [allOrg, ...temp];
      }
      return {
        ...state,
        orgsListsByOpsUserId: temp,
      };

    case GET_ACTION_LOG_CATEGORIES:
      return {
        ...state,
        actionLogCategories: action.payload,
      };
    case GET_ACTION_LOG_SUB_CATEGORIES:
      return {
        ...state,
        actionLogSubCategories: action.payload,
      };
    case GET_ACTION_LOG_ADDITIONAL_CATEGORIES:
      return {
        ...state,
        actionLogAdditionalCategories: action.payload,
      };
    case GET_ACTION_LOG_CATEGORIES_INPUTS:
      return {
        ...state,
        actionLogCategoriesInputs: action.payload,
      };
    case GET_ACTION_LOG_LISTS:
      return {
        ...state,
        actionLogLists: action.payload?.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        ),
      };
    case GET_OPS_STATISTICS:
      return {
        ...state,
        opsStatistics: action.payload,
      };
    case UPDATE_INTERNAL_CHECK_STATUS_IN_STORE:
      let {
        candidatesChecksMappingId,
        verificationResultId,
        checkInternalStatusId,
      } = action.payload;
      let { OpsBasicCandidateInfo } = state;

      //verification result
      let selectedCheck = state.OpsCandidateCaseChecksList?.find(
        (curr) => curr?.candidatesChecksMappingId === candidatesChecksMappingId
      );

      let oldInternalStatus = VERIFICATION_RESULTS.find(
        (curr) => curr.id === selectedCheck?.verificationResultId
      )?.description;

      let newInternalStatus = VERIFICATION_RESULTS.find(
        (curr) => curr.id === verificationResultId
      )?.description;

      OpsBasicCandidateInfo = {
        ...OpsBasicCandidateInfo,
        internalStatus: {
          ...OpsBasicCandidateInfo.internalStatus,
          [newInternalStatus]: {
            ...OpsBasicCandidateInfo.internalStatus[newInternalStatus],
            count:
              +OpsBasicCandidateInfo.internalStatus[newInternalStatus]?.count +
              1,
          },
        },
      };

      if (oldInternalStatus) {
        OpsBasicCandidateInfo = {
          ...OpsBasicCandidateInfo,
          internalStatus: {
            ...OpsBasicCandidateInfo.internalStatus,
            [oldInternalStatus]: {
              ...OpsBasicCandidateInfo.internalStatus[oldInternalStatus],
              count:
                +OpsBasicCandidateInfo.internalStatus[oldInternalStatus]
                  ?.count - 1,
            },
          },
        };
      }

      //check internal status
      let oldCheckStatus = CHECK_INTERNAL_STATUS.find(
        (curr) => curr.id === selectedCheck?.checkInternalStatusId
      )?.description;

      let newCheckStatus = CHECK_INTERNAL_STATUS.find(
        (curr) => curr.id === checkInternalStatusId
      )?.description;

      OpsBasicCandidateInfo = {
        ...OpsBasicCandidateInfo,
        internalStatus: {
          ...OpsBasicCandidateInfo.internalStatus,
          [newCheckStatus]: {
            ...OpsBasicCandidateInfo.internalStatus[newCheckStatus],
            count:
              +OpsBasicCandidateInfo.internalStatus[newCheckStatus]?.count + 1,
          },
        },
      };

      if (oldCheckStatus) {
        OpsBasicCandidateInfo = {
          ...OpsBasicCandidateInfo,
          internalStatus: {
            ...OpsBasicCandidateInfo.internalStatus,
            [oldCheckStatus]: {
              ...OpsBasicCandidateInfo.internalStatus[oldCheckStatus],
              count:
                +OpsBasicCandidateInfo.internalStatus[oldCheckStatus]?.count -
                1,
            },
          },
        };
      }

      return { ...state, OpsBasicCandidateInfo };
    case UPDATE_CHECK_DATA_IN_STORE: {
      let { candidatesChecksMappingId, payload } = action.payload;
      let {
        OpsCandidateCaseChecksList,
        OpsUserBySubRoleIds,
        checkInternalStatusLists,
        verificationResultStatusData,
        subChecksList,
      } = state;

      OpsCandidateCaseChecksList.forEach((curr) => {
        if (curr.candidatesChecksMappingId === candidatesChecksMappingId) {
          //finding matched assignee
          let getAssignee = OpsUserBySubRoleIds?.find(
            (user) => user.assignee === payload.assignee
          );

          //finding matched risk level
          let getRisk = verificationResultStatusData?.find(
            (risk) =>
              risk.candidatesVerificationResultStatusId ===
              payload.verificationResultId
          );

          //finding matched check status
          let getCheckStatus = checkInternalStatusLists?.find(
            (status) => status.id === payload.checkInternalStatusId
          );

          //updating assignee
          curr.assigneeName = getAssignee?.assigneeName;
          curr.assignee = getAssignee?.assignee;
          curr.loginEmail = getAssignee?.loginEmail;

          //updating risk
          if (getRisk) {
            curr.verificationResultId =
              getRisk.candidatesVerificationResultStatusId;
            curr.verificationResultStatusName =
              getRisk.verificationResultStatusName;
          }

          //updating check status
          curr.checkInternalStatusId = getCheckStatus.id;
          curr.checkStatusName = getCheckStatus.checkStatusName;
          curr.checkInternalStatusName = getCheckStatus.checkInternalStatusName;
        }
      });

      subChecksList?.forEach((curr) => {
        if (curr.candidatesChecksMappingId === candidatesChecksMappingId) {
          //finding matched assignee
          let getAssignee = OpsUserBySubRoleIds?.find(
            (user) => user.assignee === payload.assignee
          );

          //updating assignee
          if (!curr.assignee) {
            curr.assigneeName = getAssignee?.assigneeName;
            curr.assignee = getAssignee?.assignee;
            curr.loginEmail = getAssignee?.loginEmail;
          }
        }
      });

      return { ...state, OpsCandidateCaseChecksList, subChecksList };
    }
    case UPDATE_SUBCHECK_DATA_IN_STORE: {
      let { subCheckId, payload } = action.payload;
      let {
        checkInternalStatusLists,
        verificationResultStatusData,
        OpsUserBySubRoleIds,
        subChecksList,
        allSubChecksLists,
      } = state;

      subChecksList.forEach((curr) => {
        if (curr.id === subCheckId) {
          //finding matched assignee
          let getAssignee = OpsUserBySubRoleIds?.find(
            (user) => user?.assignee === payload?.assignee
          );

          //finding matched risk level
          let getRisk = verificationResultStatusData?.find(
            (risk) =>
              risk.candidatesVerificationResultStatusId ===
              payload.subCheckVerificationResultStatusId
          );

          //finding matched check status
          let getCheckStatus = checkInternalStatusLists?.find(
            (status) => status.id === payload.subCheckInternalStatusId
          );

          //updating assignee
          curr.assigneeName = getAssignee?.assigneeName;
          curr.assignee = getAssignee?.assignee;
          curr.loginEmail = getAssignee?.loginEmail;

          //updating risk
          if (getRisk) {
            curr.subCheckVerificationResultStatusId =
              getRisk.candidatesVerificationResultStatusId;
            curr.subCheckVerificationResultStatusName =
              getRisk.verificationResultStatusName;
          }

          //updating check status
          curr.subCheckInternalStatusId = getCheckStatus?.id;
          curr.checkStatusName = getCheckStatus?.checkStatusName;
          curr.checkInternalStatusName =
            getCheckStatus?.checkInternalStatusName;
        }
      });

      //to update sub check list in case overview in report pdf
      let temp = [];
      allSubChecksLists?.forEach((curr) => {
        let ifPresent = subChecksList?.find((val) => val.id === curr.id);
        ifPresent ? temp.push(ifPresent) : temp.push(curr);
      });

      return {
        ...state,
        subChecksList,
        allSubChecksLists: temp,
      };
    }
    case UPDATE_CANDIDATES_DATA_FOR_ASSIGNEE_IN_STORE: {
      let { payload, candidatesCasesId } = action.payload;
      let { OpsCandidatesList } = state;

      OpsCandidatesList?.forEach((curr) => {
        if (curr.candidatesCasesId === candidatesCasesId) {
          let getAssigneeName;

          curr?.hrOrganization?.opsUserMappingData?.forEach((curr) => {
            if (payload.assignee === curr?.opsUserData?.usersId) {
              return (getAssigneeName = curr?.opsUserData?.userName);
            }
          });

          curr.assignee = payload.assignee;
          curr.assigneeName = getAssigneeName;
        }
      });

      return {
        ...state,
        OpsCandidatesList,
      };
    }
    case ADD_CHECK_AND_SUBCHECK: {
      let values = action.payload;
      let tempAdded = [...state.addedChecksAndSubCheck];

      //if state already has some checks or subchecks present
      if (tempAdded?.length && values?.length) {
        values?.forEach((val) => {
          //will loop over the values and search if the value sent is already present in the state or not
          let ifPresentIndex = tempAdded?.findIndex(
            (added) => added.checkId === val.checkId
          );

          //if it is already present in the state , then we will simple remove it from the state
          if (ifPresentIndex >= 0) {
            tempAdded.splice(ifPresentIndex, 1);
          }

          //now even if the value was present in the state or not , we will simply push the latest value
          tempAdded.push(val);
        });
      } else {
        //if state is initially an empty array , then we will simply push the values
        values && tempAdded.push(...values);
      }

      return {
        ...state,
        addedChecksAndSubCheck: [...tempAdded],
      };
    }
    case ALLOW_ADD_CHECK_SUBCHECK:
      return {
        ...state,
        allowAddCheckAndSubCheck: action.payload,
      };
    case REMOVE_CHECK_AND_SUBCHECK: {
      let id = action.payload;
      let tempAdded = [...state.addedChecksAndSubCheck];

      //to reset to empty array
      if (id === "all") {
        tempAdded = [];
      } else {
        //to remove check & subcheck as per id
        tempAdded = [
          ...tempAdded.filter((addedCheck) => addedCheck.checkId !== id),
        ];
      }
      return {
        ...state,
        addedChecksAndSubCheck: [...tempAdded],
        removeAddedChecksAndSubCheck: id,
      };
    }
    case CLEAR_STORE:
      return { ...initialState };
    case HANDLE_CV_CHECK_ADDED_FILE:
      return {
        ...state,
        uploadedCVFileDetails: action.payload,
      };
    case DISABLE_UPDATE_ADD_CHECK_BTN:
      return {
        ...state,
        disableUpdateAddCheckBtn: action.payload,
      };
    case GET_OPS_AUDIT_TRAIL_ACTIVITY:
      return {
        ...state,
        OpsAuditTrailActivity: action.payload,
      };
    case LOAD_ADD_CHECK_UPDATE_BTN:
      return {
        ...state,
        loadUpdateAddCheckBtn: action.payload,
      };
    case LOAD_ALL_CHECKS_UPDATE_BTN:
      let prevState = state.loadUpdateSingleCheckBtn;
      let { id, value } = action.payload;
      return {
        ...state,
        loadUpdateSingleCheckBtn: { ...prevState, [id]: value },
      };
    case HIDE_OPS_CM_SECTION:
      return {
        ...state,
        toHideOpsCMSection: action.payload,
      };
    case GET_ALL_SUB_CHECKS_LIST: {
      let { OpsCandidateCaseChecksList } = state;
      let allSubChecksLists = action.payload;

      let tempSubChecksLists = [];

      allSubChecksLists?.forEach((curr) => {
        if (
          curr?.candidatesChecksMappingId ===
          OpsCandidateCaseChecksList[0]?.candidatesChecksMappingId
        ) {
          tempSubChecksLists.push(curr);
        }
      });

      return {
        ...state,
        allSubChecksLists,
        selectedCheckId:
          OpsCandidateCaseChecksList[0]?.candidatesChecksMappingId,
        subChecksList: tempSubChecksLists,
        selectedSubCheckId: tempSubChecksLists[0]?.id,
      };
    }
    case GET_OPS_USERS_BY_ORG:
      return {
        ...state,
        opsUsersByOrg: action.payload,
      };
    case SET_OPS_COMPONENT:
      return {
        ...state,
        opsComponent: action.payload,
      };
    case GET_OPS_BASIC_CANDIDATE_INFO_ADDITIONAL_DATA:
      return {
        ...state,
        OpsBasicCandidateInfoAdditionalData: action.payload,
      };
    case UPDATE_SUB_CHECKS_LIST: {
      let { allSubChecksLists } = state;

      let { subCheckId, payload, whichReduxStateToUse } = action?.payload;

      //'whichReduxStateToUse' has two different values depending on from where it's get called
      //using 'subChecksList' for 'UpdateActionComponent' & using 'subChecksListForVerifierSection' for 'VerifierDetails'
      //doing this so that both the components use different redux states which contain the same data & be independent

      let updatedSubChecksList = state[whichReduxStateToUse]?.map((curr) => {
        if (curr?.id === subCheckId) {
          curr = { ...curr, ...payload };
        }
        return curr;
      });

      let updatedAllSubCheckList = allSubChecksLists?.map((curr) => {
        if (curr?.id === subCheckId) {
          curr = { ...curr, ...payload };
        }
        return curr;
      });

      return {
        ...state,
        [whichReduxStateToUse]: updatedSubChecksList,
        allSubChecksLists: updatedAllSubCheckList,
      };
    }
    case UPDATE_CHECK_SELECTED_STATE:
      return {
        ...state,
        selectedCheckId: action.payload,
      };
    case UPDATE_SUBCHECK_SELECTED_STATE:
      return {
        ...state,
        selectedSubCheckId: action.payload,
      };
    case GET_OPS_SUBCHECK_LIST_TABLE_DATA: {
      let { data, totalSubChecksCount } = action.payload;
      return {
        ...state,
        opsSubcheckListTableData: data,
        totalSubChecksCount,
      };
    }
    default:
      return state;
  }
}
