import { Box, Button, Typography } from "@mui/material";
import { Block } from "@mui/icons-material";
import ProcessStatus from "../../../../../../Candidates/CandidatesTable/Cells/ProcessStatus";
import { useSelector } from "react-redux";
import CircularLoader from "../../../../../../../common/CircularLoader";
import CustomTooltip from "../../../../../../common/CustomTooltip";
import { useState } from "react";
import StatusPreviewModal from "./../../../../../../Candidates/CandidatesTable/Modals/StatusPreviewModal";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ViewCandidateDetailsModal from "./components/ViewCandidateDetailsModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExportReport from './../CMVerifyCandidateDetails/VerifiedReportPdf/ExportReport';

const CMHeading = () => {
  const {
    OpsBasicCandidateInfo,
    OpsBasicCandidateInfoAdditionalData,
    allSubChecksLists,
  } = useSelector((state) => state.operations);
  const [checksModal, setChecksModal] = useState(false);
  const [candidatesModal, setCandidatesModal] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      {OpsBasicCandidateInfo ? (
        <Box display="flex" alignItems="center">
          <Box flexShrink={0} mr={1}>
            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  JSON.parse(localStorage.getItem("OpsCandidateFilterUrl")) ||
                    "/ops/candidates"
                )
              }
            >
              <ArrowBackIcon /> &nbsp; Back
            </Button>
          </Box>
          <Box
            display="flex"
            justifyContent={{ xs: "center", md: "space-between" }}
            alignItems="center"
            flexDirection={{ xs: "column", md: "row" }}
            gap={1}
            width="100%"
          >
            <Box display="flex" flexDirection="column">
              <Typography
                fontWeight={550}
                color={(theme) => theme.palette.primary.main}
                mb={{ xs: 1, md: "0" }}
                sx={{ wordBreak: "break-all" }}
              >
                Case Number: {OpsBasicCandidateInfo?.caseNumber}
              </Typography>

              <Box display="flex" columnGap={1}>
                <Typography
                  fontSize={20}
                  fontWeight={550}
                  mb={{ xs: 1, md: "0" }}
                  sx={{ wordBreak: "break-all" }}
                >
                  {OpsBasicCandidateInfo?.candidateName} (
                  {OpsBasicCandidateInfo?.candidateEmail})
                </Typography>
                <CustomTooltip title="View Check Scope">
                  <ChecklistIcon
                    color="primary"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#F2F4FE",
                      marginTop: "2.5px",
                      borderRadius: 5,
                    }}
                    onClick={() => setChecksModal(true)}
                  />
                </CustomTooltip>
                <CustomTooltip title="View Candidate Data">
                  <VisibilityIcon
                    color="primary"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#F2F4FE",
                      marginTop: "2.5px",
                      borderRadius: 5,
                    }}
                    onClick={() => setCandidatesModal(true)}
                  />
                </CustomTooltip>
              </Box>
              {allSubChecksLists?.length ? <ExportReport /> : null}
            </Box>
            <Box
              display="flex"
              justifyContent={{ xs: "center", md: "space-between" }}
              alignItems={{ xs: "center", md: "flex-start" }}
              flexDirection="column"
              gap={1}
              maxWidth={{ xs: "100%", md: "30%" }}
            >
              <Box display="flex" alignItems="center">
                <Typography fontWeight={500} sx={{ wordBreak: "break-all" }}>
                  {" "}
                  Current Risk Level&nbsp;:
                </Typography>
                {OpsBasicCandidateInfo?.verificationResultStatusName ? (
                  <>
                    <Block sx={{ margin: "0 5px" }} />
                    <Typography
                      fontWeight={500}
                      sx={{ wordBreak: "break-all" }}
                    >
                      {OpsBasicCandidateInfo?.verificationResultStatusName}{" "}
                    </Typography>
                  </>
                ) : (
                  <Typography
                    fontWeight={550}
                    sx={{ wordBreak: "break-all" }}
                    ml={1}
                  >
                    No Results Yet
                  </Typography>
                )}
              </Box>

              <Box
                display="flex"
                alignItems="center"
                flexDirection={{ xs: "column", md: "row" }}
              >
                <Typography
                  fontWeight={500}
                  sx={{ wordBreak: "break-all" }}
                  mr={1}
                >
                  {" "}
                  Process Status&nbsp;:
                </Typography>
                {OpsBasicCandidateInfo?.verificationProcessStatusName ? (
                  <Box>
                    <ProcessStatus
                      processStatus={
                        OpsBasicCandidateInfo?.verificationProcessStatusName
                      }
                      size="medium"
                    />
                  </Box>
                ) : (
                  <Typography
                    fontWeight={550}
                    sx={{ wordBreak: "break-all" }}
                    ml={1}
                  >
                    No Results Yet
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <CircularLoader height="10vh" size={40} />
      )}

      {checksModal ? (
        <StatusPreviewModal
          open={checksModal}
          handleClose={() => setChecksModal(false)}
          assignedChecks={OpsBasicCandidateInfoAdditionalData?.assignedChecks}
          selectedPackageName={
            OpsBasicCandidateInfoAdditionalData?.assignedPackage?.packageName
          }
        />
      ) : null}

      {candidatesModal ? (
        <ViewCandidateDetailsModal
          open={candidatesModal}
          handleClose={() => setCandidatesModal(false)}
        />
      ) : null}
    </>
  );
};

export default CMHeading;
