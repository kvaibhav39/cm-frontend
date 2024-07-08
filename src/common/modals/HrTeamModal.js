import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  Select,
  MenuItem,
  Switch,
  Typography,
  Grid,
  Alert,
  styled,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { ERROR, SUCCESS } from "../../store/constant";
import { Box } from "@mui/system";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import {
  AddCompanyTeam,
  DeleteCompanyTeam,
  getOrganizationTeams,
  getOrganizationUsers,
} from "../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const HrAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.main,
  fontWeight: 500,
  "& .MuiAlert-icon": {
    color: theme.palette.error.main,
  },
}));

export default function HrTeamModal({
  open,
  handleClose,
  operationType,
  team,
  runWhenSuccess = () => {},
}) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [teamName, setTeamName] = React.useState(""); // For UI

  const userOperation = {
    addTeam: {
      title: "Add Team",
      description: "",
      inputs: ["Team Name"],
      params: { orgId: getLoggedInUserHrOrganizationId() },
    },
    removeTeam: {
      title: "Remove Team",
      description:
        "Deleting the team may result in the loss of data in those associated candidates. Are you sure you want to proceed?",
      inputs: [],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        teamId: team?.hrTeamsId,
      },
    },
  };

  const operation = userOperation[operationType];

  const handleSubmitText = () => {
    if (operationType.includes("add")) {
      return "Add";
    }
    if (operationType.includes("remove")) {
      return "Delete";
    }
  };

  const handleSubmit = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    if (operationType.includes("add")) {
      if (!teamName?.length) {
        return dispatch(
          setToastNotification(ERROR, "Please enter a team name", logDetails)
        );
      }

      if (teamName?.length > 50) {
        return dispatch(
          setToastNotification(
            ERROR,
            "Team name should not exceed 50 characters",
            logDetails
          )
        );
      }

      dispatch(
        AddCompanyTeam(
          {
            ...operation.params,
          },
          {
            hrTeamName: teamName,
          },
          runWhenSuccess,
          logDetails
        )
      );
    }
    if (operationType.includes("remove")) {
      dispatch(
        DeleteCompanyTeam(
          {
            ...operation.params,
          },
          runWhenSuccess,
          logDetails
        )
      );
    }
    handleClose();
  };

  const handleButtonStyle = () => {
    if (operationType.includes("add")) {
      return {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        paddingLeft: "30px",
        paddingRight: "30px",
        marginLeft: "20px",
        border: `1px solid ${theme.palette.primary.main}`,
      };
    }
    if (operationType.includes("remove")) {
      return {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.background.paper,
        paddingLeft: "30px",
        paddingRight: "30px",
        marginLeft: "20px",
        border: `1px solid ${theme.palette.error.dark}`,
      };
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          minWidth: 500,
        }}
      >
        <DialogTitle>
          <Typography variant="h2" style={{ fontWeight: "normal" }}>
            {operation?.title}
          </Typography>
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {operationType.includes("remove") && (
            <HrAlert variant="outlined" severity="error">
              {operation?.description}
            </HrAlert>
          )}
          {operationType.includes("add") && (
            <DialogContentText>
              <TextField
                size="small"
                sx={{ width: "100%", marginTop: "5px" }}
                label="New Team"
                value={teamName || ""}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "0 24px" }}>
          <Button variant="standard" onClick={handleClose} disableElevation>
            Cancel
          </Button>
          <Button
            variant="outlined"
            style={handleButtonStyle()}
            onClick={handleSubmit}
            disableElevation
          >
            {handleSubmitText()}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
