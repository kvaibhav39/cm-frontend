import {
  Grid,
  Box,
  Dialog,
  DialogContent,
  Typography,
  Button,
  DialogActions,
  FormControl,
  List,
  ListItem,
  FormGroup,
  Divider,
} from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { addCheckSubCheck } from "../../../../../../../../store/actions/operationActions";
import { useSearchParams } from "react-router-dom";
import { omit } from "lodash";
import DisplayCheckOrSubCheckDetails from "./DisplayCheckOrSubCheckDetails";
import { useState } from "react";
import { CustomCheckbox } from "../../../../../../../common/CustomCheckBox";
import { getCurrentFileNameAndFunction } from "../../../../../../../../utils/getCurrentFileNameAndFunction.js";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0px 5px;
  min-height: 45vh;
  min-width: 50vw;
  overflow-y: scroll;
`;

const AddedChecksSubChecksSummaryModal = ({ open, handleClose }) => {
  const [sendEmailFlag, setSendEmailFlag] = useState(true);
  const { addedChecksAndSubCheck } = useSelector((state) => state.operations);
  const { allCountries } = useSelector((state) => state.helper);
  const { allQuestionnaires, allChecksData } = useSelector(
    (state) => state?.hr
  );
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const getCountryNames = (id) =>
    allCountries?.find((curr) => curr.countryMasterId === id)?.name;

  const getQuestionName = (id) =>
    allQuestionnaires?.find((curr) => curr.questionnairesId === id)
      ?.questionnaireName;

  let addedChecks = useMemo(() => {
    if (allChecksData) {
      let tempChecks = [...addedChecksAndSubCheck];

      allChecksData?.checks?.forEach((check) => {
        tempChecks?.forEach((addedCheck) => {
          if (addedCheck?.checkId === check?.checksId) {
            addedCheck.checkScopeDescription = check.checkScopeDescription;
            addedCheck.checkDisplayName = check.checkDisplayName;

            if (addedCheck?.researchCountries) {
              addedCheck.displayExtra = `Create sub-check for - ${addedCheck.researchCountries
                ?.map((curr) => getCountryNames(curr))
                ?.join(",")}`;
            }

            if (addedCheck?.checkId === 8 || addedCheck?.checkId === 15) {
              addedCheck.displayExtra = getQuestionName(
                addedCheck?.checkScope?.questionnaireId
              );
            }

            //cv check
            if (addedCheck?.checkId === 10) {
              addedCheck.displayExtra = addedCheck?.checkScope?.attachmentName;
            }
          }
        });
      });
      return tempChecks;
    }
    return [];
  }, [allChecksData, addedChecksAndSubCheck]);

  const handleSubmit = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(
      addCheckSubCheck(
        logDetails,
        {
          checkData: addedChecksAndSubCheck?.map((curr) =>
            omit(
              curr,
              "checkDisplayName",
              "checkScopeDescription",
              "displayExtra"
            )
          ),
        },
        +searchParams.get("candidatesCasesId"),
        allChecksData,
        "callFromAddChecksSubchecks",
        sendEmailFlag ? 1 : 2
      )
    );
    handleClose();
  };

  return (
    <Grid item xs={12}>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxWidth: "none",
            maxHeight: "95vh",
            overflowY: "scroll",
          },
        }}
      >
        <HrModalBox>
          <DialogContent>
            <FormControl fullWidth size="small">
              <List
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <ListItem
                  sx={{
                    width: "auto",
                  }}
                >
                  <FormGroup
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "max-content",
                      flexDirection: "row",
                    }}
                  >
                    <CustomCheckbox
                      type="checkbox"
                      id="email-checkbox"
                      name="email checkbox"
                      value={sendEmailFlag}
                      checked={sendEmailFlag}
                      onChange={() => setSendEmailFlag(!sendEmailFlag)}
                    />
                    <label htmlFor="email-checkbox">
                      {" "}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          fontWeight: 550,
                        }}
                      >
                        Send Email to Candidate
                      </Typography>
                    </label>
                  </FormGroup>
                </ListItem>
              </List>
            </FormControl>
            <Divider />
            <DisplayCheckOrSubCheckDetails
              addedChecks={addedChecks}
              condition={(check) => !check.candidatesChecksMappingId}
              title="Checks"
            />
            <DisplayCheckOrSubCheckDetails
              addedChecks={addedChecks}
              condition={(check) => check.candidatesChecksMappingId}
              title="Sub-Checks"
            />

            <DialogActions
              sx={{ position: "absolute", right: "10px", bottom: "10px" }}
            >
              <Button
                variant="contained"
                color="error"
                mr={1}
                onClick={handleClose}
              >
                Close
              </Button>{" "}
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </DialogActions>
          </DialogContent>
        </HrModalBox>
      </Dialog>
    </Grid>
  );
};

export default AddedChecksSubChecksSummaryModal;
