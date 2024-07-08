import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getFileNameWithEllipsis } from "../../../utils/getFileNameWithEllipsis";
import {
  CheckCircleOutline,
  HourglassTop,
  DeleteOutlineOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { uploadingFiles } from "../utils/uploadingFiles";
import { ERROR } from "../../../store/constant";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { CANDIDATE_SECTION_DISABLE_SUBMTI_BTN } from "../../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const UploadSignatureComponent = ({
  form,
  formId = "upload_sign",
  section = "",
  fieldName = "",
  fileName = "",
}) => {
  const [fileData, setFileData] = useState({
    formId,
    fileName: "",
    status: "",
  });
  const [disableBtn, setDisableBtn] = useState(false);

  const dispatch = useDispatch();

  const saveUploadedConsentFormUrl = (v) => {
    //for uploading driver license in personal particular
    if (section === "personal_details") {
      form.setFieldTouched(fieldName, true);
      form.setFieldValue(fieldName, v || "");
    } else {
      form.setFieldTouched("consentFormUploadedByOps", true);
      form.setFieldValue("consentFormUploadedByOps", v || "");

      //setting below value because there's a validation in schema
      form.setFieldValue("candidateConsentSignature", v || "");
    }
  };

  const handleFileUpload = async (e) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleFileUpload"
    );

    if (
      e.target.files[0]?.type.includes("pdf") ||
      e.target.files[0]?.type.includes("jpg") ||
      e.target.files[0]?.type.includes("jpeg") ||
      e.target.files[0]?.type.includes("png")
    ) {
      if (e.target.files[0]?.name?.length > 100) {
        return dispatch(
          setToastNotification(ERROR, "File Name is Too Long!", logDetails)
        );
      }

      //disabling next & save progress btn
      if (section === "personal_details") {
        dispatch({
          type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
          payload: true,
        });
      }
      setDisableBtn(true);

      //making status to pending
      let newFileData = {
        formId,
        fileName: e.target.files[0].name,
        status: "pending",
      };
      setFileData((prev) => (prev = newFileData));

      //uploading file
      let savedFormCdnPath = await uploadingFiles(
        e.target.files[0],
        dispatch,
        [],
        // "EDUCATION_DOCS",
        "CONSENT",
        "additional-info"
      );

      if (!savedFormCdnPath) {
        setFileData({
          formId,
          fileName: "",
          status: "",
        });

        dispatch(
          setToastNotification(
            ERROR,
            "An error occurred, please try again!",
            logDetails
          )
        );

        if (section === "personal_details") {
          dispatch({
            type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
            payload: false,
          });
        }

        return setDisableBtn(false);
      }

      //making status to uploaded
      newFileData = {
        formId,
        fileName: e.target.files[0].name,
        status: "uploaded",
      };

      setFileData((prev) => (prev = newFileData));

      saveUploadedConsentFormUrl(savedFormCdnPath);

      if (section === "personal_details") {
        dispatch({
          type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
          payload: false,
        });
      }

      return setDisableBtn(false);
    } else {
      return dispatch(
        setToastNotification(
          ERROR,
          "Please upload a valid pdf / jpg / jpeg / png file",
          logDetails
        )
      );
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <input
          name={`fileUpload-${formId}`}
          id={`fileUpload-${formId}`}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          onClick={(e) => {
            e.target.value = null;
          }}
        />
        <label htmlFor={`fileUpload-${formId}`}>
          {" "}
          <Button
            color="primary"
            variant="outlined"
            component="span"
            disabled={disableBtn}
          >
            {section === "personal_details" ? "Upload" : "Upload Consent Form"}
          </Button>
        </label>
        {fileData?.fileName ? (
          <>
            {form?.values?.consentFormUploadedByOps ? (
              <a href={form?.values?.consentFormUploadedByOps} target="_blank">
                <Typography variant="h5" mx={1} sx={{ color: "blue" }}>
                  {getFileNameWithEllipsis(fileData?.fileName)}
                </Typography>
              </a>
            ) : (
              <Typography variant="h5" mx={1}>
                {getFileNameWithEllipsis(fileData?.fileName)}
              </Typography>
            )}

            <Box mx={1}>
              {fileData?.status === "pending" ? (
                <HourglassTop />
              ) : (
                <CheckCircleOutline color="success" />
              )}
            </Box>

            <DeleteOutlineOutlined
              style={{ cursor: "pointer" }}
              sx={{
                color: (theme) => theme.palette.error.main,
                marginTop: "-5px",
              }}
              onClick={(e) => {
                setFileData({
                  formId,
                  fileName: "",
                  status: "",
                });
                saveUploadedConsentFormUrl();
                e.stopPropagation();
              }}
            />
          </>
        ) : fieldName && fileName && form?.values[fieldName] ? (
          <>
            <a href={form?.values[fieldName]} target="_blank">
              <Typography variant="h5" mx={1} sx={{ color: "blue" }}>
                {fileName}
              </Typography>
            </a>
            <Box mx={1}>
              {fileData?.status === "pending" ? (
                <HourglassTop />
              ) : (
                <CheckCircleOutline color="success" />
              )}
            </Box>

            <DeleteOutlineOutlined
              style={{ cursor: "pointer" }}
              sx={{
                color: (theme) => theme.palette.error.main,
                marginTop: "-5px",
              }}
              onClick={(e) => {
                setFileData({
                  formId,
                  fileName: "",
                  status: "",
                });
                saveUploadedConsentFormUrl();
                e.stopPropagation();
              }}
            />
          </>
        ) : null}
      </Box>
    </>
  );
};

export default UploadSignatureComponent;
