import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import styled from "@emotion/styled";
import _ from "lodash";
import PackageIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useDispatch, useSelector } from "react-redux";
import { getAllCountries } from "../../../../store/actions/helperActions";
import { getLoggedInUserHrOrganizationId } from "../../../../utils/UserHelper";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 500px;
  min-height: 250px;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatusPreviewModal = ({
  open,
  handleClose,
  assignedChecks,
  selectedPackageName,
}) => {
  const { allCountries: countries } = useSelector((state) => state.helper);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!countries) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getAllCountries(logDetails));
    }
  }, []);

  const getResearchCountryList = (countryIdLists) => {
    let countryNames = [];
    countryIdLists?.forEach((countryId) => {
      let selectedCountry = countries?.find(
        (country) => +country?.countryMasterId === +countryId
      );
      countryNames.push(selectedCountry?.name);
    });
    return countryNames.join(", ");
  };
  return (
    <>
      {assignedChecks ? (
        <Dialog open={open} onClose={handleClose}>
          <HrModalBox>
            <DialogTitle>
              <Typography
                variant="h2"
                textAlign="center"
                style={{
                  fontWeight: "normal",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                Package {selectedPackageName ? `- ${selectedPackageName}` : ""}
              </Typography>
            </DialogTitle>
            <StyledDialogContent>
              <List>
                {assignedChecks?.map((check) => {
                  return (
                    <ListItem key={`check-${check.checkId}`}>
                      <ListItemIcon>
                        <PackageIcon color={"primary"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${check.checkName} ${
                          check.checkId === 25
                            ? check.checkScope.allJurisdictionSearch
                              ? `- Research countries based on the candidate data - All Jurisdiction(s) in the past ${check.checkScope.noOfYearsForAdditionalJuridictionSearch} years.`
                              : `- Research country chosen: ${getResearchCountryList(
                                  check.checkScope.jurisdictionId
                                )}`
                            : check.checkScopeDescription
                            ? "- " +
                              check.checkScopeDescription?.replace("{", "(")
                            : ""
                        }`}
                        secondary=""
                      />
                    </ListItem>
                  );
                })}
              </List>
            </StyledDialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClose}
                disableElevation
              >
                Close
              </Button>
            </DialogActions>
          </HrModalBox>
        </Dialog>
      ) : null}
    </>
  );
};

export default StatusPreviewModal;
