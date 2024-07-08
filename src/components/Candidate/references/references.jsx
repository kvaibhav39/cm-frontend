import { Fragment } from "react";
import { useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FastField, Form, Formik, setNestedObjectValues } from "formik";
import { Box, Divider, Typography } from "@mui/material";
import { BaseTextField, BaseQuantity } from "../../base";
import { StyledBasePaper } from "../../base/styled";
import { get, omit } from "lodash";
import { newReference } from "../helpers/initialState/refrences";
import { referenceValidationSchema } from "../helpers/validationSchema/refrences";
import { getSectionData } from "../utils/getSectionData";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
} from "../../../store/actions/actionTypes";
import {
  getCandidateProfessionalRelationsTypes,
  getProfessionalReferenceData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import CircularLoader from "../../../common/CircularLoader";
import DisplayErrorsForMultipleFields from "../common/DisplayErrorsForMultipleFields";
import DisplaySectionListsForMultipleFields from "../common/DisplaySectionListsForMultipleFields";
import DisplayAddBtnForMultipleFields from "../common/DisplayAddBtnForMultipleFields";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import CandidateMultipleFieldsSectionLayout from "../common/CandidateMultipleFieldsSectionLayout";
import ProfessionalReferencesFormDetails from "./components/ProfessionalReferencesFormDetails";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateProfileReferencesPage = () => {
  const navigate = useNavigate();
  const referenceForm = useRef();
  const toCacheValues = useRef();
  const dispatch = useDispatch();

  const {
    loading,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    professionalReferenceData,
    candidateSectionLoading,
    professionalRelationsTypes,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const professionalReferenceDataRef = useRef();
  professionalReferenceDataRef.current = professionalReferenceData;

  const pushNewReference = useRef();
  const sectionDataRef = useRef();

  let candidateCacheDetailsForComponent =
    candidateCachedDetails && candidateCachedDetails["PROFESSIONAL_REFERENCE"];

  useEffect(() => {

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getProfessionalReferenceData(logDetails));
    !professionalRelationsTypes &&
      dispatch(getCandidateProfessionalRelationsTypes(logDetails));
  }, []);

  const initialValues = useMemo(() => {
    if (professionalReferenceData) {
      let tempReferences = get(
        professionalReferenceData,
        "0.referencedetails",
        candidateCacheDetailsForComponent?.references || [newReference()]
      );

      if (tempReferences) {
        tempReferences = tempReferences.map((curr, index) => {
          return {
            ...curr,
            selectedTab: index === 0,
          };
        });
      }

      return {
        references: tempReferences,
        reasonForLessNoOfReference: get(
          professionalReferenceData,
          "0.reasonForLessNoOfReference",
          candidateCacheDetailsForComponent?.reasonForLessNoOfReference || ""
        ),
        noOfProfessionalReference: get(
          professionalReferenceData,
          "0.noOfProfessionalReference",
          candidateCacheDetailsForComponent?.noOfProfessionalReference || 1
        ),
      };
    } else {
      return undefined;
    }
  }, [professionalReferenceData, candidateCachedDetails]);

  useEffect(() => {
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () => {
        handleSubmit(referenceForm?.current?.values, referenceForm?.current);
      },
    });

    return () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      // dispatch({
      //   type: PROFESSIONAL_REFERENCE,
      //   payload: [],
      // });

      //caching when dismounts
      if (
        (!professionalReferenceDataRef.current ||
          !professionalReferenceDataRef.current?.length ||
          !professionalReferenceDataRef.current[0]?.referencedetails?.length) &&
        toCacheValues.current
      ) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );
        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            toCacheValues.current,
            "PROFESSIONAL_REFERENCE"
          )
        );
      }
    };
  }, []);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "PROFESSIONAL_REFERENCE",
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

  useEffect(() => {
    sectionDataRef.current = sectionData;
  }, [
    sectionData,
    candidateProfileSections,
    professionalReferenceData,
    initialValues,
  ]);

  const handleSubmit = async (values, form) => {
    try {
      //we cannot make next btn in candidate nav section as type submit because it is not wrapped in formik form
      //so that's why to validate the form on onClick we have added validateForm()
      const validationErrors = await form?.validateForm();

      //to stop the api call when there are errors , we will simply return
      if (Object.keys(validationErrors)?.length) {
        //since we are submitting our form on 'onClick' event on next btn fields wont get touched
        //so we have to explicitly touch them so that validation error msgs below fields can get displayed
        //and this can be achieved by using 'setTouched' &  'setNestedObjectValues' which is provided by formik
        return form?.setTouched(setNestedObjectValues(validationErrors, true));
      }

      let submitValues = { ...values };
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      if (values?.references.length === 0) {
        return dispatch(
          setToastNotification(
            ERROR,
            "Please fill all the required fields",
            logDetails
          )
        );
      }

      //to check if count selected by user is equal to that of references provided
      if (values?.noOfProfessionalReference !== values?.references.length) {
        form?.resetForm({ values: submitValues });

        dispatch(
          setToastNotification(
            ERROR,
            "References count does not match with the number of references provided.",
            logDetails
          )
        );
        return;
      }

      //to check for unique emails for multiple references
      const dup = _.uniqBy(values.references, (obj) => obj.email);

      if (dup.length !== values.references.length) {
        form?.resetForm({ values: submitValues });

        dispatch(
          setToastNotification(
            ERROR,
            "Please provide unique email addresses!",
            logDetails
          )
        );
        return;
      }

      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      dispatch(
        submitCandidateDetails(
          {
            PROFESSIONAL_REFERENCE: {
              noOfProfessionalReference: values?.noOfProfessionalReference || 1, //
              reasonForLessNoOfReference:
                values?.noOfProfessionalReference <
                sectionDataRef.current?.section?.validationScope?.minNoOfRefrees
                  ? values.reasonForLessNoOfReference
                  : "",
              candidateProfessionalReferenceDetails: values.references.map(
                (ref) => {
                  return omit(ref, [
                    "candidateProfessionalReferenceId",
                    "candidatesProfessionalReferencesDetailsId",
                    "isExpanded",
                    "professionalRelationshipName",
                    "countryName",
                    "selectedTab",
                  ]);
                }
              ),
            },
          },
          "professional-reference",
          () => {
            toCacheValues.current = [];
            navigate(sectionDataRef.current?.urls.nextUrl);
          },
          sectionDataRef.current?.section?.onHold,
          sectionDataRef.current?.section?.candidatesProfileSectionsId,
          navigate,
          logDetails
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {!loading &&
      !candidateSectionLoading &&
      professionalReferenceData &&
      professionalRelationsTypes &&
      initialValues ? (
        <StyledBasePaper>
          <Formik
            initialValues={initialValues}
            validationSchema={() =>
              referenceValidationSchema(
                referenceForm.current?.values?.noOfProfessionalReference,
                sectionDataRef.current?.section?.validationScope
                  ?.minNoOfRefrees,
                referenceForm.current?.values?.reasonForLessNoOfReference
              )
            }
            // onSubmit={handleSubmit}
            innerRef={referenceForm}
            // enableReinitialize
          >
            {(form) => {
              toCacheValues.current = { ...form.values };
              return (
                <Form>
                  <CandidateMultipleFieldsSectionLayout
                    formHeadingComponent={
                      <>
                        <DisplaySectionHeading
                          icon={sectionData?.section?.sectionIcon}
                          text={sectionData?.section?.candidateRequiredInfoText}
                        />

                        <DisplayErrorsForMultipleFields
                          errors={form.errors.references}
                          touched={form.touched.references}
                          section="Professional Reference"
                          apiErrorMsg={apiErrorMsg}
                        />

                        <Typography
                          my={2}
                          fontSize="1rem"
                          fontWeight="800"
                          color={(theme) => theme.palette.grey[700]}
                          display="flex"
                          alignItems="center"
                          flexDirection={{ xs: "column", sm: "row" }}
                          sx={{ mx: 2 }}
                          textAlign="center"
                        >
                          I can provide{" "}
                          <FastField
                            sx={{ mx: 2, my: 1 }}
                            component={BaseQuantity}
                            name="noOfProfessionalReference"
                            max={
                              sectionData?.section?.validationScope
                                ?.minNoOfRefrees
                            }
                          />{" "}
                          contact details as my Professional Reference(s).
                        </Typography>

                        {/*will render the text area only when the reference count is less than minNoOfRefrees*/}
                        {form?.values?.noOfProfessionalReference <
                          sectionData?.section?.validationScope
                            ?.minNoOfRefrees && (
                          <FastField
                            component={BaseTextField}
                            rows={3}
                            multiline
                            name="reasonForLessNoOfReference"
                            placeholder="Please mention why you cannot provide requested no of references (within 250 words)"
                          />
                        )}
                      </>
                    }
                    formListsComponent={
                      <>
                        {/*reference lists */}
                        <DisplaySectionListsForMultipleFields
                          values={form?.values?.references}
                          setFieldValue={form.setFieldValue}
                          fieldArrayName="references"
                          sectionName="Professional Reference"
                        />

                        {/*add reference btn */}

                        {form.values?.references?.length <
                        sectionData?.section?.validationScope
                          ?.minNoOfRefrees ? (
                          <DisplayAddBtnForMultipleFields
                            values={form?.values?.references}
                            fieldArrayName="references"
                            form={form}
                            pushNewRef={pushNewReference}
                            newFields={newReference}
                            addSectionText={() =>
                              form?.values?.references?.length > 0
                                ? "Add More Professional Reference"
                                : "Add Professional Reference"
                            }
                            runWhenNewAdd={() => {
                              form.setFieldValue(
                                "noOfProfessionalReference",
                                referenceForm.current?.values?.references
                                  ?.length
                              );
                            }}
                          />
                        ) : null}

                        {/*cache*/}
                        <Box mb={2}>
                          {!professionalReferenceData ||
                          !professionalReferenceData?.length ||
                          !professionalReferenceData[0]?.referencedetails
                            ?.length ? (
                            <>
                              <Box my={3}>
                                <Divider />
                              </Box>
                              <AlertMessageComponent
                                cond={() => {
                                  return (
                                    !professionalReferenceData ||
                                    !professionalReferenceData?.length ||
                                    !professionalReferenceData[0]
                                      ?.referencedetails?.length
                                  );
                                }}
                                CONSTANT="PROFESSIONAL_REFERENCE"
                                toCacheValues={toCacheValues.current}
                                sectionDetails={professionalReferenceData}
                              />
                            </>
                          ) : null}
                        </Box>
                      </>
                    }
                    formDetailsComponent={
                      <ProfessionalReferencesFormDetails
                        form={form}
                        pushNewReference={pushNewReference}
                        professionalRelationsTypes={professionalRelationsTypes}
                        runWhenDelete={() => {
                          form.setFieldValue(
                            "noOfProfessionalReference",
                            referenceForm.current?.values?.references?.length
                          );
                        }}
                      />
                    }
                  />
                </Form>
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

export { CandidateProfileReferencesPage };
