import { Grid, Box, Dialog, Button } from "@mui/material";
import styled from "@emotion/styled";
import { useSearchParams } from "react-router-dom";
import ViewCandidateInHR from "../../../../../../../../common/ViewCandidateInHR";
import CloseIcon from "@mui/icons-material/Close";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0 5px 5px;
  min-height: 90vh;
  width: 90vw;
  overflow: "hidden";
`;

const ViewCandidateDetailsModal = ({ open, handleClose }) => {
  const [params, _] = useSearchParams();

  return (
    <Grid item xs={12}>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxWidth: "none",
            maxHeight: "95vh",
            overflow: "none",
          },
        }}
      >
        <HrModalBox>
          <Box display="flex" justifyContent="flex-end" pr={1} pt={1}>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                color: (theme) => theme.palette.grey[700],
              }}
            />
          </Box>
          <ViewCandidateInHR
            candidatesCasesId={params.get("candidatesCasesId")}
            hideBackBtn={true}
          />
        </HrModalBox>
      </Dialog>
    </Grid>
  );
};

export default ViewCandidateDetailsModal;
