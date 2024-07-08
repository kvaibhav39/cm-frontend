import React, { useEffect, useMemo, useRef, useState } from "react";
import { Field } from "formik";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  RadioGroup,
  Switch,
  Typography,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import Radio from "@mui/material/Radio";
import AddIcon from "@mui/icons-material/Add";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { InputTextField } from "../../../common/Form/InputTextField/InputTextField";
import { ButtonSwitch } from "../../../common/Form/ButtonSwitch/ButtonSwitch";
import { MaxCounterField } from "../../../common/Form/MaxCounter/MaxCounterField";
import { DeleteOutline } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import AddDraggableRatings from "./components/AddDraggableRatings";
import { uniqueId } from "lodash";
import { BaseRadioGroup } from "../../base";

const NewQuestionCard = ({
  question,
  index,
  setFieldValue,
  handleQuestionDelete,
  handleChange,
  error,
  viewMode,
  columns,
  setColumns,
  setErrors,
}) => {
  const [activeButton, setActiveButton] = useState(question?.questionTypeId);
  const [mandatorySwitch, setMandatorySwitch] = useState(question?.isMandatory);

  const theme = useTheme();

  useEffect(() => {
    if (question?.questionTypeId === 4) {
      let ratingCriteriaText = question.answerChoice.ratingCriteriaText?.map(
        (curr) => ({
          id: +uniqueId(),
          value: curr,
        })
      );
      let scales = question.answerChoice.scales?.map((curr) => ({
        ...curr,
        id: +uniqueId(),
      }));

      setColumns(
        (prev) =>
          (prev = {
            ratingCriteriaText: ratingCriteriaText || [],
            scales: scales || [],
          })
      );
    }
  }, [question?.answerChoice]);

  useEffect(() => {
    if (question?.questionTypeId === 4 && error) {
      setErrors({});
    }
  }, [columns]);

  useEffect(() => {
    setActiveButton(parseInt(question.questionTypeId));
  }, [question.questionTypeId]);

  const handleAnswerAdd = () => {
    let answerChoice = question?.answerChoice?.answerChoice
      ? [...question?.answerChoice?.answerChoice, ""]
      : [""];
    setFieldValue(
      `questions[${index}].answerChoice.answerChoice`,
      answerChoice
    );
  };

  const handleAnswerDelete = (i) => {
    //minimum 2 question options have to be present for multi select option & single select option
    if (
      question?.answerChoice?.answerChoice?.length < 3 &&
      (question.questionTypeId === 3 || question.questionTypeId === 2)
    ) {
      return;
    }

    let answerChoice = question?.answerChoice?.answerChoice.filter(
      (_, index) => index !== i
    );
    setFieldValue(
      `questions[${index}].answerChoice.answerChoice`,
      answerChoice
    );
  };

  const getAnswerPreview = useMemo(() => {
    switch (activeButton) {
      case 1:
        return (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="11px"
              padding="1rem"
            >
              This is how question will appear to user to answer.
            </Typography>
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="14px"
              padding="0rem 1rem 0rem 1rem"
              sx={{
                width: "100%",
                whiteSpace: "normal !important",
                wordWrap: "break-word !important",
              }}
            >
              Q {index + 1} . {question?.questionName}
            </Typography>
            <Grid
              item
              xs={12}
              md={11}
              sx={{
                padding: "1rem",
              }}
            >
              <Field
                name="questionAnswer"
                label="Question Answer"
                placeholder="Please answer question here"
                disabled
                multiline
                maxRows={3}
                component={InputTextField}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid item xs={12}>
            <Grid
              container
              xs={12}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              direction={{ xs: "column", sm: "row" }}
              sx={{
                padding: "1rem",
              }}
            >
              {question?.answerChoice &&
                question?.answerChoice?.answerChoice?.map((choice, i) => (
                  <Grid item xs={11} sm={4} key={i}>
                    <Field
                      name={`questions[${index}].answerChoice.answerChoice[${i}]`}
                      label="Question Answer"
                      placeholder="Please answer question here"
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {question?.answerChoice?.answerChoice?.length >
                            2 ? (
                              <IconButton
                                onClick={() => handleAnswerDelete(i)}
                                edge="end"
                                color="error"
                              >
                                <DeleteOutline />
                              </IconButton>
                            ) : null}
                          </InputAdornment>
                        ),
                      }}
                      required
                      component={InputTextField}
                    />
                  </Grid>
                ))}

              <Grid item xs={1}>
                <Button variant="contained" onClick={handleAnswerAdd}>
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
            {error && (
              <Typography
                variant="h6"
                color={theme.palette.error.main}
                fontSize="14px"
                padding="1rem"
              >
                {error}
              </Typography>
            )}
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="11px"
              padding="1rem"
            >
              This is how question will appear to user to answer.
            </Typography>
            <Grid
              container
              xs={12}
              md={11}
              direction="column"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              sx={{
                margin: "0rem 1rem 1rem 1rem",
                border: "1px solid #D6D6D6",
                borderRadius: "12px",
              }}
              p={1}
            >
              <Typography
                variant="h6"
                color={theme.palette.grey[700]}
                fontSize="14px"
                padding="0rem 1rem 0rem 1rem"
                sx={{
                  width: "100%",
                  whiteSpace: "normal !important",
                  wordWrap: "break-word !important",
                }}
              >
                Q {index + 1} . {question?.questionName}
              </Typography>
              <Grid
                item
                xs={11}
                md={11}
                sx={{
                  padding: "0rem 1rem 0 1rem",
                }}
              >
                <RadioGroup>
                  <FormGroup row>
                    {question?.answerChoice &&
                      question?.answerChoice?.answerChoice?.map(
                        (answer, index) => (
                          <FormControlLabel
                            value={answer || index}
                            control={<Radio />}
                            label={answer}
                            key={index}
                            sx={{
                              width: "100%",
                              whiteSpace: "normal !important",
                              wordBreak: "break-word !important",
                            }}
                          />
                        )
                      )}
                  </FormGroup>
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid item xs={12}>
            <Grid
              container
              xs={12}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              direction={{ xs: "column", sm: "row" }}
              sx={{
                padding: "1rem",
              }}
            >
              {question?.answerChoice &&
                question?.answerChoice?.answerChoice?.map((choice, i) => (
                  <Grid item xs={11} sm={4} key={i}>
                    <Field
                      name={`questions[${index}].answerChoice.answerChoice[${i}]`}
                      label="Question Answer"
                      placeholder="Please answer question here"
                      required
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {question?.answerChoice?.answerChoice?.length >
                            2 ? (
                              <IconButton
                                onClick={() => handleAnswerDelete(i)}
                                edge="end"
                                color="error"
                              >
                                <DeleteOutline />
                              </IconButton>
                            ) : null}
                          </InputAdornment>
                        ),
                      }}
                      component={InputTextField}
                    />
                  </Grid>
                ))}
              <Grid item xs={1}>
                <Button variant="contained" onClick={handleAnswerAdd}>
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
            {error && (
              <Typography
                variant="h6"
                color={theme.palette.error.main}
                fontSize="14px"
                padding="0 1rem"
              >
                {error}
              </Typography>
            )}
            <Grid
              container
              className={"flex-container"}
              columns={16}
              sx={{
                padding: "1rem",
              }}
            >
              <Grid item xs={5} className={"min-width-100"}>
                <Typography variant="h5" gutterBottom>
                  Number of Answers user need to select.
                </Typography>
                <Typography variant="subtitle2"></Typography>
              </Grid>
              <Grid item xs={5} className={"min-width-100 text-center"}>
                <Field
                  name={`questions[${index}].answerChoice.noOfAnswersRequired`}
                  component={MaxCounterField}
                />
              </Grid>
            </Grid>
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="11px"
              padding="1rem"
            >
              This is how question will appear to user to answer.
            </Typography>
            <Grid
              container
              xs={12}
              md={11}
              direction="column"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              sx={{
                margin: "0rem 1rem 1rem 1rem",
                border: "1px solid #D6D6D6",
                borderRadius: "12px",
              }}
              p={1}
            >
              <Typography
                variant="h6"
                color={theme.palette.grey[700]}
                fontSize="14px"
                padding="0rem 1rem 0rem 1rem"
                sx={{
                  width: "100%",
                  whiteSpace: "normal !important",
                  wordWrap: "break-word !important",
                }}
              >
                Q {index + 1} . {question?.questionName}
              </Typography>
              <Grid
                item
                xs={12}
                md={11}
                sx={{
                  padding: "0rem 1rem 0rem 1rem",
                }}
              >
                <FormGroup row>
                  {question?.answerChoice &&
                    question?.answerChoice?.answerChoice?.map(
                      (answer, index) => (
                        <FormControlLabel
                          value={answer || ""}
                          control={<Checkbox />}
                          label={answer}
                          key={index}
                          sx={{
                            width: "100%",
                            whiteSpace: "normal !important",
                            wordBreak: "break-word !important",
                          }}
                        />
                      )
                    )}
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container xs={12}>
            <Grid item xs={12} p={1}>
              <AddDraggableRatings columns={columns} setColumns={setColumns} />
            </Grid>
            {error ? (
              <Grid item xs={12} p={1}>
                <Typography
                  variant="h6"
                  color={theme.palette.error.main}
                  fontSize="14px"
                  padding="1rem"
                >
                  {error}
                </Typography>
              </Grid>
            ) : null}
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="11px"
              padding="1rem"
            >
              This is how question will appear to user to answer.
            </Typography>
            <Grid
              container
              xs={12}
              md={11}
              direction="row"
              sx={{
                margin: "0rem 1rem 1rem 1rem",
                border: "1px solid #D6D6D6",
                borderRadius: "12px",
                padding: "1rem",
              }}
            >
              <Typography
                variant="h6"
                color={theme.palette.grey[700]}
                fontSize="14px"
                padding="0rem 1rem"
                sx={{
                  width: "100%",
                  whiteSpace: "normal !important",
                  wordWrap: "break-word !important",
                }}
              >
                Q {index + 1} . {question?.questionName}
              </Typography>
              {columns &&
                columns?.ratingCriteriaText?.map((criteria, index) =>
                  criteria?.value ? (
                    <Grid
                      container
                      direction="row"
                      xs={12}
                      key={index}
                      padding="1rem 1rem 0"
                      alignItems="center"
                      gap={1}
                    >
                      <Grid
                        sm={3}
                        sx={{
                          width: "100%",
                          whiteSpace: "normal !important",
                          wordBreak: "break-word !important",
                        }}
                      >
                        {criteria?.value}
                      </Grid>
                      <Grid sm={8.5}>
                        <RadioGroup
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            whiteSpace: "normal !important",
                            wordBreak: "break-word !important",
                          }}
                        >
                          {columns?.scales?.map((ratingData, index) => (
                            <FormControlLabel
                              value={ratingData?.scaleNumber}
                              control={<Radio />}
                              label={ratingData?.scaleText}
                              key={index}
                            />
                          ))}
                        </RadioGroup>
                      </Grid>
                    </Grid>
                  ) : null
                )}
            </Grid>
          </Grid>
        );
      case 5:
        return (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="11px"
              padding="1rem"
            >
              This is how question will appear to user to answer.
            </Typography>
            <Grid
              container
              xs={12}
              md={11}
              direction="column"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              sx={{
                margin: "0rem 1rem 1rem 1rem",
                border: "1px solid #D6D6D6",
                borderRadius: "12px",
              }}
              p={1}
            >
              <Typography
                variant="h6"
                color={theme.palette.grey[700]}
                fontSize="14px"
                padding="0rem 1rem 0rem 1rem"
                sx={{
                  width: "100%",
                  whiteSpace: "normal !important",
                  wordWrap: "break-word !important",
                }}
              >
                Q {index + 1} . {question?.questionName}
              </Typography>
              <Grid
                item
                xs={11}
                md={11}
                sx={{
                  padding: "0rem 1rem 0 1rem",
                }}
              >
                <RadioGroup>
                  <FormGroup row>
                    {question?.answerChoice &&
                      question?.answerChoice?.answerChoice?.map(
                        (answer, index) => (
                          <FormControlLabel
                            value={answer || index}
                            control={<Radio />}
                            label={answer}
                            key={index}
                            sx={{
                              width: "100%",
                              whiteSpace: "normal !important",
                              wordBreak: "break-word !important",
                            }}
                          />
                        )
                      )}
                  </FormGroup>
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  }, [activeButton, question, index, error, columns, viewMode]);

  return (
    <Grid container sx={viewMode && { pointerEvents: "none" }}>
      <Grid
        item
        sm={11}
        md={11}
        direction="column"
        sx={{
          background: "rgba(243, 243, 243, 0.26)",
          border: "1px solid #DCDCDC",
          borderRadius: "12px",
          margin: "1rem 0rem",
        }}
      >
        <Grid
          container
          xs={12}
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          sx={{
            padding: "1rem",
          }}
          style={{
            backgroundColor: theme.palette.accordion.bg,
            borderRadius: "12px 12px 0px 0px",
          }}
        >
          <Grid item xs={2} sm={2} md={1}>
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="16px"
              textAlign="left"
            >
              Q {index + 1}
            </Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={2}>
            <Typography
              variant="h6"
              color={theme.palette.grey[700]}
              fontSize="16px"
              textAlign="left"
              marginBottom={{ xs: 2, sm: 0 }}
            >
              Type of Question
            </Typography>
          </Grid>
          <Grid item xs={7} sm={7} md={9}>
            <Field
              name={`questions[${index}].questionTypeId`}
              component={ButtonSwitch}
            />
          </Grid>
        </Grid>
        <Grid
          container
          xs={12}
          direction="row"
          sx={{
            padding: "1rem",
          }}
        >
          <Grid item xs={12} sm={9} lg={10}>
            <Field
              name={`questions[${index}].questionName`}
              label="Question Name"
              placeholder="Please add Question here"
              required
              multiline
              maxRows={3}
              component={InputTextField}
            />
          </Grid>
          <Grid item xs={12} sm={3} lg={2}>
            <Grid
              item
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                height: "100%",
                gap: "20px",
                marginTop: "10px",
              }}
            >
              <Typography variant="h5">Mandatory?</Typography>
              <Switch
                id={question && `question.isMandatory`}
                name={question && `question.isMandatory`}
                checked={mandatorySwitch}
                size="small"
                onChange={() => {
                  setMandatorySwitch(!mandatorySwitch);
                  handleChange({ question, mandatorySwitch });
                }}
                required={false}
              />
            </Grid>
          </Grid>
        </Grid>
        {getAnswerPreview}
      </Grid>
      {!viewMode ? (
        <Grid
          item
          xs={12}
          sm={1}
          md={1}
          style={{ padding: 20 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            style={{
              width: 60,
              height: 60,
              backgroundColor: theme.palette.error.light,
              borderRadius: 30,
            }}
            color="error"
            onClick={handleQuestionDelete}
          >
            <DeleteOutline />
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default NewQuestionCard;
