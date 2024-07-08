import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { HourglassTop, CheckCircleOutline } from "@mui/icons-material";
import { ERROR } from "../../../store/constant";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { uploadingFiles } from "../../Candidate/utils/uploadingFiles";
import {
  DISABLE_UPDATE_ADD_CHECK_BTN,
  HANDLE_CV_CHECK_ADDED_FILE,
} from "../../../store/actions/actionTypes";
import { getFileNameWithEllipsis } from "../../../utils/getFileNameWithEllipsis";
import { useSearchParams } from "react-router-dom";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction.js";

const UploadCV = ({
  savedCVfile = null,
  setSavedCVfile = () => {},
  setDisableBtn = () => {},
  addCheckFlag = false,
}) => {
  const [fileData, setFileData] = useState({
    fileName: "",
    status: "",
  });
  const [searchParams, _] = useSearchParams();
  //to disable update btn whenever cv check is selected
  //after uploading a file it becomes enable
  useEffect(() => {
    if (savedCVfile) {
      setFileData(
        (prev) =>
          (prev = { fileName: savedCVfile?.attachmentName, status: "uploaded" })
      );
    } else {
      setDisableBtn(true);
    }
  }, []);

  const dispatch = useDispatch();

  const handleFileUpload = async (e) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleFileUpload"
    );

    if (e.target.files[0]?.type.includes("pdf")) {
      if (e.target.files[0]?.name?.length > 100) {
        return dispatch(
          setToastNotification(ERROR, "File Name is Too Long!", logDetails)
        );
      }
      setDisableBtn(true);

      //for add check & subcheck
      if (addCheckFlag) {
        dispatch({ type: DISABLE_UPDATE_ADD_CHECK_BTN, payload: true });
      }

      //making status to pending
      let newFileData = {
        fileName: e.target.files[0].name,
        status: "pending",
      };
      setFileData((prev) => (prev = newFileData));

      //uploading file
      let savedCdnPath = await uploadingFiles(
        e.target.files[0],
        dispatch,
        [],
        "EDUCATION_DOCS",
        "additional-info",
        () => {},
        {
          hrOrganizationId: +searchParams.get("orgId") || undefined,
        }
      );

      if (!savedCdnPath) {
        return;
      }

      setSavedCVfile({
        attachmentName: newFileData?.fileName,
        attachmentPath: savedCdnPath,
      });

      //for add check & subcheck
      if (addCheckFlag) {
        dispatch({
          type: HANDLE_CV_CHECK_ADDED_FILE,
          payload: {
            attachmentName: newFileData?.fileName,
            attachmentPath: savedCdnPath,
            attachmentCategoryName: "EDUCATION_DOCS",
          },
        });

        dispatch({ type: DISABLE_UPDATE_ADD_CHECK_BTN, payload: false });
      }

      //making status to uploaded
      newFileData = {
        fileName: e.target.files[0].name,
        status: "uploaded",
      };

      setFileData((prev) => (prev = newFileData));

      //enabling next & save progress btn
      return setDisableBtn(false);
    } else {
      return dispatch(
        setToastNotification(
          ERROR,
          "Please Upload a Valid PDF File",
          logDetails
        )
      );
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent={{
        xs: "center",
        md: addCheckFlag ? "center" : "flex-start",
      }}
      flexDirection={{ xs: "column", md: "row" }}
    >
      <Box my={{ xs: 2 }} mr={{ xs: 0, md: 2 }}>
        <input
          name={`fileUpload`}
          id={`fileUpload`}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          onClick={(e) => {
            e.target.value = null;
          }}
        />
        <label htmlFor={`fileUpload`}>
          <Button color="primary" variant="outlined" component="span">
            Upload CV
          </Button>
        </label>
      </Box>
      {fileData?.fileName && (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography mr={1} variant="h5">
            {getFileNameWithEllipsis(fileData?.fileName)}
          </Typography>

          <Box mx={1}>
            {fileData?.status === "pending" ? (
              <HourglassTop />
            ) : (
              <CheckCircleOutline color="success" />
            )}
          </Box>

          <DeleteOutlineOutlinedIcon
            style={{ cursor: "pointer" }}
            sx={{
              color: (theme) => theme.palette.error.main,
              marginTop: "-5px",
            }}
            onClick={(e) => {
              //reseting file data state
              let resetFileData = {
                fileName: "",
                status: "uploaded",
              };
              setFileData(resetFileData);
              setSavedCVfile(null);
              setDisableBtn(true);

              //for add check & subcheck
              if (addCheckFlag) {
                dispatch({
                  type: HANDLE_CV_CHECK_ADDED_FILE,
                  payload: null,
                });
              }

              e.stopPropagation();
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadCV;
