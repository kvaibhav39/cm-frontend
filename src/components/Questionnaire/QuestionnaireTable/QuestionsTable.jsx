import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  getCreatedByInitials,
  getQuestionnaireId,
  getUpdatedByInitials,
} from "../QuestionnaireHelper";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDeleteOrganizationQuestionnaire,
  selectQuestionnaire,
} from "../../../store/actions/hrActions";
import SaveAsIcon from "@mui/icons-material/ContentCopyOutlined";
import { useState } from "react";
import DeletePackageModal from "../../../common/modals/DeletePackageModal";
import * as React from "react";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { SUCCESS } from "../../../store/constant";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import { checkActionPermission } from "../../../utils/CheckPageAccess";
import { useMemo } from "react";
import permissionKey from "../../constants/permissionKey";
import PreviewIcon from "@mui/icons-material/Preview";
import CustomTooltip from "../../common/CustomTooltip";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const QuestionsTable = ({ questionnaire, fetchQuestions }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState();
  const loggedInUser = useSelector((state) => state.authorization);

  const handleClickOpenModal = (data) => {
    setSelectedQuestionnaire(data);
    setOpenModal(true);
  };

  const handleCloseModal = (isDelete) => {
    if (isDelete) {
      handleDeleteQuestionnaire(selectedQuestionnaire);
    }
    setOpenModal(false);
  };

  const handleDeleteQuestionnaire = (id) => {
    let params = {
      orgId: getLoggedInUserHrOrganizationId(),
      questionnairesId: id,
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleDeleteQuestionnaire"
    );

    dispatch(
      getDeleteOrganizationQuestionnaire(params, fetchQuestions, logDetails)
    );
  };

  const handleSaveAs = (params) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSaveAs"
    );
    dispatch(selectQuestionnaire(params.row, logDetails));
    navigate(
      `/hr/questionnaire/clone/${params.row.questionnairesId}?screen=saveAs`,
      {
        state: params.row,
      }
    );
  };

  const handleEdit = (params) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleEdit"
    );
    dispatch(selectQuestionnaire(params.row, logDetails));
    navigate(
      `/hr/questionnaire/edit/${params.row.questionnairesId}?screen=edit`,
      {
        state: params.row,
      }
    );
  };

  const handleViewMode = (params) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleViewMode"
    );
    dispatch(selectQuestionnaire(params.row, logDetails));
    navigate(
      `/hr/questionnaire/view/${
        params.row.questionnairesId
      }?screen=edit&viewMode=${true}`,
      {
        state: params.row,
      }
    );
  };

  const hrQuestionnaireEditAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrQuestionnaireEdit,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const hrQuestionnaireCloneAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrQuestionnaireClone,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const hrQuestionnaireDeleteAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrQuestionnaireDelete,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const columnsActionArray = (params) => {
    let tempActionArray = [];

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="View Questionnaire">
            <PreviewIcon color="primary" />
          </CustomTooltip>
        }
        label="View"
        onClick={() => handleViewMode(params)}
      />
    );

    hrQuestionnaireEditAccess &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Edit Questionnaire">
              <EditIcon
                color={
                  params.row.questionnaireType === "SYSTEM"
                    ? "disabled"
                    : "orange"
                }
              />
            </CustomTooltip>
          }
          label="Edit"
          disabled={params.row.questionnaireType === "SYSTEM"}
          onClick={() => handleEdit(params)}
        />
      );

    hrQuestionnaireCloneAccess &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Clone Questionnaire (save as)">
              <SaveAsIcon />
            </CustomTooltip>
          }
          label="Save As"
          onClick={() => handleSaveAs(params)}
        />
      );

    hrQuestionnaireDeleteAccess &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Delete Questionnaire">
              <DeleteIcon
                color={
                  params.row.questionnaireType === "SYSTEM"
                    ? "disabled"
                    : "error"
                }
              />
            </CustomTooltip>
          }
          label="Delete"
          disabled={params.row.questionnaireType === "SYSTEM"}
          onClick={() => handleClickOpenModal(params.row.questionnairesId)}
        />
      );

    return tempActionArray;
  };

  const columns = [
    {
      field: "questionnaireID",
      headerName: "QUESTIONNAIRE ID",
      width: 250,
      valueGetter: getQuestionnaireId,
    },
    {
      field: "questionnaireName",
      headerName: "QUESTIONNAIRE NAME",
      width: 300,
    },
    {
      field: "createdBy",
      headerName: "CREATED BY",
      width: 150,
      valueGetter: getCreatedByInitials,
    },
    {
      field: "updatedBy",
      headerName: "UPDATED BY",
      width: 150,
      valueGetter: getUpdatedByInitials,
    },
    {
      field: "createdAt",
      headerName: "CREATED ON",
      width: 150,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 140,
      getActions: (params) => columnsActionArray(params),
    },
  ];

  return (
    // <div style={{ height: 879, marginTop: "2em" }}>
    <div style={{ height: 450, marginTop: "2em" }}>
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: "createdAt", sort: "desc" }],
          },
        }}
        components={{ Toolbar: GridToolbar }}
        rows={questionnaire || []}
        columns={columns}
        // pageSize={20}
        pageSize={6}
        rowsPerPageOptions={[20]}
        density="standard"
        getRowId={(row) => row.questionnairesId}
      />
      <DeletePackageModal
        title="Delete Questionnaire"
        description="Are you sure, you want to delete this questionnaire ?"
        handleClose={handleCloseModal}
        open={openModal}
      />
    </div>
  );
};

export default QuestionsTable;
