import React, { useRef, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";
import { ERROR } from "../../store/constant";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { useDispatch, useSelector } from "react-redux";
import { read, utils } from "xlsx";
import { Form, Formik } from "formik";
import {
  addMultipleCandidates,
  getFailedToRegisterCandidates,
} from "../../store/actions/hrActions";
import { MultipleCandidateInitialValues } from "../Candidates/helper/InitialState/MultipleCandidates";
import { MultipleCandidatesSchema } from "../Candidates/helper/ValidationSchema/MultipleCandidates";
import { getFileNameWithEllipsis } from "../../utils/getFileNameWithEllipsis";
import { useSearchParams } from "react-router-dom";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

const BaseMultipleCandidatesUpload = ({
  id,
  theme,
  setExcelDataFailedToUpload,
  addCustomFieldsDataInColumns,
  addCustomFieldsInsideArray,
  updateFailedDataModal,
  resetOpsCandidatesTableFilters = () => {},
}) => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { failedToRegisterCandidatesLists } = useSelector((state) => state.hr);
  const dispatch = useDispatch();

  //continously making api call to get latest data
  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    const interval = setInterval(() => {
      if (!updateFailedDataModal) {
        dispatch(getFailedToRegisterCandidates(logDetails));
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [updateFailedDataModal]);

  //setting failed data coming from api to table
  useEffect(() => {
    if (failedToRegisterCandidatesLists) {
      addCustomFieldsDataInColumns(failedToRegisterCandidatesLists);

      setExcelDataFailedToUpload(
        (prev) => (prev = failedToRegisterCandidatesLists)
      );
    }
  }, [failedToRegisterCandidatesLists]);

  const handleFileUpload = (e, setValues) => {
    let uploadedFile = e.target.files[0];
    setErrors([]);
    if (
      uploadedFile?.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      uploadedFile?.type === "application/excel" ||
      uploadedFile?.type === "application/vnd.ms-excel" ||
      uploadedFile?.type === "application/x-excel" ||
      uploadedFile?.type === "application/x-msexcel"
    ) {
      setFile(uploadedFile);

      //reading excel sheet and converting it into array of objects
      var reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let finalArr = addCustomFieldsInsideArray(
          utils.sheet_to_json(worksheet)
        );
        setValues(finalArr);
      };

      reader.readAsArrayBuffer(uploadedFile);
    } else if (uploadedFile) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleFileUpload"
      );
      return dispatch(
        setToastNotification(ERROR, "Please Upload an Excel File", logDetails)
      );
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setErrors([]);
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleRegister = (values, form) => {
    let errors = [];

    let tempValues = values?.map((value, index) => {
      let ifCountryPresent = value?.customFields?.find(
        (curr) => curr?.jurisdictionCountries
      )?.jurisdictionCountries;

      let ifYearsPresent = value?.customFields?.find(
        (curr) => curr?.noOfYearsForAdditionalJuridictionSearch
      )?.noOfYearsForAdditionalJuridictionSearch;

      value.additionalChecks = ifYearsPresent
        ? [
            {
              checksId: 25,
              checkScope: {
                allJurisdictionSearch: ifCountryPresent ? false : true,
                noOfYearsForAdditionalJuridictionSearch: ifYearsPresent || 1,
                jurisdictionCountries: ifCountryPresent || "",
              },
            },
          ]
        : [];

      value.customFields = value?.customFields?.filter(
        (curr) =>
          !(
            curr?.jurisdictionCountries ||
            curr?.noOfYearsForAdditionalJuridictionSearch
          )
      );

      return { ...value };
    });

    for (let index in form.errors) {
      let fields = [
        "candidateName",
        "candidateEmail",
        "candidatePhone",
        "hiringCountryName",
        "hrTeamName",
        "packageName",
      ];

      fields?.forEach((field) => {
        if (form.errors[index][field]) {
          errors.push(
            `Candidate ${+index + 1} -  ${form.errors[index][field]}`
          );
        }
      });
    }

    if (errors?.length) {
      return setErrors(errors);
    } else {
      setErrors([]);
      

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleRegister"
      );

      dispatch(addMultipleCandidates(tempValues, logDetails,resetOpsCandidatesTableFilters));
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={MultipleCandidateInitialValues}
      validationSchema={MultipleCandidatesSchema}
    >
      {(form) => (
        <Form>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box
              mx={4}
              display="flex"
              alignItems="center"
              flexDirection={{ xs: "column", md: "row" }}
            >
              <input
                ref={fileInputRef}
                name={id}
                id={id}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  handleFileUpload(e, form.setValues);
                }}
              />
              <label htmlFor={id}>
                <Button color="primary" variant="outlined" component="span">
                  Upload file
                </Button>
              </label>
              {file && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  ml={2}
                >
                  <Typography mr={1}>
                    {getFileNameWithEllipsis(file.name)}
                  </Typography>

                  <DeleteOutlineOutlinedIcon
                    style={{ cursor: "pointer" }}
                    sx={{ color: theme.palette.error.main }}
                    onClick={handleFileRemove}
                  />
                </Box>
              )}
            </Box>
            <Box mt={{ xs: 1, md: 0 }}>
              <Button
                variant="contained"
                size="small"
                disableElevation
                disabled={!file}
                onClick={() => handleRegister(form.values, form)}
              >
                Register
              </Button>
            </Box>
          </Box>
          {errors?.length ? (
            <Box
              p={1}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              maxHeight={300}
              overflow="auto"
            >
              {errors?.map((error) => (
                <Box py={1}>
                  <Alert
                    sx={{
                      width: "100%",
                      color: "#5f2120",
                      whiteSpace: "pre-line",
                    }}
                    severity="error"
                  >
                    {error}
                  </Alert>
                </Box>
              ))}
            </Box>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};

export default BaseMultipleCandidatesUpload;
