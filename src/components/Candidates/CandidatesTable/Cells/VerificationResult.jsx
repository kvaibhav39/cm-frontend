import { Box, Chip, Typography } from "@mui/material";
import HighlightOff from "@mui/icons-material/HighlightOff";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import BlockIcon from "@mui/icons-material/Block";
import CustomTooltip from "../../../common/CustomTooltip";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PendingIcon from "@mui/icons-material/Pending";

const VerificationResult = (props) => {
  let displayIcon, tooltipTitle;

  switch (props.verificationResultStatusName) {
    case "High Risk":
      displayIcon = <HighlightOff color="error" />;
      tooltipTitle =
        "Information verified with material inconsistencies and/or major derogatory information found";
      break;
    case "Moderate Risk":
      displayIcon = <HighlightOff color="warning" />;
      tooltipTitle =
        "Information verified with slight inconsistencies and/or minor derogatory information found";
      break;
    case "Low Risk":
      displayIcon = <TaskAltIcon color="success" />;
      tooltipTitle =
        "Information verified with no inconsistencies and/or no derogatory information found";
      break;
    case "Unable to Verify":
      displayIcon = <BlockIcon color="grey" />;
      tooltipTitle = "Information cannot be verified due to certain reason(s)";
      break;
    case "Pending":
      displayIcon = <WarningAmberRoundedIcon color="error" />;
      tooltipTitle =
        "Checking on hold due to pending for additional information to proceed further";
      break;
    case "In progress":
      displayIcon = <PendingIcon color="grey" />;
      tooltipTitle = "Check has been initiated and awaiting result";
      break;
    default:
      displayIcon = <HighlightOff color="error" />;
      tooltipTitle =
        "Information verified with material inconsistencies and/or major derogatory information found";
      break;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        "> *:not(:first-child)": {
          marginLeft: "0.5rem",
        },
      }}
    >
      {props.verificationResultStatusName && (
        <Box height="24px" width="24px">
          <CustomTooltip title={tooltipTitle}>{displayIcon}</CustomTooltip>
        </Box>
      )}
      {props.displayName && (
        <Typography>{props.verificationResultStatusName || "-"}</Typography>
      )}
    </Box>
  );
};

export default VerificationResult;
