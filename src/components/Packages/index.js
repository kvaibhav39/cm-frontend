import { useEffect, useMemo, useState } from "react";
import PackagesTable from "./PackagesTable";
import PackageFilter from "./PackageFilter";
import { Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import PanelCard from "../../common/cards/PanelCard";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import {
  checkActionPermission,
  checkPagePermission,
} from "../../utils/CheckPageAccess";
import permissionKey from "../constants/permissionKey";
import ScrollableGrid from "../../common/ScrollableGrid";
import {
  getAllPackages,
  getOrgIndustries,
} from "../../store/actions/hrActions";
import { getOrganizationIndustries } from "../../store/actions/organizationAction";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const Packages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [showDefaultPackages, setShowDefaultPackages] = useState(true);
  const [showCustomPackages, setShowCustomPackages] = useState(true);
  const loggedInUser = useSelector((state) => state.authorization);
  const { orgIndustriesLists, allPackages: packages } = useSelector(
    (state) => state.hr
  );

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getAllPackages({ orgId: getLoggedInUserHrOrganizationId() }, logDetails)
    );

    dispatch(
      getOrganizationIndustries(
        {
          orgId: getLoggedInUserHrOrganizationId(),
        },
        setSelectedIndustries,
        logDetails
      )
    );

    dispatch(
      getOrgIndustries({ orgId: getLoggedInUserHrOrganizationId() }, logDetails)
    );
  }, []);

  useEffect(() => {
    let finalPackages = [];
    packages.map((singlePackage) => {
      if (
        selectedIndustries.includes(
          singlePackage?.packageIndustries?.industriesId
        )
      ) {
        if (singlePackage?.packageType == "SYSTEM" && showDefaultPackages) {
          finalPackages.push(singlePackage);
        } else if (
          singlePackage?.packageType == "CUSTOM" &&
          showCustomPackages
        ) {
          finalPackages.push(singlePackage);
        }
      } else {
        if (singlePackage?.packageType == "CUSTOM" && showCustomPackages) {
          finalPackages.push(singlePackage);
        }
      }
    });
    setFilteredPackages(finalPackages);
  }, [selectedIndustries, packages, showDefaultPackages, showCustomPackages]);

  useEffect(() => {
    setIndustries(orgIndustriesLists);
  }, [orgIndustriesLists]);

  const hrCreatePackageAccess = useMemo(
    () =>
      checkActionPermission(
        permissionKey.hrPackageCreate,
        loggedInUser.permissions
      ) && checkPagePermission("/hr/packages/create", loggedInUser.permissions),
    [loggedInUser.permissions]
  );

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
            <PackageFilter
              industries={industries}
              showDefaultPackages={showDefaultPackages}
              showCustomPackages={showCustomPackages}
              selectedIndustries={selectedIndustries}
              onSelectIndustry={setSelectedIndustries}
              onDefaultToggle={setShowDefaultPackages}
              onCustomToggle={setShowCustomPackages}
            />
          </PanelCard>
        </Grid>
        <Grid item md={10} sm={12} xs={12}>
          <PanelCard>
            <Grid container sx={{ marginBottom: "2em" }}>
              <Grid item xs={12}>
                <Typography>
                  You may choose pre configured packages, which are crafted by
                  our industry expert investigators based on BGC standards.
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems="center"
              sx={{ marginBottom: "2em" }}
            >
              <Typography variant="h4" sx={{ marginBottom: "10px" }}>
                Packages
              </Typography>
              {hrCreatePackageAccess && (
                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/hr/packages/create")}
                >
                  Create your custom package
                </Button>
              )}
            </Grid>

            <PackagesTable
              packages={filteredPackages?.length ? filteredPackages : []}
            />
          </PanelCard>
        </Grid>
      </Grid>
    </ScrollableGrid>
  );
};

export default Packages;
