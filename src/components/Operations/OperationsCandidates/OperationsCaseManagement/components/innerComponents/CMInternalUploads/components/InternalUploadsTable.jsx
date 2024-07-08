import { Box, Grid, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  EditOutlined,
  Backup,
  DoNotDisturbAlt,
  HighlightOff,
  CheckCircleOutline,
  WarningAmber,
} from "@mui/icons-material";
import CustomTooltip from "../../../../../../../common/CustomTooltip";
import DropdownComponent from "../../common/DropdownComponent";

const InternalUploadsTable = () => {
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

  const riskLevels = [
    { name: "High", icon: <HighlightOff color="error" /> },
    { name: "Moderate", icon: <CheckCircleOutline color="success" /> },
    { name: "Low", icon: <WarningAmber color="warning" /> },
    { name: "Unable to verify", icon: <DoNotDisturbAlt /> },
    { name: "Unable to verify - In Progress", icon: <DoNotDisturbAlt /> },
  ];

  const columns = [
    {
      headerName: "FILE NAME",
      field: "assignee",
      width: 200,
      align: "center",

      // toRenderCell: true,
      // renderCell: () => <DropdownComponent options={assigneeLists} />,
    },
    {
      headerName: "RELATED CHECK",
      field: "last",
      width: 200,
      align: "center",
      renderCell: () => (
        <DropdownComponent
          options={riskLevels}
          placeholderText="Select Risk"
          displayIcon={true}
        />
      ),
    },

    {
      headerName: "UPLOADED BY",
      field: "internal1",
      width: 200,
      align: "center",

      //   toRenderCell: true,
      //   renderCell: (rowData) => (

      //   ),
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
      last: "abc",
      assignee: "xyz",
      fileSize: "128KB",
    },
    {
      id: 2,
      check: "#2",
      research: "1/10/2022",
      last: "abc",
      assignee: "xyz",
      fileSize: "128KB",
    },
    {
      id: 3,
      check: "#3",
      research: "1/10/2022",
      last: "abc",
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

export default InternalUploadsTable;