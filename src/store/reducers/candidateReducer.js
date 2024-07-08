import { placeOtherDropdownAtLast } from "../../utils/PlaceOtherDropDownAtLast";
import {
  CANDIDATE_DISPLAY_API_ERROR,
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_DETAILS,
  CANDIDATE_INITIAL_DETAILS,
  CLEAR_STORE,
  CANDIDATE_SECTION_LOADING,
  LOADING,
  CANDIDATE_CACHED_DETAILS,
  PERSONAL_PARTICULAR,
  ADDRESS_DETAILS,
  FAMILY_DETAILS,
  EMPLOYMENT_HISTORY,
  EDUCATIONAL_QUALIFICATIONS,
  PROFESSIONAL_QUALIFICATIONS,
  PROFESSIONAL_REFERENCE,
  IDENTITY_DETAILS,
  DECLARATION,
  ADDITIONAL_INFORMATION,
  CANDIDATE_SIDEBAR_STATE,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
  CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
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
} from "../actions/actionTypes";

const initialState = {
  candidateDetails: null,
  loading: false,
  candidateSectionLoading: false,
  candidateInitialDetails: {},
  apiErrorMsg: null,
  candidateCachedDetails: null,
  personalParticularData: null,
  addressDetailsData: null,
  familyDetailsData: null,
  employmentHistoryData: null,
  educationalQualificationsData: null,
  professionalQualificationsData: null,
  professionalReferenceData: null,
  identityData: null,
  declarationData: [],
  additionalInformationData: [],
  candidateSidebarState: null,
  candidateSectionBackUrl: null,
  candidateSectionSubmitHandler: () => {},
  candidateSectionDisableSubmitBtn: false,
  checkCandidateSectionsAreSubmitted: null,
  educationTypes: null,
  bonusTypes: null,
  careerGapsTypes: null,
  reasonOfLeavingTypes: null,
  salaryFreq: null,
  employmentTypes: null,
  professionalRelationsTypes: null,
  qualificationTypes: null,
  qualificationStatuses: null,
  currencies: null,
  languages: null,
  identityDocumentTypeLists: [],
};

