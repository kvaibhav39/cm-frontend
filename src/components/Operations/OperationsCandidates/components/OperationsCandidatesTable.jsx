import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OperationsCandidatesTableUI from "./OperationsCandidatesTableUI";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkPagePermission } from "../../../../utils/CheckPageAccess";
import { getFailedToRegisterCandidates } from "../../../../store/actions/hrActions";
import AddMultipleCandidatesModal from "../../../Candidates/CandidatesTable/Modals/AddMultipleCandidatesModal";
import CustomTooltip from "../../../common/CustomTooltip";
import InfoIcon from "@mui/icons-material/Info";
import AttributionIcon from "@mui/icons-material/Attribution";
import CircularLoader from "./../../../../common/CircularLoader";
import { getOPScandidates } from "../../../../store/actions/operationActions";
import { rangeSelectors } from "../../../constants/filterData";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

const OperationsCandidatesTable = (props) => {
  const [filterCandidates, setFilterCandidates] = useState("");
  const [filteredOrg, setFilteredOrg] = useState(0);
  const [addMultipleCandidatesModal, setAddMultipleCandidatesModal] =
    useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { orgsListsByOpsUserId, loading } = useSelector(
    (state) => state.operations
  );

  const loggedInUser = useSelector((state) => state.authorization);

  useEffect(() => {
    //search text

    setFilterCandidates(searchParams.get("searchText"));

    //org
    const hrOrganizationIds = searchParams.get("hrOrganizationIds");

    if (orgsListsByOpsUserId?.length) {
      if (hrOrganizationIds === "all") {
        setFilteredOrg(0);
      } else {
        setFilteredOrg(+hrOrganizationIds);
      }
    }
  }, [
    searchParams.get("searchText"),
    searchParams.get("hrOrganizationIds"),
    orgsListsByOpsUserId,
  ]);

  const handleFilter = (e) => {
    if (e.target?.value && e !== "empty") {
      setFilterCandidates(e.target?.value);
    } else {
      setFilterCandidates("");
    }

    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        searchText: e === "empty" ? "" : e.target?.value,
        pageNumber: 1,
      });
    });
  };

  const handleFilterOrgs = (orgId) => {
    setFilteredOrg(orgId);

    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        hrOrganizationIds: orgId ? String(orgId) : "all",
        pageNumber: 1,
      });
    });
  };

  const handleRegisterCandidate = () => {
    let orgName = orgsListsByOpsUserId?.find(
      (curr) =>
        curr?.hrOrganizationsId === +searchParams.get("hrOrganizationIds")
    )?.hrOrganizationName;

    navigate(
      `/ops/candidates/create?orgId=${searchParams.get(
        "hrOrganizationIds"
      )}&orgName=${orgName}`
    );
  };

  const handleModalOpen = () => {
    setAddMultipleCandidatesModal(true);

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleModalOpen"
    );

    dispatch(getFailedToRegisterCandidates(logDetails));
  };

  const handleOpsTableViewChange = (viewValue) => {
    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        toggledOpsTableView: viewValue,
      });
    });
  };

  const resetOpsCandidatesTableFilters = () => {
    const filterParams = {
      toggledOpsTableView: "candidates",
      hrOrganizationIds: searchParams.get("hrOrganizationIds"),
      verificationProcessId: "2,3",
      verificationResultId: "3",
      searchText: "",
      pageNumber: "1",
      fromDate: rangeSelectors[1]?.dates?.fromDate,
      toDate: rangeSelectors[1]?.dates?.toDate,
    };

    //setting params to url
    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        ...filterParams,
      });
    });

    delete filterParams?.toggledOpsTableView;
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleModalOpen"
    );
    dispatch(getOPScandidates(filterParams, logDetails));
  };



  return (
    <Box>
      <Grid
        xs={12}
        display="flex"
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="center"
        flexDirection={{ xs: "column", md: "row" }}
        pt={0.5}
      >
        <Grid
          item
          xs={12}
          md={
            checkPagePermission(
              "/ops/candidates/create",
              loggedInUser.permissions
            )
              ? 3
              : 9
          }
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Box
            p={1}
            sx={{
              background: (theme) =>
                searchParams.get("toggledOpsTableView") === "candidates"
                  ? theme.palette.primary.main
                  : "none",
              color:
                searchParams.get("toggledOpsTableView") === "candidates"
                  ? "#FFF"
                  : "none",
              borderRadius: "10px 0 0 10px",
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              cursor: "pointer",
              fontWeight: "550",
            }}
            onClick={() => handleOpsTableViewChange("candidates")}
          >
            Candidates
          </Box>
          <Box
            p={1}
            sx={{
              background: (theme) =>
                searchParams.get("toggledOpsTableView") === "checks"
                  ? theme.palette.primary.main
                  : "none",
              color:
                searchParams.get("toggledOpsTableView") === "checks"
                  ? "#FFF"
                  : "none",
              borderRadius: "0 10px 10px 0",
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              cursor: "pointer",
              fontWeight: "550",
            }}
            onClick={() => handleOpsTableViewChange("checks")}
          >
            Checks
          </Box>
        </Grid>
        {checkPagePermission(
          "/ops/candidates/create",
          loggedInUser.permissions
        ) ? (
          <Grid
            item
            xs={12}
            md={6}
            my={{ xs: 1, md: 0 }}
            mr={{ xs: 0, md: 1 }}
            display="flex"
            justifyContent={{ xs: "none", md: "flex-end" }}
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "none" }}
          >
            <CustomTooltip
              title={
                !filteredOrg
                  ? "Please select an organization to register a candidate"
                  : ""
              }
            >
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleModalOpen}
                  disabled={!filteredOrg || loading}
                >
                  Add Multiple Candidates
                </Button>
              </span>
            </CustomTooltip>
            <CustomTooltip
              title={
                !filteredOrg
                  ? "Please select an organization to register a candidate"
                  : ""
              }
            >
              <span>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!filteredOrg || loading}
                  startIcon={<AddIcon />}
                  onClick={handleRegisterCandidate}
                  sx={{
                    margin: { xs: "8px 0 0", md: "0 8px" },
                  }}
                >
                  Create Candidate
                </Button>
              </span>
            </CustomTooltip>
          </Grid>
        ) : null}

        <Grid item xs={12} md={3} my={{ xs: 1, md: 0 }} mr={{ md: 3, xs: 0 }}>
          {orgsListsByOpsUserId ? (
            <Autocomplete
              disablePortal
              disableClearable
              id="org-selection"
              options={orgsListsByOpsUserId}
              size="small"
              sx={{ width: { xs: 250, md: "auto" } }}
              value={
                searchParams.get("hrOrganizationIds") === "all"
                  ? orgsListsByOpsUserId && orgsListsByOpsUserId[0]
                  : orgsListsByOpsUserId?.find(
                      (curr) =>
                        curr?.hrOrganizationsId ===
                        +searchParams.get("hrOrganizationIds")
                    )
              }
              // defaultValue={
              //   searchParams.get("hrOrganizationIds") === "all"
              //     ? orgsListsByOpsUserId && orgsListsByOpsUserId[0]
              //     : orgsListsByOpsUserId?.find(
              //         (curr) =>
              //           curr?.hrOrganizationsId ===
              //           +searchParams.get("hrOrganizationIds")
              //       )
              // }
              onChange={(e, newValue) => {
                if (newValue) {
                  handleFilterOrgs(newValue?.hrOrganizationsId);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    orgsListsByOpsUserId?.find(
                      (curr) =>
                        curr?.hrOrganizationsId ===
                        +searchParams.get("hrOrganizationIds")
                    )?.isVendor
                      ? "Vendor"
                      : "Organization"
                  }
                />
              )}
              getOptionLabel={(option) => option.hrOrganizationName || ""}
              filterOptions={(options, { inputValue }) =>
                inputValue?.length
                  ? options?.filter((option) =>
                      option.hrOrganizationName
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                  : options
              }
              renderOption={(props, item) => (
                <li {...props} key={item.hrOrganizationsId}>
                  <Box
                    width="10%"
                    display="flex"
                    justifyContent="center"
                    marginRight="1px"
                  >
                    {item?.isVendor && (
                      <CustomTooltip title="Vendor">
                        <AttributionIcon color="primary" />
                      </CustomTooltip>
                    )}
                  </Box>
                  <Box>
                    {item?.hrOrganizationName?.length > 25 ? (
                      <CustomTooltip
                        tooltipmaxwidth={400}
                        title={item?.hrOrganizationName}
                      >
                        <Box component="span">{`${item?.hrOrganizationName.slice(
                          0,
                          25
                        )}...`}</Box>
                      </CustomTooltip>
                    ) : (
                      item?.hrOrganizationName
                    )}
                  </Box>
                </li>
              )}
            />
          ) : (
            <CircularLoader size={20} height="40px" />
          )}
        </Grid>

        <Grid item xs={12} md={3} my={{ xs: 1, md: 0 }}>
          <TextField
            value={filterCandidates}
            placeholder="Search..."
            type="text"
            fullWidth={true}
            size="small"
            variant="outlined"
            onChange={handleFilter}
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
                    onClick={() => handleFilter("empty")}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid xs={12} mt={1}>
        <OperationsCandidatesTableUI {...props} />
      </Grid>
      {addMultipleCandidatesModal && (
        <AddMultipleCandidatesModal
          open={addMultipleCandidatesModal}
          handleClose={() => setAddMultipleCandidatesModal(false)}
          resetOpsCandidatesTableFilters={resetOpsCandidatesTableFilters}
        />
      )}
    </Box>
  );
};

export default OperationsCandidatesTable;
