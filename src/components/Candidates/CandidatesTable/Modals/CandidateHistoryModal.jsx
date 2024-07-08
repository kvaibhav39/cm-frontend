import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Grid, Box } from "@mui/material";
import styled from "@emotion/styled";
import _ from "lodash";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getTimestampFromString } from "../../../../utils/DateTimeHelper";
import CustomTooltip from "../../../common/CustomTooltip";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-height: 60vh;
  min-width: 90vw;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

let columns = [
  {
    headerName: "Activity Time",
    field: "createdAt",
    width: 200,
    valueFormatter: ({ value }) =>
      getTimestampFromString(value, "Asia/Hong_Kong", "dd-MMM-YYYY hh:mm:ss a"),
  },
  {
    headerName: "Activity",
    field: "activityKey",
    width: 350,
    renderCell: (params) => (
      <CustomTooltip title={params.row.activityKey}>
        <span>{params.row.activityKey}</span>
      </CustomTooltip>
    ),
  },
  {
    headerName: "Message",
    field: "activityMessage",
    width: 400,
    renderCell: (params) => (
      <CustomTooltip title={params.row.activityMessage}>
        <span>{params.row.activityMessage}</span>
      </CustomTooltip>
    ),
  },
];

const CandidateHistoryModal = ({ open, handleClose, candidateHistory }) => {
  return (
    <Grid item xs={12}>
      {candidateHistory?.length ? (
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              maxWidth: "none",
              maxHeight: "none",
            },
          }}
        >
          <HrModalBox>
            <StyledDialogContent>
              <div
                style={{
                  height: 450,
                }}
                className="hr_module_table"
              >
                <DataGrid
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "createdAt", sort: "desc" }],
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  rows={candidateHistory}
                  columns={columns}
                  pageSize={8}
                  rowsPerPageOptions={[50]}
                  density="standard"
                  getRowId={(row) => row.createdAt}
                  xs={{ width: "100vw" }}
                />
              </div>
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
    </Grid>
  );
};

export default CandidateHistoryModal;
