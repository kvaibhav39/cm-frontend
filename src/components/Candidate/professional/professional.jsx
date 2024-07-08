import moment from "moment";
import { Fragment, useEffect } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik, setNestedObjectValues } from "formik";
import { Box, Divider } from "@mui/material";
import { StyledBasePaper } from "../../base/styled";
import { omit } from "lodash";
import { useState } from "react";
import { useRef } from "react";
import { newProfessional } from "../helpers/initialState/professional";
import { professionalValidationSchema } from "../helpers/validationSchema/professional";
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
  getCandidateProfessionalQualificationTypes,
  getProfessionalQualificationsData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import { getFilteredDataForCacheSubmit } from "../utils/getFilteredDataForCacheSubmit";
import CircularLoader from "../../../common/CircularLoader";
import { removeTimeFromDate } from "../utils/removeTimeFromDate";
import DisplayErrorsForMultipleFields from "../common/DisplayErrorsForMultipleFields";
import DisplaySectionListsForMultipleFields from "../common/DisplaySectionListsForMultipleFields";
import DisplayAddBtnForMultipleFields from "../common/DisplayAddBtnForMultipleFields";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import CandidateMultipleFieldsSectionLayout from "../common/CandidateMultipleFieldsSectionLayout";
import ProfessionalFormDetails from "./components/ProfessionalFormDetails";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateProfessionalPage = () => {
  const navigate = useNavigate();
  const [attachFileErr, setAttachFileErr] = useState([]);
  const professionalForm = useRef();
  const toCacheValues = useRef();
  const [disableBtn, setDisableBtn] = useState(false);

  const dispatch = useDispatch();

  const {
    loading,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    professionalQualificationsData,
    candidateSectionLoading,
    qualificationStatuses,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const professionalQualificationsDataRef = useRef();
  professionalQualificationsDataRef.current = professionalQualificationsData;

  const pushNewProfRef = useRef();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getProfessionalQualificationsData(logDetails));
    !qualificationStatuses &&
      dispatch(getCandidateProfessionalQualificationTypes(logDetails));
  }, []);

  const qualifications = useMemo(() => {
    if (professionalQualificationsData) {
      let cachedProffesionalQual =
        candidateCachedDetails &&
        candidateCachedDetails["PROFESSIONAL_QUALIFICATIONS"];

      let tempQualifications =
        !professionalQualificationsData ||
        !professionalQualificationsData.length
          ? cachedProffesionalQual?.length
            ? cachedProffesionalQual
            : [newProfessional()]
          : professionalQualificationsData;

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
        if (curr.dateOfAccreditation) {
          curr.dateOfAccreditation = moment(
            curr.dateOfAccreditation
          ).toLocaleString();
        }
      });

      return tempQualifications;
    } else {
      return undefined;
    }
  }, [professionalQualificationsData, candidateCachedDetails]);

  useEffect(() => {
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () => {
        handleSubmit(
          professionalForm?.current?.values,
          professionalForm?.current
        );
      },
    });

    return async () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      // dispatch({
      //   type: PROFESSIONAL_QUALIFICATIONS,
      //   payload: [],
      // });

      //caching when dismounts
      if (
        (!professionalQualificationsDataRef.current ||
          !professionalQualificationsDataRef.current.length) &&
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
            "PROFESSIONAL_QUALIFICATIONS"
          )
        );
      }
    };
  }, []);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "PROFESSIONAL_QUALIFICATIONS",
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
          const mQualification = omit(qualification, [
            "candidatesProfessionalQualificationsId",
            "CandidatesProfessionalQualificationsAttachments",
            "attachments",
            "candidateId",
            "isExpanded",
            "statusProfessionalQualificationName",
            "countryName",
            "qualificationTypeName",
            "selectedTab",
          ]);

          mQualification.candidateProfessionalQualificationAttachments =
            qualification.attachments?.map((file) => {
              file = omit(file, [
                "candidatesProfessionalQualificationsAttachmentsId",
                "candidateProfessionalQualificationId",
                "icon",
                "status",
              ]);
              return file;
            }) || [];

          if (
            mQualification.candidateProfessionalQualificationAttachments
              .length === 0
          ) {
            return dispatch(
              setToastNotification(ERROR, "Please upload a file", logDetails)
            );
          }

          mQualification.fromDate = removeTimeFromDate(mQualification.fromDate);
          mQualification.toDate = removeTimeFromDate(mQualification.toDate);
          mQualification.dateOfAccreditation = removeTimeFromDate(
            mQualification.dateOfAccreditation
          );

          return mQualification;
        }
      );

      if (!fileUploadError.length) {
        dispatch(
          submitCandidateDetails(
            {
              PROFESSIONAL_QUALIFICATIONS: finalEducationalQualification,
            },
            "professional-qualification",
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
      professionalQualificationsData &&
      qualifications &&
      qualificationStatuses ? (
        <StyledBasePaper>
          <Formik
            // enableReinitialize
            initialValues={{ qualifications }}
            validationSchema={professionalValidationSchema}
            // onSubmit={handleSubmit}
            innerRef={professionalForm}
          >
            {(form) => {
              toCacheValues.current = [
                ...form.values.qualifications.map((qualification) => {
                  return {
                    ...qualification,
                    fromDate: removeTimeFromDate(qualification.fromDate),
                    toDate: removeTimeFromDate(qualification.toDate),
                    dateOfAccreditation: removeTimeFromDate(
                      qualification.dateOfAccreditation
                    ),
                  };
                }),
              ];

              return (
                <Form>
                  <CandidateMultipleFieldsSectionLayout
                    formHeadingComponent={
                      <>
                        {" "}
                        <DisplaySectionHeading
                          icon={sectionData?.section?.sectionIcon}
                          text={sectionData?.section?.candidateRequiredInfoText}
                        />
                        <DisplayErrorsForMultipleFields
                          errors={form.errors.qualifications}
                          touched={form.touched.qualifications}
                          section="Professional Qualification"
                          apiErrorMsg={apiErrorMsg}
                        />
                      </>
                    }
                    formListsComponent={
                      <>
                        {/*Qualification lists */}
                        <DisplaySectionListsForMultipleFields
                          values={form?.values?.qualifications}
                          setFieldValue={form.setFieldValue}
                          fieldArrayName="qualifications"
                          sectionName="Professional"
                        />

                        {/*Add qualification */}
                        <DisplayAddBtnForMultipleFields
                          values={form?.values?.qualifications}
                          fieldArrayName="qualifications"
                          form={form}
                          pushNewRef={pushNewProfRef}
                          newFields={newProfessional}
                          addSectionText={() =>
                            form?.values?.qualifications?.length > 0
                              ? "Add More Professional Qualification"
                              : "Add Professional Qualification"
                          }
                        />

                        {/* cache*/}
                        <Box mb={2}>
                          {!professionalQualificationsData ||
                          !professionalQualificationsData.length ? (
                            <>
                              <Box my={3}>
                                <Divider />
                              </Box>
                              <AlertMessageComponent
                                cond={() => {
                                  return (
                                    !professionalQualificationsData ||
                                    !professionalQualificationsData.length
                                  );
                                }}
                                CONSTANT="PROFESSIONAL_QUALIFICATIONS"
                                toCacheValues={getFilteredDataForCacheSubmit(
                                  toCacheValues.current
                                )}
                                sectionDetails={professionalQualificationsData}
                                disableBtn={disableBtn}
                              />
                            </>
                          ) : null}
                        </Box>
                      </>
                    }
                    formDetailsComponent={
                      <ProfessionalFormDetails
                        form={form}
                        pushNewProfRef={pushNewProfRef}
                        qualificationStatuses={qualificationStatuses}
                        professionalForm={professionalForm}
                        setDisableBtn={setDisableBtn}
                        attachFileErr={attachFileErr}
                        setAttachFileErr={setAttachFileErr}
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

export { CandidateProfessionalPage };
