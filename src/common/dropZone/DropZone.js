import { UploadOutlined } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { ERROR } from "../../store/constant";
import { useDispatch } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

function DropZone({ open, setUploadedLogo }) {
  const dispatch = useDispatch();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        if (reader.readyState === 2) {
          // console.log(reader.result);
          setUploadedLogo(reader.result);
        }
      };

      if (
        acceptedFiles[0]?.type.includes("jpeg") ||
        acceptedFiles[0]?.type.includes("jpg") ||
        acceptedFiles[0]?.type.includes("png")
      ) {
        reader.readAsDataURL(acceptedFiles[0]);
      } else {
        let logDetails = getCurrentFileNameAndFunction(import.meta.url,'onDrop');
        dispatch(
          setToastNotification(
            ERROR,
            "Please upload a .jpeg, .jpg, .png file only!",
            logDetails
          )
        );
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Grid
      container
      item
      direction="column"
      alignItems={"center"}
      xs={12}
      sm={3}
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          <UploadOutlined />
          <Typography>
            <b>Drop_Drop</b> File Here
          </Typography>

          <Typography>OR</Typography>
          <Button variant="outlined">Click To Upload</Button>
        </div>
      </div>
    </Grid>
  );
}

export default DropZone;
