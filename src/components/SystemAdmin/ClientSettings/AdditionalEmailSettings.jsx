import { Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddAdditionalEmailSettingsModal from "./components/AddAdditionalEmailSettingsModal";
import { useState } from "react";
import SystemAdminTable from "../common/SystemAdminTable";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteClientSettingsModal from "./components/DeleteClientSettingsModal";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import {
  getAdditionalEmailDetails,
  deleteAdditionalEmailDetails,
} from "../../../store/actions/systemAdminActions";
import { GET_ADDITIONAL_EMAIL_SETTINGS_DATA } from "../../../store/actions/actionTypes";
import { convertFrequencyArrayIntoObject } from "../utils/convertFrequencyArrayIntoObject";
import { frequencyUnits } from "../constants/frequencyUnits";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const AdditionalEmailSettings = () => {
  const [modal, setmodal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editDetailsFlag, setEditDetailsFlag] = useState(false);
  const dispatch = useDispatch();

  const { selectedOrg, additionalEmailSettingsData, loading } = useSelector(
    (state) => state.systemAdmin
  );

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getAdditionalEmailDetails(selectedOrg, logDetails));

    return () =>
      dispatch({ type: GET_ADDITIONAL_EMAIL_SETTINGS_DATA, payload: null });
  }, [selectedOrg]);

  const columnActionArray = (params) => {
    let tempActionArray = [];

    tempActionArray.push(
      <GridActionsCellItem
        icon={<EditIcon color="orange" />}
        label="Edit"
        onClick={() => {
          setmodal(true);
          setSelectedRowId(params.id);
          setEditDetailsFlag(true);
        }}
      />
    );

    tempActionArray.push(
      <GridActionsCellItem
        icon={<DeleteIcon color="error" />}
        label="delete"
        onClick={() => {
          setDeleteModal(true);
          setSelectedRowId(params.id);
        }}
      />
    );

    return tempActionArray;
  };

  const columns = [
    {
      field: "categoryName",
      headerName: "Email Category",
      flex: 1,
      minWidth: 350,
    },
    {
      field: "frequency",
      headerName: "Email Frequency",
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        let freqArr = convertFrequencyArrayIntoObject(params.row?.frequency);

        const resultString = freqArr
          .map((item) => {
            const unit = frequencyUnits.find((u) => u.unitVal === item.unit);
            return `${item.value} ${unit?.unitName}`;
          })
          .join(", ");

        return resultString;
      },
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      flex: 1,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => columnActionArray(params),
    },
  ];

  const handleDeleteCustomField = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleDeleteCustomField"
    );

    dispatch(
      deleteAdditionalEmailDetails(selectedRowId, selectedOrg, logDetails)
    );
  };

  return (
    <>
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
        >
          Add New Email Settings
        </Button>
      </Grid>
      <SystemAdminTable
        columns={columns}
        rows={additionalEmailSettingsData || []}
        loading={loading || additionalEmailSettingsData === null}
      />

      {modal && (
        <AddAdditionalEmailSettingsModal
          open={modal}
          handleClose={() => {
            setmodal(false);
            setEditDetailsFlag(false);
          }}
          editDetailsFlag={editDetailsFlag}
          selectedEmailSettings={additionalEmailSettingsData?.find(
            (curr) => curr?.id === selectedRowId
          )}
        />
      )}

      {deleteModal && (
        <DeleteClientSettingsModal
          deleteText="Email settings will be permanently deleted!"
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          handleDelete={handleDeleteCustomField}
        />
      )}
    </>
  );
};

export default AdditionalEmailSettings;
