import { GridActionsCellItem } from "@mui/x-data-grid";
import CustomTooltip from "../../../../../../../common/CustomTooltip";
import { EditOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import DropdownComponent from "../../common/DropdownComponent";
import CheckStatusDropdown from "../../common/CheckStatusDropdown";
import moment from "moment";
import DisplayChip from "../../common/DisplayChip";
import { checkActionPermission } from "../../../../../../../../utils/CheckPageAccess";
import permissionKey from "../../../../../../../constants/permissionKey";
import { LoadingButton } from "@mui/lab";
import CircularLoader from "../../../../../../../../common/CircularLoader";

export const checkStatusColumns = [
  {
    headerName: "CHECK",
    field: "checkName",
    width: 200,
    renderCell: (rowData) => (
      <Typography fontSize="14px" fontWeight={550}>
        {rowData?.checkName}
      </Typography>
    ),
  },
  {
    headerName: "LAST UPDATED ON",
    field: "last",
    width: 150,
    renderCell: (rowData) =>
      rowData?.updatedAt
        ? moment(rowData?.updatedAt).format("DD-MM-YYYY")
        : "-",
  },
  {
    headerName: "ASSIGNEE",
    field: "assignee",
    width: 150,
    renderCell: (rowData, id, props) => {
      //adding rowData's assignee into ops user by sub role id list if present
      // if (
      //   rowData?.assignee &&
      //   rowData?.assigneeName &&
      //   props.OpsUserBySubRoleIds?.length
      // ) {
      //   let ifAlreadyPresent = props.OpsUserBySubRoleIds.find(
      //     (curr) => curr.assignee === rowData?.assignee
      //   );
      //   if (!ifAlreadyPresent) {
      //     props.OpsUserBySubRoleIds = [
      //       ...props.OpsUserBySubRoleIds,
      //       {
      //         assignee: rowData?.assignee,
      //         assigneeName: rowData?.assigneeName,
      //       },
      //     ];
      //   }
      // }

      return props?.OpsUserBySubRoleIds?.length ? (
        <DropdownComponent
          id={id}
          options={props.OpsUserBySubRoleIds}
          optionLabel="assigneeName"
          optionId="assignee"
          defaultValue={props.assigneeDropdown[id] || rowData?.assignee || ""}
          setDisableBtn={props.setDisableBtnAssignee}
          setDropdownVal={props.setAssigneeDropdown}
          toDisableDropdown={
            !checkActionPermission(
              permissionKey.opsAssigneUser,
              props?.permissions
            )
          }
        />
      ) : (
        <>
          Attached organization with this candidate is new, you need to attach
          it to any OPS user.
        </>
      );
    },
  },
  {
    headerName: "CHECK INTERNAL STATUS",
    field: "checkstatus",
    width: 200,
    renderCell: (rowData, id, props) =>
      props.checkInternalStatusLists?.length ? (
        <CheckStatusDropdown
          id={id}
          options={props.checkInternalStatusLists}
          optionLabel="checkInternalStatusName"
          optionId="id"
          defaultValue={rowData?.checkInternalStatusId}
          setDisableBtn={props.setDisableBtnCheckStatus}
          setDropdownVal={props.setCheckStatusDropdown}
        />
      ) : null,
  },
  {
    headerName: "CHECK STATUS",
    field: "internal",
    width: 200,
    renderCell: (rowData, id, props) =>
      props.checkInternalStatusLists && (
        <DisplayChip
          id={id}
          rowData={rowData}
          checkStatusDropdown={props.checkStatusDropdown}
          checkInternalStatusLists={props.checkInternalStatusLists}
        />
      ),
  },

  {
    headerName: "RISK LEVEL",
    field: "risk",
    width: 150,
    renderCell: (rowData, id, props) =>
      props.verificationResultStatusData?.length ? (
        <DropdownComponent
          id={id}
          options={props.verificationResultStatusData}
          optionLabel="verificationResultStatusName"
          optionId="candidatesVerificationResultStatusId"
          defaultValue={rowData.verificationResultId || ""}
          placeholderText="Select Risk"
          setDisableBtn={props.setDisableBtnRiskLevel}
          setDropdownVal={props.setRiskLevelDropdown}
          displayIcon={true}
        />
      ) : null,
  },
  {
    field: "ACTION",
    headerName: "ACTIONS",
    type: "actions",
    width: 200,
    renderCell: (rowData, id, props) =>
      props.loadUpdateSingleCheckBtn && props.loadUpdateSingleCheckBtn[id] ? (
        <Button
          variant="contained"
          disabled={true}
          color="grey"
          sx={{ padding: "6px 25px" }}
        >
          <CircularLoader height="auto" size={20} />
        </Button>
      ) : (
        <Button
          variant="contained"
          disabled={
            Object.keys(props.disableBtnAssignee)?.length &&
            Object.keys(props.disableBtnCheckStatus)?.length &&
            Object.keys(props.disableBtnRiskLevel)?.length
              ? props.disableBtnAssignee[id] &&
                props.disableBtnCheckStatus[id] &&
                props.disableBtnRiskLevel[id]
              : true
          }
          onClick={() => props.handleUpdate(id)}
        >
          Update
        </Button>
      ),
  },
];
