import { useState } from "react";
import { Box, Stack, styled, Typography } from "@mui/material";
import { useEffect } from "react";

const StyledBaseUpload = styled(Box)`
  position: relative;
  .bu-header {
    z-index: 1;
    display: flex;
    min-height: 56px;
    align-items: center;
    background-color: ${(v) => `${v.headerbg || "white"}`};
  }
  .bu-body {
    position: relative;
    text-align: center;
    margin-top: -1rem;
    background-color: ${(v) => `${v.bg || "white"}`};
  }
  .bu-body,
  .bu-header {
    position: relative;
    border-radius: ${(v) => `${v.radius || "12px"}`};
    border: 1px solid ${(v) => `${v.bordercolor || "#dadce0"}`};
  }
  .bu-upload-icon {
    width: 48px;
    height: 48px;
    color: #5874f6;
  }
`;

const BaseUpload = ({
  accept = "images/*",
  bg = "#F2F5FE",
  headerbg = "#F5F5F5",
  bordercolor = "#D6D6D6",
  radius = "12px",
  label = "Upload Your Files",
  onChange = () => {},
  uploadFileName = "",
  ...props
}) => {
  const [files, setFiles] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState(uploadFileName);

  const handleChange = (e) => {
    setUploadedFileName("");
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      // setFiles([...e.target.files]);
      // onChange(props.multiple ? [...e.target.files] : e.target.files[0]);
      console.log([e.target.files[0], ...files]);
      setFiles([e.target.files[0], ...files]);
      onChange(
        props.multiple ? [e.target.files[0], ...files] : e.target.files[0]
      );
    }
  };
  console.log(props.multiple);

  return (
    <StyledBaseUpload
      bg={bg}
      radius={radius}
      headerbg={headerbg}
      bordercolor={bordercolor}
      {...props}
    >
      {props?.attachFileErr?.length
        ? props.attachFileErr.map(
            (curr, ind) =>
              curr.errFileName === props?.checkName && (
                <Typography
                  key={ind}
                  color="red"
                  fontSize={{ xs: "16px", md: "17px" }}
                  style={{ wordBreak: "break-word", marginTop: "-20px" }}
                >
                  Please Attach a File*
                </Typography>
              )
          )
        : null}

      <Box
        className="bu-header"
        p={{ xs: 2, md: "0.5rem 2rem" }}
        id={props.id}
        mt={1}
      >
        <Typography
          fontWeight={600}
          color="#565261"
          fontSize={{ xs: "16px", md: "17px" }}
          style={{ wordBreak: "break-word" }}
        >
          {label}
        </Typography>
      </Box>
      <Box className="bu-body" p={{ xs: 2, md: "4rem 6rem 3rem 4rem" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="bu-upload-icon feather feather-upload"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <Typography variant="h4" my={1} sx={{ color: "#73707C" }}>
          Click to{" "}
          <Typography
            variant="span"
            sx={{ color: "#527AFB", fontSize: "1rem" }}
          >
            Select File
          </Typography>{" "}
          or Drop Files Here
        </Typography>
        <Typography
          variant="p"
          sx={{ color: "#73707C", wordBreak: "break-word" }}
        >
          Your file should be in one of these
          formats(.pdf,.doc,.docx,.jpg,.jpeg)
        </Typography>
        <Stack direction="column" spacing={2}>
          {files.map((file, index) => (
            <Typography
              key={index}
              sx={{ color: "#646464", wordBreak: "break-word" }}
            >
              {file.name} ({file.size})
            </Typography>
          ))}
          {uploadedFileName
            ? uploadedFileName !== "" && (
                <Typography sx={{ color: "#646464", wordBreak: "break-word" }}>
                  {uploadedFileName}
                </Typography>
              )
            : ""}
        </Stack>
        <input
          style={{
            top: "0",
            left: "0",
            opacity: "0",
            width: "100%",
            height: "100%",
            cursor: "pointer",
            position: "absolute",
          }}
          type="file"
          accept={accept}
          multiple={props.multiple}
          onChange={handleChange}
        />
      </Box>
    </StyledBaseUpload>
  );
};

export { BaseUpload };
