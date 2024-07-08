import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CandidatesTable from "./CandidatesTable";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import TeamRangeSelection from "../common/TeamRangeSelection";
import { useDispatch, useSelector } from "react-redux";
import {
  checkActionPermission,
  checkPagePermission,
} from "../../utils/CheckPageAccess";
import permissionKey from "../constants/permissionKey";
import ScrollableGrid from "../../common/ScrollableGrid";
import PanelCard from "../../common/cards/PanelCard";
import AddMultipleCandidatesModal from "./CandidatesTable/Modals/AddMultipleCandidatesModal";
import { getFailedToRegisterCandidates } from "../../store/actions/hrActions";
import { hrCandidatesByOrgId } from "../../store/actions/hrActions";
import { SET_HR_CANDIDATES_FILTER } from "../../store/actions/actionTypes";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { ERROR } from "../../store/constant";
import moment from "moment";
import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import { debounce } from "lodash";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const CandidatesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterCandidates, setFilteredCandidates] = useState("");

  const loggedInUser = useSelector((state) => state.authorization);
  const { HrCandidatesFilter } = useSelector((state) => state.hr);

  const [addMultipleCandidatesModal, setAddMultipleCandidatesModal] =
    useState(false);

  useEffect(() => {
    return () =>
      dispatch({
        type: SET_HR_CANDIDATES_FILTER,
        payload: { ...HrCandidatesFilter, searchText: "" },
      });
  }, []);

  const hrCandidateCreateAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrInviteCandidate,
        loggedInUser.permissions
      ) &&
      checkPagePermission("/hr/candidates/create", loggedInUser.permissions),
    [loggedInUser.permissions]
  );

  const onFilterChange = (finalFilters) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "onFilterChange"
    );

    dispatch(
      hrCandidatesByOrgId(
        getLoggedInUserHrOrganizationId(),
        finalFilters,
        logDetails
      )
    );
  };

  const debouncedSearch = useCallback(debounce(onFilterChange, 500), [
    dispatch,
  ]);

  const onFetchCandidates = useCallback(
    (filters) => {
      let finalFilters = {
        ...HrCandidatesFilter,
        ...filters,
      };

      delete finalFilters?.rangeValue;

      const from = moment(finalFilters?.fromDate);
      const to = moment(finalFilters?.toDate);
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "onFetchCandidates"
      );

      // Compare the dates
      if (from >= to) {
        dispatch(
          setToastNotification(
            ERROR,
            "From date should be smaller than To date",
            logDetails
          )
        );
      } else {
        debouncedSearch(finalFilters);
      }
    },
    [HrCandidatesFilter]
  );

  const handleModalOpen = () => {
    setAddMultipleCandidatesModal(true);

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleModalOpen"
    );

    dispatch(getFailedToRegisterCandidates(logDetails));
  };

  const setFilter = (filters) => {
    dispatch({
      type: SET_HR_CANDIDATES_FILTER,
      payload: { ...HrCandidatesFilter, ...filters },
    });

    onFetchCandidates({ ...HrCandidatesFilter, ...filters });
  };

  return (
    <ScrollableGrid>
      <Grid
        container
        spacing={2}
        sx={{ height: "90vh" }}
        mt={{ xs: 8, md: -2 }}
      >
        <Grid item md={2} sm={12} xs={12}>
          <PanelCard>
            <TeamRangeSelection
              onChange={(v) => setFilter(v)}
              toSaveFilters={true}
            />
          </PanelCard>
        </Grid>
        <Grid item md={10} sm={12} xs={12}>
          <PanelCard>
            <Grid
              container
              alignItems="center"
              spacing={2}
              marginBottom="1rem"
              direction={{ xs: "column", sm: "row" }}
            >
              <Grid item xs={12} sm={hrCandidateCreateAccess ? 3 : 9}>
                <Typography variant="h4" sx={{ marginBottom: "10px" }}>
                  Candidates
                </Typography>
              </Grid>
              {hrCandidateCreateAccess && (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display="flex"
                  justifyContent={{ xs: "space-between", sm: "flex-end" }}
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "center", sm: "none" }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    startIcon={<AddIcon />}
                    onClick={handleModalOpen}
                  >
                    Add Multiple Candidates
                  </Button>

                  <Button
                    sx={{
                      margin: { xs: "10px 0 0 0", sm: "0 0 0 10px" },
                    }}
                    variant="contained"
                    size="small"
                    disableElevation
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/hr/candidates/create")}
                  >
                    Create Candidate
                  </Button>
                </Grid>
              )}
              <Grid ml={1} item xs={12} sm={2.9}>
                <TextField
                  value={filterCandidates}
                  placeholder="Search..."
                  type="text"
                  fullWidth={true}
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    setFilter({ searchText: e.target.value });
                    setFilteredCandidates(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined style={{ marginLeft: "0.5rem" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <ClearOutlined
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFilter({ searchText: "" });
                            setFilteredCandidates("");
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <CandidatesTable
              onFetchCandidates={onFetchCandidates}
              setFilter={setFilter}
            />
          </PanelCard>
        </Grid>
      </Grid>
      {addMultipleCandidatesModal && (
        <AddMultipleCandidatesModal
          open={addMultipleCandidatesModal}
          handleClose={() => setAddMultipleCandidatesModal(false)}
          onFetchCandidates={onFetchCandidates}
        />
      )}
    </ScrollableGrid>
  );
};

export { CandidatesPage };
