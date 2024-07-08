import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useMemo } from "react";
import AddCustomFieldModal from "./components/AddCustomFieldModal";
import { useState } from "react";
import SystemAdminTable from "../common/SystemAdminTable";
import { useEffect } from "react";
import { getCustomFieldByOrgId } from "../../../store/actions/hrActions";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteClientSettingsModal from "./components/DeleteClientSettingsModal";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import { deleteCustomField } from "../../../store/actions/systemAdminActions";
import CandidateRegistraionFieldsSettings from "./components/CandidateRegistraionFieldsSettings";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CustomFields = () => {
  const [modal, setmodal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const dispatch = useDispatch();

  const { customFieldByOrgId, loading } = useSelector((state) => state.hr);
  const { orgsLists, selectedOrg } = useSelector((state) => state.systemAdmin);

  useEffect(() => {
    if (selectedOrg) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        getCustomFieldByOrgId(
          { fieldCategoryName: null },
          {
            orgId: selectedOrg,
          },
          logDetails
        )
      );
    }
  }, [selectedOrg]);

  let isVendor = useMemo(
    () =>
      orgsLists?.find((curr) => curr?.hrOrganizationsId === selectedOrg)
        ?.isVendor,
    [orgsLists, selectedOrg]
  );

  const columns = [
    {
      field: "fieldCategoryName",
      headerName: "Field Category",
      width: 250,
    },
    {
      field: "fieldTypeName",
      headerName: "Field Type",
      width: 180,
    },
    {
      field: "customFieldName",
      headerName: "Field Name",
      width: 180,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 180,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 180,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<DeleteIcon style={{ color: "red" }} />}
          label="delete"
          onClick={() => {
            setDeleteModal(true);
            setDeleteRowId(params.id);
          }}
        />
      ),
    },
  ];

  const handleDeleteCustomField = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleDeleteCustomField"
    );
    dispatch(deleteCustomField(selectedOrg, deleteRowId, logDetails));
  };

  return (
    <Box
      px={1}
      sx={{
        width: "100%",
        height: { xs: "70vh", xxl: "80vh" },
        overflowY: "auto",
      }}
    >
      {selectedOrg ? (
        <>
          {isVendor ? <CandidateRegistraionFieldsSettings /> : null}
          <Grid
            container
            justifyContent={{ xs: "center", sm: "flex-end" }}
            sx={{ marginBottom: "2em" }}
          >
            <Button
              variant="contained"
              size="small"
              disableElevation
              startIcon={<AddIcon />}
              onClick={() => setmodal(true)}
              disabled={!selectedOrg}
            >
              Add New Field
            </Button>
          </Grid>
          <SystemAdminTable
            columns={columns}
            rows={customFieldByOrgId}
            disableColumnFilter={false}
            loading={loading}
          />

          {modal && (
            <AddCustomFieldModal
              open={modal}
              handleClose={() => setmodal(false)}
            />
          )}

          {deleteModal && (
            <DeleteClientSettingsModal
              open={deleteModal}
              handleClose={() => setDeleteModal(false)}
              deleteRowId={deleteRowId}
              handleDelete={handleDeleteCustomField}
            />
          )}
        </>
      ) : (
        <Typography textAlign="center" mt={4} fontWeight={600}>
          Please select an organization
        </Typography>
      )}
    </Box>
  );
};

export default CustomFields;
