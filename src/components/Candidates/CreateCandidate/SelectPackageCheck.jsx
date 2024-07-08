import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PackageIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import Link from "@mui/material/Link";
import { useState } from "react";
import SelectCheck from "./SelectCheck";
import { useTheme } from "@mui/material/styles";
import { HighlightOff } from "@mui/icons-material";
import { useEffect } from "react";
import CustomTooltip from "../../common/CustomTooltip";
import { useSelector } from "react-redux";
import { checkPagePermission } from "../../../utils/CheckPageAccess";
import CircularLoader from "./../../../common/CircularLoader";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const DisplayChecksWithDesc = ({
  id,
  name,
  desc,
  Icon = [<PackageIcon color="primary" />],
}) => {
  return (
    <Box key={`check-${id}`} display="flex" alignItems="center" mt={2}>
      {Icon}
      <Box ml={2}>
        {name}
        {desc ? "- " + desc : ""}
      </Box>
    </Box>
  );
};

export default function SelectPackageCheckTabs(props) {
  const {
    packages,
    selectPackage,
    setFieldValue,
    values,
    countries,
    questionnairesData,
    additionalChecks,
    displayPackages,
    setDisplayPackages,
    selectedCheckTypes,
    createCandidate,
    disableBtn,
    setStep,
    filterPackages,
    setFilterPackages,
  } = props;
  const [selectCustomPkg, setSelectCustomPkg] = useState(null);
  const [selectedTab, setSelectTab] = useState(null);
  const loggedInUser = useSelector((state) => state.authorization);
  const { allChecksData, loading } = useSelector((state) => state?.hr);

  const theme = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    if (values?.packageId && !selectCustomPkg) {
      let index = packages.findIndex(
        (curr) => curr.packagesId === values?.packageId
      );
      handleChange(values?.packageId, index);
    }
  }, []);

  const handleChange = (packageId, index) => {
    if (packageId === selectCustomPkg) {
      selectPackage("packageId", null);
      setSelectCustomPkg(null);
      setSelectTab(null);
    } else {
      selectPackage("packageId", packageId);
      setSelectCustomPkg(packageId);
      setSelectTab(index);
    }
  };

  return (
    <Grid
      container
      xs={12}
      marginLeft={{ md: "10px", xs: "5px" }}
      position="relative"
    >
      {loading || !packages ? (
        <CircularLoader height="10vh" size={40} />
      ) : (
        <>
          {packages?.length ? (
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              flexDirection={{ xs: "column", md: "row" }}
            >
              {/* <Grid
          item
          md={8}
          xs={12}
          mt={2}
          display="flex"
          flexWrap="wrap"
          justifyContent={{ md: "flex-start", xs: "space-around" }}
        >
          {packages?.map((pkg, index) => (
            <Chip
              label={pkg.packageName}
              size="medium"
              sx={{
                color: theme.palette.grey[700],
                backgroundColor: theme.palette.primary[100],
                marginRight: { md: "18px", xs: "none" },
                marginTop: { md: "none", xs: "3px" },
                borderRadius: "5px",
                fontWeight: "600",
                border:
                  selectCustomPkg === pkg.packagesId
                    ? `1.5px solid ${theme.palette.primary.main}`
                    : null,
              }}
              onClick={() => handleChange(pkg.packagesId)}
            />
          ))}
        </Grid> */}

              <Grid
                item
                md={8}
                xs={12}
                display="flex"
                flexWrap="wrap"
                justifyContent={{ md: "flex-start", xs: "space-around" }}
                marginLeft={{ md: "-15px", xs: "-5px" }}
              >
                <Tabs
                  value={selectedTab}
                  variant="scrollable"
                  aria-label="Vertical tabs example"
                  scrollButtons={true}
                  allowScrollButtonsMobile
                  sx={{
                    "& .MuiTabScrollButton-root": {
                      color: "#000",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1,
                    },
                  }}
                >
                  {packages?.map((pkg, index) => {
                    return (
                      <Tab
                        label={
                          <Box
                            fontWeight="600"
                            sx={{
                              maxWidth: "400px",
                            }}
                          >
                            {pkg.packageName?.length > 35 ? (
                              <CustomTooltip
                                tooltipmaxwidth={400}
                                title={pkg.packageName}
                              >
                                <Box component="span">{`${pkg.packageName.slice(
                                  0,
                                  35
                                )}...`}</Box>
                              </CustomTooltip>
                            ) : (
                              pkg.packageName
                            )}
                          </Box>
                        }
                        key={`tab-${index}`}
                        sx={{
                          color: theme.palette.grey[700],
                          backgroundColor: theme.palette.primary[100],
                          marginRight: "18px",
                          marginTop: { md: "none", xs: "3px" },
                          borderRadius: "5px",
                          fontWeight: "600",
                        }}
                        onClick={() => handleChange(pkg.packagesId, index)}
                      />
                    );
                  })}
                </Tabs>
              </Grid>

              <Grid
                item
                md={4}
                xs={12}
                sx={{
                  position: { md: "absolute", xs: "none" },
                  width: "100%",
                  right: { md: "5px", xs: "none" },
                  height: '110%',
                  marginTop: { xs: 2, md: 0 },
                }}
              >
                <Box
                  sx={{
                    padding: "10px",
                    border: "1px solid #527AFB",
                    boxShadow: "0px 4px 24px rgba(24, 41, 47, 0.02)",
                    borderRadius: "5px",
                    maxHeight: { md: "100%", xs: "30vh" },
                    overflow: "auto",
                    whiteSpace: "normal !important",
                    wordBreak: "break-word !important",
                  }}
                >
                  {!selectCustomPkg ? (
                    <Typography variant="h4">
                      Selected Package / Additional Checks :
                    </Typography>
                  ) : null}
                  {selectCustomPkg ? (
                    packages?.map((pkg, index) => {
                      return (
                        <TabPanel
                          value={selectCustomPkg}
                          index={pkg?.packagesId}
                          key={`tabpanel-${index}`}
                        >
                          <Typography variant="h4" gutterBottom>
                            Selected Package ({pkg?.packageName}) / Additional
                            Checks :
                          </Typography>
                          {pkg?.packageChecks?.map((check) => {
                            return check.strikeOut ? (
                              <>
                                <s>
                                  <DisplayChecksWithDesc
                                    Icon={[<HighlightOff color="error" />]}
                                    id={check.checksId}
                                    name={check.checkName}
                                    desc={check.checkScopeDescription}
                                  />
                                </s>
                                <DisplayChecksWithDesc
                                  id={check.checksId}
                                  name={check.checkName}
                                  desc={check.newCheckScopeDescription}
                                />
                              </>
                            ) : check.checkAdded ? (
                              <DisplayChecksWithDesc
                                id={check.checksId}
                                name={check.checkName}
                                desc={check.addedCheckScopeDescription}
                              />
                            ) : (
                              <DisplayChecksWithDesc
                                id={check.checksId}
                                name={check.checkName}
                                desc={check.checkScopeDescription}
                              />
                            );
                          })}
                        </TabPanel>
                      );
                    })
                  ) : (
                    <>
                      {values?.checks?.map((check) =>
                        check.checkEnabled ? (
                          <DisplayChecksWithDesc
                            id={check.checksId}
                            name={check.checkName}
                            desc={check.newCheckScopeDescription}
                          />
                        ) : null
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <>
              {loggedInUser?.currentUser?.roleId === 4 ? (
                <Typography variant="h4" textAlign="center">
                  You have not configured any packages please contact system
                  admin for further assistance, though you may still order
                  individual checks. If you have any questions, feel free to
                  reach out to us at{" "}
                  <a href="mailto:info@checkministry.com">
                    info@checkministry.com
                  </a>
                  .
                </Typography>
              ) : (
                <Typography variant="h4" textAlign="center">
                  You have not configured any packages, you may still order
                  individual checks.
                  <>
                    {checkPagePermission(
                      "/hr/packages/create",
                      loggedInUser.permissions
                    ) ? (
                      <>
                        {" "}
                        Click{" "}
                        <Link
                          component="button"
                          variant="body2"
                          underline="none"
                          onClick={() => {
                            // console.log("redirect");
                            navigate("/hr/packages/create");
                          }}
                        >
                          HERE
                        </Link>{" "}
                        to create Package.
                      </>
                    ) : null}
                  </>
                </Typography>
              )}
            </>
          )}
        </>
      )}

      <Grid
        container
        item
        md={7.8}
        xs={12}
        mt={1.5}
        sx={{
          maxHeight: displayPackages?.length
            ? { xxl: "48vh", lg: "35vh", xs: "38vh" }
            : "none",
          height: displayPackages?.length
            ? "none"
            : { xxl: "48vh", lg: "35vh", xs: "38vh" },
        }}
      >
        {loading || !allChecksData ? (
          <CircularLoader height="20vh" size={50} />
        ) : allChecksData?.checks?.length ? (
          <SelectCheck
            setFieldValue={setFieldValue}
            values={values}
            countries={countries}
            questionnairesData={questionnairesData}
            additionalChecks={additionalChecks}
            displayPackages={displayPackages}
            setDisplayPackages={setDisplayPackages}
            selectedCheckTypes={selectedCheckTypes}
            filterPackages={filterPackages}
            setFilterPackages={setFilterPackages}
          />
        ) : (
          <Typography variant="h4" textAlign="center" width="100%" mt={4}>
            There are no checks assigned with this organization. Please contact
            system admin if you want to add additional checks. If you have any
            questions, feel free to reach out to us at{" "}
            <a href="mailto:info@checkministry.com">info@checkministry.com</a>.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
