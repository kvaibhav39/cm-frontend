import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import PanelCard from "../../../common/cards/PanelCard";
import ScrollableGrid from "../../../common/ScrollableGrid";
import {
  getCustomFieldCategoriesLists,
  getCustomFieldTypesLists,
  getOrgsLists,
  setSelectedOrg,
} from "../../../store/actions/systemAdminActions";
import SystemAdminSideBar from "./SystemAdminSideBar";
import {
  DriveFileRenameOutline,
  Email,
  PostAdd,
  Tune,
  CurrencyExchange,
  Public,
  Diversity2,
  SettingsSuggest,
  PlaylistAddCircle,
  RemoveModerator,
} from "@mui/icons-material";
import {
  GET_OPS_USERS_BY_ORG,
  GET_ORGANIZATION_USERS,
  GET_REMOVAL_PERMISSIONS_DATA,
} from "../../../store/actions/actionTypes";
import CustomTooltip from "../../common/CustomTooltip";
import AttributionIcon from "@mui/icons-material/Attribution";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const navItems = [
  {
    name: "Custom Fields",
    url: "/system-admin/client-settings/custom-fields",
    icon: <DriveFileRenameOutline />,
  },
  {
    name: "Custom Emails",
    url: "/system-admin/client-settings/custom-emails",
    icon: <Email />,
  },
  {
    name: "Custom Consent Form",
    url: "/system-admin/client-settings/custom-consent-form",
    icon: <PostAdd />,
  },
  {
    name: "Other Settings",
    url: "/system-admin/client-settings/org-settings",
    icon: <Tune />,
  },
  {
    name: "Update Check Prices",
    url: "/system-admin/client-settings/update-check-prices",
    icon: <CurrencyExchange />,
  },
  {
    name: "Research Countries Settings",
    url: "/system-admin/client-settings/research-countries-settings",
    icon: <Public />,
  },
  {
    name: "Update Relationships",
    url: "/system-admin/client-settings/update-relationships",
    icon: <Diversity2 />,
  },
  {
    name: "Additional Email Settings",
    url: "/system-admin/client-settings/additional-email-settings",
    icon: <SettingsSuggest />,
  },
  {
    name: "Additional Check Settings",
    url: "/system-admin/client-settings/additional-check-settings",
    icon: <PlaylistAddCircle />,
  },
  {
    name: "Remove Permissions",
    url: "/system-admin/client-settings/remove-permissions",
    icon: <RemoveModerator />,
  },
];

const ClientSettingsLayout = () => {
  const dispatch = useDispatch();
  const { orgsLists, selectedOrg } = useSelector((state) => state.systemAdmin);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getOrgsLists(logDetails));
    dispatch(getCustomFieldCategoriesLists(logDetails));
    dispatch(getCustomFieldTypesLists(logDetails));
    return () => dispatch(setSelectedOrg(0));
  }, []);

  return (
    <>
      {orgsLists?.length ? (
        <ScrollableGrid scrollHeight={{ xs: "95vh", md: "90vh" }}>
          <Grid
            container
            spacing={2}
            display={{ xs: "flex", md: "block" }}
            flexDirection={{ xs: "column", md: "none" }}
            justifyContent={{ xs: "center", md: "none" }}
            alignItems={{ xs: "center", md: "none" }}
            sx={{
              height: { xs: "none", md: "80vh" },
            }}
          >
            <Grid
              item
              xs={12}
              container
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "center" }}
              alignItems="center"
              mb={3}
              mt={{ xs: 10, md: 0 }}
            >
              <Typography mb={{ xs: 1, md: 0 }}>
                Select Organization : &nbsp;
              </Typography>

              <Autocomplete
                disablePortal
                disableClearable
                id="org-selection"
                options={orgsLists}
                sx={{ width: { md: 450, xs: 250 } }}
                defaultValue={orgsLists[0]}
                onChange={(e, newValue) => {
                  if (newValue) {
                    dispatch(setSelectedOrg(newValue.hrOrganizationsId));
                    //on selection of new org , we will make hr users lists & ops users lists
                    //to null so that api only gets called once
                    dispatch({ type: GET_ORGANIZATION_USERS, payload: null });
                    dispatch({ type: GET_OPS_USERS_BY_ORG, payload: null });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      orgsLists?.find(
                        (curr) => curr?.hrOrganizationsId === +selectedOrg
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
                    <Box width="10%" display="flex" justifyContent="center">
                      {item?.isVendor && (
                        <CustomTooltip title="Vendor">
                          <AttributionIcon color="primary" />
                        </CustomTooltip>
                      )}
                    </Box>
                    <Box>
                      {item?.hrOrganizationName?.length > 35 ? (
                        <CustomTooltip
                          tooltipmaxwidth={400}
                          title={item?.hrOrganizationName}
                        >
                          <Box component="span">{`${item?.hrOrganizationName.slice(
                            0,
                            30
                          )}...`}</Box>
                        </CustomTooltip>
                      ) : (
                        item?.hrOrganizationName
                      )}
                    </Box>
                  </li>
                )}
              />
            </Grid>
            <Grid
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              justifyContent={{ xs: "center" }}
              alignItems={{ xs: "center", md: "flex-start" }}
              sx={{ marginBottom: "2em" }}
              gap={2}
              width="100%"
              height="100%"
            >
              <Grid item md={2} xs={12} width="100%" height="100%">
                <PanelCard sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ height: "72vh", overflow: "scroll" }}>
                    <SystemAdminSideBar
                      key="client-settings"
                      items={navItems}
                    />
                  </Box>
                </PanelCard>
              </Grid>
              <Grid item md={10} xs={12} width="100%" height="100%">
                <PanelCard>
                  <Outlet />
                </PanelCard>
              </Grid>
            </Grid>
          </Grid>
        </ScrollableGrid>
      ) : null}
    </>
  );
};

export default ClientSettingsLayout;
