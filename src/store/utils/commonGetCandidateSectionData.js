import { errorUtils } from "../../utils/ErrorUtils";
import {
  CANDIDATE_SECTION_LOADING,
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
} from "../actions/actionTypes";
import { getCacheCandidateDetails } from "../actions/candidateAction";
import { setToastNotification } from "../actions/toastNotificationActions";
import { ERROR } from "../constant";
import { toDispatchWhenSectionIsSubmitted } from "./toDispatchWhenSectionIsSubmitted";
import { toCheckIfDeclarationAlreadySubmitted } from "../../components/Candidate/declaration/utils/toCheckIfDeclarationAlreadySubmitted";

export const commonGetCandidateSectionData = async (
  logDetails,
  runAction,
  CONSTANT,
  dispatch
) => {
  try {
    //setting reducer constants to null before call because we have removed enableReinitialize from formik
    //in address, employment, education, professional qualification, professional reference sections.
    //So formik wont take the latest values from the response of get section data api &
    //it will take the already saved old data present in reducer.So that's why we have made it
    //null so that once the value gets fetched then only the formik part can get rendered with latest values
    dispatch({ type: CONSTANT, payload: null });

    let res = await runAction();

    //conditions for every section to check whether it's submitted or not, to skip the below cache api
    let finalRes = res?.data?.data;

    if (finalRes) {
      if (
        (CONSTANT === PERSONAL_PARTICULAR ||
          CONSTANT === FAMILY_DETAILS ||
          CONSTANT === IDENTITY_DETAILS) &&
        Object.keys(finalRes)?.length
      ) {
        return toDispatchWhenSectionIsSubmitted(dispatch, CONSTANT, res);
      }

      if (
        (CONSTANT === ADDRESS_DETAILS ||
          CONSTANT === EDUCATIONAL_QUALIFICATIONS ||
          CONSTANT === PROFESSIONAL_QUALIFICATIONS) &&
        finalRes?.length
      ) {
        return toDispatchWhenSectionIsSubmitted(dispatch, CONSTANT, res);
      }

      if (
        CONSTANT === EMPLOYMENT_HISTORY &&
        (finalRes?.candidatesEmployeeHistory?.length ||
          finalRes?.candidateEmploymentGaps?.length)
      ) {
        return toDispatchWhenSectionIsSubmitted(dispatch, CONSTANT, res);
      }

      if (
        CONSTANT === PROFESSIONAL_REFERENCE &&
        finalRes?.length &&
        finalRes[0]?.referencedetails?.length
      ) {
        return toDispatchWhenSectionIsSubmitted(dispatch, CONSTANT, res);
      }

      if (
        CONSTANT === ADDITIONAL_INFORMATION &&
        finalRes.length > 0 &&
        finalRes[0]?.savedFormCdnPath
      ) {
        return toDispatchWhenSectionIsSubmitted(dispatch, CONSTANT, res);
      }

      if (
        CONSTANT === DECLARATION &&
        finalRes.length &&
        toCheckIfDeclarationAlreadySubmitted(finalRes)
      ) {
        return toDispatchWhenSectionIsSubmitted(dispatch, CONSTANT, res);
      }
    }

    dispatch(
      getCacheCandidateDetails(logDetails, CONSTANT, {
        type: CONSTANT,
        payload: res.data.data,
      })
    );
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
