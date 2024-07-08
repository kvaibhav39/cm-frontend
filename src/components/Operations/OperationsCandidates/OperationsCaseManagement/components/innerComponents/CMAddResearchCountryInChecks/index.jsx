import {
  Box,
  Button,
  Divider,
  FormControl,
  FormGroup,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checksIdsWithResearchCountries } from "../CMCheckStatus/utils/checksIdsWithResearchCountries";
import { Field, Form, Formik } from "formik";
import { AutoCompleteWithChipsController } from "../../../../../../../common/Form/AutoCompleteWithChipsController/AutoCompleteWithChipsController";
import { useSearchParams } from "react-router-dom";
import { addCheckSubCheck } from "../../../../../../../store/actions/operationActions";
import { omit } from "lodash";
import { CustomCheckbox } from "../../../../../../common/CustomCheckBox";
import CircularLoader from "../../../../../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../../../../../utils/getCurrentFileNameAndFunction.js";

const CMAddResearchCountryInChecks = ({
  toHideCMAddResearchCountryInChecks,
  toShowCMAddResearchCountryInChecks,
}) => {
  const {
    OpsCandidateCaseChecksList,
    loadUpdateAddCheckBtn,
    OpsBasicCandidateInfo,
  } = useSelector((state) => state.operations);
  const { allChecksData } = useSelector((state) => state?.hr);
  const { allCountriesModified } = useSelector((state) => state.helper);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  //initial values for formik
  let initialValues = useMemo(() => {
    if (allChecksData && OpsCandidateCaseChecksList) {
      let checks = [
        {
          checkId: 0,
          checkScope: null,
          candidatesChecksMappingId: null,
          checkName: "All",
        },
      ];
      OpsCandidateCaseChecksList?.forEach((check) => {
        let ifPresent = checksIdsWithResearchCountries?.find(
          (curr) => curr.checksId === check.checksId
        );

        if (ifPresent) {
          checks.push({
            checkId: check.checksId,
            checkScope: allChecksData?.checks?.find(
              (curr) => curr.checksId === check.checksId
            )?.defaultScope,
            candidatesChecksMappingId: check?.candidatesChecksMappingId,
            checkName: check?.checkName,
          });
        }
      });

      //setting all the checkboxes to checked
      let temp = { 0: true };

      checks?.forEach((curr) => {
        temp = { ...temp, [curr.checkId]: true };
      });

      //to hide or show section
      if (
        checks?.length > 1 &&
        !(
          OpsBasicCandidateInfo?.verificationProcessId === 1 ||
          OpsBasicCandidateInfo?.verificationProcessId === 2
        )
      ) {
        toShowCMAddResearchCountryInChecks();
      } else {
        toHideCMAddResearchCountryInChecks();
      }

      return { selectedChecks: temp, checks, researchCountries: [] };
    }
    return null;
  }, [allChecksData, OpsCandidateCaseChecksList, OpsBasicCandidateInfo]);

  const handleToggleCheckBoxes = (id, values, setFieldValue) => {
    let temp = { ...values?.selectedChecks };
    temp = { ...temp, [id]: !temp[id] };

    if (id === 0) {
      //'All' is selected
      if (temp[id]) {
        //making every checkbox ticked
        values?.checks?.forEach((curr) => {
          if (curr.checkId !== 0) {
            temp = { ...temp, [curr.checkId]: true };
          }
        });
      } else {
        //'All' is deselected
        values?.checks?.forEach((curr) => {
          temp = { ...temp, [curr.checkId]: false };
        });
      }
    } else {
      let countTickedChecks = 0;
      //counting number of ticked checkboxes
      for (let i in temp) {
        if (i !== "0" && temp[i]) countTickedChecks++;
      }

      //if countTickedChecks is equal to the number of total checkboxes - 1 ,
      //then we will make 'All' checkbox true else false
      //subtracting 1 from values?.checks because it has an extra object for 'All'
      temp = { ...temp, 0: countTickedChecks === values?.checks.length - 1 };
    }

    setFieldValue("selectedChecks", temp);
  };

  const handleSubmit = (values, form) => {
    let tempArr = [];

    for (let i in values?.selectedChecks) {
      if (i !== "0" && values?.selectedChecks[i]) {
        //not adding 'All' checkbox
        let findCheck = values?.checks?.find((curr) => +curr.checkId === +i);
        tempArr.push({
          ...findCheck,
          researchCountries: values?.researchCountries,
        });
      }
    }

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(
      addCheckSubCheck(
        logDetails,
        {
          checkData: tempArr?.map((curr) => omit(curr, "checkName")),
        },
        +searchParams.get("candidatesCasesId"),
        allChecksData
      )
    );
    form.resetForm();
  };

  return (
    <>
      <Typography fontWeight={550} mb={1}>
        Add Research Country in Checks
      </Typography>
      {initialValues?.checks?.length > 1 &&
      allCountriesModified &&
      !(
        loadUpdateAddCheckBtn?.purpose ===
          "callFromAddResearchCountryInChecks" && loadUpdateAddCheckBtn?.value
      ) ? (
        <>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Grid
                  border={(theme) => `1px solid ${theme.palette.grey[400]}`}
                  borderRadius="5px"
                  width="100%"
                >
                  <Grid
                    xs={12}
                    p={2}
                    display="flex"
                    justifyContent="center"
                    sx={{
                      margin: "0 auto",
                    }}
                  >
                    <Box width={{ xs: "100%", md: "auto" }}>
                      <Field
                        name="researchCountries"
                        countriesData={allCountriesModified}
                        component={AutoCompleteWithChipsController}
                        wrapperObject={values?.checks}
                      />
                    </Box>
                  </Grid>
                  <Divider />

                  <Grid xs={12} p={2}>
                    <FormControl fullWidth size="small">
                      <Box
                        color={(theme) => theme.palette.grey[700]}
                        fontWeight="bold"
                        textAlign="center"
                      >
                        Select Check(s)
                      </Box>
                      <List
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {values?.checks?.map((curr, ind) => (
                          <ListItem
                            key={ind}
                            sx={{
                              width: "auto",
                              maxWidth: { xs: "250px", md: "max-content" },
                            }}
                          >
                            <FormGroup
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "max-content",
                                flexDirection: "row",
                              }}
                            >
                              <CustomCheckbox
                                type="checkbox"
                                id={`check-checkbox-${ind}`}
                                name={curr?.checkId}
                                value={values?.selectedChecks[curr?.checkId]}
                                checked={values?.selectedChecks[curr?.checkId]}
                                onChange={() =>
                                  handleToggleCheckBoxes(
                                    curr?.checkId,
                                    values,
                                    setFieldValue
                                  )
                                }
                              />
                              <label htmlFor={`check-checkbox-${ind}`}>
                                {" "}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "12px",
                                  }}
                                >
                                  {curr?.checkName}
                                </Typography>
                              </label>
                            </FormGroup>
                          </ListItem>
                        ))}
                      </List>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} display="flex" justifyContent="center" p={2}>
                    {" "}
                    <Button
                      variant="contained"
                      disabled={
                        !Object.values(values?.selectedChecks)?.find(
                          (curr) => curr
                        ) || !values?.researchCountries?.length
                      }
                      type="submit"
                    >
                      Add Countries to Checks
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <CircularLoader height="10vh" size={40} />
      )}
    </>
  );
};

export default CMAddResearchCountryInChecks;
