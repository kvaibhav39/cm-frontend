import { Box, Typography, Grid, Button, Divider } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import { verifierDetailsSchema } from "./helper/verifierDetailsSchema";
import { YesNoField } from "../../../../../../../../../common/Form/YesNoField/YesNoField";
import { PhoneNumberTextField } from "../../../../../../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import { BaseDatePicker, BaseTextField } from "../../../../../../../../base";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { removeTimeFromDate } from "../../../../../../../../Candidate/utils/removeTimeFromDate";
import { isEqual } from "lodash";
import { updateVerifierData } from "../../../../../../../../../store/actions/operationActions";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../utils/getCurrentFileNameAndFunction";

const VerifierDetails = () => {
  const dispatch = useDispatch();
  const [searchParams, _] = useSearchParams();

  const {
    subChecksListForVerifierSection,
    selectedSubCheckId,
    OpsCandidateCaseChecksList,
    selectedCheckId,
  } = useSelector((state) => state.operations);

  let selectedSubCheck = useMemo(() => {
    return subChecksListForVerifierSection?.find(
      (curr) => curr.id === selectedSubCheckId
    );
  }, [subChecksListForVerifierSection, selectedSubCheckId]);

  let rowData = useMemo(() => {
    return OpsCandidateCaseChecksList?.find(
      (curr) => curr?.candidatesChecksMappingId === selectedCheckId
    );
  }, [OpsCandidateCaseChecksList, selectedCheckId]);

  let verifierDetailsInitialValues = useMemo(() => {
    let temp = {
      isVerifierAPersonOr3rdParty: true,
      verifierName: "",
      verifierTitle: "",
      verifierContactDetails: "",
      dateOfVerification: "",
      verifierParty: "",
    };
    if (selectedSubCheck) {
      let { isVerifierAPersonOr3rdParty, verifierDetails } = selectedSubCheck;

      if (
        (isVerifierAPersonOr3rdParty &&
          verifierDetails?.verifierName &&
          verifierDetails?.verifierTitle &&
          verifierDetails?.verifierContactDetails &&
          verifierDetails?.dateOfVerification) ||
        (!isVerifierAPersonOr3rdParty &&
          verifierDetails?.dateOfVerification &&
          verifierDetails?.verifierParty)
      ) {
        temp = {
          isVerifierAPersonOr3rdParty: isVerifierAPersonOr3rdParty ?? true,
          verifierName: verifierDetails?.verifierName || "",
          verifierTitle: verifierDetails?.verifierTitle || "",
          verifierContactDetails: verifierDetails?.verifierContactDetails || "",
          dateOfVerification: verifierDetails?.dateOfVerification || null,
          verifierParty: verifierDetails?.verifierParty || "",
        };
      }
    }

    return temp;
  }, [selectedSubCheck]);

  const handleSubmit = (values, form) => {
    let {
      isVerifierAPersonOr3rdParty,
      verifierName,
      verifierTitle,
      verifierContactDetails,
      dateOfVerification,
      verifierParty,
    } = values;

    let verifierDetails = {
      dateOfVerification: removeTimeFromDate(dateOfVerification),
    };

    if (
      isVerifierAPersonOr3rdParty &&
      verifierName &&
      verifierTitle &&
      verifierContactDetails &&
      dateOfVerification
    ) {
      verifierDetails = {
        ...verifierDetails,
        verifierName,
        verifierTitle,
        verifierContactDetails,
      };
    } else if (
      !isVerifierAPersonOr3rdParty &&
      dateOfVerification &&
      verifierParty
    ) {
      verifierDetails = {
        ...verifierDetails,
        verifierParty,
      };
    }

    let payload = {
      isVerifierAPersonOr3rdParty,
      verifierDetails,
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(
      updateVerifierData(
        payload,
        rowData.candidatesChecksMappingId,
        selectedSubCheckId,
        +searchParams.get("candidatesCasesId"),
        logDetails
      )
    );
  };

  return (
    <>
      {rowData?.checkTypeName === "Verification" ? (
        <>
          <Divider
            sx={{
              width: "95%",
              margin: "10px auto",
              color: "#000",
              height: "4px",
            }}
          />
          <Box px={2} py={1} gap={1}>
            <Formik
              enableReinitialize
              initialValues={verifierDetailsInitialValues}
              validationSchema={verifierDetailsSchema}
              onSubmit={handleSubmit}
            >
              {({ values, resetForm, isSubmitting, setSubmitting }) => {
                useEffect(() => {
                  if (isEqual(values, verifierDetailsInitialValues)) {
                    setSubmitting(false);
                  } else {
                    setSubmitting(true);
                  }
                }, [values]);
                return (
                  <Form>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center">
                        <Typography
                          variant="h5"
                          gutterBottom
                          textTransform="capitalize"
                          mr={1}
                          sx={{ marginTop: "5px" }}
                        >
                          Is the verifier a person or 3rd party/DB?
                        </Typography>

                        <FastField
                          name="isVerifierAPersonOr3rdParty"
                          component={YesNoField}
                        />
                      </Box>
                      <Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexWrap="wrap"
                          gap="5px"
                        >
                          <Button
                            variant="contained"
                            disabled={!isSubmitting}
                            type="submit"
                          >
                            Update
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => resetForm()}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                    <Grid container xs={12} gap={1} alignItems="center">
                      {values?.isVerifierAPersonOr3rdParty ? (
                        <>
                          <Grid item xs={2.9}>
                            <FastField
                              component={BaseTextField}
                              name="verifierName"
                              label="Verifier Name*"
                            />
                          </Grid>
                          <Grid item xs={2.9}>
                            <FastField
                              component={BaseTextField}
                              name="verifierTitle"
                              label="Verifier Title*"
                            />
                          </Grid>
                          <Grid item xs={2.9}>
                            <Typography
                              varient="h6"
                              sx={{ marginBottom: "4px" }}
                            >
                              Verifier Phone Number*
                            </Typography>
                            <FastField
                              name="verifierContactDetails"
                              component={PhoneNumberTextField}
                              className="round_phone"
                            />
                          </Grid>
                        </>
                      ) : (
                        <Grid item xs={2.9}>
                          <FastField
                            component={BaseTextField}
                            name="verifierParty"
                            label="Verifier Party*"
                          />
                        </Grid>
                      )}
                      <Grid item xs={2.9}>
                        <FastField
                          component={BaseDatePicker}
                          label="Date of Verification*"
                          presentBtn
                          views={["year", "month", "day"]}
                          placeholder="DD-MMM-YYYY"
                          inputFormat="dd-MMM-yyyy"
                          name="dateOfVerification"
                        />
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </>
      ) : null}
    </>
  );
};

export default VerifierDetails;
