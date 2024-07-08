import moment from "moment";
import RiskLevelIcon from "../assets/RiskLevelIcon";
import { riskLevelColorsAndIcons } from "../assets/riskLevelColorsAndIcons";
import { Text, View } from "@react-pdf/renderer";

export const verificationReferenceFields = (
  data,
  matchedSubCheck,
  commonStyles,
  refereeQuestionsAnswers
) => {
  let questionnaires = [];
  let candidateRating = [];

  let selectedValue = refereeQuestionsAnswers?.find(
    (curr) => curr?.refereeEmail === data?.email
  );

  selectedValue?.questionsAnswers?.forEach((question) => {
    //question type id = 1 or 2
    if (
      question?.candidateRefereeQuestionnairesQuestions?.questionTypeId === 1 ||
      question?.candidateRefereeQuestionnairesQuestions?.questionTypeId === 2
    ) {
      questionnaires.push({
        param: question?.candidateRefereeQuestionnairesQuestions?.questionName,
        paramVerifierValue: question?.answer,
      });
    }

    //question type id = 3
    if (
      question?.candidateRefereeQuestionnairesQuestions?.questionTypeId === 3
    ) {
      questionnaires.push({
        param: question?.candidateRefereeQuestionnairesQuestions?.questionName,
        paramVerifierValue: question?.answer
          ?.map((curr, index) =>
            index !== question?.answer?.length - 1 ? curr + ", " : curr
          )
          .join(""),
      });
    }

    //question type id = 4
    if (
      question?.candidateRefereeQuestionnairesQuestions?.questionTypeId === 4
    ) {
      let finalObj = {
        heading:
          question?.candidateRefereeQuestionnairesQuestions?.questionName,
        ratingScales: [],
        ratingCriteriaTexts:
          question?.candidateRefereeQuestionnairesQuestions?.answerChoice
            ?.ratingCriteriaText,
        ratingValues: [],
      };

      //storing scaleNames
      finalObj.ratingScales =
        question?.candidateRefereeQuestionnairesQuestions?.answerChoice?.scales?.map(
          (curr) => curr?.scaleText
        );

      //storing criteria text & answer
      question?.answer?.forEach((option) => {
        finalObj.ratingValues.push({
          param: option?.answeroption,
          paramSelectedValue:
            question?.candidateRefereeQuestionnairesQuestions?.answerChoice?.scales?.find(
              (curr) => curr?.scaleNumber === option?.rating
            )?.scaleText,
        });
      });

      candidateRating.push(finalObj);
    }

    //question type id = 5
    if (
      question?.candidateRefereeQuestionnairesQuestions?.questionTypeId === 5
    ) {
      let answer = question?.answer?.answeroption;
      let justification = question?.answer?.justification;

      questionnaires.push({
        param: question?.candidateRefereeQuestionnairesQuestions?.questionName,
        renderParamValue: (
          <View style={[commonStyles.displayFlexColumn]}>
            <View
              style={[
                commonStyles.displayFlexRow,
                commonStyles.alignItemsCenter,
              ]}
            >
              <RiskLevelIcon
                path={
                  riskLevelColorsAndIcons(
                    answer === "Yes"
                      ? "Reference_check_select"
                      : "Reference_check_deselect"
                  ).icon
                }
              />
              <Text
                style={{
                  color: riskLevelColorsAndIcons(
                    answer === "Yes"
                      ? "Reference_check_select"
                      : "Reference_check_deselect"
                  ).color,
                }}
              >
                Yes
              </Text>
            </View>
            <View
              style={[
                commonStyles.displayFlexRow,
                commonStyles.alignItemsCenter,
                commonStyles.paddingTop4,
              ]}
            >
              <RiskLevelIcon
                path={
                  riskLevelColorsAndIcons(
                    answer === "No"
                      ? "Reference_check_select"
                      : "Reference_check_deselect"
                  ).icon
                }
              />
              <Text
                style={{
                  color: riskLevelColorsAndIcons(
                    answer === "No"
                      ? "Reference_check_select"
                      : "Reference_check_deselect"
                  ).color,
                  // whiteSpace: "normal !important",
                  // wordBreak: "break-word !important",
                  whiteSpace: "normal !important",
                  wordWrap: "break-word !important",
                }}
              >
                {`No ${
                  answer === "No"
                    ? `, please provide reason: ${justification}`
                    : ""
                }`}
              </Text>
            </View>
          </View>
        ),
      });
    }
  });

  if (!selectedValue?.NotResponded && selectedValue?.isDeclined) {
    questionnaires = [{
      param: "Reason for Decline",
      paramVerifierValue: selectedValue?.reasonOfDecline,
    }]
  }

  let finalFields = {
    startFromNewPage: true,
    fieldValue: [
      {
        param: "Check Summary",
        paramValue: matchedSubCheck?.checkSummary || "Pending",
        paramIcon: (
          <RiskLevelIcon
            path={
              riskLevelColorsAndIcons(
                matchedSubCheck?.subCheckVerificationResultStatusName ||
                  "Pending"
              ).icon
            }
          />
        ),
      },
      {
        param: "Entity Name",
        paramValue: matchedSubCheck?.entityName || "-",
      },
      {
        param: "Supplement Information",
        paramValue: data?.supplementInformation || "-",
      },
    ],
    candidateInputPresent: false,
    verifierInputPresent: true,
    verificationDetails: questionnaires,
    candidateRating,
  };

  // if (!selectedValue?.NotResponded && !selectedValue?.isDeclined) {
  if (!selectedValue?.NotResponded) {
    finalFields.verifierDetails = {
      heading: "Referee Details",
      values: [
        {
          param: "Referee Name",
          paramValue: selectedValue?.refereeName || "-",
        },
        {
          param: "Referee Title ",
          paramValue: selectedValue?.refereeTitle || "-",
        },
        {
          param: "Referee Contact details",
          paramValue: `${selectedValue?.refereeEmail || "-"} ${
            selectedValue?.refereePhoneNumber
              ? ` (${selectedValue?.refereePhoneNumber})`
              : ""
          } `,
        },
        {
          param: "Date of Verification",
          paramValue:
            moment(selectedValue?.dateOfVerification).format("DD-MMM-YYYY") ||
            "-",
        },
      ],
    };
  }

  return finalFields;
};
