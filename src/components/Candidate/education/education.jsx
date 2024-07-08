import moment from "moment";
import { omit } from "lodash";
import { useNavigate } from "react-router-dom";
import { useMemo, Fragment, useRef } from "react";
import { Form, Formik, setNestedObjectValues } from "formik";
import { StyledBasePaper } from "../../base/styled";
import { Box, Divider } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { newEducation } from "../helpers/initialState/education";
import { educationValidationSchema } from "../helpers/validationSchema/education";
import { getSectionData } from "../utils/getSectionData";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
} from "../../../store/actions/actionTypes";
import {
  getCandidateEducationTypes,
  getCandidateEducationalQualificationTypes,
  getEducationalQualificationsData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import { getFilteredDataForCacheSubmit } from "../utils/getFilteredDataForCacheSubmit";
import CircularLoader from "../../../common/CircularLoader";
import { removeTimeFromDate } from "../utils/removeTimeFromDate";
import DisplayErrorsForMultipleFields from "../common/DisplayErrorsForMultipleFields";
import DisplaySectionListsForMultipleFields from "../common/DisplaySectionListsForMultipleFields.jsx";
import DisplayAddBtnForMultipleFields from "../common/DisplayAddBtnForMultipleFields.jsx";
import DisplaySectionHeading from "../common/DisplaySectionHeading.jsx";
import CandidateMultipleFieldsSectionLayout from "../common/CandidateMultipleFieldsSectionLayout.jsx";
import EducationFormDetails from "./components/EducationFormDetails.jsx";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction.js";

const CandidateEducationPage = () => {
  const navigate = useNavigate();
  const [attachFileErr, setAttachFileErr] = useState([]);
  const educationForm = useRef();
  const dispatch = useDispatch();
  const toCacheValues = useRef();
  const [disableBtn, setDisableBtn] = useState(false);

  const {
    loading,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    educationalQualificationsData,
    candidateSectionLoading,
    educationTypes,
    qualificationTypes,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const educationalQualificationsDataRef = useRef();
  educationalQualificationsDataRef.current = educationalQualificationsData;

  const pushNewEduRef = useRef();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getEducationalQualificationsData(logDetails));
    !educationTypes && dispatch(getCandidateEducationTypes(logDetails));
    !qualificationTypes &&
      dispatch(getCandidateEducationalQualificationTypes(logDetails));
  }, []);

  const qualifications = useMemo(() => {
    if (educationalQualificationsData) {
      let cachedEducationalQual =
        candidateCachedDetails &&
        candidateCachedDetails["EDUCATIONAL_QUALIFICATIONS"];

      let tempQualifications =
        !educationalQualificationsData || !educationalQualificationsData.length
          ? cachedEducationalQual?.length
            ? cachedEducationalQual
            : [newEducation()]
          : educationalQualificationsData;

      if (tempQualifications) {
        tempQualifications = tempQualifications.map((curr, index) => {
          let tempAtt = [...curr.attachments].map((att) => {
            return {
              ...att,
              status: "existing",
            };
          });
          return {
            ...curr,
            attachments: tempAtt || [],
            selectedTab: index === 0,
          };
        });
      }

      tempQualifications.forEach((curr) => {
        if (curr.fromDate) {
          curr.fromDate = moment(curr.fromDate).toLocaleString();
        }
        if (curr.toDate) {
          curr.toDate = moment(curr.toDate).toLocaleString();
        }
      });

      return tempQualifications;
    } else {
      return undefined;
    }
  }, [educationalQualificationsData, candidateCachedDetails]);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "EDUCATIONAL_QUALIFICATIONS",
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
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () => {
        handleSubmit(educationForm?.current?.values, educationForm?.current);
      },
    });

    return async () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      // dispatch({
      //   type: EDUCATIONAL_QUALIFICATIONS,
      //   payload: [],
      // });

      //caching when dismounts
      if (
        (!educationalQualificationsDataRef.current ||
          !educationalQualificationsDataRef.current.length) &&
        toCacheValues.current
      ) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );
        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            getFilteredDataForCacheSubmit(toCacheValues.current),
            "EDUCATIONAL_QUALIFICATIONS"
          )
        );
      }
    };
  }, []);

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

      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      let fileUploadError = [];

      values.qualifications.map((qualification, index) => {
        if (qualification.attachments.length === 0) {
          fileUploadError.push({
            errFileName: `qualifications.${index}.attachments`,
          });
        }
      });

      setAttachFileErr([...fileUploadError]);

      if (values?.qualifications?.length === 0) {
        return dispatch(
          setToastNotification(
            ERROR,
            "Please fill all the required fields",
            logDetails
          )
        );
      }

      let finalEducationalQualification = values.qualifications.map(
        (qualification) => {
          const omittedData = [
            "candidatesEducationsId",
            "attachments",
            "candidateId",
            "categoryName",
            "isExpanded",
            "educationType",
            "countryName",
            "qualificationTypeName",
            "educationTypeName",
            "selectedTab",
          ];

          let mQualification = omit(qualification, omittedData);

          mQualification.candidatesEducationQualificationAttachments =
            qualification.attachments?.map((file) => {
              file = omit(file, [
                "candidatesEducationAttachmentsId",
                "candidatesEducationQualificationId",
                "icon",
                "status",
              ]);
              return file;
            }) || [];

          if (
            mQualification.candidatesEducationQualificationAttachments
              .length === 0
          ) {
            return dispatch(
              setToastNotification(ERROR, "Please upload a file", logDetails)
            );
          }

          mQualification.fromDate = removeTimeFromDate(mQualification.fromDate);
          mQualification.toDate = removeTimeFromDate(mQualification.toDate);

          return mQualification;
        }
      );

      if (!fileUploadError.length) {
        dispatch(
          submitCandidateDetails(
            {
              EDUCATIONAL_QUALIFICATIONS: finalEducationalQualification,
            },
            "educational-qualification",
            () => {
              toCacheValues.current = [];
              navigate(sectionData?.urls.nextUrl);
            },
            sectionData?.section?.onHold,
            sectionData?.section?.candidatesProfileSectionsId,
            navigate,
            logDetails
          )
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Fragment>
      {!loading &&
      !candidateSectionLoading &&
      educationalQualificationsData &&
      qualifications &&
      qualifications?.length &&
      qualificationTypes?.length &&
      educationTypes?.length ? (
        <StyledBasePaper>
          <Formik
            // enableReinitialize
            initialValues={{
              qualifications,
            }}
            validationSchema={educationValidationSchema}
            // onSubmit={handleSubmit}
            innerRef={educationForm}
          >
            {(form) => {
              toCacheValues.current = [
                ...form.values?.qualifications?.map((qualification) => {
                  return {
                    ...qualification,
                    fromDate: removeTimeFromDate(qualification.fromDate),
                    toDate: removeTimeFromDate(qualification.toDate),
                  };
                }),
              ];

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
                          errors={form.errors.qualifications}
                          touched={form.touched.qualifications}
                          section="Education"
                          apiErrorMsg={apiErrorMsg}
                        />
                      </>
                    }
                    formListsComponent={
                      <>
                        {/*Education lists */}
                        <DisplaySectionListsForMultipleFields
                          values={form?.values?.qualifications}
                          setFieldValue={form.setFieldValue}
                          fieldArrayName="qualifications"
                          sectionName="Education"
                        />

                        {/*Add education */}
                        <DisplayAddBtnForMultipleFields
                          values={form?.values?.qualifications}
                          fieldArrayName="qualifications"
                          form={form}
                          pushNewRef={pushNewEduRef}
                          newFields={newEducation}
                          addSectionText={() =>
                            form?.values?.qualifications?.length > 0
                              ? "Add More Education"
                              : "Add Education"
                          }
                        />

                        {/*cache */}
                        <Box mb={2}>
                          {!educationalQualificationsData ||
                          !educationalQualificationsData.length ? (
                            <>
                              <Box my={3}>
                                <Divider />
                              </Box>
                              <AlertMessageComponent
                                cond={() => {
                                  return (
                                    !educationalQualificationsData ||
                                    !educationalQualificationsData.length
                                  );
                                }}
                                CONSTANT="EDUCATIONAL_QUALIFICATIONS"
                                toCacheValues={getFilteredDataForCacheSubmit(
                                  toCacheValues.current
                                )}
                                sectionDetails={educationalQualificationsData}
                                disableBtn={disableBtn}
                              />
                            </>
                          ) : null}
                        </Box>
                      </>
                    }
                    formDetailsComponent={
                      <EducationFormDetails
                        form={form}
                        pushNewEduRef={pushNewEduRef}
                        educationForm={educationForm}
                        qualificationTypes={qualificationTypes}
                        educationTypes={educationTypes}
                        setDisableBtn={setDisableBtn}
                        attachFileErr={attachFileErr}
                        setAttachFileErr={setAttachFileErr}
                        sectionData={sectionData}
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

export { CandidateEducationPage };
