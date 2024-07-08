import * as Yup from "yup";

import { StyledAlert } from "./styled";
import { RadioAlert } from "./RadioAlert";
import { LoadingButton } from "@mui/lab";
import { BaseTextField } from "../base";
import { FastField, Form, Formik } from "formik";
import { StyledBasePaper } from "../base/styled";
import { Link, useNavigate } from "react-router-dom";
import { useRef, Fragment } from "react";
import {
  DriveFileRenameOutlineOutlined,
  PictureAsPdf,
} from "@mui/icons-material";
import ReactPDF from "@react-pdf/renderer";

import {
  Box,
  Grid,
  Typography,
  FormHelperText,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import Signature from "../../common/SignaturePad";
import { useState } from "react";
import { calculate_Back_Next_Urls } from "./utils/CandidateModule_Back_Next_URLs";
import { ConsentSubmittedContent } from "../common/ConsentSubmittedPDF";
import { Buffer } from "buffer";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import CustomTooltip from "../common/CustomTooltip";
import { useTheme } from "@mui/material/styles";
import { CANDIDATE_CLEAR_API_ERROR } from "../../store/actions/actionTypes";
import { uploadFileUtils } from "../../store/actions/helperActions";
import { submitCandidateDetails } from "../../store/actions/candidateAction";
import DisplaySectionHeading from "./common/DisplaySectionHeading";
import { getSectionData } from "./utils/getSectionData";
import { useMemo } from "react";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { ERROR } from "../../store/constant";
import UploadConsentFormComponent from "./common/UploadConsentFormComponent";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const validationSchema = Yup.object({
  candidateFullLegalName: Yup.string().required("Candidate Name is required"),
  candidateConsentSignature: Yup.string()
    .required("Signature is required")
    .typeError("Signature is invalid, please try again"),
});

const generateConsentPdf = async (data, dispatch, callBack) => {
  try {
    const pdfStream = await ReactPDF.pdf(
      <ConsentSubmittedContent
        consentSign={data.consentSign}
        consentText={data.consentText}
        candidateName={data.candidateName}
        consentDate={data.consentDate}
      />
    ).toBlob();

    let file = new File([pdfStream], `${new Date()}.pdf`, {
      type: "application/pdf",
    });

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "generateConsentPdf"
    );

    dispatch(
      uploadFileUtils(
        logDetails,
        { file },
        {
          // category: "CANDIDATE_REPORT",
          category: "CONSENT",
          multiple: true,
        },
        (res) => callBack(res?.fileAttachmentPath)
      )
    );
  } catch (error) {
    console.log("error123", error);
  }
};

