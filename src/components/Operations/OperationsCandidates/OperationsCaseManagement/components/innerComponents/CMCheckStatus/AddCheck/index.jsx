import { Box, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddedCheckAccordion from "./components/AddedCheckAccordion";
import { Formik, Form } from "formik";
import { useSearchParams } from "react-router-dom";
import { addNewChecks } from "../../../../../../../../store/actions/operationActions";
import {
  ADD_CHECK_AND_SUBCHECK,
  ALLOW_ADD_CHECK_SUBCHECK,
  REMOVE_CHECK_AND_SUBCHECK,
} from "../../../../../../../../store/actions/actionTypes";
import { checksIdsWithResearchCountries } from "../utils/checksIdsWithResearchCountries";
import { getCurrentFileNameAndFunction } from "../../../../../../../../utils/getCurrentFileNameAndFunction.js";

const AddCheck = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dropdownChecks, setDropDownChecks] = useState([]);
  const [addedChecks, setAddedChecks] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState("");
  const [disableAddCheck, setDisableAddCheck] = useState(true);
  const [disableAdd, setDisableAdd] = useState(true);
  const [accordionState, setAccordionState] = useState();
  const [initialValues, setInitialValues] = useState();

  const { allChecksData } = useSelector((state) => state.hr);
  const { OpsCandidateCaseChecksList, allowAddCheckAndSubCheck } = useSelector(
    (state) => state.operations
  );

  //to disable add check icon on dropdown selection
  useEffect(() => {
    if (selectedCheck) {
      setDisableAddCheck(false);
    } else {
      setDisableAddCheck(true);
    }
  }, [selectedCheck]);

  //adding those checks in the dropdown which are not present in the case check list
  useEffect(() => {
    let temp = [];
    allChecksData?.checks?.forEach((check) => {
      if (
        !OpsCandidateCaseChecksList?.find(
          (opsCheck) => check?.checksId === opsCheck?.checksId
        )
      ) {
        temp.push(check);
      }
    });

    setDropDownChecks(temp);
    setAddedChecks([]);
    setSelectedCheck("");
  }, [OpsCandidateCaseChecksList, allChecksData]);

  //initial values for formik
  useEffect(() => {
    if (allChecksData) {
      let temp = [];
      allChecksData?.checks?.forEach((check) => {
        let checkData = {
          checkId: check.checksId,
          checkScope: check.defaultScope,
        };

        if (
          checksIdsWithResearchCountries?.find(
            (curr) => curr.checksId === check?.checksId
          )
        ) {
          checkData.researchCountries = [];
        }

        temp.push(checkData);
      });
      setInitialValues({ checks: temp });
    }
  }, [allChecksData]);

  //adding selected check from dropdown
  const handleAddCheck = (value) => {
    if (value) {
      let toBeAddedCheck = allChecksData?.checks?.find(
        (curr) => curr.checksId === value
      );

      setAddedChecks((prev) => [toBeAddedCheck, ...prev]);
      setDisableAddCheck(true);
      setDisableAdd(false);
      setAccordionState(value);
      setSelectedCheck("");
    }
  };

  //removing selected check by id
  const handleRemoveCheck = (id, checks) => {
    let newAddedChecks = [...addedChecks]?.filter(
      (curr) => curr.checksId !== id
    );
    setAddedChecks([...newAddedChecks]);

    setAccordionState(null);

    if (newAddedChecks?.length === 0) {
      setDisableAdd(true);
    }

    //setting removed checks in redux store
    let payloadChecks = [];
    checks?.forEach((check) => {
      if (newAddedChecks?.find((added) => added.checksId === check.checkId)) {
        payloadChecks.push(check);
      }
    });

    dispatch({
      type: REMOVE_CHECK_AND_SUBCHECK,
      payload: id,
    });
  };

  const handleAddAllCheck = (values, form) => {
    let payloadChecks = [];
    values?.checks?.forEach((check) => {
      if (addedChecks?.find((added) => added.checksId === check.checkId)) {
        payloadChecks.push(check);
      }
    });

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleAddAllCheck"
    );

    dispatch(
      addNewChecks(
        { checkData: payloadChecks },
        +searchParams.get("candidatesCasesId"),
        logDetails
      )
    );
    setAddedChecks([]);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleAddAllCheck}
    >
      {(form) => {
        //added a useEffect here which listens to the changes made inside checks
        //and adding checks in redux store
        useEffect(() => {
          if (form?.values?.checks && allowAddCheckAndSubCheck) {
            let payloadChecks = [];

            form?.values?.checks?.forEach((check) => {
              if (
                addedChecks?.find((added) => added.checksId === check.checkId)
              ) {
                payloadChecks.push(check);
              }
            });
            dispatch({
              type: ADD_CHECK_AND_SUBCHECK,
              payload: payloadChecks,
            });
          }
        }, [addedChecks, form.values, allowAddCheckAndSubCheck]);

        return (
          <Form>
            {dropdownChecks?.length ? (
              <Grid
                container
                mt={1}
                mb={2}
                xs={12}
                p={2}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.grey[400]}`,
                  borderRadius: "5px",
                  display: "none", //for now , we are hiding this section
                }}
              >
                <Grid
                  item
                  xs={12}
                  display="flex"
                  alignItems="center"
                  flexDirection={{ xs: "column", sm: "row" }}
                >
                  <Grid
                    item
                    xs={12}
                    md={11}
                    display="flex"
                    alignItems="center"
                    gap={{ xs: 1, sm: 2 }}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Box>
                      <Typography
                        fontWeight={550}
                        color={(theme) => theme.palette.grey[700]}
                        textAlign={{ xs: "center", md: "left" }}
                      >
                        Add Check(s)
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDirection={{ xs: "column", sm: "row" }}
                    >
                      <Select
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          getContentAnchorEl: null,
                          PaperProps: { sx: { maxHeight: 300 } },
                        }}
                        displayEmpty
                        value={selectedCheck}
                        size="small"
                        variant="outlined"
                        onChange={(event) => {
                          setSelectedCheck(event.target.value);
                          handleAddCheck(event.target.value);

                          //making true so that in 'AddedSubCheckDetails' due to the useEffect ,
                          //'ADD_CHECK_AND_SUBCHECK' gets called which sets the 'addedChecksAndSubCheck'
                          dispatch({
                            type: ALLOW_ADD_CHECK_SUBCHECK,
                            payload: true,
                          });
                        }}
                        sx={{
                          transform: "scale(0.8)",
                          height: "35px",
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            fontSize: "12px",
                          },
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: "12px" }}>
                          Select Check
                        </MenuItem>

                        {dropdownChecks?.map((option, index) => (
                          <MenuItem
                            key={index}
                            value={option?.checksId || ""}
                            disabled={addedChecks?.find(
                              (curr) => curr?.checksId === option.checksId
                            )}
                            sx={{ fontSize: "12px" }}
                          >
                            {option?.checkName}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12} p={addedChecks?.length ? 1 : 0}>
                  <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    {addedChecks?.map((curr, ind) => (
                      <AddedCheckAccordion
                        key={curr?.checksId}
                        checksId={curr?.checksId}
                        selectedCheckData={curr}
                        initialValues={form?.values}
                        handleRemoveCheck={handleRemoveCheck}
                        accordionState={accordionState}
                        setAccordionState={setAccordionState}
                        setFieldValue={form.setFieldValue}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            ) : null}
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddCheck;
