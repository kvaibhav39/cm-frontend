import { Box, Button, Chip } from "@mui/material";
import CustomTooltip from "../../common/CustomTooltip";
import {
  HighlightOff,
  Pending,
  TaskAlt,
  Replay,
  Delete,
  Send,
  Block,
} from "@mui/icons-material";
import { addMultipleCandidates } from "../../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction.js";

export const mainColumnsForFailedCandidates = (
  setUpdateFailedDataModal,
  setSelectedFailedData,
  dispatch,
  theme,
  setDeleteModal
) => {
  return [
    {
      headerName: "Status",
      width: 110,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        let { isProceed, isSuccess, reasonOfFail } = params.row;

        if (isSuccess && isProceed) {
          //success
          return (
            <CustomTooltip title="Successfully Added" placement="top">
              <Chip
                label="Success"
                size="small"
                sx={{
                  color: theme.palette.grey[700],
                  fontWeight: 500,
                  backgroundColor: theme.palette.success.light,
                  padding: "10px",
                }}
              />
            </CustomTooltip>
          );
        } else if (!isSuccess && isProceed) {
          //failed
          return (
            <CustomTooltip title={`${reasonOfFail}.`} placement="top">
              <Chip
                label="Error"
                size="small"
                sx={{
                  color: theme.palette.grey[700],
                  fontWeight: 500,
                  backgroundColor: theme.palette.error.lighter,
                  padding: "10px",
                }}
              />
            </CustomTooltip>
          );
        } else if (!isSuccess && !isProceed) {
          //resend
          return (
            <CustomTooltip title="Processing" placement="top">
              <Chip
                label="In process"
                size="small"
                sx={{
                  color: theme.palette.grey[700],
                  fontWeight: 500,
                  backgroundColor: theme.palette.primary[200],
                  padding: "10px",
                }}
              />
            </CustomTooltip>
          );
        }
      },
    },
    {
      headerName: "Actions",
      width: 100,
      headerAlign: "center",
      align: "left",
      field: "id",
      renderCell: (params) => {
        let {
          isProceed,
          isSuccess,
          candidateName,
          candidatePhone,
          candidateEmail,
          hiringCountryName,
          hrTeamName,
          packageName,
          customFields,
          id,
        } = params.row;

        if (isSuccess && isProceed) {
          //success
          return <Block color="grey" sx={{ marginLeft: "15px" }} />;
        } else if (!isSuccess && isProceed) {
          //failed
          return (
            <Box width="100%" display="flex" alignItems="center">
              <CustomTooltip title="Retry Failed Data" placement="top">
                <Replay
                  color="info"
                  onClick={() => {
                    setUpdateFailedDataModal(true);
                    setSelectedFailedData(params.row);
                  }}
                  sx={{ cursor: "pointer", margin: "0 15px" }}
                />
              </CustomTooltip>
              <CustomTooltip title="Delete Failed Data" placement="top">
                <Delete
                  color="error"
                  onClick={() => {
                    setDeleteModal(true);
                    setSelectedFailedData(params.row);
                  }}
                  sx={{ cursor: "pointer" }}
                />
              </CustomTooltip>
            </Box>
          );
        } else if (!isSuccess && !isProceed) {
          //resend
          let temp = {
            candidateName,
            candidatePhone,
            candidateEmail,
            hiringCountryName,
            hrTeamName,
            packageName,
            customFields,
          };

          return (
            <CustomTooltip title="Resend Data" placement="top">
              <Send
                color="info"
                onClick={() => {
                  let logDetails = getCurrentFileNameAndFunction(
                    import.meta.url,
                    "onClick"
                  );
                  dispatch(addMultipleCandidates([temp], logDetails));
                }}
                sx={{ cursor: "pointer", marginLeft: "15px" }}
              />
            </CustomTooltip>
          );
        }
      },
    },
    {
      headerName: "Candidate Name",
      field: "candidateName",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Candidate Phone",
      field: "candidatePhone",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Candidate Email",
      field: "candidateEmail",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Hiring Country Name",
      field: "hiringCountryName",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "HR Team Name",
      field: "hrTeamName",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Package Name",
      field: "packageName",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
  ];
};
