import {
  getAdditionalInformationUrl,
  getAddressDetailsUrl,
  getCacheCandidateDetailsUrl,
  getCandidateServicesUrl,
  getCandidateSubmitFeedback,
  getDeclarationDataUrl,
  getEducationalQualificationsUrl,
  getEmploymentHistoryUrl,
  getFamilyDetailsUrl,
  getIdentityDataUrl,
  getPersonalParticularUrl,
  getProfessionalQualificationsUrl,
  getProfessionalReferenceUrl,
  getSupportDocumentsByCountryUrl,
  hostPath,
} from "../../utils/UrlUtils";
import {
  CANDIDATE_DISPLAY_API_ERROR,
  CANDIDATE_DETAILS,
  CANDIDATE_INITIAL_DETAILS,
  CLEAR_STORE,
  CANDIDATE_SECTION_LOADING,
  LOADING,
  CANDIDATE_CACHED_DETAILS,
  PERSONAL_PARTICULAR,
  ADDRESS_DETAILS,
  EMPLOYMENT_HISTORY,
  FAMILY_DETAILS,
  EDUCATIONAL_QUALIFICATIONS,
  PROFESSIONAL_QUALIFICATIONS,
  PROFESSIONAL_REFERENCE,
  IDENTITY_DETAILS,
  DECLARATION,
  ADDITIONAL_INFORMATION,
  CANDIDATE_SIDEBAR_STATE,
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
  GET_IDENTITY_DOCUMENT_TYPES_LISTS,
} from "./actionTypes";
import { errorUtils } from "../../utils/ErrorUtils";
import { get, post } from "../../api/api";
import { setToastNotification } from "./toastNotificationActions";
import { ERROR, SUCCESS } from "../constant";
import { commonGetCandidateSectionData } from "../utils/commonGetCandidateSectionData";
import { store } from "../index";
import axios from "axios";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

export const clearCandidateStore = () => {
  return {
    type: CLEAR_STORE,
  };
};

//get - welcome api
export const initialCandidateDetails = (logDetails, navigate, location) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: true });
      let res = await get(getCandidateServicesUrl("welcome"));
      dispatch({ type: CANDIDATE_INITIAL_DETAILS, payload: res.data.data });
      let {
        allowProfileEdit,
        candidateConsentSubmitted,
        candidateProfileSections,
      } = res.data.data;

      if (navigate) {
        if (allowProfileEdit === false) {
          let sectionOnHold = candidateProfileSections?.find(
            (section) => section.onHold
          );

          if (sectionOnHold) {
            dispatch({ type: CANDIDATE_SIDEBAR_STATE, payload: "onHold" });

            let isPathPresent = candidateProfileSections?.find(
              (section) =>
                section.sectionPath === location?.pathname &&
                section.sectionPath !== "/candidate/profile"
            );

            navigate(isPathPresent?.sectionPath || sectionOnHold?.sectionPath);
          } else {
            dispatch({ type: CANDIDATE_SIDEBAR_STATE, payload: "all" });
            navigate("/candidate/profile/post-submit");
          }
        } else if (candidateConsentSubmitted === false) {
          dispatch({
            type: CANDIDATE_SIDEBAR_STATE,
            payload: "except_welcome",
          });
          navigate("/candidate/profile");
        } else if (candidateConsentSubmitted === true) {
          dispatch({ type: CANDIDATE_SIDEBAR_STATE, payload: "none" });
        }
      }

      let innerLogDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "initialCandidateDetails"
      );

      dispatch(fetchDetails(innerLogDetails));
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

