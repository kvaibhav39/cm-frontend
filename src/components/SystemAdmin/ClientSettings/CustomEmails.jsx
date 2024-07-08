import { Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AddCustomEmailBodyModal from "./components/AddCustomEmailBodyModal";
import SystemAdminTable from "../common/SystemAdminTable";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import {
  deleteCustomEmail,
  getCustomEmails,
} from "../../../store/actions/systemAdminActions";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DeleteClientSettingsModal from "./components/DeleteClientSettingsModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import CustomTooltip from "./../../common/CustomTooltip";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CustomEmails = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [modal, setmodal] = useState(false);
  const [editEmailId, setEditEmailId] = useState(null);
  const dispatch = useDispatch();
  const { selectedOrg, customEmailsLists, loading } = useSelector(
    (state) => state.systemAdmin
  );

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getCustomEmails(selectedOrg, logDetails));
  }, [selectedOrg]);

  const handleDeleteCustomEmail = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleDeleteCustomEmail"
    );

    dispatch(deleteCustomEmail(selectedOrg, deleteRowId, logDetails));
  };

  const columns = [
    {
      field: "fieldCategoryName",
      headerName: "Email Category",
      width: 250,
    },
    {
      field: "emailSubject",
      headerName: "Email Subject",
      width: 250,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 150,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "updatedAt",
      headerName: "Updated On",
      width: 150,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<EditIcon color="orange" />}
            label="Edit"
            onClick={() => {
              setmodal(true);
              setEditEmailId(params.id);
            }}
          />
          <GridActionsCellItem
            icon={
              <DeleteIcon
                style={{ color: selectedOrg ? "red" : "grey" }}
                disabled={!selectedOrg}
              />
            }
            label="delete"
            onClick={() => {
              setDeleteModal(true);
              setDeleteRowId(params.id);
            }}
            disabled={!selectedOrg}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Grid
        container
        justifyContent={{ xs: "center", sm: "flex-end" }}
        sx={{ marginBottom: "2em" }}
      >
        <CustomTooltip
          title={
            !selectedOrg ? "Please select an organization to enable it" : ""
          }
        >
          <span>
            <Button
              variant="contained"
              size="small"
              disableElevation
              startIcon={<AddIcon />}
              onClick={() => {
                setmodal(true);
                setEditEmailId(null);
              }}
              disabled={!selectedOrg}
            >
              Add New Mail Template
            </Button>
          </span>
        </CustomTooltip>
      </Grid>
      <SystemAdminTable
        columns={columns}
        rows={customEmailsLists}
        loading={loading}
      />
      {modal && (
        <AddCustomEmailBodyModal
          open={modal}
          handleClose={() => setmodal(false)}
          editId={editEmailId || false}
        />
      )}
      {deleteModal && (
        <DeleteClientSettingsModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          handleDelete={handleDeleteCustomEmail}
          deleteText="Custom email body will be permanently deleted!"
        />
      )}
    </>
  );
};

export default CustomEmails;
