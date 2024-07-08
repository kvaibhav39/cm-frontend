import { useMemo, useState } from "react";
import { FastField, Form, Formik } from "formik";
import { Button, Grid, Typography } from "@mui/material";
import NewQuestionCard from "./NewQuestionCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputTextField } from "../../../common/Form/InputTextField/InputTextField";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import _ from "lodash";
import { checkActionPermission } from "../../../utils/CheckPageAccess";
import permissionKey from "../../constants/permissionKey";
import {
  getAddOrganizationQuestionnaire,
  getEditOrganizationQuestionnaire,
} from "../../../store/actions/hrActions";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import useTimer from "../../../hooks/useTimer";
import CircularLoader from "./../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CustomQuestionnaire = () => {
  const [searchParams] = useSearchParams();
  const { questionnaireId } = useParams();
  const usage = searchParams.get("screen");
  const navigate = useNavigate();
  const [allMandatorySwitch, setAllMandatorySwitch] = useState([]);
  const [columns, setColumns] = useState({
    ratingCriteriaText: [],
    scales: [],
  });
  const [loadingComponent, setLoadingComponent] = useTimer(100);
  const loggedInUser = useSelector((state) => state.authorization);
  const dispatch = useDispatch();
  const { state } = useLocation();

  const questionnaireFormData = useMemo(() => {
    if (state?.questionnaireName && usage === "edit") {
      return {
        questionnaireName: state?.questionnaireName,
        questionnaireDescription: state?.questionnaireDescription,
        questions: state?.QuestionnairesQuestions?.map((question) => {
          let prevQuestion = question;
          delete prevQuestion?.questionnairesQuestionsId;
          return prevQuestion;
        }),
      };
    } else if (state?.questionnaireName && usage === "saveAs") {
      return {
        questionnaireName: "",
        questionnaireDescription: "",
        questions: state?.QuestionnairesQuestions?.map((question) => {
          let prevQuestion = question;
          delete prevQuestion?.questionnairesQuestionsId;
          return prevQuestion;
        }),
      };
    } else {
      return {
        questionnaireName: "",
        questionnaireDescription: "",
        questions: [
          {
            questionTypeId: 1,
            questionName: "",
            questionDescription: "",
            questionOrder: 1,
            isMandatory: false,
          },
        ],
      };
    }
  }, [state, usage]);

  const handleQuestionAdd = (values, callback) => {
    let prevQuestions = values.questions;
    let lengthofQuestions = prevQuestions.length;
    prevQuestions.push({
      questionTypeId: 1,
      questionName: "",
      questionDescription: "",
      questionOrder: lengthofQuestions + 1,
      isMandatory: false,
    });
    callback(`questions`, prevQuestions);
  };

  const handleQuestionDelete = (index, values, callback) => {
    let updatedQuestions = values.questions;
    updatedQuestions.splice(index, 1);
    callback(`questions`, updatedQuestions);
  };

  const handleSubmit = (values, { setErrors, setSubmitting }) => {
    setSubmitting(true);
    const _params = {
      ...values,
      orgId: getLoggedInUserHrOrganizationId(),
      questionnairesId: state?.questionnairesId,
    };

    let errorObj = {};

    values.questions.forEach((question, index) => {
      if (question.questionTypeId === 2 || question.questionTypeId === 3) {
        const dup = _(question.answerChoice.answerChoice)
          .countBy()
          .reduce((acc, val, key) => (val > 1 ? acc.concat(key) : acc), [])
          .map(_.toNumber);
        if (dup.length > 0) {
          errorObj[index] = "You have entered same answer choices";
        }
      }

      if (question.questionTypeId === 4) {
        let criteriaEmpty = columns?.ratingCriteriaText?.find(
          (curr) => curr?.value === ""
        )?.value;

        let scaleTextEmpty = columns?.scales?.find(
          (curr) => curr?.scaleText === ""
        )?.scaleText;

        if (
          criteriaEmpty === "" ||
          scaleTextEmpty === "" ||
          !columns?.scales?.length
        ) {
          errorObj[index] = "Please fill all the criteria/scale fields";
        }
      }
    });

    if (Object.keys(errorObj)?.length > 0) {
      setErrors(errorObj);
      return setSubmitting(false);
    }

    //rating changes
    _params.questions?.forEach((question) => {
      if (question?.questionTypeId === 4) {
        question.answerChoice.ratingCriteriaText =
          columns?.ratingCriteriaText?.map((curr) => curr.value);
        question.answerChoice.scales = columns?.scales?.map((curr, index) => ({
          scaleNumber: index + 1,
          scaleText: curr.scaleText,
        }));
      }
    });

    //updating the isMandatory field values with the user selected ones
    _params.questions.forEach((submit) => {
      allMandatorySwitch.forEach((mandSwitch) => {
        if (
          submit.questionTypeId === mandSwitch.questionTypeId &&
          submit.questionOrder === mandSwitch.questionOrder
        ) {
          submit.isMandatory = mandSwitch.isMandatory;
        }
      });
    });

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    if (usage === "edit") {
      _params.questionnairesId = questionnaireId;

      dispatch(
        getEditOrganizationQuestionnaire(
          _params,
          () => navigate("/hr/questionnaire"),
          () => setSubmitting(false),
          logDetails
        )
      );
    } else {
      dispatch(
        getAddOrganizationQuestionnaire(
          _params,
          () => navigate("/hr/questionnaire"),
          () => setSubmitting(false),
          logDetails
        )
      );
    }
  };

  //this function will handle mandatory switch values for every question type id & their respective question order id
  const handleChange = (values) => {
    // console.log(values);
    let mandatorySwitch = !values.mandatorySwitch;
    let selectedQ = values.question;

    let temp = allMandatorySwitch;
    let newValues = [];

    if (temp.length) {
      temp.map((curr) => {
        if (
          curr.questionTypeId === selectedQ.questionTypeId &&
          curr.questionOrder === selectedQ.questionOrder
        ) {
          //if user has already manipulated the switch value of a present question , we will update it with the new one
          curr.isMandatory = mandatorySwitch;
        } else {
          //if there's a new entry i.e new question, we will simply push it
          newValues.push({
            questionTypeId: selectedQ.questionTypeId,
            questionOrder: selectedQ.questionOrder,
            isMandatory: mandatorySwitch,
          });
        }
      });
    } else {
      //intialising when allMandatorySwitch is an empty array
      newValues.push({
        questionTypeId: selectedQ.questionTypeId,
        questionOrder: selectedQ.questionOrder,
        isMandatory: mandatorySwitch,
      });
    }

    // console.log(temp);
    // console.log(newValues);
    //merging old array with the new array having new switch values for new questions
    temp = [...temp, ...newValues];

    // console.log(temp);

    setAllMandatorySwitch(temp);
  };

  const hrQuestionnaireEditAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrQuestionnaireEdit,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );
  const hrCreateQuestionnaireAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrQuestionnaireCreate,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  return (
    <>
      {loadingComponent ? (
        <CircularLoader />
      ) : (
        <Formik
          initialValues={questionnaireFormData}
          validationSchema={Yup.object().shape({
            questionnaireName: Yup.string()
              .required("Name is required")
              .max(100, "Should not exceed 50 characters"),
            questionnaireDescription: Yup.string()
              .required("Description is required")
              .max(500, "Should not exceed 50 characters"),
          })}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({
            errors,
            handleBlur,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue,
            setErrors,
          }) => (
            <Form className="customQuestionnaire">
              <Grid
                container
                item
                md={10}
                sm={12}
                spacing={3}
                sx={{ justifyContent: "flex-start" }}
              >
                <Grid item sm={12}>
                  <Typography variant="h4">
                    {searchParams.get("viewMode")
                      ? "View"
                      : usage === "edit"
                      ? "Update"
                      : "Add"}{" "}
                    Custom Questionnaire
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={11} md={11}>
                  <FastField
                    name="questionnaireName"
                    label="Questionnaire Name"
                    placeholder="Enter Questionnaire Name (upto 100 characters)"
                    required
                    component={InputTextField}
                    disabled={searchParams.get("viewMode") || false}
                    error={
                      errors?.questionnaireName && touched?.questionnaireName
                        ? errors?.questionnaireName
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={11} md={11}>
                  <FastField
                    name="questionnaireDescription"
                    label="Questionnaire Description"
                    placeholder="You may write a Questionnaire Description to help you remind in future why this Questionnaire was created(upto 500 characters)"
                    required
                    multiline
                    maxRows={4}
                    component={InputTextField}
                    disabled={searchParams.get("viewMode") || false}
                    error={
                      errors?.questionnaireDescription &&
                      touched?.questionnaireDescription
                        ? errors?.questionnaireDescription
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  {values?.questions?.map((question, index) => (
                    <NewQuestionCard
                      question={question}
                      index={index}
                      key={index}
                      setFieldValue={setFieldValue}
                      handleQuestionDelete={() =>
                        handleQuestionDelete(index, values, setFieldValue)
                      }
                      handleChange={handleChange}
                      error={errors[index]}
                      viewMode={searchParams.get("viewMode") || false}
                      columns={columns}
                      setColumns={setColumns}
                      setErrors={setErrors}
                    />
                  ))}
                </Grid>
                {!searchParams.get("viewMode") ? (
                  <Grid
                    item
                    xs={12}
                    direction="row"
                    justifyContent={{ xs: "center", sm: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleQuestionAdd(values, setFieldValue)}
                    >
                      Add More Question
                    </Button>
                  </Grid>
                ) : null}

                <Grid
                  container
                  item
                  xs={12}
                  direction="row"
                  justifyContent={{ xs: "center", sm: "flex-end" }}
                  gap={2}
                >
                  <Button
                    variant="outlined"
                    disableElevation
                    onClick={() => navigate("/hr/questionnaire")}
                  >
                    <ArrowBackIcon /> Back
                  </Button>
                  {usage === "edit" &&
                  hrQuestionnaireEditAccess &&
                  !searchParams.get("viewMode") ? (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      disableElevation
                      loading={isSubmitting}
                      disabled={
                        isSubmitting ||
                        (values?.questions?.length ? false : true)
                      }
                    >
                      Update Questionnaire
                    </LoadingButton>
                  ) : (
                    usage !== "edit" &&
                    hrCreateQuestionnaireAccess && (
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        disableElevation
                        loading={isSubmitting}
                        disabled={
                          isSubmitting ||
                          (values?.questions?.length ? false : true)
                        }
                      >
                        Create Questionnaire
                      </LoadingButton>
                    )
                  )}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default CustomQuestionnaire;
