import { Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import SystemAdminTable from "../common/SystemAdminTable";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import {
  deleteConsentEmail,
  getConsentEmails,
} from "../../../store/actions/systemAdminActions";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DeleteClientSettingsModal from "./components/DeleteClientSettingsModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import AddConsentEmailBodyModal from "./components/AddConsentEmailBodyModal";
import { getOrganizationPackages } from "../../../store/actions/hrActions";
import CustomTooltip from "../../common/CustomTooltip";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const ClientSettingsCustomConsentForm = ({ tableHeight = 415 }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [modal, setmodal] = useState(false);
  const [editEmailId, setEditEmailId] = useState(null);
  const [packagesLists, setPackagesLists] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState();
  const dispatch = useDispatch();
  const { selectedOrg, consentEmailsLists, loading } = useSelector(
    (state) => state.systemAdmin
  );

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getConsentEmails(
        {
          orgId: selectedOrg,
          packageId: "",
        },
        logDetails
      )
    );
    if (selectedOrg)
      dispatch(getOrganizationPackages({ orgId: selectedOrg }, logDetails));
  }, [selectedOrg]);

  const handleDeleteCustomEmail = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleDeleteCustomEmail"
    );

    dispatch(deleteConsentEmail(selectedOrg, deleteRowId, logDetails));
  };

  const columns = [
    {
      field: "packageName",
      headerName: "Package Name",
      width: 250,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 250,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 200,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "updatedAt",
      headerName: "Updated On",
      width: 200,
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
              Add Consent Form Template
            </Button>
          </span>
        </CustomTooltip>
      </Grid>

      <SystemAdminTable
        columns={columns}
        rows={consentEmailsLists}
        loading={loading}
      />

      {modal && (
        <AddConsentEmailBodyModal
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
          deleteText="Consent email body will be permanently deleted!"
        />
      )}
    </>
  );
};

export default ClientSettingsCustomConsentForm;
