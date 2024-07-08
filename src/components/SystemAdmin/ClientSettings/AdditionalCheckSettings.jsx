import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getAdditionalCheckSettings,
  updateAdditionalCheckSettings,
} from "../../../store/actions/systemAdminActions";
import { getAllChecks } from "../../../store/actions/hrActions";
import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import CheckItem from "../../Packages/CustomPackages/Checks/CheckWidget/CheckItem";
import CircularLoader from "./../../../common/CircularLoader";
import CustomTooltip from "../../common/CustomTooltip";
import { CLEAR_ALL_CHECKS } from "../../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const AdditionalCheckSettings = () => {
  const dispatch = useDispatch();
  const [additionalChecks, setAdditionalChecks] = useState([]);
  const [displayPackages, setDisplayPackages] = useState([]);
  const [filterPackages, setFilterPackages] = useState(null);
  const tempRef = useRef(true);

  const { selectedOrg, additionalChecksSettingData, loading } = useSelector(
    (state) => state.systemAdmin
  );
  const { allChecksData } = useSelector((state) => state?.hr);

  useEffect(() => {
    if (selectedOrg) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getAdditionalCheckSettings(selectedOrg, logDetails));
    }
  }, [selectedOrg]);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getAllChecks(logDetails));

    return () => dispatch({ type: CLEAR_ALL_CHECKS });
  }, []);

  //all checks
  useEffect(() => {
    if (allChecksData) {
      let checksArr = allChecksData?.checks?.map((v) => ({
        ...v,
        checkEnabled: false,
        checkScope: v.defaultScope,
        checkId: v.checksId,
      }));

      if (!selectedOrg) {
        checksArr = checksArr?.map((v) => {
          v.checkEnabled = true;
          return v;
        });
      } else if (additionalChecksSettingData?.length) {
        checksArr = checksArr?.map((v) => {
          let ifPresent = additionalChecksSettingData?.find(
            (curr) => curr?.checkId === v.checkId
          );
          v.checkEnabled = ifPresent ? true : false;
          return v;
        });
      }

      setDisplayPackages(checksArr);
      setAdditionalChecks(checksArr);
    }
  }, [allChecksData, selectedOrg, additionalChecksSettingData]);

  const handleFilter = async (e) => {
    if (e === "empty") {
      setFilterPackages("");
      return setDisplayPackages(additionalChecks);
    }

    setFilterPackages(e.target.value);
    let temp = additionalChecks;

    if (e.target.value !== "") {
      temp = additionalChecks.filter((curr) =>
        curr.checkName.toLowerCase().includes(e.target.value.toLowerCase())
          ? curr
          : null
      );
    } else {
      setFilterPackages("");
    }

    setDisplayPackages(temp);
  };

  const handleSubmit = (values) => {
    let checksId = [];
    values?.checks?.forEach((curr) => {
      if (curr?.checkEnabled) checksId.push(curr?.checksId);
    });

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(
      updateAdditionalCheckSettings({ checksId }, selectedOrg, logDetails)
    );
  };

  const getCheckOrderId = (checks, checksId) => {
    return checks?.length
      ? checks?.findIndex((check) => check?.checkId === checksId)
      : 0;
  };

  return (
    <>
      {!loading && allChecksData ? (
        <Formik
          enableReinitialize
          initialValues={{ checks: additionalChecks }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <Grid
                container
                justifyContent={{ xs: "center", sm: "flex-end" }}
                sx={{ marginBottom: "1em" }}
              >
                <CustomTooltip
                  title={
                    !selectedOrg
                      ? "Please select an organization to enable it"
                      : ""
                  }
                >
                  <span>
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      type="submit"
                      disabled={!selectedOrg}
                    >
                      Update settings
                    </Button>
                  </span>
                </CustomTooltip>
              </Grid>
              <Grid container display="flex" justifyContent="center">
                <Grid container item xs={12} md={6} px={1} mb={1.5}>
                  <TextField
                    value={filterPackages}
                    placeholder="Type Check Name To Search..."
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
                <Grid
                  container
                  item
                  xs={12}
                  spacing={1}
                  sx={{
                    height: { xs: "60vh", xxl: "70vh" },
                    overflow: "scroll",
                  }}
                  px={1}
                  display="flex"
                  alignContent="baseline"
                >
                  {displayPackages?.map((checkConfig) => (
                    <CheckItem
                      id={checkConfig.checksId}
                      checks={values.checks}
                      checkOrderId={getCheckOrderId(
                        values.checks,
                        checkConfig.checksId
                      )}
                      defaultCheckConfig={checkConfig}
                      key={checkConfig.checksId}
                      tempRef={tempRef}
                      hideCheckDetails={true}
                      viewMode={!selectedOrg}
                    />
                  ))}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      ) : (
        <CircularLoader height="70vh" size={50} />
      )}
    </>
  );
};

export default AdditionalCheckSettings;
