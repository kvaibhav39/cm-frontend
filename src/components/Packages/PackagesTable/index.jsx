import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveAsIcon from "@mui/icons-material/ContentCopyOutlined";
import {
  getCreatedByInitials,
  getPackageIndustries,
  getPackageId,
} from "../PackagesHelper";
import ChecksIncluded from "../PackagesTable/Cells/ChecksIncluded";
import Strength from "../PackagesTable/Strength/Strength";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import DeletePackageModal from "../../../common/modals/DeletePackageModal";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { checkActionPermission } from "../../../utils/CheckPageAccess";
import permissionKey from "../../constants/permissionKey";
import PreviewIcon from "@mui/icons-material/Preview";
import CustomTooltip from "../../common/CustomTooltip";
import { deletePackage } from "../../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const PackagesTable = ({ packages, onDelete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState();
  const loggedInUser = useSelector((state) => state.authorization);
  const { loading } = useSelector((state) => state.hr);

  const handleClickOpenModal = (data) => {
    setSelectedPackage(data);
    setOpenModal(true);
  };

  const handleCloseModal = async (isDelete) => {
    if (isDelete) {

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleCloseModal"
      );

      dispatch(deletePackage(selectedPackage,logDetails));
    }
    setOpenModal(false);
  };

  const hrPackageEditAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrPackageEdit,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const hrPackageCloneAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrPackageClone,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const hrPackageDeleteAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrPackageDelete,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const coloumnActionArray = (params) => {
    let tempActionArray = [];

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="View Package">
            <PreviewIcon color="primary" />
          </CustomTooltip>
        }
        label="View"
        onClick={() =>
          navigate(
            `/hr/packages/view/${params.row.packagesId}?viewMode=${true}`
          )
        }
      />
    );

    hrPackageEditAccess &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Edit Package">
              <EditIcon
                color={
                  params.row.packageType === "SYSTEM" ? "disabled" : "orange"
                }
              />
            </CustomTooltip>
          }
          label="Edit"
          disabled={params.row.packageType === "SYSTEM"}
          onClick={() =>
            navigate(`/hr/packages/edit/${params.row.packagesId}?screen=edit`)
          }
        />
      );

    hrPackageCloneAccess &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Clone Package (save as)">
              <SaveAsIcon />
            </CustomTooltip>
          }
          label="Save As"
          onClick={() =>
            navigate(
              `/hr/packages/clone/${params.row.packagesId}?screen=saveAs`
            )
          }
        />
      );

    hrPackageDeleteAccess &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Delete Package">
              <DeleteIcon
                color={
                  params.row.packageType === "SYSTEM" ? "disabled" : "error"
                }
              />
            </CustomTooltip>
          }
          label="Delete"
          disabled={params.row.packageType === "SYSTEM"}
          onClick={() => handleClickOpenModal(params.row.packagesId)}
        />
      );
    return tempActionArray;
  };

  const columns = [
    {
      field: "packagesId",
      headerName: "PACKAGE ID",
      width: 100,
      valueGetter: getPackageId,
    },
    { field: "packageName", headerName: "PACKAGE NAME", width: 200 },
    {
      field: "checks",
      headerName: "CHECKS INCLUDED IN PACKAGE",
      width: 420,
      renderCell: (params) => (
        <ChecksIncluded checksCount={params.row.checksCount || {}} />
      ),
    },
    {
      field: "strength",
      headerName: "STRENGTH",
      width: 200,
      renderCell: (params) => (
        <Strength
          strengthPercentage={params.row.strength || {}}
          colorCode={params.row.strenghthColorCode || {}}
        />
      ),
    },
    {
      field: "createdBy",
      headerName: "CREATED BY",
      width: 120,
      valueGetter: getCreatedByInitials,
    },
    {
      field: "createdAt",
      headerName: "CREATED ON",
      width: 120,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 200,
      getActions: (params) => coloumnActionArray(params),
    },
  ];
  return (
    <div
      style={{
        height: 415,
      }}
    >
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: "createdAt", sort: "desc" }],
          },
        }}
        components={{ Toolbar: GridToolbar }}
        rows={packages}
        columns={columns}
        pageSize={6}
        rowsPerPageOptions={[20]}
        density="standard"
        getRowId={(row) => row.packagesId}
        loading={loading}
      />
      <DeletePackageModal
        title="Delete Package"
        description="Are you sure, you want to delete this package ?"
        handleClose={handleCloseModal}
        open={openModal}
      />
    </div>
  );
};

export default PackagesTable;
