import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Pagination, styled } from "@mui/material";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "0",

  "& .MuiDataGrid-columnHeaders": {
    border: `1px solid ${theme.palette.grey[700]}`,
    borderRadius: "10px",
  },

  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    width: "100%",
    justifyContent: "center",
  },

  "& .MuiDataGrid-row": {
    margin: "7px 0",
    border: `1px solid ${theme.palette.grey[700]}`,
    borderRadius: "10px",
    width: `calc(100% - 1.2px)`,
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "none",
  },

  "& .MuiDataGrid-footerContainer": {
    display: "none",
  },
}));

const TableWithCustomPagination = ({
  rowId,
  rows,
  columns,
  pageSize,
  page,
  loading,
  totalCount,
  handlePageChange,
}) => {
  return (
    <Box sx={{ height: "70vh", width: "100%" }}>
      {" "}
      <StyledDataGrid
        getRowId={(row) => row[rowId]}
        // getRowHeight={() => "auto"} //row height will increase if cell data is too large
        density="compact"
        rows={rows || []}
        columns={columns}
        rowsPerPageOptions={[20]}
        disableRowSelectionOnClick
        disableColumnMenu
        editMode={false}
        pageSize={pageSize}
        hideFooterPagination={true}
        loading={loading}
      />
      <Box display="flex" justifyContent="center" mt={1}>
        <Pagination
          size="small"
          count={Math.ceil(totalCount / pageSize)}
          page={page}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default TableWithCustomPagination;
