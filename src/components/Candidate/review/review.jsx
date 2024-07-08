import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Stack,
  Typography,
  CardContent,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";

import { ArrowForward, InfoOutlined } from "@mui/icons-material";
import { IconPencil } from "@tabler/icons";
import { StyledBasePaper } from "../../base/styled";
import { LoadingButton } from "@mui/lab";
import { useMemo } from "react";
import { CHECKS, SUCCESS } from "../../../store/constant";
import { useDispatch, useSelector } from "react-redux";
import ReviewPageSubmitModal from "../../../common/modals/ReviewPageSubmitModal";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { HEADERS } from "./helpers/reviewHeadersData";
import CandidateEmploymentHistoryAccordion from "./components/CandidateEmploymentHistoryAccordion";
import CandidateProfileReviewComponent from "./components/CandidateProfileReviewComponent";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
} from "../../../store/actions/actionTypes";
import { useTheme } from "@mui/material/styles";
import { submitCandidateDetails } from "../../../store/actions/candidateAction";
import CircularLoader from "../../../common/CircularLoader";
import CustomTooltip from "../../common/CustomTooltip";
import { calculate_Back_Next_Urls } from "../utils/CandidateModule_Back_Next_URLs";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import { getSectionData } from "../utils/getSectionData";
import { checkConditionToDisplayExtraFields } from "./../utils/checkConditionToDisplayExtraFields";
import ViewCandidateDetails from "../../../common/ViewCandidateDetails";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateProfileReviewPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [checkboxActive, setCheckboxActive] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState();
  const [questions, setQuestions] = useState([]);
  const dispatch = useDispatch();
  const {
    loading,
    candidateDetails,
    candidateInitialDetails,
    apiErrorMsg,
    checkCandidateSectionsAreSubmitted,
  } = useSelector((state) => state.candidate);
  const {
    candidateProfileSections,
    consentsAttachment,
    hrOrganizationName,
    allowProfileEdit,
    doNotDisplayClientName,
  } = candidateInitialDetails;

  useEffect(() => {
    if (candidateDetails) {
      let questionsArr = [];

      candidateDetails?.DECLARATION?.forEach((curr) => {
        curr?.questionnaireQuestions?.forEach((question) => {
          questionsArr.push({
            question: question.questionName,
            answer: question.answer,
            questionTypeName: question.questionTypeName,
            isMandatory: question.isMandatory,
            answerChoice: question.answerChoice,
          });
        });
      });

      setQuestions(questionsArr);
    }
  }, [loading, candidateDetails]);

  useEffect(() => {
    if (
      candidateProfileSections?.length &&
      checkCandidateSectionsAreSubmitted
    ) {
      let flag = false;

      candidateProfileSections?.map((curr) => {
        if (
          checkCandidateSectionsAreSubmitted[curr.candidateProfileSectionName]
        ) {
          return (flag = true);
        }
      });

      setDisableBtn(flag);
    }
  }, [
    candidateProfileSections,
    candidateDetails,
    checkCandidateSectionsAreSubmitted,
  ]);

  const sectionData = useMemo(
    () => getSectionData("REVIEW", candidateProfileSections, allowProfileEdit),
    [candidateProfileSections]
  );

  const tabs = useMemo(() => {
    if (candidateProfileSections?.length) {
      let url = calculate_Back_Next_Urls("REVIEW", candidateProfileSections);

      //passing back url for the back btn present in candidate nav section
      dispatch({
        type: CANDIDATE_SECTION_BACK_URL,
        payload: url?.backUrl,
      });

      let temp = [];

      candidateProfileSections?.forEach((section) => {
        if (
          section.candidateProfileSectionName !== "WELCOME" &&
          section.candidateProfileSectionName !== "REVIEW"
        )
          temp.push(section.candidateProfileSectionDisplayName);
      });

      setSelectedTab(temp[0]);

      return temp;
    }
    return [];
  }, [candidateProfileSections]);

  const handleSubmit = async () => {
    try {
      setOpenModal(false);
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      dispatch(
        submitCandidateDetails(
          {
            REVIEW: {
              accuracyConsent: true,
            },
          },
          "review",
          () => {
            dispatch(
              setToastNotification(
                SUCCESS,
                `Details Submitted successfully!`,
                logDetails
              )
            );

            window.location.reload();
          },
          null,
          null,
          null,
          logDetails
        )
      );
    } catch (error) {}
  };

  return (
    <Fragment>
      {!loading &&
      candidateProfileSections?.length &&
      tabs?.length &&
      checkCandidateSectionsAreSubmitted &&
      candidateDetails ? (
        <StyledBasePaper>
          <Box p={{ xs: 0, md: 2 }}>
            <DisplaySectionHeading
              icon={sectionData?.section?.sectionIcon}
              text="Please Review all the information that you have provided."
            />

            <Card
              sx={{
                backgroundColor: (theme) => theme.palette.grey[150],
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Typography
                    fontSize="1rem"
                    fontWeight="500"
                    marginLeft="0.5rem"
                    marginTop="0.5rem"
                  >
                    If you wish to edit any information you can click on "Edit"
                    button or use navigation menu to go to respective section
                    and make edits.
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/*all candidate sections details */}
            <ViewCandidateDetails
              tabs={tabs}
              module="candidate"
              questions={questions}
            />

            {consentsAttachment ? (
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
                      <a href={consentsAttachment} target="_blank">
                        consent
                      </a>
                    </Typography>
                  </Grid>
                </Stack>
              </Box>
            ) : null}

            <Box mt={6}>
              <Typography
                fontSize={20}
                fontWeight={500}
                color={theme.palette.primary.main}
              >
                Declaration
              </Typography>

              <Box>
                <FormControlLabel
                  sx={{ mt: 3 }}
                  control={
                    <Checkbox
                      checked={checkboxActive}
                      onChange={() => {
                        setCheckboxActive(!checkboxActive);
                        dispatch({ type: CANDIDATE_CLEAR_API_ERROR });
                      }}
                    />
                  }
                  label="To the best of my knowledge, the statements and/or information that I have provided are true, and complete and I make them freely without any reservations. I understand that such a report may contact information about my background, character and personal reputation. I further understand and agree that, in the event of my employment, an employment report or investigative report may be procured in connection with subsequent employment decisions. I hereby release liability from all persons or entities requesting or supplying such information."
                />
              </Box>

              {/* displaying error message when the api fails */}
              {apiErrorMsg && (
                <Box mt={{ xs: 3, md: 6 }}>
                  <Alert severity="error">{apiErrorMsg}</Alert>
                </Box>
              )}
            </Box>

            <Box
              mt={6}
              display={"flex"}
              className="space-x-4"
              justifyContent={"center"}
            >
              <LoadingButton
                color="primary"
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => setOpenModal(true)}
                disabled={disableBtn || !checkboxActive}
              >
                Submit My Details
              </LoadingButton>
              <ReviewPageSubmitModal
                title="Submit Details"
                description="Please ensure that you have reviewed your details carefully and have ensured that provided details are accurate. Once submitted, Your details will be locked and you will not be able to make any modifications."
                handleSubmit={handleSubmit}
                setOpenModal={setOpenModal}
                open={openModal}
              />
            </Box>
          </Box>
        </StyledBasePaper>
      ) : (
        <CircularLoader />
      )}
    </Fragment>
  );
};

export { CandidateProfileReviewPage };
