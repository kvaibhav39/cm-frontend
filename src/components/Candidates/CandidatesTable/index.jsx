import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DeletePackageModal from "../../../common/modals/DeletePackageModal";
import { useDispatch, useSelector } from "react-redux";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewIcon from "@mui/icons-material/Preview";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HistoryIcon from "@mui/icons-material/History";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import ProcessStatus from "./Cells/ProcessStatus";
import VerificationResult from "./Cells/VerificationResult";
import CheckStatusPreview from "./Cells/CheckStatusPreview";

import { Chip, Typography } from "@mui/material";
import permissionKey from "../../constants/permissionKey";
import {
  getCustomPackages,
  terminateStatusOfCandidate,
} from "../../../store/actions/hrActions";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import PdfReportModal from "./Modals/PdfReportModal";
import CustomTooltip from "../../common/CustomTooltip";
import CandidateHistoryModal from "./Modals/CandidateHistoryModal";
import { InfoOutlined, EditOutlined } from "@mui/icons-material";
import TableWithCustomPagination from "../../common/TableWithCustomPagination";
import SwitchAccountInOpsModal from "../../Operations/OperationsCandidates/OperationsCaseManagement/components/innerComponents/CMCheckStatus/components/SwitchAccountInOpsModal";
import LoginIcon from "@mui/icons-material/Login";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidatesTable = ({ setFilter, onFetchCandidates }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState();
  const [pdfReportModal, setPdfReportModal] = useState(false);
  const [candidateHistoryModal, setCandidateHistoryModal] = useState(false);
  const [selectedCandidateHistory, setSelectedCandidateHistory] =
    useState(null);
  const [selectedCandidatesLatestReport, setSelectedCandidatesLatestReport] =
    useState(null);
  const [page, setPage] = useState(1);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const {
    loading,
    candidatesLists,
    totalCandidateCaseCount,
    allCustomPackages,
    HrCandidatesFilter,
  } = useSelector((state) => state.hr);

  let vendorUser =
    JSON.parse(
      JSON.parse(localStorage.getItem("first_login"))?.CheckMinistryUser
    )?.subRoleId === 11;

  const loadCustomPackagesData = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "loadCustomPackagesData"
    );

    dispatch(
      getCustomPackages(
        {
          orgId: getLoggedInUserHrOrganizationId(),
        },
        logDetails
      )
    );
  };

  useEffect(() => !allCustomPackages?.length && loadCustomPackagesData(), []);

  useEffect(() => {
    setPage(HrCandidatesFilter?.pageNumber);
  }, [HrCandidatesFilter]);

  const handleClickOpenModal = (data) => {
    setSelectedPackage(data);
    setOpenModal(true);
  };

  const handleCloseModal = async (isDelete) => {
    if (isDelete) {
      let params = {
        orgId: getLoggedInUserHrOrganizationId(),
        candidateCaseId: selectedPackage,
      };

      let body = {
        verificationProcessId: 8,
      };

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleCloseModal"
      );

      dispatch(
        terminateStatusOfCandidate(params, body, onFetchCandidates, logDetails)
      );
    }
    setOpenModal(false);
  };

  const checkCandidateActionPermissions = (actionName, permissions) => {
    let hasAccess = permissions?.find(
      (permission) => permission?.actionName === actionName
    );
    if (hasAccess) {
      return true;
    }
    return false;
  };

  const columnActionArray = (params) => {
    let tempActionArray = [];

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="Update Package">
            <EditOutlined color="orange" />
          </CustomTooltip>
        }
        label="View"
        onClick={() => {
          navigate(
            `/hr/candidates/edit?updatePackage=${true}&candidateCaseId=${
              params?.row?.candidatesCasesId
            }`
          );
        }}
      />
    );

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="View Activity History">
            <HistoryIcon
              color={`${
                params?.row?.candidateCaseAuditData?.length
                  ? "info"
                  : "disabled"
              }`}
            />
          </CustomTooltip>
        }
        label="View"
        onClick={() => {
          setCandidateHistoryModal(true);
          setSelectedCandidateHistory(params.row.candidateCaseAuditData);
        }}
        disabled={!params?.row?.candidateCaseAuditData?.length}
      />
    );

    checkCandidateActionPermissions(
      permissionKey.hrCandidateViewVerification,
      params?.row?.permissions
    ) &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="View Candidate Data">
              <PreviewIcon color="primary" />
            </CustomTooltip>
          }
          label="View"
          onClick={() =>
            navigate(`/hr/candidates/view/${params.row.candidatesCasesId}`)
          }
        />
      );

    checkCandidateActionPermissions(
      permissionKey.hrCandidateViewReportPdf,
      params?.row?.permissions
    ) &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="View Verification Results">
              <PictureAsPdfIcon
                color={`${
                  params?.row?.latestReport?.length ? "error" : "disabled"
                }`}
              />
            </CustomTooltip>
          }
          label="Save As"
          onClick={() => {
            setPdfReportModal(true);
            setSelectedCandidatesLatestReport(params.row.latestReport);
          }}
          disabled={!params?.row?.latestReport?.length}
        />
      );

    checkCandidateActionPermissions(
      permissionKey.hrCandidateTerminateVerification,
      params?.row?.permissions
    ) &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Terminate Verification">
              <HighlightOffIcon color="error" />
            </CustomTooltip>
          }
          label="Delete"
          disabled={params.row.packageType === "SYSTEM"}
          onClick={() => handleClickOpenModal(params.row.candidatesCasesId)}
        />
      );

    checkCandidateActionPermissions(
      permissionKey.loginAsCandidate,
      params?.row?.permissions
    ) &&
      tempActionArray.push(
        <GridActionsCellItem
          icon={
            <CustomTooltip title="Login into candidate">
              <LoginIcon color="info" />
            </CustomTooltip>
          }
          label="Login"
          onClick={() => {
            setOpenLoginModal(true);
            setSelectedCandidate(params?.row?.candidatesCasesId);
          }}
        />
      );

    return tempActionArray;
  };

  const columns = [
    {
      headerName: "VERIFICATION RESULT",
      field: "verificationResultStatusName",
      width: 180,
      align: "center",
      renderCell: (params) => (
        <VerificationResult
          verificationResultStatusName={params.row.verificationResultStatusName}
          displayName={true}
        />
      ),
    },
    {
      headerName: "PROCESS STATUS",
      field: "verificationProcessStatusName",
      width: 160,
      renderCell: (params) => (
        <ProcessStatus
          processStatus={params.row.verificationProcessStatusName || {}}
        />
      ),
    },
    {
      headerName: "CHECK STATUS PREVIEW",
      field: "checkStatus",
      width: 200,
      renderCell: (params) => (
        <CheckStatusPreview
          data={params.row}
          assignedChecks={params.row.assignedCheck}
          selectedPackageName={params.row?.assignedPackage?.packageName}
        />
      ),
    },
    {
      headerName: "CASE NUMBER",
      field: "caseNumber",
      width: 150,
    },
    {
      headerName: "CANDIDATE NAME",
      field: "candidateName",
      width: 200,
      renderCell: (params) =>
        vendorUser ? (
          <Chip
            label={params.row.candidateName}
            size="medium"
            sx={{
              marginLeft: "10px",
              padding: "0 10px",
            }}
          />
        ) : (
          <CustomTooltip
            title={
              <>
                {params.row.candidateEmail} <br />{" "}
                {params.row.candidatePhone
                  ? "(" + params.row.candidatePhone + ")"
                  : ""}
              </>
            }
            placement="right"
          >
            <Chip
              label={params.row.candidateName}
              size="medium"
              sx={{
                marginLeft: "10px",
                padding: "0 10px",
              }}
            />
          </CustomTooltip>
        ),
    },

    {
      headerName: "HIRING COUNTRY",
      field: "hiringCountryName",
      width: 200,
    },

    {
      headerName: "REGISTERED BY",
      field: "userName",
      width: 150,
      valueGetter: (params) => params.row.createdByUser?.userName || {},
    },
    {
      headerName: "REG TEAM",
      field: "hrTeamName",
      width: 200,
    },
    {
      headerName: "REG DATE",
      field: "createdAt",
      width: 120,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      headerName: "CUSTOM FIELDS",
      field: "customFieldResponseData",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Typography>
          {params?.row?.customFieldResponseData?.length ? (
            <CustomTooltip
              title={params?.row?.customFieldResponseData?.map(
                (customField, index) => {
                  return (
                    <>
                      {`${index + 1}) ${customField?.customFieldName} - ${
                        customField?.customFieldResponseText ||
                        customField?.customFieldValue
                      }`}
                      <br />
                    </>
                  );
                }
              )}
              tooltipmaxwidth={300}
              placement="left"
            >
              <InfoOutlined color="secondary" />
            </CustomTooltip>
          ) : (
            "-"
          )}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 250,
      getActions: (params) => columnActionArray(params),
    },
  ];

  const handlePageChange = (e, newPage) => {
    if (page !== newPage) {
      setPage(newPage);
      setFilter({ pageNumber: newPage });
    }
  };

  return (
    <>
      <TableWithCustomPagination
        key="hr-candidates"
        rowId="candidatesCasesId"
        rows={candidatesLists}
        columns={columns}
        pageSize={10}
        page={page}
        loading={loading}
        totalCount={totalCandidateCaseCount}
        handlePageChange={handlePageChange}
      />
      <DeletePackageModal
        title="Terminate process"
        description="Are you sure you want to terminate this candidate's process?"
        handleClose={handleCloseModal}
        open={openModal}
        confirmBtn="Terminate"
      />
      {pdfReportModal && (
        <PdfReportModal
          open={pdfReportModal}
          handleClose={() => setPdfReportModal(false)}
          latestReport={selectedCandidatesLatestReport}
        />
      )}
      {candidateHistoryModal && (
        <CandidateHistoryModal
          open={candidateHistoryModal}
          handleClose={() => setCandidateHistoryModal(false)}
          candidateHistory={selectedCandidateHistory}
        />
      )}
      {openLoginModal ? (
        <SwitchAccountInOpsModal
          open={openLoginModal}
          handleClose={() => setOpenLoginModal(false)}
          rows={candidatesLists}
          selectedCandidate={selectedCandidate}
          switchAccountInto="Vendor"
        />
      ) : null}
    </>
  );
};

export default CandidatesTable;
