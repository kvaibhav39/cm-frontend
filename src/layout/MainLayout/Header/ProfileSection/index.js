import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";

// project imports
import Transitions from "common/Transitions";

// assets
import { IconLogout, IconSettings, IconUser } from "@tabler/icons";
import {
  clearAuthorizationStore,
  deleteToken,
} from "../../../../store/actions/authorizationAction";
import MainCard from "../../../../common/cards/MainCard";
import { clearOperationStore } from "../../../../store/actions/operationActions";
import { clearOrgStore } from "../../../../store/actions/organizationAction";
import { clearToastNotificationStore } from "../../../../store/actions/toastNotificationActions";
import { clearHrStore } from "../../../../store/actions/hrActions";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import UpdateProfileModal from "../Components/UpdateProfileModal";
import { clearCandidateStore } from "../../../../store/actions/candidateAction";
// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [updateProfileModal, setUpdateProfileModal] = useState(false);
  const userData = useSelector((state) => state.authorization.currentUser);
  const dispatch = useDispatch();
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  //extracting switch back url
  let switchBackUrl = JSON.parse(localStorage.getItem("switchBackUrl"));

  let vendorUser =
    JSON.parse(
      JSON.parse(localStorage.getItem("first_login"))?.CheckMinistryUser
    )?.subRoleId === 11;

    let secondLoginPresent = localStorage.getItem("loginProfile") === "second"

  const handleLogout = () => {
    deleteToken();
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light,
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            sx={{
              ...theme.typography.mediumAvatar,
              margin: "8px 0 8px 8px !important",
              cursor: "pointer",
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            color="inherit"
          >
            <IconUser />
          </Avatar>
        }
        label={
          <IconSettings
            stroke={1.5}
            size="1.5rem"
            color={theme.palette.primary.main}
          />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ padding: "16px 16px 0" }}>
                    <Stack>
                      <Stack direction="column" spacing={0.5}>
                        <Typography variant="h4">Good Morning,</Typography>
                        <Typography
                          component="span"
                          variant="h4"
                          sx={{ fontWeight: 400 }}
                        >
                          {userData?.userName}
                        </Typography>
                      </Stack>
                      {vendorUser && secondLoginPresent ? null : (
                        <>
                          <Typography
                            component="span"
                            variant="h4"
                            sx={{ fontWeight: 400 }}
                            mt={1}
                          >
                            {userData?.loginEmail}
                          </Typography>
                          <Typography
                            component="span"
                            variant="h4"
                            sx={{ fontWeight: 400 }}
                            mt={1}
                          >
                            {userData?.phoneNumber}
                          </Typography>
                        </>
                      )}
                      <Typography mt={1} variant="subtitle2">
                        {userData?.roleName}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Box>

                  <Box sx={{ padding: "0 8px 8px" }}>
                    <List
                      component="nav"
                      sx={{
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "10px",
                        [theme.breakpoints.down("md")]: {
                          minWidth: "100%",
                        },
                        "& .MuiListItemButton-root": {
                          mt: 0.5,
                        },
                      }}
                    >
                      {vendorUser && secondLoginPresent ? null : (
                        <ListItemButton
                          sx={{
                            borderRadius: `${customization.borderRadius}px`,
                          }}
                          selected={selectedIndex === 0}
                          onClick={() => setUpdateProfileModal(true)}
                        >
                          <ListItemIcon>
                            <ManageAccountsIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                Update Profile
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}

                      <ListItemButton
                        sx={{
                          borderRadius: `${customization.borderRadius}px`,
                        }}
                        selected={selectedIndex === 4}
                        onClick={handleLogout}
                        href={
                          localStorage.getItem("loginProfile") === "first"
                            ? "/login"
                            : switchBackUrl || "/"
                        }
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">Logout</Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                  {updateProfileModal && (
                    <UpdateProfileModal
                      open={updateProfileModal}
                      handleClose={() => setUpdateProfileModal(false)}
                      userData={userData}
                    />
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
