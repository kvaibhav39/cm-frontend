import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import _ from "lodash";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getTimestampFromString } from "../../../../utils/DateTimeHelper";

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

let columns = [
  {
    headerName: "VERIFICATION PROCESS NAME",
    field: "verificationProcessName",
    width: 180,
    renderCell: (params) => (
      <a href={params.row.reportCdnPath} target="_blank">
        {params.row.verificationProcessName}
      </a>
    ),
  },
  {
    headerName: "CREATED AT",
    field: "createdAt",
    width: 200,
    valueFormatter: ({ value }) => getTimestampFromString(value),
  },
];

const PdfReportModal = ({ open, handleClose, latestReport }) => {
  return (
    <>
      {latestReport?.length ? (
        <Dialog open={open} onClose={handleClose}>
          <HrModalBox>
            <StyledDialogContent>
              <div
                style={{
                  // height: 879,
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
                  rows={latestReport}
                  columns={columns}
                  // pageSize={50}
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
    </>
  );
};

export default PdfReportModal;
