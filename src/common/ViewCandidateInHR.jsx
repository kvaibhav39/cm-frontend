import React, { Fragment, useCallback, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button, Stack, Card } from "@mui/material";

import { ArrowBack, FilePresent } from "@mui/icons-material";
import { StyledBasePaper } from "../components/base/styled";
import { HEADERS } from "../components/Candidate/review/helpers/reviewHeadersData";
import CandidateEmploymentHistoryAccordion from "../components/Candidate/review/components/CandidateEmploymentHistoryAccordion";
// import CandidateProfileReviewAccordion from "../components/Candidate/review/components/CandidateProfileReviewAccordion";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCandidateDetailsById,
  getCandidateDetailsById,
} from "../store/actions/hrActions";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import CandidateProfileReviewComponent from "../components/Candidate/review/components/CandidateProfileReviewComponent";
import ScrollableGrid from "./ScrollableGrid";
import CircularLoader from "./CircularLoader";
import ViewCandidateDetails from "./ViewCandidateDetails";
import { getCurrentFileNameAndFunction } from "../utils/getCurrentFileNameAndFunction.js";

const ViewCandidateInHR = (props) => {
  const dispatch = useDispatch();
  const [dataPresent, setDataPresent] = useState(false);
  const [selectedTab, setSelectedTab] = useState();
  const { candidateDetailsById, candidateDetailsByIdLoading } = useSelector(
    (state) => state.hr
  );
  const params = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  //extrating current login's details
  const currentLoginProfile = localStorage.getItem("loginProfile");

  let { CheckMinistryUser } = JSON.parse(
    localStorage.getItem(`${currentLoginProfile}_login`)
  );

  let hrOrganizationName =
    JSON.parse(CheckMinistryUser)?.hrOrganization?.hrOrganizationName;

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getCandidateDetailsById({
        candidateCaseId: params.candidatesCasesId || props.candidatesCasesId,
        logDetails,
        //for refactor branch
      })
    );
  }, []);

  const declarationQuestions = useCallback(() => {
    return candidateDetailsById?.DECLARATION?.reduce(
      (questions, declaration) => {
        return questions.concat(
          declaration.questionnaireQuestions.reduce(
            (innerQuestions, question) => {
              return innerQuestions.concat([
                {
                  question: question.questionName,
                  answer: question.answer,
                  answerChoice: question.answerChoice,
                  questionTypeName: question.questionTypeName,
                },
              ]);
            },
            []
          )
        );
      },
      []
    );
  }, [candidateDetailsById]);

  const refereeQuestions = useCallback(() => {
    let finalQuestions = [];

    candidateDetailsById?.refereeQuestionsAnswers?.forEach((question) => {
      let obj = {
        refereeName: question?.refereeName,
        refereeEmail: question?.refereeEmail,
        companyName: question?.companyName,
        NotResponded: question?.NotResponded || false,
        isDeclined: question?.isDeclined || false,
        reasonOfDecline: question?.reasonOfDecline || null,
        questionsAnswers: [],
      };
      if (question?.questionsAnswers) {
        question?.questionsAnswers?.forEach((q) => {
          obj.questionsAnswers.push({
            question: q?.candidateRefereeQuestionnairesQuestions?.questionName,
            answer: q.answer,
            questionTypeName:
              q?.candidateRefereeQuestionnairesQuestions?.questionTypeName,
            candidateRefereeQuestionnairesQuestions:
              q?.candidateRefereeQuestionnairesQuestions,
          });
        });
      }

      finalQuestions.push(obj);
    });
    return finalQuestions;
  }, [candidateDetailsById]);

  useEffect(() => {
    if (
      candidateDetailsById?.PERSONAL_PERTICULAR ||
      candidateDetailsById?.ADDRESS_DETAILS?.length ||
      candidateDetailsById?.FAMILY_DETAILS ||
      candidateDetailsById?.EMPLOYMENT_HISTORY?.candidatesEmployeeHistory
        ?.length ||
      candidateDetailsById?.EMPLOYMENT_HISTORY?.candidateEmploymentGaps
        ?.length ||
      candidateDetailsById?.EDUCATIONAL_QUALIFICATIONS?.length ||
      candidateDetailsById?.PROFESSIONAL_QUALIFICATIONS?.length ||
      candidateDetailsById?.PROFESSIONAL_REFERENCE?.length ||
      candidateDetailsById?.IDENTITY_DETAILS ||
      (declarationQuestions() && declarationQuestions()[0]?.answer) ||
      candidateDetailsById?.ADDITIONAL_INFORMATION?.length ||
      candidateDetailsById?.supportingDocumentsForCandidate?.uploadedByCandidate
        ?.length ||
      candidateDetailsById?.supportingDocumentsForCandidate?.uploadedByOpsUser
        ?.length ||
      candidateDetailsById?.supportingDocumentsForCandidate?.uplodedByHr?.length
    ) {
      setDataPresent(true);
    }
  }, [candidateDetailsById]);

  const tabs = useMemo(() => {
    let temp = [];

    if (candidateDetailsById?.PERSONAL_PERTICULAR) {
      temp.push("Personal Details");
    }

    if (candidateDetailsById?.ADDRESS_DETAILS?.length) {
      temp.push("Address Details");
    }

    if (candidateDetailsById?.FAMILY_DETAILS) {
      temp.push("Family Details");
    }

    if (
      candidateDetailsById?.EMPLOYMENT_HISTORY?.candidatesEmployeeHistory
        ?.length ||
      candidateDetailsById?.EMPLOYMENT_HISTORY?.candidateEmploymentGaps?.length
    ) {
      temp.push("Employment History");
    }

    if (candidateDetailsById?.EDUCATIONAL_QUALIFICATIONS?.length) {
      temp.push("Educational Qualifications");
    }
    if (candidateDetailsById?.PROFESSIONAL_QUALIFICATIONS?.length) {
      temp.push("Professional License & Membership");
    }
    if (candidateDetailsById?.PROFESSIONAL_REFERENCE?.length) {
      temp.push("Professional Reference");
    }
    if (candidateDetailsById?.IDENTITY_DETAILS) {
      temp.push("Identity Details");
    }
    if (declarationQuestions() && declarationQuestions()[0]?.answer) {
      temp.push("Declaration");
    }
    if (candidateDetailsById?.ADDITIONAL_INFORMATION?.length) {
      temp.push("Additional Information");
    }

    if (
      candidateDetailsById?.supportingDocumentsForCandidate?.uploadedByCandidate
        ?.length ||
      candidateDetailsById?.supportingDocumentsForCandidate?.uploadedByOpsUser
        ?.length ||
      candidateDetailsById?.supportingDocumentsForCandidate?.uplodedByHr?.length
    ) {
      temp.push("Supporting Documents");
    }

    if (
      candidateDetailsById?.PROFESSIONAL_REFERENCE?.length &&
      candidateDetailsById?.refereeQuestionsAnswers?.length
    ) {
      temp.push("Referee Response");
    }

    setSelectedTab(temp[0]);

    return temp;
  }, [candidateDetailsById]);

  return (
    <Fragment>
      <StyledBasePaper>
        {props?.hideBackBtn ? null : (
          <Box
            mt={1}
            mb={3}
            display={"flex"}
            className="space-x-4"
            justifyContent={"left"}
          >
            <Button
              color="primary"
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => {
                if (props.candidatesCasesId) {
                  props.setOpsComponent("ops-screen");
                } else {
                  navigate("/hr/candidates");
                }
                dispatch(clearCandidateDetailsById());
              }}
            >
              Back{" "}
            </Button>
          </Box>
        )}
        <ScrollableGrid>
          {!candidateDetailsByIdLoading &&
          candidateDetailsById &&
          dataPresent &&
          tabs?.length ? (
            <>
              <ViewCandidateDetails
                tabs={tabs}
                declarationQuestions={declarationQuestions}
                refereeQuestions={refereeQuestions}
                {...props}
              />
            </>
          ) : !candidateDetailsByIdLoading &&
            tabs?.length === 0 &&
            !dataPresent ? (
            <Typography variant="h4" textAlign="center" fontWeight="700" mt={1}>
              Data Not Found
            </Typography>
          ) : (
            <CircularLoader />
          )}
          {/* {candidateDetailsById?.consentsAttachment ? (
            <Box p={{ xs: 0, md: 1 }}>
              <Stack
                mt={{ xs: 3, md: 4 }}
                spacing={3}
                sx={{
                  backgroundColor: theme.palette.grey[150],
                  borderRadius: "12px",
                }}
                p={4}
              >
                <Grid xs={12} item>
                  <Typography fontSize="1rem" fontWeight="700">
                    Candidate's submitted consent form -{" "}
                    <a
                      href={candidateDetailsById?.consentsAttachment}
                      target="_blank"
                    >
                      consent
                    </a>
                  </Typography>
                </Grid>
              </Stack>
            </Box>
          ) : null} */}
        </ScrollableGrid>{" "}
      </StyledBasePaper>
    </Fragment>
  );
};

export default ViewCandidateInHR;
