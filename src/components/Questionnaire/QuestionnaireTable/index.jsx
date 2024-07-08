import { useEffect, useState } from "react";
import QuestionsTable from "./QuestionsTable";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { Button, Grid, Checkbox, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import PanelCard from "../../../common/cards/PanelCard";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import * as React from "react";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  checkActionPermission,
  checkPagePermission,
} from "../../../utils/CheckPageAccess";
import { useMemo } from "react";
import permissionKey from "../../constants/permissionKey";
import ScrollableGrid from "../../../common/ScrollableGrid";
import { getAllQuestionnaires } from "../../../store/actions/hrActions";
import CircularLoader from "../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const Questionnaire = () => {
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState([]);
  const [showDefault, setShowDefault] = useState(false);
  const loggedInUser = useSelector((state) => state.authorization);
  const { allQuestionnaires } = useSelector((state) => state.hr);
  const dispatch = useDispatch();

  const fetchQuestions = () => {
    let params = {
      orgId: getLoggedInUserHrOrganizationId(),
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "fetchQuestions"
    );

    dispatch(getAllQuestionnaires(params, logDetails));
  };

  useEffect(() => fetchQuestions(), []);

  useEffect(() => {
    if (showDefault) {
      let newQuestionnaire = allQuestionnaires?.filter(
        (question) => question.questionnaireType === "SYSTEM"
      );
      setQuestionnaire(newQuestionnaire);
    } else {
      setQuestionnaire(allQuestionnaires);
    }
  }, [showDefault, allQuestionnaires]);

  const toggleDefault = () => {
    setShowDefault(!showDefault);
  };

  const hrCreateQuestionnaireAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrQuestionnaireCreate,
        loggedInUser.permissions
      ) &&
      checkPagePermission("/hr/questionnaire/create", loggedInUser.permissions),
    [loggedInUser.permissions]
  );

  return (
    <>
      {questionnaire?.length ? (
        <ScrollableGrid>
          <Grid
            container
            spacing={2}
            sx={{ height: "90vh" }}
            mt={{ xs: 8, md: -2 }}
          >
            <Grid item md={2} sm={12} xs={12}>
              <PanelCard>
                <List>
                  <ListItem key={"default"} disablePadding>
                    <ListItemButton
                      role={undefined}
                      sx={{
                        padding: "0px",
                        height: "2rem",
                      }}
                      onClick={toggleDefault}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          icon={<RadioButtonUnchecked />}
                          sx={{ py: 0, px: 2 }}
                          checkedIcon={<CheckCircle />}
                          checked={showDefault}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{
                            "aria-labelledby": "checkbox-list-label-default",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={"default"}
                        primary={"Show Default Questionnaire"}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </PanelCard>
            </Grid>
            <Grid item md={10} sm={12} xs={12}>
              <PanelCard>
                <Grid
                  container
                  direction="row"
                  justifyContent={{ xs: "center", sm: "space-between" }}
                  alignItems="center"
                  sx={{ marginBottom: "2em" }}
                >
                  <Typography variant="h4" sx={{ marginBottom: "10px" }}>
                    Questionnaires
                  </Typography>
                  {hrCreateQuestionnaireAccess && (
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      startIcon={<AddIcon />}
                      onClick={() =>
                        navigate("/hr/questionnaire/create?screen=new")
                      }
                    >
                      Add Your Custom Questionnaire
                    </Button>
                  )}
                </Grid>
                <QuestionsTable
                  questionnaire={questionnaire}
                  fetchQuestions={fetchQuestions}
                />
              </PanelCard>
            </Grid>
          </Grid>
        </ScrollableGrid>
      ) : (
        <CircularLoader />
      )}
    </>
  );
};

export default Questionnaire;
