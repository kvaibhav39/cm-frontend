import { Box, Grid, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { EditOutlined, Backup } from "@mui/icons-material";
import CustomTooltip from "../../../../../../../common/CustomTooltip";

const AttachmentsTable = () => {
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: "0",
    fontWeight: 550,

    "& .MuiDataGrid-columnHeaders": {
      borderRadius: "5px",
      borderBottom: "none",
    },

    "& .MuiDataGrid-columnHeaderTitleContainerContent": {
      width: "100%",
      justifyContent: "center",
    },

    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
      width: `calc(100% - 1.2px)`,
    },

    "& .Mui-selected": {
      //   border: `1px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
    },

    "& .MuiDataGrid-cell": {
      borderBottom: "none",
    },

    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
    },
  }));

  const columns = [
    {
      headerName: "FILE NAME",
      field: "assignee",
      width: 200,
      align: "center",
    },
    {
      headerName: "RELATED CHECK",
      field: "last",
      width: 200,
      align: "center",
    },

    {
      headerName: "UPLOADED BY",
      field: "internal1",
      width: 200,
      align: "center",
    },

    {
      headerName: "UPLOADED ON",
      field: "internal",
      width: 200,
      align: "center",
    },
    {
      headerName: "FILE SIZE",
      field: "fileSize",
      width: 200,
      align: "center",
    },

    {
      field: "ACTION",
      headerName: "ACTIONS",
      type: "actions",
      width: 200,
      toRenderCell: true,
      renderCell: (rowData) => columnActionArray(rowData),
    },
  ];

  const columnActionArray = (rowData) => {
    let tempActionArray = [];
    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="Update Package">
            <Backup color="primary" />
          </CustomTooltip>
        }
        label="View"
        onClick={() => {}}
      />
    );

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="Update Package">
            <EditOutlined color="primary" />
          </CustomTooltip>
        }
        label="View"
        onClick={() => {}}
      />
    );

    return tempActionArray;
  };

  const rows = [
    {
      id: 1,
      check: "#1",
      research: "1/10/2022",
      last: "Education Check (Hong Kong University)",
      assignee: "xyz",
      fileSize: "128KB",
    },
    {
      id: 2,
      check: "#2",
      research: "1/10/2022",
      last: "Education Check (Hong Kong University)",
      assignee: "xyz",
      fileSize: "128KB",
    },
    {
      id: 3,
      check: "#3",
      research: "1/10/2022",
      last: "Education Check (Hong Kong University)",
      assignee: "xyz",
      fileSize: "128KB",
    },
  ];

  return (
    <Grid item xs={12}>
      <Box sx={{ height: "50vh", width: "100%" }}>
        <StyledDataGrid
          getRowId={(row) => row?.id}
          density="standard"
          rows={rows}
          columns={columns}
          pageSize={3}
          rowsPerPageOptions={[20]}
          disableRowSelectionOnClick
          disableColumnMenu
          editMode={false}
          checkboxSelection
        />
      </Box>
    </Grid>
  );
};

export default AttachmentsTable;
