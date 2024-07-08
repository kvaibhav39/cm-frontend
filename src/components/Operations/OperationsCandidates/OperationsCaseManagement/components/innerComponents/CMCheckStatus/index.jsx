import { Typography, Box, Card, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect, useState } from "react";

import {
  getCheckInternalStatus,
  getOPSCandidateCaseChecks,
  getOPSUserBySubRoleIds,
  getVerificationResultStatus,
} from "../../../../../../../store/actions/operationActions";
import { useSearchParams } from "react-router-dom";
import CircularLoader from "../../../../../../../common/CircularLoader";

import SwitchAccountInOpsModal from "./components/SwitchAccountInOpsModal";
import CheckLists from "./CheckLists";
import { isEqual } from "lodash";
import SelectedCheckDetails from "./SelectedCheckDetails";
import { getAllChecks } from "../../../../../../../store/actions/hrActions";
import AddCheck from "./AddCheck/index";
import { GET_OPS_USERS_BY_SUBROLE_IDS } from "../../../../../../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "../../../../../../../utils/getCurrentFileNameAndFunction.js";

const CMCheckStatus = memo(
  () => {
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const [searchParams, _] = useSearchParams();
    const {
      OpsBasicCandidateInfo,
      OpsCandidateCaseChecksList,
      allSubChecksLists,
      OpsUserBySubRoleIds,
      checkInternalStatusLists,
      verificationResultStatusData,
    } = useSelector((state) => state.operations);

    useEffect(() => {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        getOPSCandidateCaseChecks(
          {
            candidateCaseId: +searchParams.get("candidatesCasesId"),
          },
          logDetails
        )
      );

      dispatch(getCheckInternalStatus(logDetails));
      dispatch(getVerificationResultStatus(logDetails));

      return () =>
        dispatch({
          type: GET_OPS_USERS_BY_SUBROLE_IDS,
          payload: null,
        });
    }, []);

    useEffect(() => {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      if (OpsBasicCandidateInfo) {
        dispatch(
          getOPSUserBySubRoleIds(
            {
              subRoleIds: "7,9",
              forAssignee: "1",
              hrOrganizationId: OpsBasicCandidateInfo?.hrOrganizationId,
            },
            logDetails
          )
        );
        dispatch(getAllChecks(logDetails,OpsBasicCandidateInfo?.hrOrganizationId));
      }
    }, [OpsBasicCandidateInfo]);

    return (
      <Box mt={{ xs: "none", md: "-20px" }}>
        <Typography fontWeight={550} mt={2} mb={1}>
          Check Status{" "}
          <Box
            component="span"
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              color: (theme) => theme.palette.primary.main,
            }}
            onClick={() => setOpenModal(true)}
          >
            (Login as Candidate)
          </Box>
        </Typography>

        {/*Add Check Component */}
        <AddCheck />

        {OpsBasicCandidateInfo &&
        OpsCandidateCaseChecksList &&
        allSubChecksLists &&
        OpsUserBySubRoleIds &&
        checkInternalStatusLists &&
        verificationResultStatusData ? (
          <Grid
            container
            mt={2}
            mb={1}
            gap={1}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            height={OpsCandidateCaseChecksList?.length > 12 ? "70vh" : "50vh"}
          >
            {OpsCandidateCaseChecksList?.length ? (
              <>
                <Grid
                  item
                  xs={12}
                  md={2.9}
                  xl={1.9}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.grey[400]}`,
                    borderRadius: "5px",
                  }}
                  p={1}
                  height="100%"
                  overflow="auto"
                >
                  {OpsCandidateCaseChecksList?.map((caseCheck, ind) => (
                    <CheckLists
                      key={caseCheck?.candidatesChecksMappingId}
                      caseCheck={caseCheck}
                    />
                  ))}
                </Grid>

                <Grid item xs={12} md={9} xl={10} height="100%" overflow="auto">
                  <Card
                    variant="outlined"
                    sx={{
                      padding: "0.5rem",
                      height: "100%",
                      overflow: "auto",
                      minWidth: "fit-content",
                    }}
                    id="ops-candidate-select-check-or-subcheck-scroll"
                  >
                    <SelectedCheckDetails />
                  </Card>
                </Grid>
              </>
            ) : (
              <Typography fontWeight={550} my={1} textAlign="center">
                No Checks Present
              </Typography>
            )}
          </Grid>
        ) : (
          <CircularLoader height="10vh" size={40} />
        )}

        {openModal ? (
          <SwitchAccountInOpsModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
          />
        ) : null}
      </Box>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default CMCheckStatus;
