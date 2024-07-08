import {
  Grid,
  Button,
  Typography,
  Box,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { getOPSUserBySubRoleIds } from "../../../../store/actions/operationActions";
import AddOperationsUsersModal from "./components/AddOperationsUsersModal";
import OperationsUserAccordions from "./components/OperationsUserAccordions";
import CircularLoader from "../../../../common/CircularLoader";
import { cloneDeep, isEqual } from "lodash";
import { useSearchParams } from "react-router-dom";
import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import { getSubrolesOfRole } from "../../../../store/actions/hrActions";
import { getOrgsLists } from "../../../../store/actions/systemAdminActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const OperationsSettingsUsers = () => {
  const dispatch = useDispatch();
  const [modal, setmodal] = useState(false);
  const [accordionStateIndex, setAccordionStateIndex] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(null);
  const [OpsUsers, setOpsUsers] = useState(null);

  let pageSize = 8;

  const { loading: opsLoading, OpsUserBySubRoleIds } = useSelector(
    (state) => state.operations
  );

  const { loading: systemAdminLoading, orgsLists } = useSelector(
    (state) => state.systemAdmin
  );

  const { subRolesLists } = useSelector((state) => state.hr);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (!OpsUserBySubRoleIds) {
      dispatch(
        getOPSUserBySubRoleIds(
          {
            // subRoleIds: "7,8,9,10",
            subRoleIds: "7,9",
          },
          logDetails
        )
      );
    }

    if (!subRolesLists) {
      dispatch(getSubrolesOfRole(logDetails, { roleId: 4 }, () => {}, true));
    }
    if (!orgsLists?.length) {
      dispatch(getOrgsLists(logDetails));
    }
  }, []);

  useEffect(() => {
    setOpsUsers((prev) => (prev = OpsUserBySubRoleIds));
  }, [OpsUserBySubRoleIds]);

  let newOpsUsers = useMemo(() => {
    let params = +searchParams.get("pageNumber");
    let newUsers = cloneDeep(OpsUsers)?.slice(
      ((params || 1) - 1) * pageSize,
      ((params || 1) - 1) * pageSize + pageSize
    );

    return newUsers;
  }, [OpsUsers, searchParams.get("pageNumber")]);

  const handleClose = () => {
    setmodal(false);
  };

  const handlePageChange = (e, newPage) => {
    if (+searchParams.get("pageNumber") !== newPage) {
      setSearchParams((prevParams) => {
        return new URLSearchParams({
          ...Object.fromEntries(prevParams.entries()),
          pageNumber: newPage,
        });
      });
    }
  };

  const handleFilter = (e) => {
    if (e.target?.value && e !== "empty") {
      setSearchText(e.target?.value);
      let filteredUsers = OpsUserBySubRoleIds?.filter(
        (curr) =>
          curr?.assigneeName?.includes(e.target?.value) ||
          curr?.loginEmail?.includes(e.target?.value)
      );
      setOpsUsers(() => filteredUsers);
    } else {
      setSearchText("");
      setOpsUsers(() => OpsUserBySubRoleIds);
    }
  };

  return (
    <>
      {!opsLoading && !systemAdminLoading && OpsUserBySubRoleIds?.length ? (
        <Box p={2}>
          <Grid
            container
            justifyContent={{ xs: "center", sm: "flex-end" }}
            mb={3}
          >
            <Button
              variant="contained"
              size="small"
              disableElevation
              startIcon={<AddIcon />}
              onClick={() => setmodal(true)}
            >
              Add Operations Users
            </Button>
          </Grid>
          <Grid container display="flex" justifyContent="center">
            <Grid item xs={12} md={6} mb={2}>
              <TextField
                value={searchText}
                placeholder="Search by name or email..."
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
          {OpsUsers?.length ? (
            <>
              {" "}
              {newOpsUsers?.map((curr, index) => (
                <OperationsUserAccordions
                  key={index}
                  accordionStateIndex={accordionStateIndex}
                  setAccordionStateIndex={setAccordionStateIndex}
                  index={index}
                  opsUserData={curr}
                />
              ))}
              <Box display="flex" justifyContent="center" mt={1}>
                <Pagination
                  size="small"
                  count={Math.ceil(OpsUsers?.length / pageSize)}
                  page={+searchParams.get("pageNumber") || 1}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                />{" "}
              </Box>
            </>
          ) : (
            <Typography fontWeight={550} textAlign="center">
              No Users Found
            </Typography>
          )}
          {modal && (
            <AddOperationsUsersModal
              open={modal}
              handleClose={handleClose}
              clearSearchTextState={() => {
                handleFilter("empty");
              }}
            />
          )}
        </Box>
      ) : !opsLoading &&
        !systemAdminLoading &&
        OpsUserBySubRoleIds?.length === 0 ? (
        <Typography fontWeight={550} textAlign="center">
          No Users Present
        </Typography>
      ) : (
        <CircularLoader height="10vh" size={40} />
      )}
    </>
  );
};

export default OperationsSettingsUsers;
