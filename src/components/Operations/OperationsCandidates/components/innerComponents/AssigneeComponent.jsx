import { Close, Edit, Save } from "@mui/icons-material";
import { Box, Grid, Select, MenuItem } from "@mui/material";
import CustomTooltip from "../../../../common/CustomTooltip";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAssigneeForCandidate } from "../../../../../store/actions/operationActions";
import { updateStateWith } from "../../OperationsCaseManagement/components/innerComponents/CMCheckStatus/utils/updateStateWith";
import { setToastNotification } from "../../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../../store/constant";
import { checkActionPermission } from "../../../../../utils/CheckPageAccess.js";
import permissionKey from "../../../../constants/permissionKey.js";
import { getCurrentFileNameAndFunction } from "../../../../../utils/getCurrentFileNameAndFunction.js";

const AssigneeComponent = ({
  data,
  updateAssignee,
  setUpdateAssignee,
  assigneeLists,
}) => {
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const dispatch = useDispatch();

  const { permissions } = useSelector((state) => state.authorization);

  useEffect(() => {
    if (!data.assignee && !data.assigneeName) {
      updateStateWith(setUpdateAssignee, data?.candidatesCasesId, false);
    }
  }, [data]);

  const checkAssigneUpdatePermission = () => {
    if (!checkActionPermission(permissionKey.opsAssigneUser, permissions)) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "checkAssigneUpdatePermission"
      );

      dispatch(
        setToastNotification(
          ERROR,
          "You dont have permission to update assignee",
          logDetails
        )
      );
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!checkAssigneUpdatePermission()) return;

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSave"
    );

    if (selectedAssignee) {
      dispatch(
        updateAssigneeForCandidate(
          { assignee: selectedAssignee },
          data?.candidatesCasesId,
          logDetails
        )
      );

      updateStateWith(setUpdateAssignee, data?.candidatesCasesId, false);
    } else {
      dispatch(
        setToastNotification(
          ERROR,
          `Please select a valid assignee for ${data?.caseNumber}`,
          logDetails
        )
      );
    }
  };

  const handleClose = () => {
    if (!checkAssigneUpdatePermission()) return;

    if (data.assignee && data.assigneeName) {
      updateStateWith(setUpdateAssignee, data?.candidatesCasesId, false);
      setSelectedAssignee("");
    }
    updateStateWith(setUpdateAssignee, data?.candidatesCasesId, false);
  };

  return (
    <Grid
      item
      xs={12}
      display="flex"
      justifyContent="space-around"
      alignItems="center"
    >
      {updateAssignee[data?.candidatesCasesId] ? (
        <Grid item xs={9}>
          <Select
            displayEmpty
            value={selectedAssignee || ""}
            size="small"
            variant="outlined"
            onChange={(event) => setSelectedAssignee(event.target.value)}
            disabled={
              !checkActionPermission(permissionKey.opsAssigneUser, permissions)
            }
            sx={{
              transform: "scale(0.8)",
              height: "35px",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: "12px" }}>
              Select Assignee
            </MenuItem>
            {assigneeLists?.map((option, index) => (
              <MenuItem
                key={index}
                value={option.assignee}
                sx={{ fontSize: "12px" }}
              >
                {option.assigneeName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      ) : (
        <Grid
          item
          xs={9}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {data?.assigneeName || "Not Assigned Yet"}
        </Grid>
      )}
      {updateAssignee[data?.candidatesCasesId] ? (
        <Grid
          item
          xs={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={6}>
            <CustomTooltip title="Save" placement="top">
              <Box>
                <Save
                  onClick={handleSave}
                  sx={{
                    margin: "5px 0 0",
                    cursor: "pointer",
                    color: (theme) => theme.palette.success.main,
                  }}
                />
              </Box>
            </CustomTooltip>
          </Grid>
          <Grid item xs={6}>
            <CustomTooltip title="Close" placement="top">
              <Box>
                <Close
                  onClick={handleClose}
                  sx={{
                    margin: "5px 0 0",
                    cursor: "pointer",
                    color: (theme) => theme.palette.error.light,
                  }}
                />
              </Box>
            </CustomTooltip>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={3} display="flex" justifyContent="center">
          <CustomTooltip title="Update" placement="top">
            <Box>
              <Edit
                onClick={() => {
                  if (!checkAssigneUpdatePermission()) return;

                  setSelectedAssignee(data.assignee);

                  updateStateWith(
                    setUpdateAssignee,
                    data?.candidatesCasesId,
                    true
                  );
                }}
                sx={{
                  cursor: "pointer",
                  color: (theme) => theme.palette.warning.dark,
                }}
              />
            </Box>
          </CustomTooltip>
        </Grid>
      )}
    </Grid>
  );
};

export default AssigneeComponent;
