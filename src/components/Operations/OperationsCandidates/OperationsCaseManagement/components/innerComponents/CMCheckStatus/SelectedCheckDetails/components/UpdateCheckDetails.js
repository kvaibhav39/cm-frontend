import React, { useMemo } from "react";
import {
  Box,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { updateStateWith } from "../../utils/updateStateWith";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { updateCheckData } from "../../../../../../../../../store/actions/operationActions";
import CMTableComponent from "../../../common/CMTableComponent";
import { checkStatusColumns } from "./../../utils/checkStatusColumns";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setToastNotification } from "../../../../../../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../../../../../../store/constant";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../utils/getCurrentFileNameAndFunction";

const UpdateCheckDetails = () => {
  const [disableBtnAssignee, setDisableBtnAssignee] = useState({});
  const [disableBtnCheckStatus, setDisableBtnCheckStatus] = useState({});
  const [disableBtnRiskLevel, setDisableBtnRiskLevel] = useState({});
  const [assigneeDropdown, setAssigneeDropdown] = useState({});
  const [checkStatusDropdown, setCheckStatusDropdown] = useState({});
  const [riskLevelDropdown, setRiskLevelDropdown] = useState({});
  const {
    OpsCandidateCaseChecksList,
    OpsUserBySubRoleIds,
    checkInternalStatusLists,
    verificationResultStatusData,
    loadUpdateSingleCheckBtn,
    selectedCheckId,
  } = useSelector((state) => state.operations);

  const { permissions } = useSelector((state) => state.authorization);

  const [searchParams, _] = useSearchParams();
  const theme = useTheme();
  const dispatch = useDispatch();

  let rowData = useMemo(() => {
    return OpsCandidateCaseChecksList?.find(
      (curr) => curr?.candidatesChecksMappingId === selectedCheckId
    );
  }, [OpsCandidateCaseChecksList, selectedCheckId]);

  //disabling update btn when component mounts
  useEffect(() => {
    if (OpsCandidateCaseChecksList) {
      if (
        Object.keys(disableBtnAssignee)?.length === 0 &&
        Object.keys(disableBtnCheckStatus)?.length === 0 &&
        Object.keys(disableBtnRiskLevel)?.length === 0
      ) {
        OpsCandidateCaseChecksList?.forEach((curr) => {
          updateStateWith(
            setDisableBtnAssignee,
            curr.candidatesChecksMappingId,
            true
          );
          updateStateWith(
            setDisableBtnCheckStatus,
            curr.candidatesChecksMappingId,
            true
          );
          updateStateWith(
            setDisableBtnRiskLevel,
            curr.candidatesChecksMappingId,
            true
          );
        });
      }
    }

    return () => {
      setDisableBtnAssignee({});
      setDisableBtnCheckStatus({});
      setDisableBtnRiskLevel({});
      setAssigneeDropdown({});
      setCheckStatusDropdown({});
      setRiskLevelDropdown({});
    };
  }, [OpsCandidateCaseChecksList]);

  const handleUpdate = (id) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdate"
    );
    
    if (!assigneeDropdown[id]) {

      return dispatch(
        setToastNotification(
          ERROR,
          "Please select a valid assignee",
          logDetails
        )
      );
    }

    let payload = {
      assignee: assigneeDropdown[id],
      checkInternalStatusId: checkStatusDropdown[id],
      verificationResultId: riskLevelDropdown[id],
    };

    dispatch(
      updateCheckData(
        payload,
        id,
        +searchParams.get("candidatesCasesId"),
        logDetails
      )
    );

    //after update call , making update btn disabled again
    updateStateWith(setDisableBtnAssignee, id, true);
    updateStateWith(setDisableBtnCheckStatus, id, true);
    updateStateWith(setDisableBtnRiskLevel, id, true);
  };

  return (
    <>
      {rowData ? (
        <CMTableComponent removeTableBottomBorder={true}>
          <TableHead>
            <TableRow sx={{ background: theme.palette.primary.main }}>
              {checkStatusColumns?.map((columnData, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{ fontSize: "12px", color: "#fff" }}
                >
                  {columnData?.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {checkStatusColumns?.map((columnData, index) => (
                <TableCell key={index} align="center">
                  {columnData?.renderCell(
                    rowData,
                    rowData?.candidatesChecksMappingId,
                    {
                      disableBtnAssignee,
                      disableBtnCheckStatus,
                      disableBtnRiskLevel,
                      setDisableBtnAssignee,
                      setDisableBtnCheckStatus,
                      setDisableBtnRiskLevel,
                      handleUpdate,
                      setAssigneeDropdown,
                      checkStatusDropdown,
                      setCheckStatusDropdown,
                      setRiskLevelDropdown,
                      OpsUserBySubRoleIds,
                      checkInternalStatusLists,
                      verificationResultStatusData,
                      permissions,
                      assigneeDropdown,
                      loadUpdateSingleCheckBtn,
                    }
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </CMTableComponent>
      ) : null}
    </>
  );
};

export default UpdateCheckDetails;