const CandidateProfilePage = () => {
  const theme = useTheme();
  const formikRef = useRef(null);
  const [canvasCleared, setCanvasCleared] = useState(true);
  const [checkboxActive, setCheckboxActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, candidateInitialDetails } = useSelector(
    (state) => state.candidate
  );

  const {
    candidateName,
    candidateConsentSignature,
    hrOrganizationName,
    candidateConsentText,
    candidateFullLegalName,
    candidateProfileSections,
    consentsAttachment,
    candidateConsentSubmitted,
    consentCreatedDate,
    allowProfileEdit,
    doNotDisplayClientName,
  } = candidateInitialDetails;

  const sectionData = useMemo(
    () => getSectionData("WELCOME", candidateProfileSections, allowProfileEdit),
    [candidateProfileSections]
  );

  //to check if second login is present or not
  const isSecondLoginProfilePresent = localStorage.getItem("second_login");

  const handleSubmit = async (values, form) => {
    try {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      //if candidate was logged in from ops & consent is not submitted
      if (isSecondLoginProfilePresent && !candidateConsentSubmitted) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "handleSubmit"
        );

        handleSubmitCandidateDetails(
          {
            candidateFullLegalName: values?.candidateFullLegalName,
            candidateConsentSignature: null,
          },
          values?.consentFormUploadedByOps,
          logDetails
        );
      } else {
        generateConsentPdf(
          {
            consentSign: values.candidateConsentSignature,
            consentText: candidateConsentText,
            candidateName: values.candidateFullLegalName,
            consentDate: moment(consentCreatedDate).format("YYYY-MM-DD h:mm a"),
          },
          dispatch,
          (fileAttachmentUrl) => {
            let logDetails = getCurrentFileNameAndFunction(
              import.meta.url,
              "generateConsentPdf"
            );

            if (fileAttachmentUrl) {
              handleSubmitCandidateDetails(
                values,
                fileAttachmentUrl,
                logDetails
              );
            } else {
              dispatch(
                setToastNotification(
                  ERROR,
                  "Failed to upload Signature, please try again!",
                  logDetails
                )
              );
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitCandidateDetails = (
    values,
    fileAttachmentUrl,
    logDetails
  ) => {
    dispatch(
      submitCandidateDetails(
        {
          candidateFullLegalName: values.candidateFullLegalName,
          candidateConsentSignature: values.candidateConsentSignature,
          consentsAttachment: fileAttachmentUrl,
        },
        "consent",
        () =>
          navigate(
            calculate_Back_Next_Urls(
              "WELCOME",
              candidateProfileSections,
              allowProfileEdit
            ).nextUrl
          ),
        null,
        null,
        navigate,
        logDetails
      )
    );
  };

  return (
    <Fragment>
      {!loading && candidateConsentText?.length && (
        <StyledBasePaper>
          <Box p={{ xs: 0, md: 1 }}>
            <DisplaySectionHeading
              icon={sectionData?.section?.sectionIcon}
              text={`Welcome ${candidateName}`}
            />

            <Box marginTop="2rem">
              <StyledAlert>
                Your Potential/Current Employer{" "}
                {!doNotDisplayClientName && (
                  <Link to="#">{hrOrganizationName}</Link>
                )}{" "}
                has engaged us to conduct Employment Check as part of the
                recruitment/onboarding/due-diligence process. We request you to
                please go through below instruction to complete the process.
              </StyledAlert>

              <Typography variant="h5" fontWeight="bold" mt={2} ml={1}>
                Please have below information and documents handy before you
                start. The forms should take you no more than 15 - 20 minutes to
                complete.
              </Typography>
            </Box>
            <Stack mt={2} spacing={2}>
              {candidateProfileSections
                ?.filter((v) => !!v.candidateRequiredInfoText)
                ?.map(
                  (section, index) =>
                    section.candidateProfileSectionName !==
                      "ADDITIONAL_INFORMATION" && (
                      <RadioAlert
                        key={index}
                        tooltip={section.candidateRequiredInfoTextHelp}
                        label={
                          section.candidateRequiredInfoText ||
                          `Section ${index}`
                        }
                      />
                    )
                )}
            </Stack>

            <Stack marginTop="3rem" spacing={3}>
              <StyledAlert>
                In case you do not have some of the mentioned details or is not
                applicable to you, you will have an option to skip while filling
                the forms.
              </StyledAlert>
              <StyledAlert>
                All data that you will be submitting will be processed in
                accordance of our{" "}
                <Link to="/data-privacy-policy" target="_blank">
                  Data Privacy Policy
                </Link>
                . During your submission of Employment Screening application,
                the below information and supporting documents would be
                required. We do not sell your data to any third parties,
                marketers or advertisers.
              </StyledAlert>
              <StyledAlert>
                You are also required to read and sign consent form to provide
                your consent allowing us using your personal information and
                supporting documents (collected in next steps of this form) for
                conducting verification checks.
              </StyledAlert>
            </Stack>

            <Formik
              enableReinitialize
              innerRef={formikRef}
              initialValues={{
                candidateFullLegalName: candidateFullLegalName || candidateName,
                candidateConsentSignature:
                  (candidateConsentSignature &&
                    Buffer.from(
                      candidateConsentSignature,
                      "base64"
                    ).toString()) ??
                  "",
                consentFormUploadedByOps: null,
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {(form) => (
                <Form>
                  <Box marginTop="2rem" maxWidth="1200px">
                    <Box
                      py={{ xs: 1, md: 2 }}
                      display="flex"
                      alignItems="center"
                    >
                      <DriveFileRenameOutlineOutlined
                        style={{ color: theme.palette.primary.main }}
                      />
                      <Typography variant="h3" ml={1} id="read-and-sign-text">
                        Read and Sign Consent Form
                      </Typography>
                    </Box>

                    <Box
                      p={{ xs: 1, md: 2 }}
                      sx={{
                        borderTop: "none",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.grey[400]}`,
                      }}
                    >
                      {/*Consent Text */}
                      <Box
                        sx={{ lineHeight: "25px" }}
                        dangerouslySetInnerHTML={{
                          __html: candidateConsentText,
                        }}
                      />
                      <Grid
                        container
                        spacing={4}
                        marginTop={
                          !isSecondLoginProfilePresent ||
                          JSON.parse(
                            localStorage.getItem("switchBackUrl")
                          )?.includes("case-management")
                            ? "4rem"
                            : 0
                        }
                      >
                        <Grid item xs={12} md={5} sm={6}>
                          <FastField
                            component={BaseTextField}
                            name="candidateFullLegalName"
                            label="Your Full Legal Name*"
                            disabled={candidateConsentSubmitted}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5}
                          sm={6}
                          mt={{ xs: 0, sm: 2 }}
                          display="flex"
                          alignItems="center"
                        >
                          <Typography>
                            Date & Time of Consent :
                            {consentCreatedDate
                              ? " " +
                                moment(consentCreatedDate).format(
                                  "DD/MM/YYYY h:mm a"
                                )
                              : " " + moment().format("DD/MM/YYYY h:mm a")}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          {/* if candidate is logged in from ops , then we will show upload consent form else 
                        if the candidate themself logged in then we will make them submit on their own */}
                          {isSecondLoginProfilePresent &&
                          !candidateConsentSubmitted ? (
                            <UploadConsentFormComponent form={form} />
                          ) : !isSecondLoginProfilePresent ||
                            JSON.parse(
                              localStorage.getItem("switchBackUrl")
                            )?.includes("case-management") ? (
                            <>
                              <Signature
                                headerMessage={
                                  candidateConsentSubmitted
                                    ? "Submitted signature"
                                    : "Please draw your signature"
                                }
                                onChange={(v) => {
                                  form.setFieldTouched(
                                    "candidateConsentSignature",
                                    true
                                  );
                                  form.setFieldValue(
                                    "candidateConsentSignature",
                                    v || ""
                                  );
                                }}
                                canvasCleared={canvasCleared}
                                setCanvasCleared={setCanvasCleared}
                                candidateConsentSubmitted={
                                  candidateConsentSubmitted
                                }
                                candidateConsentSignature={
                                  candidateConsentSignature
                                }
                              />
                              {form.touched["candidateConsentSignature"] &&
                                !!form.errors["candidateConsentSignature"] && (
                                  <FormHelperText error>
                                    {form.errors["candidateConsentSignature"]}
                                  </FormHelperText>
                                )}

                              <Typography mt={2} fontStyle="italic">
                                By signing and clicking "Submit Consent" you are
                                providing your consent to CheckMinistry to use
                                your personal information that you will be
                                submitting for conducting checks for your
                                employment verification purpose. Your digital
                                signature will be electronically recorded.
                              </Typography>
                            </>
                          ) : null}
                          <Box>
                            <FormControlLabel
                              sx={{ mt: 3 }}
                              control={
                                <Checkbox
                                  checked={
                                    candidateConsentSubmitted || checkboxActive
                                  }
                                  onChange={() => {
                                    setCheckboxActive(!checkboxActive);
                                  }}
                                  disabled={candidateConsentSubmitted}
                                />
                              }
                              label="I acknowledge all data that I will be submitting will be processed in accordance of CheckMinistry's Data Privacy Policy. My personal information collected will be used solely for the purpose of employment screening."
                            />
                          </Box>

                          <Box mt={4} display="flex" alignItems="center">
                            <LoadingButton
                              type="submit"
                              color="primary"
                              variant="contained"
                              loading={form.isSubmitting}
                              disabled={
                                candidateConsentSubmitted ||
                                !checkboxActive ||
                                !form.values.candidateConsentSignature
                              }
                            >
                              Submit Consent
                            </LoadingButton>
                            {consentsAttachment && (
                              <CustomTooltip title="Your Consent Form">
                                <PictureAsPdf
                                  onClick={() =>
                                    window.open(consentsAttachment, "_blank")
                                  }
                                  style={{
                                    marginLeft: "5px",
                                    color: theme.palette.primary.main,
                                    cursor: "pointer",
                                  }}
                                />
                              </CustomTooltip>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </StyledBasePaper>
      )}
    </Fragment>
  );
};

export { CandidateProfilePage };
