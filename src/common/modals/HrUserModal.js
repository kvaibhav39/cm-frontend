import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Alert,
  Grid,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Box } from "@mui/system";
import styled from "@emotion/styled";
import { AutoCompleteUser } from "../Form/AutoCompleteUser/AutoCompleteUser";
import { useEffect, useState } from "react";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import {
  EditCompanyUsers,
  EditTeamsUser,
  changePermissionOrgUser,
  getAddCompanyUsers,
  getAddTeamsUser,
  getSubrolesOfRole,
  DeleteTeamsUser,
  RemoveUserFromOrganization,
} from "../../store/actions/hrActions";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 500px;
  min-height: 250px;
`;

const HrAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.main,
  fontWeight: 500,
  "& .MuiAlert-icon": {
    color: theme.palette.error.main,
  },
}));

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default function HrUserModal({
  open,
  handleClose,
  updateCompanyDetails,
  operationType,
  team,
  user,
  registeredUsers,
  selectedTeamIds,
}) {
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(""); // For UI
  const [selectedRole, setSelectedRole] = useState(
    user?.usersSubRolesId ||
      team?.teamUsersMap.find((curr) => curr?.userId === user?.userId)
        ?.subRoleId ||
      user?.subRoleId ||
      4
  );
  const [errorTextField, setErrorTextField] = useState(false);
  const loggedInUser = useSelector((state) => state.authorization);
  const { organizationUsers } = useSelector((state) => state?.hr);
  const theme = useTheme();

  useEffect(() => {
    let params = {
      roleId: loggedInUser?.currentUser?.roleId, //should be coming from current user details.
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (
      operationType.includes("add") ||
      operationType.includes("edit") ||
      operationType.includes("changePermission")
    ) {
      dispatch(getSubrolesOfRole(logDetails, params, setRoles));
    }
    if (operationType.includes("add")) {
      updateCompanyDetails();
    }
  }, [loggedInUser]);

  const userOperation = {
    addToOrg: {
      title: "Add User",
      description:
        "Please enter user name or email below to search any existing user in team. In case if new user to system, you will be required to give username and user email to register user.",
      inputs: ["User/Email", "Role"],
      params: { orgId: getLoggedInUserHrOrganizationId() },
    },
    addToTeam: {
      title: "Add User",
      description:
        "Please enter user name or email below to search any existing user in team. In case if new user to system, you will be required to give username and user email to register user.",
      inputs: ["User/Email", "Role"],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        teamId: selectedTeamIds,
      },
    },
    addVendorToTeam: {
      title: "Add Vendor",
      description:
        "Please enter user name or email below to search any existing vendor in team. In case if new vendor to system, you will be required to give username and email to register vendor.",
      inputs: ["User/Email"],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        teamId: selectedTeamIds,
      },
    },
    editFromOrg: {
      title: "Edit User",
      description: "",
      inputs: ["Role"],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        userId: user?.usersId,
      },
    },
    editFromTeam: {
      title: "Edit User",
      description: "",
      inputs: ["Role"],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        teamId: team?.hrTeamsId,
        userId: user?.userId,
      },
    },
    removeFromOrg: {
      title: "Remove User From Organization",
      description:
        "User will be permanently removed from organization, please click Delete to confirm.",
      inputs: [],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        userId: user?.usersId,
      },
    },
    removeFromTeam: {
      title: "Remove User From Team",
      description:
        "User will be permanently removed from Team, please click Delete to confirm.",
      inputs: [],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        userId: user?.userId,
        teamId: team?.hrTeamsId,
      },
    },
    changePermission: {
      title: "Change Permissions",
      description: "",
      inputs: ["Role"],
      params: {
        orgId: getLoggedInUserHrOrganizationId(),
        userId: user?.usersId,
      },
    },
  };

  const operation = userOperation[operationType];

  const handleSubmitText = () => {
    if (operationType.includes("add")) {
      return "Invite";
    }
    if (operationType.includes("edit")) {
      return "Update";
    }
    if (operationType.includes("changePermission")) {
      return "Change";
    }
    if (operationType.includes("remove")) {
      return "Delete";
    }
  };

  const handleSubmit = () => {
    setDisableBtn(true);

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    if (selectedUser?.length && selectedUser !== "") {
      if (operationType.includes("add")) {
        if (operationType.includes("Vendor")) {
          return dispatch(
            getAddTeamsUser(
              {
                ...operation.params,
              },
              {
                loginEmail: selectedUser,
                usersSubRolesId: 11,
              },
              () => {
                handleClose();
                setDisableBtn(false);
              },
              logDetails
            )
          );
        }
        if (operationType.includes("Org")) {
          dispatch(
            getAddCompanyUsers(
              {
                ...operation.params,
              },
              {
                loginEmail: selectedUser,
                userSubRoleId: selectedRole,
              },
              () => {
                handleClose();
                setDisableBtn(false);
              },
              updateCompanyDetails,
              logDetails
            )
          );
        }
        if (operationType.includes("Team")) {
          dispatch(
            getAddTeamsUser(
              {
                ...operation.params,
              },
              {
                loginEmail: selectedUser,
                usersSubRolesId: selectedRole,
              },
              () => {
                handleClose();
                setDisableBtn(false);
              },
              logDetails
            )
          );
        }
      }
    } else {
      setErrorTextField(true);
      if (operationType.includes("add")) {
        setDisableBtn(false);
      }
    }

    if (operationType.includes("edit")) {
      if (operationType.includes("Org")) {
        dispatch(
          EditCompanyUsers(
            {
              ...operation.params,
            },
            {
              userSubRoleId: selectedRole,
            },
            () => {
              handleClose();
              setDisableBtn(false);
            },
            updateCompanyDetails,
            logDetails
          )
        );
      }
      if (operationType.includes("Team")) {
        dispatch(
          EditTeamsUser(
            {
              ...operation.params,
            },
            {
              usersSubRolesId: selectedRole,
            },
            () => {
              handleClose();
              setDisableBtn(false);
            },
            logDetails
          )
        );
      }
    }

    if (operationType.includes("remove")) {
      if (operationType.includes("Org")) {
        dispatch(
          RemoveUserFromOrganization(
            {
              ...operation.params,
            },
            () => {
              handleClose();
              setDisableBtn(false);
            },
            updateCompanyDetails,
            logDetails
          )
        );
      }
      if (operationType.includes("Team")) {
        dispatch(
          DeleteTeamsUser(
            {
              ...operation.params,
            },
            () => {
              handleClose();
              setDisableBtn(false);
            },
            logDetails
          )
        );
      }
    }

    if (operationType.includes("changePermission")) {
      dispatch(
        changePermissionOrgUser(
          { ...operation.params },
          {
            subRoleId: selectedRole,
          },
          () => {
            handleClose();
            setDisableBtn(false);
          },
          logDetails
        )
      );
    }
  };

  const handleButtonStyle = () => {
    if (operationType.includes("add")) {
      return {
        backgroundColor: disableBtn
          ? theme.palette.grey[200]
          : theme.palette.primary.main,
        color: theme.palette.background.paper,
        paddingLeft: "30px",
        paddingRight: "30px",
        marginLeft: "20px",
        border: `1px solid ${
          disableBtn ? theme.palette.grey[200] : theme.palette.primary.main
        }`,
      };
    }
    if (
      operationType.includes("edit") ||
      operationType.includes("changePermission")
    ) {
      return {
        backgroundColor: disableBtn
          ? theme.palette.grey[200]
          : theme.palette.warning.dark,
        color: theme.palette.background.paper,
        paddingLeft: "30px",
        paddingRight: "30px",
        marginLeft: "20px",
        border: `1px solid ${
          disableBtn ? theme.palette.grey[200] : theme.palette.warning.dark
        }`,
      };
    }
    if (operationType.includes("remove")) {
      return {
        backgroundColor: disableBtn
          ? theme.palette.grey[200]
          : theme.palette.error.dark,
        color: theme.palette.background.paper,
        paddingLeft: "30px",
        paddingRight: "30px",
        marginLeft: "20px",
        border: `1px solid ${
          disableBtn ? theme.palette.grey[200] : theme.palette.error.dark
        }`,
      };
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <HrModalBox>
        <DialogTitle>
          <Typography variant="h2" style={{ fontWeight: "normal" }}>
            {operation?.title}
          </Typography>
        </DialogTitle>
        <StyledDialogContent>
          {operationType.includes("edit") ||
          operationType.includes("changePermission") ||
          operationType.includes("remove") ? (
            <Grid container direction="column">
              <Typography variant="h3">{user?.userName}</Typography>
              <Typography variant="h4">{user?.loginEmail}</Typography>
            </Grid>
          ) : null}
          {operationType.includes("remove") && (
            <HrAlert variant="outlined" severity="error">
              {operation?.description}
            </HrAlert>
          )}

          {operationType.includes("add") && (
            <DialogContentText>{operation?.description}</DialogContentText>
          )}
          {operation?.inputs.map((input, index) => {
            if (input === "User/Email") {
              return (
                <AutoCompleteUser
                  key={index}
                  filterDataOptions={
                    organizationUsers?.hrOrganizationUsers?.length
                      ? [...organizationUsers?.hrOrganizationUsers]
                      : []
                  }
                  currentUsers={registeredUsers}
                  onChange={(value) => {
                    value?.loginEmail && setSelectedUser(value.loginEmail);
                  }}
                  errorTextField={errorTextField}
                  setErrorTextField={setErrorTextField}
                />
              );
            }
            if (input === "Role") {
              return (
                <Select
                  defaultValue={selectedRole}
                  onChange={(c, key) => setSelectedRole(key.props.value)}
                  sx={{ width: "100%" }}
                  key={index}
                >
                  {roles.map(({ id, title }, _index) => (
                    <MenuItem value={id || ""} key={_index}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
              );
            } else {
              return null;
            }
          })}
        </StyledDialogContent>
        <DialogActions sx={{ padding: "0 24px" }}>
          <Button variant="standard" onClick={handleClose} disableElevation>
            Cancel
          </Button>
          <LoadingButton
            variant="outlined"
            style={handleButtonStyle()}
            onClick={handleSubmit}
            disableElevation
            disabled={disableBtn}
            loading={disableBtn}
          >
            {handleSubmitText()}
          </LoadingButton>
        </DialogActions>
      </HrModalBox>
    </Dialog>
  );
}
