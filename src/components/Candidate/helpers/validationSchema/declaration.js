import * as Yup from "yup";

const QUESTION_TYPE = {
  TEXT: "TEXT",
  RATING: "RATING",
  MULTI_SELECT: "MULTI SELECT",
  SINGLE_SELECT: "SINGLE SELECT",
  YES_NO: "Yes/No with Justification",
};

export const declarationValidationSchema = Yup.object().shape({
  declarations: Yup.array().of(
    Yup.object().shape({
      questionnaireQuestions: Yup.array().of(
        Yup.object().shape({
          answer: Yup.lazy((_, { parent: question, ...ctx }) => {
            try {
              let schema = Yup.mixed().nullable();

              if (question.questionTypeName === QUESTION_TYPE.TEXT) {
                schema = Yup.string()
                  .required("Field is required")
                  .typeError("Field is required");
              }

              if (question.questionTypeName === QUESTION_TYPE.SINGLE_SELECT) {
                schema = Yup.string()
                  .required("Field is required")
                  .typeError("Please select an option.");
              }

              if (question.questionTypeName === QUESTION_TYPE.MULTI_SELECT) {
                schema = Yup.array()
                  .of(Yup.string())
                  .required("Field is required")
                  .typeError("Please select options.");

                const { noOfAnswersRequired = 1 } =
                  question?.answerChoice || {};

                schema = schema.min(
                  noOfAnswersRequired,
                  `Please select at least ${noOfAnswersRequired} options.`
                );
              }

              if (question.questionTypeName === QUESTION_TYPE.RATING) {
                const { minScale = 1, maxScale = 9999 } =
                  question.answerChoice || {};
                schema = Yup.array()
                  .of(
                    Yup.object().shape({
                      rating: Yup.number()
                        .min(minScale, `Min value is ${minScale}`)
                        .max(maxScale, `Max value is ${maxScale}`),
                    })
                  )
                  .required("Field is required")
                  .typeError("Rating is required.");
              }

              if (question.questionTypeName === QUESTION_TYPE.YES_NO) {
                schema = Yup.object().shape({
                  answeroption: Yup.string()
                    .nullable()
                    .required("Field is required")
                    .typeError("Field is required"),
                  justification: Yup.string()
                    .nullable()
                    .when("answeroption", {
                      is: (answeroption) => {
                        if (answeroption === "No") {
                          return true;
                        }
                        return false;
                      },
                      then: (schema) =>
                        schema
                          .required("Field is required")
                          .typeError("Field is required"),
                    }),
                });
              }
              return schema;
            } catch (err) {
              console.log(question.candidateQuestionnairesQuestionsId, err);
            }
          }),
        })
      ),
    })
  ),
});