export default function candidateReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CANDIDATE_SECTION_LOADING:
      return {
        ...state,
        candidateSectionLoading: action.payload,
      };
    case CANDIDATE_DETAILS: {
      if (action.payload) {
        let {
          PERSONAL_PERTICULAR,
          ADDRESS_DETAILS,
          FAMILY_DETAILS,
          EMPLOYMENT_HISTORY,
          EDUCATIONAL_QUALIFICATIONS,
          PROFESSIONAL_QUALIFICATIONS,
          PROFESSIONAL_REFERENCE,
          IDENTITY_DETAILS,
          DECLARATION,
          ADDITIONAL_INFORMATION,
        } = action.payload;

        let questionsArr = [];
        DECLARATION?.forEach((curr) => {
          curr?.questionnaireQuestions?.forEach((question) => {
            questionsArr.push({
              question: question.questionName,
              answer: question.answer,
              questionTypeName: question.questionTypeName,
              isMandatory: question.isMandatory,
            });
          });
        });

        let errorCheckingForSubmit = {
          PERSONAL_PERTICULAR: false,
          ADDRESS_DETAILS: false,
          FAMILY_DETAILS: false,
          EMPLOYMENT_HISTORY: false,
          EDUCATIONAL_QUALIFICATIONS: false,
          PROFESSIONAL_QUALIFICATIONS: false,
          PROFESSIONAL_REFERENCE: false,
          IDENTITY_DETAILS: false,
          DECLARATION: false,
          ADDITIONAL_INFORMATION: false,
        };

        if (!PERSONAL_PERTICULAR || PERSONAL_PERTICULAR?.firstName === "") {
          errorCheckingForSubmit.PERSONAL_PERTICULAR = true;
        }

        if (!ADDRESS_DETAILS?.length) {
          errorCheckingForSubmit.ADDRESS_DETAILS = true;
        }

        // if (!FAMILY_DETAILS) {
        //   errorCheckingForSubmit.FAMILY_DETAILS = true;
        // }

        if (
          !EMPLOYMENT_HISTORY?.candidatesEmployeeHistory?.length &&
          !EMPLOYMENT_HISTORY?.candidateEmploymentGaps?.length
        ) {
          errorCheckingForSubmit.EMPLOYMENT_HISTORY = true;
        }

        if (!EDUCATIONAL_QUALIFICATIONS?.length) {
          errorCheckingForSubmit.EDUCATIONAL_QUALIFICATIONS = true;
        }

        if (!PROFESSIONAL_QUALIFICATIONS?.length) {
          errorCheckingForSubmit.PROFESSIONAL_QUALIFICATIONS = true;
        }

        if (
          !PROFESSIONAL_REFERENCE?.length ||
          (PROFESSIONAL_REFERENCE?.length &&
            !PROFESSIONAL_REFERENCE[0]?.referencedetails?.length)
        ) {
          errorCheckingForSubmit.PROFESSIONAL_REFERENCE = true;
        }

        if (!IDENTITY_DETAILS?.birthCountryId) {
          errorCheckingForSubmit.IDENTITY_DETAILS = true;
        }

        //DECLARATION
        let ansflag = false;
        questionsArr.forEach((curr) => {
          if (curr.answer === null && curr.isMandatory) {
            return (ansflag = true);
          }
        });
        if (ansflag) {
          errorCheckingForSubmit.DECLARATION = true;
        }

        ADDITIONAL_INFORMATION?.map((curr, ind) => {
          if (!(curr.savedFormName || curr.savedFormName)) {
            errorCheckingForSubmit.ADDITIONAL_INFORMATION = true;
          }
        });

        return {
          ...state,
          candidateDetails: action.payload,
          checkCandidateSectionsAreSubmitted: errorCheckingForSubmit,
        };
      }
      return {
        ...state,
        candidateDetails: action.payload,
      };
    }
    case CANDIDATE_INITIAL_DETAILS:
      return {
        ...state,
        candidateInitialDetails: action.payload,
      };
    case CANDIDATE_DISPLAY_API_ERROR:
      return {
        ...state,
        apiErrorMsg: action.payload,
      };
    case CANDIDATE_CLEAR_API_ERROR:
      return {
        ...state,
        apiErrorMsg: null,
      };
    case CANDIDATE_CACHED_DETAILS:
      return {
        ...state,
        candidateCachedDetails: {
          ...state.candidateCachedDetails,
          ...action.payload,
        },
      };
    case PERSONAL_PARTICULAR:
      return {
        ...state,
        personalParticularData: action.payload,
      };
    case ADDRESS_DETAILS:
      return {
        ...state,
        addressDetailsData: action.payload,
      };
    case FAMILY_DETAILS:
      return {
        ...state,
        familyDetailsData: action.payload,
      };
    case EMPLOYMENT_HISTORY:
      return {
        ...state,
        employmentHistoryData: action.payload,
      };
    case EDUCATIONAL_QUALIFICATIONS:
      return {
        ...state,
        educationalQualificationsData: action.payload,
      };
    case PROFESSIONAL_QUALIFICATIONS:
      return {
        ...state,
        professionalQualificationsData: action.payload,
      };
    case PROFESSIONAL_REFERENCE:
      return {
        ...state,
        professionalReferenceData: action.payload,
      };
    case IDENTITY_DETAILS:
      return {
        ...state,
        identityData: action.payload,
      };
    case DECLARATION:
      return {
        ...state,
        declarationData: action.payload,
      };
    case ADDITIONAL_INFORMATION:
      return {
        ...state,
        additionalInformationData: action.payload,
      };
    case CANDIDATE_SIDEBAR_STATE:
      return {
        ...state,
        candidateSidebarState: action.payload,
      };
    case CANDIDATE_SECTION_BACK_URL:
      return {
        ...state,
        candidateSectionBackUrl: action.payload,
      };
    case CANDIDATE_SECTION_SUBMIT_HANDLER:
      return {
        ...state,
        candidateSectionSubmitHandler: action.payload,
      };
    case CANDIDATE_SECTION_DISABLE_SUBMTI_BTN:
      return {
        ...state,
        candidateSectionDisableSubmitBtn: action.payload,
      };
    case GET_CANDIDATE_EDUCATION_TYPES:
      return {
        ...state,
        educationTypes: placeOtherDropdownAtLast(action.payload),
      };
    case GET_CANDIDATE_EMPLOYMENT_BONUS_TYPES:
      return {
        ...state,
        bonusTypes: placeOtherDropdownAtLast(action.payload),
      };
    case GET_CANDIDATE_EMPLOYMENT_CAREER_GAPS_TYPES:
      return {
        ...state,
        careerGapsTypes: placeOtherDropdownAtLast(action.payload?.reasonOFGaps),
      };
    case GET_CANDIDATE_EMPLOYMENT_REASON_OF_LEAVING_TYPES:
      return {
        ...state,
        reasonOfLeavingTypes: placeOtherDropdownAtLast(action.payload),
      };
    case GET_CANDIDATE_EMPLOYMENT_SALARY_FREQUENCY_TYPES:
      return {
        ...state,
        salaryFreq: placeOtherDropdownAtLast(action.payload),
      };
    case GET_CANDIDATE_EMPLOYMENT_TYPES:
      return {
        ...state,
        employmentTypes: placeOtherDropdownAtLast(
          action.payload?.employmentTypes
        ),
      };
    case GET_CANDIDATE_PROFESSIONAL_RELATIONS_TYPES:
      return {
        ...state,
        professionalRelationsTypes: placeOtherDropdownAtLast(
          action.payload?.professionalReferenceReationship
        ),
      };
    case GET_CANDIDATE_EDUCATION_QUALIFICATION_TYPES:
      return {
        ...state,
        qualificationTypes: placeOtherDropdownAtLast(
          action.payload?.employmentTypes
        ),
      };
    case GET_CANDIDATE_PROFESSIONAL_QUALIFICATION_TYPES:
      return {
        ...state,
        qualificationStatuses: placeOtherDropdownAtLast(
          action.payload?.professionalQualificationStatus
        ),
      };
    case GET_CURRENCIES:
      return {
        ...state,
        currencies: action.payload,
      };
    case GET_LANGUAGES:
      return {
        ...state,
        languages: action.payload,
      };
    case GET_IDENTITY_DOCUMENT_TYPES_LISTS:
      let finalData = action.payload;

      if (!finalData?.length && finalData !== null) {
        finalData = [{ type: "OTHER" }];
      }

      return {
        ...state,
        identityDocumentTypeLists: finalData,
      };
    case CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
