import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Field } from "formik";
import { AutoCompleteQuestionnaires } from "../../../../common/Form/AutoCompleteQuestionnaires/AutoCompleteQuestionnaires";
import "../../../../assets/scss/Package.scss";

const IntegrityCheck = ({
  checkOrderId,
  wrapperObject,
  questionnairesData,
}) => {
  return (
    <Grid item xs={12}>
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Typography variant="h5">
          Please Select the Questionnaire for candidate.
        </Typography>
        <Grid container className={"flex-container"} columns={16}>
          <Grid item xs={12} className={"min-width-100"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.questionnaireId`}
              questionnairesData={questionnairesData}
              component={AutoCompleteQuestionnaires}
            />
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default IntegrityCheck;
