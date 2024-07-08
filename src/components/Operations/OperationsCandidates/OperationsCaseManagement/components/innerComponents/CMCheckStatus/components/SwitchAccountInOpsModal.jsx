import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  styled,
} from "@mui/material";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAsCandidateInOps,
  loginAsHrInOps,
} from "../../../../../../../../store/actions/operationActions";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserHrOrganizationId } from "../../../../../../../../utils/UserHelper";
import { loginAsCandidateInVendor } from "../../../../../../../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../../../../../../../utils/getCurrentFileNameAndFunction.js";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0px 5px;
  min-height: 10vh;
  min-width: 30vw;
  overflow-y: scroll;
`;

const SwitchAccountInOpsModal = ({ open, handleClose, ...props }) => {
  const { OpsBasicCandidateInfo } = useSelector((state) => state.operations);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { email, hrOrganizationId } = useMemo(() => {
    //login as hr from ops settings
    if (props?.selectedCandidate && props?.switchAccountInto === "HR") {
      let { userMap, hrOrganizationId } = props?.rows?.find(
        (curr) =>
          curr?.hrOrganizationsId === props?.selectedCandidate?.hrOrganizationId
      )?.hrOrganization[0];

      return { email: userMap.loginEmail, hrOrganizationId };
    } else if (props?.selectedCandidate) {
      //login as candidate from candidates table

      let { candidateEmail, hrOrganizationId } = props?.rows?.find(
        (curr) => curr?.candidatesCasesId === props?.selectedCandidate
      );
      return {
        email: candidateEmail,
        hrOrganizationId: hrOrganizationId || getLoggedInUserHrOrganizationId(),
      };
    } else {
      //login as candidate from basic candidate info
      return {
        email: OpsBasicCandidateInfo?.candidateEmail,
        hrOrganizationId: OpsBasicCandidateInfo?.hrOrganizationId,
      };
    }
  }, [OpsBasicCandidateInfo, props]);

  const handleSubmit = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    if (props?.switchAccountInto === "HR") {
      dispatch(loginAsHrInOps({ email }, navigate, logDetails));
    } else if (props?.switchAccountInto === "Vendor") {
      dispatch(
        loginAsCandidateInVendor(
          {
            email,
            hrOrganizationId,
          },
          navigate,
          logDetails
        )
      );
    } else {
      dispatch(
        loginAsCandidateInOps(
          {
            email,
            hrOrganizationId,
          },
          navigate,
          logDetails
        )
      );
    }
    handleClose();
  };

  return (
    <Grid item xs={12}>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxWidth: "none",
            maxHeight: "95vh",
            overflowY: "scroll",
          },
        }}
      >
        <HrModalBox>
          <DialogContent>
            <Alert severity="warning">
              Are you sure you want to login into : <strong>{email}</strong> ?
            </Alert>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "auto",
              }}
            >
              <Button
                variant="contained"
                color="error"
                mr={1}
                onClick={handleClose}
              >
                Close
              </Button>{" "}
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Login
              </Button>
            </DialogActions>
          </DialogContent>
        </HrModalBox>
      </Dialog>
    </Grid>
  );
};

export default SwitchAccountInOpsModal;
