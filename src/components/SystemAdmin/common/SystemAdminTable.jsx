import { styled } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    width: "100%",
    justifyContent: "center",
  },

  "& .MuiDataGrid-row": {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    paddingBottom: "10px",

    width: `calc(100% - 1.2px)`,
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    marginTop: "5px",
  },
}));

const SystemAdminTable = ({
  columns = [],
  rows = [],
  tableHeight = 415,
  rowId = "id",
  disableColumnFilter = false,
  loading = false,
}) => {
  return (
    <div
      style={{
        height: tableHeight,
      }}
    >
      <StyledDataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: "createdAt", sort: "desc" }],
          },
        }}
        components={{ Toolbar: GridToolbar }}
        rows={rows}
        columns={columns}
        pageSize={6}
        rowsPerPageOptions={[20]}
        getRowId={(row) => row[rowId]}
        disableColumnFilter={disableColumnFilter}
        density="standard"
        getRowHeight={() => "auto"}
        loading={loading}
      />
    </div>
  );
};

export default SystemAdminTable;
