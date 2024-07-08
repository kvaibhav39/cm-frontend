import { useMemo, Fragment } from "react";
import { FastField, Form, Formik } from "formik";
import {
  Box,
  Divider,
  Slider,
  Stack,
  Typography,
  useTheme,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  BaseAccordion,
  BaseCheckboxGroup,
  BaseRadioGroup,
  BaseTextField,
  StyledSwitchCard,
} from "../base";
import { LoadingButton } from "@mui/lab";
import { StyledBasePaper } from "../base/styled";
import AlertMessageComponent from "../../common/AlertMessageComponent";
import DisplaySectionHeading from "../Candidate/common/DisplaySectionHeading";

const Questionnaire = ({
  questions,
  validationSchema,
  sectionData = undefined,
  declarationsData = [],
  alwaysExpanded = false,
  toCacheValues = { current: undefined },
  toCheckIfDeclarationAlreadySubmitted = () => {},
  declarationDataRef = { current: undefined },
  declarationForm = { current: undefined },
  hideBackNextBtn = false,
  handleSubmit = () => {},
}) => {
  const theme = useTheme();

  const declarations = useMemo(() => {
    let finalDeclarations = questions?.length
      ? [{ questionnaireQuestions: questions }]
      : declarationsData;

    finalDeclarations?.forEach((declaration, index) => {
      declaration.questionnaireQuestions?.forEach((question, qIndex) => {
        if (question?.questionTypeId === 4) {
          //setting 'answers' field with some initial values as per the critera texts to
          //avoid them being null which gets sent through api and causes issues further
          let newAnswers = [];
          question?.answerChoice?.ratingCriteriaText?.forEach((curr) => {
            //finding if the criteria text is already rated or not in the answers
            let ifPresent = question?.answer?.find(
              (ans) => ans?.answeroption === curr
            );

            newAnswers.push(
              ifPresent || {
                answeroption: curr,
                rating: question?.answerChoice?.maxScale - 1,
              }
            );
          });

          question.answer = newAnswers;

          //setting a new 'labels' field to display markers on the slider
          let labels = [];
          for (
            let i = question?.answerChoice?.minScale;
            i <= question?.answerChoice?.maxScale;
            i++
          ) {
            labels.push({
              value: i,
              label: i,
            });
          }
          question.labels = labels;
        }

        if (question?.questionTypeId === 5) {
          question.answer = {
            answeroption: question?.answer?.answeroption || null,
            justification: question?.answer?.justification || null,
          };
        }
      });
    });

    return finalDeclarations;
  }, [declarationsData]);

  return (
    <Box
      pt={sectionData ? "none" : 2}
      maxWidth={sectionData ? "none" : { xs: "100vw", md: "80vw" }}
      margin={sectionData ? "none" : "0 auto"}
      height={sectionData ? "none" : "90%"}
      overflow={sectionData ? "none" : "scroll"}
    >
      {(questions?.length ||
        declarationsData?.length ||
        declarations?.length) && (
        <StyledBasePaper>
          <Formik
            enableReinitialize
            initialValues={{ declarations }}
            validationSchema={validationSchema}
            innerRef={declarationForm}
          >
            {(form) => {
              if (toCacheValues) {
                toCacheValues.current = form.values?.declarations;
              }
              return (
                <>
                  <Box mb={2}>
                    {sectionData &&
                    (!declarationsData ||
                      !declarationsData.length ||
                      !toCheckIfDeclarationAlreadySubmitted(
                        declarationDataRef.current,
                        true
                      )) ? (
                      <AlertMessageComponent
                        cond={() => {
                          return (
                            !declarationsData ||
                            !declarationsData.length ||
                            !toCheckIfDeclarationAlreadySubmitted(
                              declarationDataRef.current,
                              true
                            )
                          );
                        }}
                        toCacheValues={toCacheValues.current}
                        sectionDetails={declarationsData}
                        ifSectionDeclaration={true}
                        CONSTANT="DECLARATION"
                      />
                    ) : null}
                  </Box>
                  <DisplaySectionHeading
                    icon="ApprovalOutlined"
                    text={
                      sectionData
                        ? sectionData?.section?.candidateRequiredInfoText ||
                          "Please answer below questions/ Provide Your Declarations."
                        : "Please answer below questions to provide your reference."
                    }
                  />
                  <Form>
                    <Stack spacing={{ xs: 2, md: 3 }}>
                      {form.values.declarations?.map((declaration, index) => (
                        <Fragment key={index}>
                          <BaseAccordion
                            key={index}
                            index={index}
                            expanded={
                              alwaysExpanded
                                ? alwaysExpanded
                                : declaration.isExpanded || false
                            }
                            toRemoveAccordionIcon={alwaysExpanded}
                            listValues={form?.values?.declarations}
                            listKey={"declarations"}
                            setFieldValue={form?.setFieldValue}
                            headerbg={theme.palette.accordion.bg}
                            bordercolor={theme.palette.accordion.border}
                            header={
                              <Box
                                px={{ xs: 1, md: 4 }}
                                width={"100%"}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                              >
                                <Box
                                  display="flex"
                                  flexDirection={{
                                    xs: "column",
                                    md: "row",
                                  }}
                                >
                                  <Typography
                                    color={theme.palette.grey[700]}
                                    fontWeight="700"
                                    fontSize={{
                                      xs: "17px",
                                      md: "20px",
                                    }}
                                  >
                                    {sectionData
                                      ? `Declaration ${index + 1}`
                                      : `Reference`}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          >
                            {declaration.questionnaireQuestions?.map(
                              (question, qIndex) => (
                                <Box py={{ xs: 1, md: 2 }} key={qIndex}>
                                  <StyledSwitchCard
                                    bgcolor={theme.palette.accordion.bg}
                                    px={{
                                      xs: 2,
                                      md: "0rem 1.5rem 0.5rem 2rem",
                                    }}
                                  >
                                    <Typography
                                      component="span"
                                      fontSize={17}
                                      fontWeight={500}
                                    >
                                      <Typography
                                        component="span"
                                        fontSize={18}
                                        fontWeight={500}
                                        mr={2}
                                      >
                                        Q{question.questionOrder}
                                      </Typography>
                                      {question.questionName}
                                    </Typography>
                                  </StyledSwitchCard>

                                  <Box mt={3}>
                                    {question.questionTypeId === 1 ? (
                                      <FastField
                                        rows={4}
                                        multiline
                                        component={BaseTextField}
                                        name={`declarations.${index}.questionnaireQuestions.${qIndex}.answer`}
                                      />
                                    ) : question.questionTypeId === 2 ? (
                                      <FastField
                                        size="2rem"
                                        name={`declarations.${index}.questionnaireQuestions.${qIndex}.answer`}
                                        component={BaseRadioGroup}
                                        labelProps={{
                                          fontSize: "1.1rem",
                                          fontWeight: 500,
                                        }}
                                        options={question.answerChoice?.answerChoice?.map(
                                          (v) => ({ label: v, value: v })
                                        )}
                                      />
                                    ) : question.questionTypeId === 3 ? (
                                      <FastField
                                        component={BaseCheckboxGroup}
                                        size="1.8rem"
                                        name={`declarations.${index}.questionnaireQuestions.${qIndex}.answer`}
                                        labelProps={{
                                          fontSize: "1rem",
                                          fontWeight: 500,
                                        }}
                                        options={question.answerChoice?.answerChoice?.map(
                                          (v) => ({ label: v, value: v })
                                        )}
                                      />
                                    ) : question.questionTypeId === 4 ? (
                                      <Box
                                        border={(theme) =>
                                          `1px solid ${theme.palette.grey[400]}`
                                        }
                                        borderRadius={1}
                                      >
                                        <Typography
                                          textAlign="center"
                                          fontWeight={550}
                                          borderBottom={(theme) =>
                                            `1px solid ${theme.palette.grey[400]}`
                                          }
                                          p={2}
                                        >
                                          How would you rate the candidate in
                                          the following areas?
                                        </Typography>

                                        {question.answerChoice.ratingCriteriaText.map(
                                          (criteria, cIndex) => {
                                            return (
                                              <Box
                                                key={cIndex}
                                                display="flex"
                                                alignItems="center"
                                                width="100%"
                                                borderBottom={(theme) =>
                                                  `1px solid ${theme.palette.grey[400]}`
                                                }
                                                flexDirection={{
                                                  xs: "column",
                                                  md: "row",
                                                }}
                                              >
                                                <Box
                                                  width={{
                                                    xs: "100%",
                                                    md: "40%",
                                                  }}
                                                >
                                                  <Typography
                                                    p={2}
                                                    textAlign={{
                                                      xs: "center",
                                                      md: "left",
                                                    }}
                                                  >
                                                    {criteria}
                                                  </Typography>
                                                </Box>
                                                <Box
                                                  width={{
                                                    xs: "100%",
                                                    md: "60%",
                                                  }}
                                                  p={1}
                                                  borderLeft={{
                                                    xs: "none",
                                                    md: `1px solid ${theme.palette.grey[400]}`,
                                                  }}
                                                  borderTop={{
                                                    md: "none",
                                                    xs: `1px solid ${theme.palette.grey[400]}`,
                                                  }}
                                                >
                                                  <FastField
                                                    component={BaseRadioGroup}
                                                    name={`declarations.${index}.questionnaireQuestions.${qIndex}.answer.${cIndex}.rating`}
                                                    options={question?.answerChoice?.scales?.map(
                                                      (curr) => ({
                                                        value:
                                                          curr?.scaleNumber,
                                                        label: curr?.scaleText,
                                                      })
                                                    )}
                                                    takeInputInNumber={true}
                                                  />
                                                </Box>
                                              </Box>
                                            );
                                          }
                                        )}
                                        {form.errors &&
                                        form.errors?.declarations &&
                                        form.errors?.declarations[index]
                                          ?.questionnaireQuestions[3]?.answer &&
                                        form.touched &&
                                        form.touched?.declarations &&
                                        form.touched?.declarations[index]
                                          ?.questionnaireQuestions[3]
                                          ?.answer ? (
                                          <Typography
                                            sx={{
                                              color: "#f44336",
                                              fontSize: "small",
                                              marginTop: "0.25rem",
                                            }}
                                          >
                                            {Array.isArray(
                                              form.errors?.declarations[index]
                                                ?.questionnaireQuestions[3]
                                                ?.answer
                                            )
                                              ? form.errors?.declarations[
                                                  index
                                                ]?.questionnaireQuestions[3]?.answer?.find(
                                                  (curr) => curr
                                                )?.rating
                                              : form.errors?.declarations[index]
                                                  ?.questionnaireQuestions[3]
                                                  ?.answer}
                                          </Typography>
                                        ) : null}
                                      </Box>
                                    ) : question.questionTypeId === 5 ? (
                                      <>
                                        <FastField
                                          size="2rem"
                                          name={`declarations.${index}.questionnaireQuestions.${qIndex}.answer.answeroption`}
                                          component={BaseRadioGroup}
                                          labelProps={{
                                            fontSize: "1.1rem",
                                            fontWeight: 500,
                                          }}
                                          options={question.answerChoice?.answerChoice?.map(
                                            (v) => ({ label: v, value: v })
                                          )}
                                        />

                                        {question?.answer?.answeroption ===
                                        "No" ? (
                                          <FastField
                                            label="Please provide your reason for your answer"
                                            name={`declarations.${index}.questionnaireQuestions.${qIndex}.answer.justification`}
                                            component={BaseTextField}
                                            rows={4}
                                            multiline
                                            mt={1}
                                          />
                                        ) : null}
                                      </>
                                    ) : null}
                                  </Box>
                                  {qIndex !==
                                    declaration.questionnaireQuestions.length -
                                      1 && (
                                    <Box mt={4}>
                                      <Divider />
                                    </Box>
                                  )}
                                </Box>
                              )
                            )}
                          </BaseAccordion>
                        </Fragment>
                      ))}
                    </Stack>

                    {/*to hide back and next btn for candidate declarations */}
                    {!hideBackNextBtn ? (
                      <Box
                        mt={6}
                        display={"flex"}
                        className="space-x-4"
                        justifyContent={"center"}
                      >
                        <LoadingButton
                          onClick={() => handleSubmit(form)}
                          color="primary"
                          variant="contained"
                        >
                          Submit
                        </LoadingButton>
                      </Box>
                    ) : null}
                  </Form>
                </>
              );
            }}
          </Formik>
        </StyledBasePaper>
      )}
    </Box>
  );
};

export default Questionnaire;
