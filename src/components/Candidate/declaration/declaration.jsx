import { useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { declarationValidationSchema } from "../helpers/validationSchema/declaration";
import { Box, Typography } from "@mui/material";
import { getSectionData } from "../utils/getSectionData";
import Questionnaire from "../../common/Questionnaire";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useRef } from "react";
import {
  getDeclarationData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import { useEffect } from "react";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
} from "../../../store/actions/actionTypes";
import { toCheckIfDeclarationAlreadySubmitted } from "./utils/toCheckIfDeclarationAlreadySubmitted";
import CircularLoader from "../../../common/CircularLoader";
import { setNestedObjectValues } from "formik";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateDeclarationPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const toCacheValues = useRef();
  const declarationForm = useRef();

  const {
    loading,
    candidateInitialDetails,
    candidateCachedDetails,
    declarationData,
    candidateSectionLoading,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const declarationDataRef = useRef();
  declarationDataRef.current = declarationData;

  let candidateCachedDetailsForComponent =
    candidateCachedDetails && candidateCachedDetails["DECLARATION"];

  useEffect(() => {

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getDeclarationData(logDetails));
  }, []);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "DECLARATION",
      candidateProfileSections,
      allowProfileEdit
    );

    //passing back url for the back btn present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_BACK_URL,
      payload: data?.urls?.backUrl,
    });

    return data;
  }, [candidateProfileSections]);

  const declarations = useMemo(() => {
    let tempDec = declarationData || [];

    if (
      !declarationData ||
      !declarationData?.length ||
      !toCheckIfDeclarationAlreadySubmitted(declarationDataRef.current, true)
    ) {
      tempDec = candidateCachedDetailsForComponent?.length
        ? candidateCachedDetailsForComponent
        : declarationData;
    }

    tempDec = tempDec?.map((curr, index) => {
      return {
        ...curr,
        isExpanded: index === tempDec.length - 1,
      };
    });

    return tempDec;
  }, [declarationData, candidateCachedDetails]);

  useEffect(() => {
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () => {
        handleSubmit(
          declarationForm?.current?.values,
          declarationForm?.current
        );
      },
    });

    return () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      // dispatch({
      //   type: DECLARATION,
      //   payload: [],
      // });

      //caching when dismounts
      if (
        (!declarationDataRef.current ||
          !declarationDataRef.current.length ||
          !toCheckIfDeclarationAlreadySubmitted(declarationDataRef.current)) &&
        toCacheValues.current
      ) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );
        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            toCacheValues.current?.map((declaration, index) => ({
              isExpanded: index === 0,
              candidateQuestionnairesId: declaration.candidateQuestionnairesId,
              questionnaireName: declaration.questionnaireName,
              questionnaireQuestions: declaration.questionnaireQuestions.map(
                (question) => ({
                  candidateQuestionnairesQuestionsId:
                    question.candidateQuestionnairesQuestionsId,
                  candidateQuestionnaireId: question.candidateQuestionnaireId,
                  questionTypeId: question.questionTypeId,
                  questionTypeName: question.questionTypeName,
                  questionName: question.questionName,
                  answer: question.answer,
                  answerChoice: question.answerChoice,
                  questionOrder: question.questionOrder,
                  isMandatory: question.isMandatory,
                })
              ),
            })),
            "DECLARATION"
          )
        );
      }
    };
  }, []);

  const handleSubmit = async (values, form) => {
    try {
      if (form && values) {
        //we cannot make next btn in candidate nav section as type submit because it is not wrapped in formik form
        //so that's why to validate the form on onClick we have added validateForm()
        const validationErrors = await form.validateForm();

        //to stop the api call when there are errors , we will simply return
        if (Object.keys(validationErrors)?.length) {
          //since we are submitting our form on 'onClick' event on next btn fields wont get touched
          //so we have to explicitly touch them so that validation error msgs below fields can get displayed
          //and this can be achieved by using 'setTouched' &  'setNestedObjectValues' which is provided by formik
          return form.setTouched(setNestedObjectValues(validationErrors, true));
        }

        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "handleSubmit"
        );

        if (values?.declarations?.length) {
          dispatch(
            submitCandidateDetails(
              {
                DECLARATION: values.declarations.map((declaration) => ({
                  candidateQuestionnairesId:
                    declaration.candidateQuestionnairesId,
                  questionnaireQuestions:
                    declaration.questionnaireQuestions.map((question) => {
                      let temp = {
                        answer: question.answer,
                        questionTypeId: question.questionTypeId,
                        candidateQuestionnaireId:
                          question.candidateQuestionnaireId,
                        candidateQuestionnairesQuestionsId:
                          question.candidateQuestionnairesQuestionsId,
                      };

                      // yes/no justification
                      if (
                        question?.questionTypeId === 5 &&
                        question?.answer?.answeroption === "Yes"
                      ) {
                        delete question?.answer?.justification;
                      }

                      return temp;
                    }),
                })),
              },
              "declaration",
              () => {
                toCacheValues.current = [];
                navigate(
                  sectionData?.urls?.nextUrl || "/candidate/profile/review"
                );
              },
              sectionData?.section?.onHold,
              sectionData?.section?.candidatesProfileSectionsId,
              navigate,
              logDetails
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {!loading && !candidateSectionLoading && declarations?.length ? (
        <>
          <Questionnaire
            declarationsData={declarations}
            validationSchema={declarationValidationSchema}
            sectionData={sectionData}
            toCacheValues={toCacheValues}
            toCheckIfDeclarationAlreadySubmitted={
              toCheckIfDeclarationAlreadySubmitted
            }
            declarationDataRef={declarationDataRef}
            declarationForm={declarationForm}
            hideBackNextBtn={true}
          />
        </>
      ) : declarations?.length === 0 ? (
        <Box
          sx={{
            backgroundColor: theme.palette.grey[150],
            borderRadius: "12px",
          }}
          p={2}
        >
          <Typography fontSize="1rem" fontWeight="600" textAlign="center">
            No Declaration Present
          </Typography>
        </Box>
      ) : (
        <CircularLoader />
      )}
    </Fragment>
  );
};

export { CandidateDeclarationPage };
