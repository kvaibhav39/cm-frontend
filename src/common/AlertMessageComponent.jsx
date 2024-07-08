import { Box, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { submitCacheCandidateDetails } from "../store/actions/candidateAction";
import useTimerForCaching from "../components/Candidate/customHooks/useTimerForCaching";
import { useSelector } from "react-redux";
import { getCurrentFileNameAndFunction } from "../utils/getCurrentFileNameAndFunction.js";

const AlertMessageComponent = ({
  cond,
  CONSTANT = "",
  toCacheValues,
  sectionDetails,
  ifSectionEmpHistory = false,
  ifSectionDeclaration = false,
  runBeforeDispatch = () => {},
  disableBtn = false,
}) => {
  const dispatch = useDispatch();

  let { candidateSectionDisableSubmitBtn } = useSelector(
    (state) => state.candidate
  );

  let cachePayload;

  if (ifSectionEmpHistory) {
    cachePayload = {
      candidatesEmployeeHistory: toCacheValues?.employments,
      candidateEmploymentGaps: toCacheValues?.employmentsGaps,
    };
  } else if (ifSectionDeclaration) {
    cachePayload = toCacheValues?.map((declaration, index) => ({
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
    }));
  } else {
    cachePayload = toCacheValues;
  }

  //caching after timer runs out
  const seconds = useTimerForCaching(
    cond,
    cachePayload,
    sectionDetails,
    CONSTANT,
    runBeforeDispatch
  );

  //caching when save btn is clicked
  const handleSaveChangesToCache = () => {
    if (CONSTANT === "ADDITIONAL_INFORMATION") {
      cachePayload = runBeforeDispatch();
    }

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSaveChangesToCache"
    );

    dispatch(
      submitCacheCandidateDetails(logDetails, cachePayload, CONSTANT, true)
    );
  };

  return (
    <Box mb={2}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent={{ xs: "center", md: "space-between" }}
        backgroundColor={(theme) => theme.palette.error.lighter}
        p={1}
        borderRadius="5px"
      >
        <Typography variant="h6" fontWeight={500} textAlign="center">
          Your progress will be automatically saved in
          <Box
            component="strong"
            display="inline-flex"
            width="45px"
            justifyContent="center"
          >
            {Math.floor(seconds / 60)
              .toString()
              .padStart(2, "0")}
            :{(seconds % 60).toString().padStart(2, "0")}{" "}
          </Box>
          , to manually save progress you may click{" "}
          <Button
            variant="contained"
            onClick={handleSaveChangesToCache}
            disabled={disableBtn || candidateSectionDisableSubmitBtn}
            size="small"
            sx={{ margin: "0 5px" }}
          >
            Save Progress
          </Button>{" "}
          at anytime. To submit the details, click the 'Next' button in the
          sidebar.
        </Typography>
      </Box>
    </Box>
  );
};

export default AlertMessageComponent;
