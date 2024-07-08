import { Box, Button, TextField, Typography } from "@mui/material";
import CheckStatusDropdown from "../../../common/CheckStatusDropdown";
import DropdownComponent from "../../../common/DropdownComponent";
import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisplayChip from "../../../common/DisplayChip";
import { useEffect } from "react";
import { updateSubCheckData } from "../../../../../../../../../store/actions/operationActions";
import { useSearchParams } from "react-router-dom";
import { setToastNotification } from "../../../../../../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../../../../../../store/constant";
import { checkActionPermission } from "../../../../../../../../../utils/CheckPageAccess";
import permissionKey from "../../../../../../../../constants/permissionKey";
import { removeTimeFromDate } from "../../../../../../../../Candidate/utils/removeTimeFromDate";
import { FastField, Form, Formik } from "formik";
import { BaseDatePicker } from "../../../../../../../../base";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../utils/getCurrentFileNameAndFunction";

const UpdateActionComponent = () => {
  const [disableBtn, setDisableBtn] = useState(true);
  const [internalStatusDropdown, setInternalStatusDropdown] = useState({});
  const [riskLevelDropdown, setRiskLevelDropdown] = useState({});
  const [selectedAssignee, setSelectedAssignee] = useState({});
  const [searchParams, _] = useSearchParams();

  const formRef = useRef();

  const dispatch = useDispatch();

  const {
    checkInternalStatusLists,
    verificationResultStatusData,
    OpsUserBySubRoleIds,
    subChecksList,
    selectedSubCheckId,
    OpsCandidateCaseChecksList,
    selectedCheckId,
  } = useSelector((state) => state.operations);

  const { candidateDetailsById } = useSelector((state) => state.hr);

  const { permissions } = useSelector((state) => state.authorization);

  let selectedSubCheck = useMemo(() => {
    return subChecksList?.find((curr) => curr.id === selectedSubCheckId);
  }, [subChecksList, selectedSubCheckId]);

  let rowData = useMemo(() => {
    return OpsCandidateCaseChecksList?.find(
      (curr) => curr?.candidatesChecksMappingId === selectedCheckId
    );
  }, [OpsCandidateCaseChecksList, selectedCheckId]);

  useEffect(() => {
    initializeDropdownValues();
  }, [
    selectedSubCheck,
    subChecksList,
    selectedSubCheckId,
    checkInternalStatusLists,
    verificationResultStatusData,
  ]);

  let pdfFieldsArr = useMemo(
    () => [
      {
        label: "Entity Name",
        field: "entityName",
        display: rowData?.checkTypeName === "Verification",
      },
      {
        label: "Date of Search",
        field: "dateOfSearch",
        display: rowData?.checkTypeName !== "Verification",
      },
      {
        label: "Source",
        field: "source",
        display: rowData?.checkTypeName !== "Verification",
      },
    ],
    [rowData]
  );

  let pdfFieldsInitialValues = useMemo(() => {
    //pdf fields
    let tempPdfField = {
      // checkSummary:
      //   selectedSubCheck?.checkSummary || selectedSubCheck?.checkStatusName,
      checkSummary: selectedSubCheck?.checkSummary,
      source: selectedSubCheck?.source,
      dateOfSearch: selectedSubCheck?.dateOfSearch || new Date(),
      checkResult: selectedSubCheck?.checkResult,
    };

    //adding value to 'entityName'
    if (rowData?.checkTypeName === "Verification") {
      let checkIdToCandidateDetailsMapping = {
        11: {
          //education check
          candidateDetailsKey: "EDUCATIONAL_QUALIFICATIONS",
          toMatchWithId: "candidatesEducationsId",
          subcheckValueField: "nameOfSchoolCollegeUniversity",
        },
        12: {
          //emp check
          candidateDetailsKey: "EMPLOYMENT_HISTORY",
          toMatchWithId: "candidatesEmploymentsId",
          subcheckValueField: "companyName",
        },
        13: {
          //salary check
          candidateDetailsKey: "EMPLOYMENT_HISTORY",
          toMatchWithId: "candidatesEmploymentsId",
          subcheckValueField: "companyName",
        },
        14: {
          //prof license check
          candidateDetailsKey: "PROFESSIONAL_QUALIFICATIONS",
          toMatchWithId: "candidatesProfessionalQualificationsId",
          subcheckValueField: "professionalQualificationTitle",
        },
        15: {
          //ref check
          candidateDetailsKey: "PROFESSIONAL_REFERENCE",
          toMatchWithId: "candidatesProfessionalReferencesDetailsId",
          subcheckValueField: "fullName",
        },
      };

      let { candidateDetailsKey, toMatchWithId, subcheckValueField } =
        checkIdToCandidateDetailsMapping[rowData?.checkId];

      let sectionDetails =
        candidateDetailsKey === "EMPLOYMENT_HISTORY"
          ? candidateDetailsById[candidateDetailsKey]?.candidatesEmployeeHistory
          : candidateDetailsKey === "PROFESSIONAL_REFERENCE"
          ? candidateDetailsById[candidateDetailsKey][0]?.referencedetails
          : candidateDetailsById[candidateDetailsKey];

      let matchedDetails = sectionDetails?.find(
        (curr) => curr[toMatchWithId] === selectedSubCheck?.detailsMappingId
      );

      if (matchedDetails && !selectedSubCheck?.entityName) {
        tempPdfField.entityName = matchedDetails[subcheckValueField];
      } else {
        tempPdfField.entityName = selectedSubCheck?.entityName;
      }
    }

    return tempPdfField;
  }, [rowData, selectedSubCheck, candidateDetailsById]);

  const initializeDropdownValues = () => {
    //disabling btn.Will also get disabled when cancel btn is clicked
    setDisableBtn(() => true);

    //internal check status
    if (selectedSubCheck?.subCheckInternalStatusId) {
      setInternalStatusDropdown({
        [selectedSubCheck?.id]: selectedSubCheck?.subCheckInternalStatusId,
      });
    } else {
      setInternalStatusDropdown({
        [selectedSubCheck?.id]: checkInternalStatusLists[0]?.id,
      });
    }

    //risk level
    if (selectedSubCheck?.subCheckVerificationResultStatusId) {
      setRiskLevelDropdown({
        [selectedSubCheck?.id]:
          selectedSubCheck?.subCheckVerificationResultStatusId,
      });
    } else {
      setRiskLevelDropdown({
        [selectedSubCheck?.id]: "",
      });
    }

    //assignee
    if (selectedSubCheck?.assignee) {
      setSelectedAssignee({
        [selectedSubCheck?.id]: selectedSubCheck?.assignee,
      });
    } else {
      setSelectedAssignee({
        [selectedSubCheck?.id]: "",
      });
    }
  };

  const handleUpdate = async () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdate"
    );
    // if (!riskLevelDropdown[selectedSubCheck?.id]) {
    //   return dispatch(
    //     setToastNotification(ERROR, "Please select a valid risk level",logDetails)
    //   );
    // }

    if (!selectedAssignee[selectedSubCheck?.id]) {
      return dispatch(
        setToastNotification(
          ERROR,
          "Please select a valid assignee",
          logDetails
        )
      );
    }

    let payload = {
      assignee: selectedAssignee[selectedSubCheck?.id],
      subCheckInternalStatusId: internalStatusDropdown[selectedSubCheck?.id],
      subCheckVerificationResultStatusId:
        riskLevelDropdown[selectedSubCheck?.id] || null,
      checkSummary: formRef.current?.values?.checkSummary || null,
      checkResult: formRef.current?.values?.checkResult || null,
    };

    pdfFieldsArr?.forEach((curr) => {
      if (curr?.display) {
        payload = {
          ...payload,
          [curr?.field]:
            curr?.field === "dateOfSearch"
              ? removeTimeFromDate(formRef.current?.values[curr?.field]) || null
              : formRef.current?.values[curr?.field] || null,
        };
      }
    });

    //after update call , making update btn disabled again
    setDisableBtn(() => true);

    dispatch(
      updateSubCheckData(
        payload,
        rowData.candidatesChecksMappingId,
        selectedSubCheck?.id,
        +searchParams.get("candidatesCasesId"),
        initializeDropdownValues,
        logDetails
      )
    );
  };

  return (
    <Formik
      key={selectedSubCheck?.id}
      enableReinitialize
      initialValues={pdfFieldsInitialValues}
      innerRef={formRef}
    >
      {(form) => (
        <Form>
          <Box
            display="flex"
            alignItems="flex-start"
            p={2}
            gap={1}
            position="relative"
          >
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexDirection="column"
              gap={1}
              flexGrow={1}
            >
              {" "}
              {/*internal status - check status - check results */}
              <Box display="flex" alignItems="center" width="100%" pl={1}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography
                    fontWeight={550}
                    textTransform="capitalize"
                    letterSpacing="1px"
                    textAlign="center"
                    mb={1}
                    fontSize="12px"
                  >
                    internal status
                  </Typography>
                  <CheckStatusDropdown
                    id={selectedSubCheck?.id}
                    options={checkInternalStatusLists}
                    optionLabel="checkInternalStatusName"
                    optionId="id"
                    defaultValue={internalStatusDropdown[selectedSubCheck?.id]}
                    setDisableBtn={setDisableBtn}
                    setDropdownVal={setInternalStatusDropdown}
                    updateCheckSummary={(id) => {
                      let foundCheck = checkInternalStatusLists?.find(
                        (curr) => curr.id === id
                      );

                      form?.setFieldValue(
                        "checkSummary",
                        foundCheck?.checkStatusName
                      );
                    }}
                    updateDisableStateDirectly={true}
                  />
                </Box>
                <Box mt={1} flexGrow={1}>
                  <Typography
                    fontWeight={550}
                    textTransform="capitalize"
                    letterSpacing="1px"
                    textAlign="center"
                    mb={1}
                    fontSize="12px"
                  >
                    check status
                  </Typography>
                  {checkInternalStatusLists && (
                    <DisplayChip
                      key={selectedSubCheck?.id}
                      id={selectedSubCheck?.id}
                      rowData={selectedSubCheck}
                      checkStatusDropdown={internalStatusDropdown}
                      checkInternalStatusLists={checkInternalStatusLists}
                    />
                  )}
                </Box>

                <Box ml={1.5} flexGrow={1}>
                  <Typography
                    fontWeight={550}
                    textTransform="capitalize"
                    letterSpacing="1px"
                    textAlign="center"
                    mb={1}
                    fontSize="12px"
                  >
                    Check Results
                  </Typography>
                  <FastField
                    component={TextField}
                    value={form?.values?.checkResult}
                    type="text"
                    size="small"
                    fullWidth
                    InputProps={{
                      sx: {
                        height: "32px",
                      },
                    }}
                    variant="outlined"
                    onChange={(e) => {
                      setDisableBtn(() => false);
                      form?.setFieldValue("checkResult", e.target.value);
                    }}
                  />
                </Box>
              </Box>
              {/*risk level - check summary */}
              <Box display="flex" alignItems="center" width="100%">
                <Box>
                  <Typography
                    fontWeight={550}
                    textTransform="capitalize"
                    letterSpacing="1px"
                    textAlign="center"
                    mb={1}
                    fontSize="12px"
                  >
                    risk level
                  </Typography>
                  <DropdownComponent
                    id={selectedSubCheck?.id}
                    options={verificationResultStatusData}
                    optionLabel="verificationResultStatusName"
                    optionId="candidatesVerificationResultStatusId"
                    defaultValue={riskLevelDropdown[selectedSubCheck?.id]}
                    placeholderText="Select Risk"
                    setDisableBtn={setDisableBtn}
                    setDropdownVal={setRiskLevelDropdown}
                    displayIcon={true}
                    updateDisableStateDirectly={true}
                  />
                </Box>
                {rowData?.checkTypeName !== "Verification" ? (
                  <Box ml={1.5} width="100%">
                    <Typography
                      fontWeight={550}
                      textTransform="capitalize"
                      letterSpacing="1px"
                      textAlign="center"
                      mb={1}
                      fontSize="12px"
                    >
                      Check Summary
                    </Typography>
                    <FastField
                      component={TextField}
                      value={form?.values?.checkSummary}
                      type="text"
                      size="small"
                      fullWidth
                      InputProps={{
                        sx: {
                          height: "32px",
                        },
                      }}
                      variant="outlined"
                      onChange={(e) => {
                        setDisableBtn(() => false);
                        form?.setFieldValue("checkSummary", e.target.value);
                      }}
                    />
                  </Box>
                ) : null}
              </Box>
              {/*date of search - source - entity name */}
              <Box display="flex" alignItems="center" width="100%" pl={1}>
                {pdfFieldsArr?.map((pdfField) =>
                  pdfField?.display ? (
                    <Box
                      width={
                        pdfField?.field === "dateOfSearch" ? "auto" : "100%"
                      }
                      mr={pdfField?.field === "dateOfSearch" ? 2 : 0}
                    >
                      <Typography
                        fontWeight={550}
                        textTransform="capitalize"
                        letterSpacing="1px"
                        textAlign="center"
                        mb={1}
                        fontSize="12px"
                      >
                        {pdfField?.label}
                      </Typography>
                      {pdfField?.field === "dateOfSearch" ? (
                        <FastField
                          component={BaseDatePicker}
                          name="dateOfSearch"
                          label=""
                          views={["year", "month", "day"]}
                          placeholder="DD-MMM-YYYY"
                          inputFormat="dd-MMM-yyyy"
                          value={form?.values[pdfField?.field] || ""}
                          runCustom={() => setDisableBtn(() => false)}
                        />
                      ) : (
                        <FastField
                          component={TextField}
                          value={form?.values[pdfField?.field] || ""}
                          type="text"
                          size="small"
                          fullWidth
                          InputProps={{
                            sx: {
                              height: "32px",
                            },
                          }}
                          variant="outlined"
                          onChange={(e) => {
                            setDisableBtn(() => false);
                            form?.setFieldValue(
                              pdfField?.field,
                              e.target.value
                            );
                          }}
                        />
                      )}
                    </Box>
                  ) : null
                )}
              </Box>
            </Box>
            {/*assignee , update buttons */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={1}
              width="15%"
            >
              <Box>
                <Typography
                  fontWeight={550}
                  textTransform="capitalize"
                  letterSpacing="1px"
                  textAlign="center"
                  fontSize="12px"
                  mb={1}
                >
                  Assignee
                </Typography>
                <DropdownComponent
                  id={selectedSubCheck?.id}
                  options={OpsUserBySubRoleIds}
                  optionLabel="assigneeName"
                  optionId="assignee"
                  defaultValue={selectedAssignee[selectedSubCheck?.id]}
                  setDisableBtn={setDisableBtn}
                  setDropdownVal={setSelectedAssignee}
                  toDisableDropdown={
                    !checkActionPermission(
                      permissionKey.opsAssigneUser,
                      permissions
                    )
                  }
                  fullWidth={true}
                  updateDisableStateDirectly={true}
                />
              </Box>
              <Box
                position="absolute"
                bottom={0}
                pb={rowData?.checkTypeName === "Verification" ? 2 : 3}
              >
                <Typography
                  fontWeight={550}
                  textTransform="capitalize"
                  letterSpacing="1px"
                  fontSize="12px"
                  textAlign="center"
                >
                  action
                </Typography>
                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexWrap="wrap"
                  gap="5px"
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={disableBtn}
                  >
                    Update
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      form.resetForm();
                      initializeDropdownValues();
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateActionComponent;
