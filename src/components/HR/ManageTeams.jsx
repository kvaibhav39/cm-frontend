import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAltOutlined";
import TableCell from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PanelCard from "../../common/cards/PanelCard";
import HrTabNav from "./HrTabNav";
import { Box } from "@mui/system";
import HrUserModal from "../../common/modals/HrUserModal";
import HrTeamModal from "../../common/modals/HrTeamModal";
import { stringAvatar } from "../../utils/StringHelper";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizationTeams,
  getOrganizationUsers,
} from "../../store/actions/hrActions";
import { checkActionPermission } from "../../utils/CheckPageAccess";
import permissionKey from "../constants/permissionKey";
import ScrollableGrid from "../../common/ScrollableGrid";
import CustomTooltip from "../common/CustomTooltip";
import DisplayErrorsWhenRemovingUserFromOrg from "./components/DisplayErrorsWhenRemovingUserFromOrg";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 15,
  height: 15,
  fontSize: 8,
  border: `1px solid ${theme.palette.background.paper}`,
}));

const ManageTeams = () => {
  const [userModal, setUserModal] = useState(false);
  const [teamModal, setTeamModal] = useState(false);
  const [removeUserFromOrgModal, setRemoveUserFromOrgModal] = useState(false);
  const [userOperation, setUserOperation] = useState("addToOrg");
  const [teamOperation, setTeamOperation] = useState("addTeam");
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [selectedTab, setSelectedTab] = useState(1);
  const [registeredUsers, setRegisteredUsers] = useState();
  const [allTeamCheck, setAllTeamCheck] = useState(false);
  const [teamCheck, setTeamCheck] = useState([]);
  const [disableBtn, setDisableBtn] = useState(true);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);

  const dispatch = useDispatch();
  const {
    organizationTeams: organizationTeamsData,
    organizationUsers,
    errorsDataWhenRemovingUserFromOrg,
  } = useSelector((state) => state?.hr);

  const loggedInUser = useSelector((state) => state.authorization);

  useEffect(() => {
    let params = {
      orgId: getLoggedInUserHrOrganizationId(), //should be coming from current user details.
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getOrganizationTeams(params, logDetails));
    dispatch(getOrganizationUsers(params, logDetails));
  }, []);

  const updateCompanyDetails = () => {
    let params = {
      orgId: getLoggedInUserHrOrganizationId(), //should be coming from current user details.
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "updateCompanyDetails"
    );

    dispatch(getOrganizationUsers(params, logDetails));
  };

  const handleTeamsEditClick = (data, team) => {
    setSelectedTeam(team);
    setSelectedUser(data);
    setUserOperation("editFromTeam");
    setUserModal(true);
  };

  //to delete a user from a team
  const handleTeamsUserDeleteClick = (data, team) => {
    setSelectedTeam(team);
    setSelectedUser(data);
    setUserOperation("removeFromTeam");
    setUserModal(true);
  };

  const handleTeamDeleteClick = (data) => {
    setTeamOperation("removeTeam");
    setSelectedTeam(data);
    setTeamModal(true);
  };

  const handleTeamUserAddClick = (data) => {
    setSelectedTeam(data);
    setSelectedTeamIds([data.hrTeamsId]);
    let users = organizationTeamsData?.filter(
      (team) => team.hrTeamsId == data.hrTeamsId
    );
    setRegisteredUsers(users[0]?.teamUsersMap);
    setUserModal(true);
    setUserOperation("addToTeam");
  };

  //handles all team check box
  const handleAllTeamCheck = () => {
    setAllTeamCheck(!allTeamCheck);
    if (allTeamCheck) {
      setTeamCheck([]);
      setDisableBtn(allTeamCheck);
    } else {
      let temp = [];

      organizationTeamsData.forEach((team) => {
        if (
          team.permissions.find(
            (permission) =>
              permission.actionName ===
              permissionKey.hrSettingsManageTeamUserAddRole
          )
        ) {
          return temp.push(team.hrTeamsId);
        }
      });

      setTeamCheck(temp);

      if (temp.length > 0) {
        setDisableBtn(allTeamCheck);
      } else {
        setDisableBtn(!allTeamCheck);
      }
    }
  };

  //handles single team checkboxes
  const handleTeamCheck = (id) => {
    let temp = [...teamCheck];
    if (temp.find((curr) => curr === id)) {
      temp = temp.filter((curr) => curr !== id);
    } else {
      temp.push(id);
    }
    if (temp.length > 0) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
    setTeamCheck(temp);
    if (temp.length === organizationTeamsData.length) {
      setAllTeamCheck(true);
    } else {
      setAllTeamCheck(false);
    }
  };

  //handles addition of a user to multiple teams
  const handleAddUserToMultipleTeams = () => {
    setSelectedTeamIds(teamCheck);
    setUserModal(true);
    setUserOperation("addToTeam");
  };

  const hrDeleteTeamAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrSettingsManageTeamsDeleteTeams,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const addUserToTeam = (entry) => {
    return entry?.permissions?.find(
      (permission) =>
        permission.actionName === permissionKey.hrSettingsManageTeamUserAddRole
    );
  };

  const hrAddTeamAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrSettingsManageTeamsAddTeams,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const handleChangeOrgUserPermissions = (user) => {
    setUserOperation("changePermission");
    setSelectedUser(user);
    setUserModal(true);
  };

  const removeTeamUserAccess = (entry) => {
    return entry?.permissions?.find(
      (permission) =>
        permission.actionName ===
        permissionKey.hrSettingsManageTeamUserDeleteRole
    );
  };

  const editTeamUserAccess = (entry) => {
    return entry?.permissions?.find(
      (permission) =>
        permission.actionName === permissionKey.hrSettingsManageTeamUserEditRole
    );
  };

  const editOrgUserAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrSettingsManageOrgUserEditRole,
        loggedInUser.permissions
      ),
    [loggedInUser.permissions]
  );

  const getChipRoleLabel = (role) => {
    if (role === "HR SuperAdmin") {
      return "SA";
    } else if (role === "HR Admin") {
      return "A";
    } else if (role === "Vendor User") {
      return "V";
    }
    return "U";
  };

  const removeUserFromOrg = (user) => {
    setUserOperation("removeFromOrg");
    setSelectedUser(user);
    setRemoveUserFromOrgModal(true);
  };

  const checkIsVendor = useCallback(() => {
    let currentLoginProfile = localStorage.getItem("loginProfile");
    let isVendor = loggedInUser?.currentUser?.hrOrganization?.isVendor;

    return currentLoginProfile === "second" && isVendor;
  }, [loggedInUser]);

  const handleAddVendorToTeam = (data) => {
    setSelectedTeam(data);
    setSelectedTeamIds([data.hrTeamsId]);
    let users = organizationTeamsData?.filter(
      (team) => team.hrTeamsId == data.hrTeamsId
    );
    setRegisteredUsers(users[0]?.teamUsersMap);
    setUserModal(true);
    setUserOperation("addVendorToTeam");
  };

  return (
    <ScrollableGrid container spacing={2} height="100%">
      <Grid item md={2} xs={12} mt={{ xs: 10, md: 0 }}>
        <PanelCard>
          <HrTabNav value={selectedTab || ""} />
        </PanelCard>
      </Grid>
      <ScrollableGrid item md={10} xs={12} applyScrollToScreenAndBelow={false}>
        <PanelCard>
          <Grid
            container
            xs={12}
            sx={{
              borderRadius: "10px",
              padding: "20px 0px",
            }}
            spacing={4}
          >
            {errorsDataWhenRemovingUserFromOrg ? (
              <Grid container item spacing={2} xs={12}>
                <DisplayErrorsWhenRemovingUserFromOrg />
              </Grid>
            ) : null}

            <Grid container item direction="column" spacing={2} xs={12}>
              <Grid item>
                <Typography variant="h4" sx={{ width: "95%", flexShrink: 0 }}>
                  Organization
                </Typography>
              </Grid>

              <Grid item>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Box
                            width={{ xs: "100%", lg: "80%" }}
                            textAlign={{ xs: "center", md: "left" }}
                            display="flex"
                            alignItems="center"
                            justifyContent={{
                              xs: "center",
                              md: "flex-start",
                            }}
                            flexDirection={{ xs: "column", md: "row" }}
                          >
                            ORGANIZATION NAME -{" "}
                            {
                              loggedInUser?.currentUser?.hrOrganization
                                ?.hrOrganizationName
                            }
                            <Box component="span">
                              {/* <Chip
                                label={
                                  loggedInUser?.currentUser?.hrOrganization
                                    ?.subRoleName
                                }
                                size="medium"
                                sx={{
                                  margin: "10px 0 10px 30px",
                                  padding: "0 10px",
                                }}
                              />{" "} */}
                              <CustomTooltip
                                title={
                                  loggedInUser?.currentUser?.hrOrganization
                                    ?.subRoleName
                                }
                              >
                                <Chip
                                  icon={<SecurityOutlinedIcon />}
                                  label={getChipRoleLabel(
                                    loggedInUser?.currentUser?.hrOrganization
                                      ?.subRoleName
                                  )}
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    margin: "10px 0 10px 20px",
                                    padding: "3px",
                                    backgroundColor: (theme) =>
                                      theme.palette.background.paper,
                                  }}
                                />
                              </CustomTooltip>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Grid item spacing={2} xs={12}>
                            {organizationUsers?.hrOrganizationUsers?.length ? (
                              organizationUsers?.hrOrganizationUsers?.map(
                                (user) => (
                                  <CustomTooltip
                                    titleContainsAction
                                    title={
                                      <Box
                                        style={{
                                          padding: "10px",
                                          gap: "5px",
                                        }}
                                      >
                                        <Typography color="inherit">
                                          {user?.loginEmail}
                                        </Typography>
                                        <Typography
                                          color="inherit"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          {user?.subRoleName}
                                        </Typography>
                                        {editOrgUserAccess &&
                                          user?.subRoleId !== 11 && (
                                            <Button
                                              variant="standard"
                                              startIcon={<EditIcon />}
                                              size="small"
                                              sx={{
                                                width: "100%",
                                                justifyContent: "flex-start",
                                              }}
                                              onClick={() =>
                                                handleChangeOrgUserPermissions(
                                                  user
                                                )
                                              }
                                            >
                                              Change Permission
                                            </Button>
                                          )}
                                        {/* <Button
                                        variant="standard"
                                        startIcon={<DeleteIcon />}
                                        size="small"
                                        sx={{
                                          width: "100%",
                                          justifyContent: "flex-start",
                                        }}
                                        onClick={() => removeUserFromOrg(user)}
                                      >
                                        Remove User
                                      </Button> */}
                                      </Box>
                                    }
                                  >
                                    <Chip
                                      label={user?.userName || user?.loginEmail}
                                      size="medium"
                                      sx={{
                                        margin: "10px 0 10px 10px",
                                        padding: "0 10px",
                                      }}
                                    />
                                  </CustomTooltip>
                                )
                              )
                            ) : (
                              <Typography fontWeight={550} textAlign="center">
                                No Permission
                              </Typography>
                            )}
                            {/* {hrAddTeamAccess && (
                              <Avatar
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                  setTeamOperation("addTeam");
                                  setTeamModal(true);
                                }}
                              >
                                <GroupAddIcon />
                              </Avatar>
                            )} */}
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Grid container item direction="column" spacing={2}>
              <Grid
                container
                item
                direction="row"
                justifyContent={"space-between"}
              >
                <Grid item>
                  <Typography variant="h4" sx={{ width: "95%", flexShrink: 0 }}>
                    Teams
                  </Typography>{" "}
                </Grid>

                <Grid item display="flex" alignItems="center">
                  {hrAddTeamAccess && (
                    <Grid item mr={2}>
                      <Button
                        variant="contained"
                        disableElevation
                        onClick={() => {
                          setTeamOperation("addTeam");
                          setTeamModal(true);
                        }}
                        marginRight="10px"
                      >
                        Add Team
                      </Button>
                    </Grid>
                  )}
                  {/* {addUserToTeam1 && ( */}
                  <Grid item>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={handleAddUserToMultipleTeams}
                      disabled={disableBtn}
                    >
                      Add user to selected teams
                    </Button>
                  </Grid>
                  {/* )} */}
                </Grid>
              </Grid>

              <Grid item style={{ maxWidth: "100vw", overflow: "scroll" }}>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Checkbox
                            checked={allTeamCheck}
                            onChange={handleAllTeamCheck}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          TEAM NAME
                        </TableCell>
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "35%" }}
                        >
                          USERS
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "10%" }}
                        >
                          ACTIONS
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {organizationTeamsData?.map((entry, index) => (
                        <TableRow id={index} key={index}>
                          <TableCell component="th" scope="row">
                            <Box
                              display="flex"
                              alignItems="center"
                              width="350px"
                            >
                              <Box>
                                <Checkbox
                                  checked={
                                    teamCheck.includes(entry.hrTeamsId)
                                      ? true
                                      : false
                                  }
                                  disabled={!addUserToTeam(entry)}
                                  onChange={() =>
                                    handleTeamCheck(entry.hrTeamsId)
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </Box>
                              <Box sx={{ wordBreak: "break-all" }}>
                                {entry?.hrTeamName?.length > 30 ? (
                                  <CustomTooltip
                                    tooltipmaxwidth={400}
                                    title={entry?.hrTeamName}
                                  >
                                    <Box component="span">{`${entry?.hrTeamName.slice(
                                      0,
                                      30
                                    )}...`}</Box>
                                  </CustomTooltip>
                                ) : (
                                  entry?.hrTeamName
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <CustomTooltip
                              title={
                                entry?.subRoleId === 2
                                  ? "HR SuperAdmin"
                                  : entry?.subRoleId === 3
                                  ? "HR Admin"
                                  : "HR User"
                              }
                              placement="top"
                            >
                              <Chip
                                icon={<SecurityOutlinedIcon />}
                                label={getChipRoleLabel(
                                  entry?.subRoleId === 2
                                    ? "HR SuperAdmin"
                                    : entry?.subRoleId === 3
                                    ? "HR Admin"
                                    : "HR User"
                                )}
                                variant="outlined"
                                size="small"
                                sx={{
                                  padding: "3px",
                                  backgroundColor: (theme) =>
                                    theme.palette.background.paper,
                                }}
                              />
                            </CustomTooltip>
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              gap={1}
                              flexWrap={{ xs: "nowrap", md: "wrap" }}
                            >
                              {entry?.teamUsersMap?.map((user) => (
                                <CustomTooltip
                                  titleContainsAction
                                  title={
                                    <Box
                                      style={{ padding: "10px", gap: "5px" }}
                                    >
                                      <Typography
                                        color="inherit"
                                        style={{ fontWeight: "bold" }}
                                      >
                                        {user?.userName}
                                      </Typography>
                                      <Typography color="inherit">
                                        {user?.loginEmail}
                                      </Typography>
                                      <Typography
                                        color="inherit"
                                        style={{ fontWeight: "bold" }}
                                      >
                                        {user?.subRoleName}
                                      </Typography>
                                      {editTeamUserAccess(entry) &&
                                        user?.subRoleId !== 11 && (
                                          <Button
                                            variant="standard"
                                            startIcon={<EditIcon />}
                                            size="small"
                                            sx={{
                                              width: "100%",
                                              justifyContent: "flex-start",
                                            }}
                                            onClick={() =>
                                              handleTeamsEditClick(user, entry)
                                            }
                                          >
                                            Edit User
                                          </Button>
                                        )}
                                      {removeTeamUserAccess(entry) && (
                                        <Button
                                          variant="standard"
                                          startIcon={<DeleteIcon />}
                                          size="small"
                                          sx={{
                                            width: "100%",
                                            justifyContent: "flex-start",
                                          }}
                                          onClick={() =>
                                            handleTeamsUserDeleteClick(
                                              user,
                                              entry
                                            )
                                          }
                                        >
                                          Remove User
                                        </Button>
                                      )}
                                    </Box>
                                  }
                                  placement="top"
                                >
                                  <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "right",
                                    }}
                                    badgeContent={
                                      <SmallAvatar>
                                        {getChipRoleLabel(user?.subRoleName)}
                                      </SmallAvatar>
                                    }
                                  >
                                    <Avatar
                                      {...stringAvatar(
                                        user?.userName || user?.loginEmail
                                      )}
                                    />
                                  </Badge>
                                </CustomTooltip>
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              {addUserToTeam(entry) && (
                                <CustomTooltip title="Add User to Team">
                                  <Avatar
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleTeamUserAddClick(entry)
                                    }
                                  >
                                    <PersonAddAltIcon />
                                  </Avatar>
                                </CustomTooltip>
                              )}
                              {checkIsVendor() && (
                                <CustomTooltip title="Add Vendor to Team">
                                  <Avatar
                                    sx={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleAddVendorToTeam(entry)}
                                  >
                                    <PersonAddAltIcon
                                      sx={{
                                        color: (theme) =>
                                          theme.palette.warning.dark,
                                      }}
                                    />
                                  </Avatar>
                                </CustomTooltip>
                              )}
                              {hrDeleteTeamAccess && (
                                <CustomTooltip title="Delete Team">
                                  <Avatar
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleTeamDeleteClick(entry)}
                                  >
                                    <DeleteIcon color="error" />
                                  </Avatar>
                                </CustomTooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            {userModal && (
              <HrUserModal
                open={userModal}
                handleClose={() => setUserModal(false)}
                updateCompanyDetails={updateCompanyDetails}
                team={selectedTeam}
                user={selectedUser}
                operationType={userOperation}
                registeredUsers={registeredUsers}
                selectedTeamIds={selectedTeamIds}
              />
            )}

            {teamModal && (
              <HrTeamModal
                key="team_modal"
                open={teamModal}
                handleClose={() => setTeamModal(false)}
                team={selectedTeam}
                operationType={teamOperation}
                runWhenSuccess={() => {
                  setTeamCheck((prev) => (prev = []));
                  setAllTeamCheck((prev) => (prev = false));
                  setDisableBtn((prev) => (prev = true));
                }}
              />
            )}

            {removeUserFromOrgModal && (
              <HrUserModal
                key="user_modal"
                open={removeUserFromOrgModal}
                handleClose={() => setRemoveUserFromOrgModal(false)}
                updateCompanyDetails={updateCompanyDetails}
                user={selectedUser}
                operationType={userOperation}
                registeredUsers={registeredUsers}
                selectedTeamIds={selectedTeamIds}
              />
            )}
          </Grid>
        </PanelCard>
      </ScrollableGrid>
    </ScrollableGrid>
  );
};

export default ManageTeams;