//get - details api
export const fetchDetails = (logDetails) => {
  return async (dispatch) => {
    try {
      let res = await get(getCandidateServicesUrl("details"));

      dispatch({ type: CANDIDATE_DETAILS, payload: res.data.data });
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

//post - candidate details
export const submitCandidateDetails = (
  data,
  candidateSectionType,
  runWhenSuccess = () => {},
  sectionOnHold = "",
  sectionId = "",
  navigate,
  logDetails
) => {
  return async (dispatch) => {
    try {
      if (data) {
        let { allowProfileEdit, candidateProfileSections } =
          store.getState().candidate.candidateInitialDetails;

        let res = await post(
          getCandidateServicesUrl(candidateSectionType),
          data,
          allowProfileEdit === false && sectionOnHold ? { sectionId } : {}
        );

        if (res.data.success) {
          runWhenSuccess();

          let innerLogDetails = getCurrentFileNameAndFunction(
            import.meta.url,
            "submitCandidateDetails"
          );

          dispatch(initialCandidateDetails(innerLogDetails, navigate));
        }
      }
    } catch (error) {
      dispatch(
        setToastNotification(
          ERROR,
          errorUtils.getError(error) || "Internal Server Error",
          logDetails
        )
      );
      dispatch({
        type: CANDIDATE_DISPLAY_API_ERROR,
        payload: error?.response?.data?.message || "Internal Server Error",
      });
    }
  };
};

//post - candidate feedback
export const submitCandidateFeedback = (
  data,
  setFeedbackAlreadySubmitted,
  logDetails
) => {
  return async (dispatch) => {
    try {
      await post(getCandidateSubmitFeedback(), data);
      setFeedbackAlreadySubmitted(true);

      dispatch({ type: LOADING, payload: false });
    } catch (error) {
      setFeedbackAlreadySubmitted(false);

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

let allowRequest = true;

//post - candidate cache data
export const submitCacheCandidateDetails = (
  logDetails,
  data = {},
  cacheSection = "",
  showSuccessMsg = false
) => {
  return async (dispatch) => {
    try {
      if (!allowRequest) {
        return;
      }
      allowRequest = false;

      let res = await post(getCacheCandidateDetailsUrl(), data, {
        cacheSection,
      });

      let cachedDetails = res?.data?.data;

      dispatch({
        type: CANDIDATE_CACHED_DETAILS,
        payload: { [cacheSection]: cachedDetails },
      });

      if (showSuccessMsg) {
        dispatch(
          setToastNotification(
            SUCCESS,
            "Your Changes Have Been Saved!",
            logDetails
          )
        );
      }

      allowRequest = true;
    } catch (error) {
      allowRequest = true;

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

//get - candidate get data
export const getCacheCandidateDetails = (
  logDetails,
  cacheSection,
  dispatchParams
) => {
  return async (dispatch) => {
    try {
      let res = await get(getCacheCandidateDetailsUrl(), {
        cacheSection,
      });

      let cachedDetails =
        res?.data?.data && JSON.parse(JSON.stringify(res?.data?.data));

      dispatch({
        type: CANDIDATE_CACHED_DETAILS,
        payload: { [cacheSection]: cachedDetails },
      });
      if (dispatchParams.type) {
        dispatch(dispatchParams);
      }
      dispatch({ type: CANDIDATE_SECTION_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: CANDIDATE_SECTION_LOADING, payload: false });
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

//get - personal particular data
export const getPersonalParticularData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getPersonalParticularUrl()),
      PERSONAL_PARTICULAR,
      dispatch
    );
  };
};

//get - address details data
export const getAddressDetailsData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getAddressDetailsUrl()),
      ADDRESS_DETAILS,
      dispatch
    );
  };
};

//get - family details data
export const getFamilyDetailsData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getFamilyDetailsUrl()),
      FAMILY_DETAILS,
      dispatch
    );
  };
};

//get - employment history data
export const getEmploymentHistoryData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getEmploymentHistoryUrl()),
      EMPLOYMENT_HISTORY,
      dispatch
    );
  };
};

//get - educational qualifications data
export const getEducationalQualificationsData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getEducationalQualificationsUrl()),
      EDUCATIONAL_QUALIFICATIONS,
      dispatch
    );
  };
};

//get - professional qualifications data
export const getProfessionalQualificationsData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getProfessionalQualificationsUrl()),
      PROFESSIONAL_QUALIFICATIONS,
      dispatch
    );
  };
};

