import { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Chip, styled } from "@mui/material";
import CheckStatusPreview from "../../../Candidates/CandidatesTable/Cells/CheckStatusPreview";
import ProcessStatus from "../../../Candidates/CandidatesTable/Cells/ProcessStatus";
import VerificationResult from "../../../Candidates/CandidatesTable/Cells/VerificationResult";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import CustomTooltip from "../../../common/CustomTooltip";
import TuneIcon from "@mui/icons-material/Tune";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useSearchParams } from "react-router-dom";
import AssigneeComponent from "./innerComponents/AssigneeComponent";
import { useState } from "react";
import { calculateM1DueDate } from "../utils/calculateM1DueDate";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { InfoOutlined } from "@mui/icons-material";
import TableWithCustomPagination from "../../../common/TableWithCustomPagination";
import LoginIcon from "@mui/icons-material/Login";
import SwitchAccountInOpsModal from "../OperationsCaseManagement/components/innerComponents/CMCheckStatus/components/SwitchAccountInOpsModal";

const OperationsCandidatesTableUI = ({ setOpsComponent }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateAssignee, setUpdateAssignee] = useState({});
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    totalCandidateCaseCount,
    OpsCandidatesList,
    loading,

    opsSubcheckListTableData,
    totalSubChecksCount,
  } = useSelector((state) => state.operations);

  useEffect(() => {
    setPage(+searchParams.get("pageNumber"));
  }, [searchParams]);

  let localStorageData = JSON.parse(localStorage.getItem("first_login"));
  let loggedInUserData = JSON.parse(localStorageData?.CheckMinistryUser);

  const columnActionArray = (params) => {
    let tempActionArray = [];

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="Case Settings">
            <SettingsApplicationsIcon color="primary" />
          </CustomTooltip>
        }
        label="View"
      />
    );

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="Case Management">
            <TuneIcon color="primary" />
          </CustomTooltip>
        }
        label="View"
        onClick={() => {
          navigate(
            `/ops/candidates/case-management?candidatesCasesId=${params?.row?.candidatesCasesId}`
          );
        }}
      />
    );

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="View Verification Report">
            <PictureAsPdfIcon color="error" />
          </CustomTooltip>
        }
        label="View"
      />
    );

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="View Candidate Data">
            <VisibilityIcon color="primary" />
          </CustomTooltip>
        }
        label="View"
        onClick={() => setOpsComponent(params?.row?.candidatesCasesId)}
      />
    );

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="Login into candidate">
            <LoginIcon
              // color={
              //   OpsCandidatesList?.find(
              //     (curr) =>
              //       curr?.candidatesCasesId === params?.row?.candidatesCasesId
              //   )?.createdByUser?.usersId === loggedInUserData?.usersId &&
              //   loggedInUserData?.subRoleId === 6
              //     ? "info"
              //     : "disabled"
              // }
              color={
                OpsCandidatesList?.find(
                  (curr) =>
                    curr?.candidatesCasesId === params?.row?.candidatesCasesId
                )?.createdByUser?.usersId === loggedInUserData?.usersId
                  ? "info"
                  : "disabled"
              }
            />
          </CustomTooltip>
        }
        label="Login"
        onClick={() => {
          setOpenModal(true);
          setSelectedCandidate(params?.row?.candidatesCasesId);
        }}
        // disabled={
        //   OpsCandidatesList?.find(
        //     (curr) => curr?.candidatesCasesId === params?.row?.candidatesCasesId
        //   )?.createdByUser?.usersId !== loggedInUserData?.usersId ||
        //   loggedInUserData?.subRoleId !== 6
        // }
        disabled={
          OpsCandidatesList?.find(
            (curr) => curr?.candidatesCasesId === params?.row?.candidatesCasesId
          )?.createdByUser?.usersId !== loggedInUserData?.usersId
        }
      />
    );

    return tempActionArray;
  };

  const candidateColumns = [
    {
      headerName: "VERIFICATION RESULT",
      field: "verificationResultStatusName",
      width: 180,
      align: "center",
      renderCell: (params) => (
        <VerificationResult
          verificationResultStatusName={
            params.row.verificationResultStatusName || ""
          }
          displayName={true}
        />
      ),
    },
    {
      field: "caseNumber",
      headerName: "CASE NO.",
      width: 150,
      align: "center",
    },
    {
      field: "verificationProcessStatusName",
      headerName: "PROCESS STATUS",
      width: 200,
      align: "center",
      renderCell: (params) => (
        <ProcessStatus
          processStatus={params.row.verificationProcessStatusName || {}}
        />
      ),
    },
    {
      field: "candidateName",
      headerName: "CANDIDATE NAME",
      width: 300,
      align: "center",
      renderCell: (params) => (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          sx={{
            //breaks word if they are too long
            whiteSpace: "normal !important",
            wordWrap: "break-word !important",
          }}
        >
          <Box mt={0.5} mr={1}>
            <CustomTooltip title={params.row.candidateEmail}>
              <InfoOutlined />
            </CustomTooltip>
          </Box>

          <Box width="80%">{params.row.candidateName}</Box>
        </Box>
      ),
    },
    {
      field: "age",
      headerName: "PACKAGE NAME",
      type: "number",
      width: 300,
      align: "center",
      valueGetter: (params) => params.row?.assignedPackage?.packageName || "-",
    },
    {
      field: "hrOrganizationName",
      headerName: "ORG NAME",
      width: 200,
      align: "center",
    },
    {
      field: "1",
      headerName: "CHECK STATUS",
      type: "number",
      width: 250,
      align: "center",
      renderCell: (params) => (
        <CheckStatusPreview
          data={params.row}
          assignedChecks={params.row.assignedCheck}
          selectedPackageName={params.row?.assignedPackage?.packageName}
        />
      ),
    },
    {
      field: "2",
      headerName: "OPS ASSIGNEE",
      type: "number",
      width: 250,
      align: "center",
      renderCell: (params) => {
        let assigneeLists = [];

        params.row?.hrOrganization?.opsUserMappingData?.forEach((curr) => {
          assigneeLists.push({
            assignee: curr?.opsUserData?.usersId,
            assigneeName: curr?.opsUserData?.userName,
            assigneeEmail: curr?.opsUserData?.loginEmail,
          });
        });
        return (
          <AssigneeComponent
            data={params.row}
            updateAssignee={updateAssignee}
            setUpdateAssignee={setUpdateAssignee}
            assigneeLists={assigneeLists}
          />
        );
      },
    },
    {
      field: "submissionDate",
      headerName: "SUBMISSION DATE",
      type: "number",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <>
          {params.row?.submissionDate
            ? moment(params.row?.submissionDate).format("DD-MM-YYYY")
            : "-"}
        </>
      ),
    },
    {
      field: "dueDate",
      headerName: "DUE DATE",
      type: "number",
      width: 150,
      align: "center",
      renderCell: (params) => {
        let result = calculateM1DueDate(params.row?.submissionDate);
        let dueDate = result?.dueDate;
        let diffInDays = result?.differenceInDays;
        return (
          <>
            {params.row?.submissionDate ? dueDate : "-"}
            <CustomTooltip title="M1 Due Date">
              <Chip
                label={params.row?.submissionDate ? diffInDays : "-"}
                size="small"
                sx={{
                  color: diffInDays >= 0 ? "#00C95C" : "#FF989A",
                  backgroundColor: diffInDays >= 0 ? "#D9F9EB" : "#FBDDE2",
                  fontSize: "10px",
                  width: "25px",
                  height: "16px",
                  marginLeft: "5px",
                  marginTop: "-2px",
                  padding: "1px",
                  borderRadius: "1px",
                  "> span": {
                    padding: 0,
                  },
                }}
              />
            </CustomTooltip>
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 200,
      align: "center",
      getActions: (params) => columnActionArray(params),
    },
  ];

  const checksColumns = [
    {
      headerName: "VERIFICATION RESULT",
      field: "subCheckVerificationResultStatusName",
      width: 180,
      align: "center",
      renderCell: (params) =>
        params.row.subCheckVerificationResultStatusName || "-",
      // renderCell: (params) => (
      //   <VerificationResult
      //     verificationResultStatusName={
      //       params.row.verificationResultStatusName || ""
      //     }
      //     displayName={true}
      //   />
      // ),
    },
    {
      field: "caseNumber",
      headerName: "CASE NO.",
      width: 150,
      align: "center",
    },
    {
      field: "checkTypeName",
      headerName: "CHECK TYPE",
      width: 200,
      align: "center",
    },
    {
      field: "subCheckDisplayName",
      headerName: "CHECK NAME",
      width: 300,
      align: "center",
      // renderCell: (params) => (
      //   <Box
      //     width="100%"
      //     display="flex"
      //     alignItems="center"
      //     sx={{
      //       //breaks word if they are too long
      //       whiteSpace: "normal !important",
      //       wordWrap: "break-word !important",
      //     }}
      //   >
      //     <Box mt={0.5} mr={1}>
      //       <CustomTooltip title={params.row.candidateEmail}>
      //         <InfoOutlined />
      //       </CustomTooltip>
      //     </Box>

      //     <Box width="80%">{params.row.candidateName}</Box>
      //   </Box>
      // ),
    },
    {
      field: "checkStatusName",
      headerName: "CHECK STATUS",
      width: 250,
      align: "center",
    },
    {
      field: "hrOrganizationName",
      headerName: "ORG NAME",
      width: 200,
      align: "center",
    },
    {
      field: "assigneeName",
      headerName: "CHECK ASSIGNEE",
      width: 250,
      align: "center",
      renderCell: (params) => params.row.assigneeName || "-",
    },
    {
      field: "submissionDate",
      headerName: "SUBMISSION DATE",
      type: "number",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <>
          {params.row?.submissionDate
            ? moment(params.row?.submissionDate).format("DD-MM-YYYY")
            : "-"}
        </>
      ),
    },
    {
      field: "dueDate",
      headerName: "DUE DATE",
      type: "number",
      width: 150,
      align: "center",
      renderCell: (params) => {
        let result = calculateM1DueDate(params.row?.submissionDate);
        let dueDate = result?.dueDate;
        let diffInDays = result?.differenceInDays;
        return (
          <>
            {params.row?.submissionDate ? dueDate : "-"}
            <CustomTooltip title="M1 Due Date">
              <Chip
                label={params.row?.submissionDate ? diffInDays : "-"}
                size="small"
                sx={{
                  color: diffInDays >= 0 ? "#00C95C" : "#FF989A",
                  backgroundColor: diffInDays >= 0 ? "#D9F9EB" : "#FBDDE2",
                  fontSize: "10px",
                  width: "25px",
                  height: "16px",
                  marginLeft: "5px",
                  marginTop: "-2px",
                  padding: "1px",
                  borderRadius: "1px",
                  "> span": {
                    padding: 0,
                  },
                }}
              />
            </CustomTooltip>
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 200,
      align: "center",
      getActions: (params) => columnActionArray(params),
    },
  ];

  const handlePageChange = (e, newPage) => {
    if (page !== newPage) {
      setPage(newPage);

      setSearchParams((prevParams) => {
        return new URLSearchParams({
          ...Object.fromEntries(prevParams.entries()),
          pageNumber: newPage,
        });
      });
    }
  };

  return (
    <>
      <TableWithCustomPagination
        key="ops-candidates"
        rowId={
          searchParams.get("toggledOpsTableView") === "candidates"
            ? "candidatesCasesId"
            : "id"
        }
        rows={
          searchParams.get("toggledOpsTableView") === "candidates"
            ? OpsCandidatesList
            : opsSubcheckListTableData
        }
        columns={
          searchParams.get("toggledOpsTableView") === "candidates"
            ? candidateColumns
            : checksColumns
        }
        pageSize={10}
        page={page}
        loading={
          loading ||
          (searchParams.get("toggledOpsTableView") === "candidates"
            ? !OpsCandidatesList
            : !opsSubcheckListTableData)
        }
        totalCount={
          searchParams.get("toggledOpsTableView") === "candidates"
            ? totalCandidateCaseCount
            : totalSubChecksCount
        }
        handlePageChange={handlePageChange}
      />
      {openModal &&
      (searchParams.get("toggledOpsTableView") === "candidates"
        ? OpsCandidatesList?.length
        : opsSubcheckListTableData?.length) ? (
        <SwitchAccountInOpsModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          rows={
            searchParams.get("toggledOpsTableView") === "candidates"
              ? OpsCandidatesList
              : opsSubcheckListTableData
          }
          selectedCandidate={selectedCandidate}
        />
      ) : null}
    </>
  );
};

export default OperationsCandidatesTableUI;
