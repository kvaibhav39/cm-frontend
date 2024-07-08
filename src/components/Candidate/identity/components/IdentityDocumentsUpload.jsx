import { CheckCircleOutline, HourglassTop } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { getFileNameWithEllipsis } from "../../../../utils/getFileNameWithEllipsis";
import { useDispatch } from "react-redux";
import { CANDIDATE_SECTION_DISABLE_SUBMTI_BTN } from "../../../../store/actions/actionTypes";
import { setToastNotification } from "../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../store/constant";
import { uploadingFiles } from "../../utils/uploadingFiles";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const IdentityDocumentsUpload = ({ form }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    setUploadedDocuments(
      form.values?.identityAttachments
        ? form.values?.identityAttachments?.map((curr) => {
            curr.status = "uploaded";
            return curr;
          })
        : []
    );
  }, []);

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
      if (
        uploadedDocuments?.find(
          (curr) => curr.attachmentName === e.target.files[0].name
        )
      ) {
        return dispatch(
          setToastNotification(ERROR, "File already present!", logDetails)
        );
      }

      if (e.target.files[0]?.name?.length > 100) {
        return dispatch(
          setToastNotification(ERROR, "File Name is Too Long!", logDetails)
        );
      }

      //disabling next & save progress btn
      dispatch({ type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN, payload: true });
      setDisableBtn(true);

      //making status to pending
      let newFileData = {
        attachmentName: e.target.files[0].name,
        status: "pending",
      };

      setUploadedDocuments((prev) => (prev = [...prev, newFileData]));

      //uploading file
      let attachmentPath = await uploadingFiles(
        e.target.files[0],
        dispatch,
        [],
        "CANDIDATE_IDENTITY",
        "additional-info"
      );

      if (!attachmentPath) {
        let temp = [...uploadedDocuments]?.filter(
          (curr) => curr?.name !== e.target.files[0].name
        );

        setUploadedDocuments([...temp]);
        form.setFieldValue("identityAttachments", [...temp]);

        dispatch(
          setToastNotification(
            ERROR,
            "An error occurred, please try again!",
            logDetails
          )
        );

        dispatch({
          type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
          payload: false,
        });

        return setDisableBtn(false);
      }

      //parent state which handles all the files
      let temp1 = [...uploadedDocuments];
      let temp2 = temp1.filter(
        (curr) => curr?.attachmentName !== e.target.files[0].name
      );

      let updatedValue = [
        ...temp2,
        {
          attachmentName: e.target.files[0].name,
          attachmentPath,
          attachmentCategoryName: "CANDIDATE_IDENTITY",
          status: "uploaded",
        },
      ];

      setUploadedDocuments([...updatedValue]);
      form.setFieldValue("identityAttachments", updatedValue);

      //enabling next & save progress btn
      dispatch({ type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN, payload: false });
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
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[200],
        borderRadius: "10px",
      }}
      p={3}
    >
      <Box
        p={3}
        width={"100%"}
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent={{ xs: "center", sm: "flex-start" }}
        textAlign="center"
        backgroundColor={{
          xs: theme.palette.grey[200],
          md: theme.palette.grey[100],
        }}
        borderRadius="10px"
      >
        <Typography fontWeight="500" variant="h4">
          {form.values?.identityDocumentType}
        </Typography>

        <Box mx={4} mt={{ xs: 2, md: 0 }}>
          <input
            name="fileUpload"
            id="fileUpload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
          <label htmlFor={disableBtn ? "" : "fileUpload"}>
            <Button
              color="primary"
              variant="outlined"
              component="span"
              disabled={disableBtn}
              // sx={{
              //   pointerEvents: uploadedDocuments?.length < 2 ? "all" : "none",
              // }}
            >
              Upload
            </Button>
          </label>
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent={{ xs: "center", md: "flex-start" }}
          alignSelf="center"
          gap={2}
        >
          {uploadedDocuments?.map((fileData, ind) => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={{ xs: 2, md: 0 }}
              sx={{ wordBreak: "break-all" }}
            >
              {fileData?.attachmentPath ? (
                <Typography
                  mr={1}
                  variant="h5"
                  component="a"
                  color="blue"
                  href={fileData?.attachmentPath}
                  target="_blank"
                >
                  {getFileNameWithEllipsis(fileData?.attachmentName, 20)}
                </Typography>
              ) : (
                <Typography mr={1} variant="h5">
                  {getFileNameWithEllipsis(fileData?.attachmentName, 20)}
                </Typography>
              )}

              <Box display="flex" alignItems="center">
                <Box mx={0.5}>
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
                    marginRight: "15px",
                  }}
                  onClick={(e) => {
                    let temp = [...uploadedDocuments];

                    temp.splice(ind, 1);

                    setUploadedDocuments([...temp]);
                    form.setFieldValue("identityAttachments", [...temp]);

                    e.stopPropagation();
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default IdentityDocumentsUpload;