//get - professional reference data
export const getProfessionalReferenceData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getProfessionalReferenceUrl()),
      PROFESSIONAL_REFERENCE,
      dispatch
    );
  };
};

//get - identity data
export const getIdentityData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getIdentityDataUrl()),
      IDENTITY_DETAILS,
      dispatch
    );
  };
};

//get - identity document types list
export const getSupportDocumentsByCountry = (iso, logDetails) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_IDENTITY_DOCUMENT_TYPES_LISTS,
        payload: null,
      });
      const response = await get(getSupportDocumentsByCountryUrl(iso));
      dispatch({
        type: GET_IDENTITY_DOCUMENT_TYPES_LISTS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: GET_IDENTITY_DOCUMENT_TYPES_LISTS,
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

//get - declaration data
export const getDeclarationData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getDeclarationDataUrl()),
      DECLARATION,
      dispatch
    );
  };
};

//get - additional info data
export const getAdditionalInformationData = (logDetails) => {
  return async (dispatch) => {
    dispatch({ type: CANDIDATE_SECTION_LOADING, payload: true });

    commonGetCandidateSectionData(
      logDetails,
      () => get(getAdditionalInformationUrl()),
      ADDITIONAL_INFORMATION,
      dispatch
    );
  };
};

//get - get Candidate Dropdown Lists
export const fetchCandidateDropdownLists = (urlPath, CONSTANT, logDetails) => {
  return async (dispatch) => {
    try {
      let res = await get(`${hostPath}${urlPath}`);
      dispatch({ type: LOADING, payload: false });
      dispatch({ type: CONSTANT, payload: res.data.data });
    } catch (error) {
      dispatch({ type: LOADING, payload: false });
      dispatch({ type: CONSTANT, payload: null });
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

//get - education types
export const getCandidateEducationTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidates-education-types",
    GET_CANDIDATE_EDUCATION_TYPES,
    logDetails
  );

//get - emp bonus types
export const getCandidateEmploymentBonusTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidates-bonus-types",
    GET_CANDIDATE_EMPLOYMENT_BONUS_TYPES,
    logDetails
  );

//get - emp career gaps types
export const getCandidateEmploymentCareerGapsTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidate-employment-reason-of-gap",
    GET_CANDIDATE_EMPLOYMENT_CAREER_GAPS_TYPES,
    logDetails
  );

//get - emp reason of leaving types
export const getCandidateEmploymentReasonOfLeavingTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidates-employment-reason-of-resignation",
    GET_CANDIDATE_EMPLOYMENT_REASON_OF_LEAVING_TYPES,
    logDetails
  );

//get - emp salary freq types
export const getCandidateEmploymentSalaryFreqTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidate-employment-salary-frequencies",
    GET_CANDIDATE_EMPLOYMENT_SALARY_FREQUENCY_TYPES,
    logDetails
  );

//get - emp types
export const getCandidateEmploymentTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidate-employment-types",
    GET_CANDIDATE_EMPLOYMENT_TYPES,
    logDetails
  );

//get - professional relations types
export const getCandidateProfessionalRelationsTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidate-professional-reference-relationship",
    GET_CANDIDATE_PROFESSIONAL_RELATIONS_TYPES,
    logDetails
  );

//get - education qualification types
export const getCandidateEducationalQualificationTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidate-edu-qualification-types",
    GET_CANDIDATE_EDUCATION_QUALIFICATION_TYPES,
    logDetails
  );

//get - professional qualification types
export const getCandidateProfessionalQualificationTypes = (logDetails) =>
  fetchCandidateDropdownLists(
    "/candidates-professionalqualification-Status",
    GET_CANDIDATE_PROFESSIONAL_QUALIFICATION_TYPES,
    logDetails
  );

//get - currencies
export const getCurrencies = (logDetails) =>
  fetchCandidateDropdownLists("/currencies", GET_CURRENCIES, logDetails);

//get - languages
export const getLanguages = (logDetails) =>
  fetchCandidateDropdownLists("/languages", GET_LANGUAGES, logDetails);
