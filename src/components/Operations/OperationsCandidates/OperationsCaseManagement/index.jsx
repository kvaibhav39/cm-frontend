import React, { useEffect } from "react";
import OpsCaseManagementMainComponent from "./components/OpsCaseManagementMainComponent";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import PanelCard from "../../../../common/cards/PanelCard";
import { getBasicCandidateInfo } from "../../../../store/actions/operationActions";
import {
  GET_ALL_SUB_CHECKS_LIST,
  HANDLE_CV_CHECK_ADDED_FILE,
  REMOVE_CHECK_AND_SUBCHECK,
} from "../../../../store/actions/actionTypes";
import CMFooter from "./components/innerComponents/CMFooter";
import { getCandidateDetailsById } from "../../../../store/actions/hrActions";
import CMHeading from "./components/innerComponents/CMHeading/index";
import { useSelector } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

const OperationsCaseManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down("md"));
  const { addedChecksAndSubCheck } = useSelector((state) => state.operations);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getBasicCandidateInfo(
        {
          candidateCaseId: +searchParams.get("candidatesCasesId"),
        },
        navigate,
        logDetails
      )
    );

    //reseting checks & subchecks saved in redux store
    dispatch({
      type: REMOVE_CHECK_AND_SUBCHECK,
      payload: "all",
    });

    //reseting uploaded file in cv check
    dispatch({
      type: HANDLE_CV_CHECK_ADDED_FILE,
      payload: null,
    });

    //candidate details
    dispatch(
      getCandidateDetailsById({
        candidateCaseId: searchParams.get("candidatesCasesId"),
        logDetails,
      })
    );

    return () => {
      dispatch({ type: GET_ALL_SUB_CHECKS_LIST, payload: [] });
    };
  }, []);

  return (
    <PanelCard>
      <Grid
        item
        md={10}
        xs={12}
        sx={{ height: { xs: "95vh", md: "90vh" }, overflow: "auto" }}
        maxWidth="1800px"
        margin="0 auto"
        pr={0.5}
      >
        {!smallDevice && <CMHeading />}
        <Box
          maxHeight={
            addedChecksAndSubCheck?.length
              ? { xs: "100%", md: "65%", lg2: "75%", xxl: "85%" }
              : { xs: "100%", md: "75%", lg2: "85%", xxl: "90%" }
          }
          overflow="auto"
        >
          <OpsCaseManagementMainComponent smallDevice={smallDevice} />
        </Box>
        {addedChecksAndSubCheck?.length ? (
          <Box>
            <CMFooter />
          </Box>
        ) : null}
      </Grid>
    </PanelCard>
  );
};

export default OperationsCaseManagement;
