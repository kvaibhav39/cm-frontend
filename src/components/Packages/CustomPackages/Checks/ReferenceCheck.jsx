import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Field } from "formik";
import { useState } from "react";
import { CounterField } from "../../../../common/Form/CounterField/CounterField";
import { AutoCompleteQuestionnaires } from "../../../../common/Form/AutoCompleteQuestionnaires/AutoCompleteQuestionnaires";
import "../../../../assets/scss/Package.scss";

const ReferenceCheck = ({
  checkOrderId,
  wrapperObject,
  questionnairesData,
}) => {
  const [rolesValue, setRolesValue] = useState();

  return (
    <Grid item xs={12}>
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Grid container className={"flex-container"} columns={16}>
          <Grid item xs={5} className={"min-width-100"}>
            <Typography variant="h5" gutterBottom>
              Selected {rolesValue} number(s) of referee candidate(s) need to be
              provided.
            </Typography>
          </Grid>
          <Grid item xs={5} className={"min-width-100 text-center"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.noOfRefree`}
              setRolesValue={(val) => setRolesValue(val)}
              component={CounterField}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">
          Select the Questionnaire for Referee.
        </Typography>
        <Grid container className={"flex-container"} columns={16}>
          <Grid item xs={12} className={"min-width-100"}>
            <Field
              name={`checks[${checkOrderId}].checkScope.questionnaireId`}
              questionnairesData={questionnairesData || []}
              component={AutoCompleteQuestionnaires}
            />
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default ReferenceCheck;
