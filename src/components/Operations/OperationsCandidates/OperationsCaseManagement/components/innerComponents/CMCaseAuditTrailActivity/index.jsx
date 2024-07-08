import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCandidateCaseAuditTrailActivity } from "../../../../../../../store/actions/operationActions";
import CircularLoader from "../../../../../../../common/CircularLoader";
import CMTableComponent from "../common/CMTableComponent";
import {
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  Box,
  TableRow,
  Grid,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import moment from "moment";
import { getCurrentFileNameAndFunction } from "../../../../../../../utils/getCurrentFileNameAndFunction.js";

const CMCaseAuditTrailActivity = () => {
  const [open, setOpen] = useState(false);
  const { OpsBasicCandidateInfo, OpsAuditTrailActivity } = useSelector(
    (state) => state.operations
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (OpsBasicCandidateInfo?.candidatesCasesId) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        getCandidateCaseAuditTrailActivity(
          OpsBasicCandidateInfo?.candidatesCasesId,
          logDetails
        )
      );
    }
  }, [OpsBasicCandidateInfo]);

  return (
    <Box>
      {OpsAuditTrailActivity ? (
        <>
          <Typography fontWeight={550} mb={1}>
            Audit Trail Activity
          </Typography>
          <Grid
            container
            border={(theme) => `1px solid ${theme.palette.grey[400]}`}
            borderRadius="5px"
            width="100%"
          >
            <Grid
              p={1}
              item
              xs={12}
              display="flex"
              alignItems="center"
              gap="10px"
              onClick={() => setOpen(!open)}
              sx={{ cursor: "pointer" }}
            >
              <Grid item xs={1}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Grid>
              <Grid
                item
                xs={11}
                display="flex"
                alignItems="center"
                fontWeight={550}
                fontSize={{ xs: "8px", md: "14px" }}
              >
                <Grid xs={2}>Activity Time</Grid>
                <Grid xs={4.5}>Activity</Grid>
                <Grid xs={0.5} />
                <Grid xs={5} marginLeft="-3px">
                  Message
                </Grid>
              </Grid>
            </Grid>
            {open ? (
              <Box sx={{ width: "100%", maxHeight: "50vh", overflow: "auto" }}>
                {OpsAuditTrailActivity?.map((curr, index) => (
                  <Grid
                    p={1}
                    item
                    xs={12}
                    display="flex"
                    alignItems="center"
                    gap="10px"
                    key={index}
                    borderTop={(theme) =>
                      `1px solid ${theme.palette.grey[400]}`
                    }
                    sx={{
                      whiteSpace: "normal !important",
                      wordBreak: "break-word !important",
                    }}
                  >
                    <Grid item xs={1} sx={{ opacity: "0" }}>
                      <IconButton aria-label="expand row" size="small">
                        <KeyboardArrowDown />
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={11}
                      display="flex"
                      alignItems="center"
                      fontSize={{ xs: "10px", md: "14px" }}
                    >
                      <Grid xs={2}>
                        {moment(curr.createdAt).format("DD/MM/YYYY h:mm a")}
                      </Grid>
                      <Grid xs={4.5}>{curr.activityKey}</Grid>
                      <Grid xs={0.5} />
                      <Grid xs={5}>{curr.activityMessage}</Grid>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            ) : null}
          </Grid>
        </>
      ) : (
        <CircularLoader height="10vh" size={40} />
      )}
    </Box>
  );
};

export default CMCaseAuditTrailActivity;
