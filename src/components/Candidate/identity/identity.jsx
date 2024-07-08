import { Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FastField, Field, Form, Formik, setNestedObjectValues } from "formik";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { BaseCountrySelect, BaseSelect, BaseTextField } from "../../base";
import { omit } from "lodash";
import { StyledBasePaper } from "../../base/styled";
import { newIdentity } from "../helpers/initialState/identity";
import { identityValidationSchema } from "../helpers/validationSchema/identity";
import { getSectionData } from "../utils/getSectionData";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
  IDENTITY_DETAILS,
} from "../../../store/actions/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import {
  getIdentityData,
  getSupportDocumentsByCountry,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import { useEffect, useRef } from "react";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import CircularLoader from "../../../common/CircularLoader";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import IdentityDocumentsUpload from "./components/IdentityDocumentsUpload";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateIdentityPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toCacheValues = useRef();
  const identityForm = useRef();

  const {
    loading,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    identityData,
    candidateSectionLoading,
    identityDocumentTypeLists,
  } = useSelector((state) => state.candidate);

  const { allCountries } = useSelector((state) => state.helper);

  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const identityDataRef = useRef();
  identityDataRef.current = identityData;

  useEffect(() => {
    
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getIdentityData(logDetails));
  }, []);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "IDENTITY_DETAILS",
      candidateProfileSections,
      allowProfileEdit
    );

    //passing back url for the back btn present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_BACK_URL,
      payload: data?.urls?.backUrl,
    });

    return data;
  }, [candidateProfileSections]);

  const identityDetails = useMemo(() => {
    if (!identityData)
      return (
        (candidateCachedDetails &&
          candidateCachedDetails["IDENTITY_DETAILS"]) ||
        newIdentity()
      );

    return identityData;
  }, [identityData, candidateCachedDetails]);

  useEffect(() => {
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () => {
        handleSubmit(identityForm?.current?.values, identityForm?.current);
      },
    });

    return () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      dispatch({
        type: IDENTITY_DETAILS,
        payload: null,
      });

      //caching when dismounts
      if (!identityDataRef.current && toCacheValues.current) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );
        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            toCacheValues.current,
            "IDENTITY_DETAILS"
          )
        );
      }
    };
  }, []);

  useEffect(() => {
    if (identityDetails?.primaryNationalityId && allCountries) {
      let selectedCountryIso = allCountries?.find(
        (curr) =>
          curr?.countryMasterId === identityDetails?.primaryNationalityId
      )?.iso3;

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getSupportDocumentsByCountry(selectedCountryIso, logDetails));
    }
  }, [identityDetails, allCountries]);

  const handleSubmit = async (values, form) => {
    try {
      //we cannot make next btn in candidate nav section as type submit because it is not wrapped in formik form
      //so that's why to validate the form on onClick we have added validateForm()
      const validationErrors = await form.validateForm();

      //to stop the api call when there are errors , we will simply return
      if (Object.keys(validationErrors)?.length) {
        //since we are submitting our form on 'onClick' event on next btn fields wont get touched
        //so we have to explicitly touch them so that validation error msgs below fields can get displayed
        //and this can be achieved by using 'setTouched' &  'setNestedObjectValues' which is provided by formik
        return form.setTouched(setNestedObjectValues(validationErrors, true));
      }

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      if (
        values?.identityDocumentType &&
        values?.identityDocumentNumber &&
        !values?.identityAttachments?.length
      ) {
        return dispatch(
          setToastNotification(
            ERROR,
            "Please upload both the front and back side of the document",
            logDetails
          )
        );
      }

      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      let finalData = omit(values, [
        "candidatesIdentityDetailsId",
        "candidateId",
        "primaryNationalityName",
        "residenceCountryName",
        "birthCountryName",
        "identityDocumentTypeLists",
      ]);

      if (!values?.identityDocumentType) {
        finalData = omit(finalData, [
          "identityDocumentType",
          "identityDocumentNumber",
          "identityAttachments",
        ]);
      }

      finalData = {
        ...finalData,
        identityAttachments: finalData?.identityAttachments?.map((curr) =>
          omit(curr, ["status"])
        ),
      };

      dispatch(
        submitCandidateDetails(
          {
            IDENTITY_DETAILS: finalData,
          },
          "identity-details",
          () => {
            toCacheValues.current = {};
            navigate(sectionData?.urls.nextUrl);
          },
          sectionData?.section?.onHold,
          sectionData?.section?.candidatesProfileSectionsId,
          navigate,
          logDetails
        )
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const runWhenPrimaryNationalityGetsSelected = (
    form,
    primaryNationalityId
  ) => {
    let selectedCountryIso = allCountries?.find(
      (curr) => curr?.countryMasterId === primaryNationalityId
    )?.iso3;

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "runWhenPrimaryNationalityGetsSelected"
    );

    dispatch(getSupportDocumentsByCountry(selectedCountryIso, logDetails));

    form.setFieldValue("identityDocumentType", "");
    form.setFieldValue("identityDocumentNumber", "");
    form.setFieldValue("identityAttachments", []);
    form.setTouched(setNestedObjectValues(form.values, false));
  };

  // console.log('00000',identityDocumentTypeLists)

  return (
    <Fragment>
      {!loading && !candidateSectionLoading && identityDetails ? (
        <StyledBasePaper>
          <Formik
            enableReinitialize
            initialValues={identityDetails}
            validationSchema={() =>
              identityValidationSchema(identityDocumentTypeLists)
            }
            innerRef={identityForm}
          >
            {(form) => {
              toCacheValues.current = form.values;
              return (
                <>
                  <Box mb={2}>
                    {!identityData ? (
                      <AlertMessageComponent
                        cond={() => {
                          return !identityData;
                        }}
                        CONSTANT="IDENTITY_DETAILS"
                        toCacheValues={toCacheValues.current}
                        sectionDetails={identityData}
                      />
                    ) : null}
                  </Box>
                  <DisplaySectionHeading
                    icon={sectionData?.section?.sectionIcon}
                    text={`${sectionData?.section?.candidateRequiredInfoText}.`}
                  />
                  <Box mb={4}>
                    <Card
                      sx={{
                        backgroundColor: (theme) => theme.palette.grey[150],
                        borderRadius: "12px",
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <Typography
                            fontSize="1rem"
                            fontWeight="500"
                            marginLeft="0.5rem"
                            marginTop="0.5rem"
                          >
                            You will be receiving a email from our side to
                            complete your Identity verificaton. Thank You!
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                    {apiErrorMsg && (
                      <Typography
                        mt={2}
                        color="error"
                        style={{ textTransform: "capitalize" }}
                      >
                        {apiErrorMsg}*
                      </Typography>
                    )}
                  </Box>

                  <Form>
                    <Card variant="outlined" sx={{ borderRadius: "12px" }}>
                      <Box p={{ xs: 2, md: 4, lg: 5 }}>
                        <Box
                          display="flex"
                          alignItems={{ md: "center" }}
                          justifyContent={{ md: "space-between" }}
                          flexDirection={{ xs: "column", md: "row" }}
                        >
                          <Typography
                            component="label"
                            htmlFor="primaryNationalityId"
                            mr={{ md: 4 }}
                            mb={{ xs: 2, md: 0 }}
                            fontSize={16}
                            fontWeight={500}
                          >
                            Primary Nationality*
                          </Typography>

                          <Box flex={1} maxWidth={{ md: "300px" }}>
                            <Field
                              id="primaryNationalityId"
                              component={BaseCountrySelect}
                              name="primaryNationalityId"
                              runWhenSelect={(val) =>
                                runWhenPrimaryNationalityGetsSelected(form, val)
                              }
                            />
                          </Box>
                        </Box>
                        <Box
                          mt={4}
                          display="flex"
                          alignItems={{ md: "center" }}
                          justifyContent={{ md: "space-between" }}
                          flexDirection={{ xs: "column", md: "row" }}
                        >
                          <Typography
                            component="label"
                            htmlFor="residenceCountryId"
                            mr={{ md: 4 }}
                            mb={{ xs: 2, md: 0 }}
                            fontSize={16}
                            fontWeight={500}
                          >
                            Primary Permanent Residency Country*
                          </Typography>
                          <Box flex={1} maxWidth={{ md: "300px" }}>
                            <FastField
                              id="residenceCountryId"
                              component={BaseCountrySelect}
                              name="residenceCountryId"
                            />
                          </Box>
                        </Box>
                        <Box
                          mt={4}
                          display="flex"
                          alignItems={{ md: "center" }}
                          justifyContent={{ md: "space-between" }}
                          flexDirection={{ xs: "column", md: "row" }}
                        >
                          <Typography
                            component="label"
                            htmlFor="birthCountryId"
                            mr={{ md: 4 }}
                            mb={{ xs: 2, md: 0 }}
                            fontSize={16}
                            fontWeight={500}
                          >
                            Country of Birth*
                          </Typography>
                          <Box flex={1} maxWidth={{ md: "300px" }}>
                            <FastField
                              id="birthCountryId"
                              component={BaseCountrySelect}
                              name="birthCountryId"
                            />
                          </Box>
                        </Box>
                        {identityDocumentTypeLists?.length ? (
                          <>
                            <Box
                              mt={4}
                              display="flex"
                              alignItems={{ md: "center" }}
                              justifyContent={{ md: "space-between" }}
                              flexDirection={{ xs: "column", md: "row" }}
                            >
                              <Typography
                                component="label"
                                htmlFor="documentTypeId"
                                mr={{ md: 4 }}
                                mb={{ xs: 2, md: 0 }}
                                fontSize={16}
                                fontWeight={500}
                              >
                                Identity Document Type
                              </Typography>
                              <Box
                                flex={1}
                                maxWidth={{ md: "300px" }}
                                mt={{ xs: 4, md: 0 }}
                              >
                                <Field
                                  component={BaseSelect}
                                  name="identityDocumentType"
                                  label="Select document type*"
                                  optionLabel="type"
                                  optionValue="type"
                                  options={identityDocumentTypeLists}
                                />
                              </Box>
                              <Box
                                flex={1}
                                maxWidth={{ md: "300px" }}
                                mt={{ xs: 4, md: 0 }}
                              >
                                <FastField
                                  component={BaseTextField}
                                  name="identityDocumentNumber"
                                  label="Input your identity document number*"
                                />
                              </Box>
                            </Box>
                            {form.values?.identityDocumentType ? (
                              <Box mt={4}>
                                <DisplaySectionHeading
                                  icon="AddLinkOutlined"
                                  text="Please upload your identity document (front and back side). Please upload the biopage for passport."
                                />
                                <IdentityDocumentsUpload form={form} />
                              </Box>
                            ) : null}
                          </>
                        ) : identityDocumentTypeLists === null ? (
                          <CircularLoader height="10vh" size={30} />
                        ) : null}
                      </Box>
                    </Card>
                  </Form>
                </>
              );
            }}
          </Formik>
        </StyledBasePaper>
      ) : (
        <CircularLoader />
      )}
    </Fragment>
  );
};

export { CandidateIdentityPage };
