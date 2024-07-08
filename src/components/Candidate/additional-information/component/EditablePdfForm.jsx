import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setToastNotification } from "../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../store/constant";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

function EditablePdfForm({
  theme,
  formId,
  uploadFiles,
  toCacheValues,
  setUploadFiles,
}) {
  const signatureCanvasRef = useRef();
  const signatureCanvasRef2 = useRef();
  const pdfUrlRef = useRef(null);
  const pdfFileRef = useRef("");
  const [pdfUrl, setPdfUrl] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    signatureCanvasRef.current?.clear();
    signatureCanvasRef2.current?.clear();
  }, []);

  useEffect(() => {
    if (uploadFiles?.length) {
      let fileUrl = null;
      let selectedFile = uploadFiles?.find((curr) => curr?.formId === formId);
      pdfFileRef.current = selectedFile?.file;

      if (!selectedFile?.savedFormCdnPath) {
        if (selectedFile?.file) {
          fileUrl = URL.createObjectURL(selectedFile?.file);
        }
      } else {
        fileUrl = selectedFile?.savedFormCdnPath;
      }

      pdfUrlRef.current = fileUrl;
      setPdfUrl(fileUrl);
    }
  }, [formId, uploadFiles]);

  const updateSignatureForFormId = async (url = pdfUrl, params) => {
    try {
      let {
        signRef,
        signPadName,
        pageNo,
        signatureX,
        signatureY,
        signImageOffsetOnPDF,
        signImgWidth,
      } = params;

      const signatureImage = signRef.current.toDataURL();
      const existingPDFBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPDFBytes);

      const signatureImageBytes = await fetch(signatureImage).then((res) =>
        res.arrayBuffer()
      );
      const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);

      const { width, height } = pdfDoc.getPages()[pageNo].getSize();

      const firstPage = pdfDoc.getPages()[pageNo];

      firstPage.drawImage(signatureImageEmbed, {
        x: signatureX,
        y:
          height -
          signatureY -
          signatureImageEmbed.height +
          signImageOffsetOnPDF,
        width: signImgWidth,
        height: signatureImageEmbed.height - signImageOffsetOnPDF,
      });

      const modifiedPDFBytes = await pdfDoc.save();
      // to view

      const pdfData = new Blob([modifiedPDFBytes], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(pdfData));
      pdfUrlRef.current = URL.createObjectURL(pdfData);
      // console.log("URL.createObjectURL(pdfData)", URL.createObjectURL(pdfData));
      const file = new File([pdfData], pdfFileRef.current?.name, {
        type: "application/pdf",
      });

      let tempState = [];

      uploadFiles?.forEach((form) => {
        let tempObject = { ...form };
        if (formId === form.formId) {
          tempObject.file = file;
        }
        tempState.push(tempObject);
      });

      console.log("updated-uploadFiles", uploadFiles, tempState);

      setUploadFiles(tempState);

      if (
        signPadName === "ausForm-applicant" ||
        signPadName === "hongkongform"
      ) {
        //saving flag if sign is present
        let temp = [...toCacheValues.current]?.map((form) => {
          if (formId === form.formId) {
            form.isSigned = signRef.current?.isEmpty() ? false : true;
          }
          return form;
        });

        toCacheValues.current = [...temp];
      }
    } catch (error) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "updateSignatureForFormId"
      );
      return dispatch(
        setToastNotification(
          ERROR,
          "Please Upload a Valid PDF File",
          logDetails
        )
      );
    }
  };

  const clearSignatureFunctionality = async (url = pdfUrl, params) => {
    try {
      let {
        signRef,
        signPadName,
        pageNo,
        signatureX,
        signatureY,
        signImageOffsetOnPDF,
        signImgWidth,
      } = params;

      const blankImageData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

      //for testing
      // const blankImageData =
      //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==";

      const existingPDFBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPDFBytes);

      const signatureImageBytes = await fetch(blankImageData, {
        headers: {
          "Content-Type": "image/png",
        },
      })
        .then((res) => res.arrayBuffer())
        .catch((err) => {
          console.error(err);
          return new ArrayBuffer(0);
        });

      const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);

      const { width, height } = pdfDoc.getPages()[pageNo].getSize();

      const firstPage = pdfDoc.getPages()[pageNo];

      firstPage.drawImage(signatureImageEmbed, {
        x: signatureX,
        y: height - signatureY - signatureImageEmbed.height,
        width: signImgWidth,
        height: signatureImageEmbed.height + signImageOffsetOnPDF,
      });

      const modifiedPDFBytes = await pdfDoc.save();
      // to view

      const pdfData = new Blob([modifiedPDFBytes], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(pdfData));
      pdfUrlRef.current = URL.createObjectURL(pdfData);
      console.log("URL.createObjectURL(pdfData)", URL.createObjectURL(pdfData));
      const file = new File([pdfData], pdfFileRef.current?.name, {
        type: "application/pdf",
      });

      let tempState = [];

      uploadFiles?.forEach((form) => {
        let tempObject = { ...form };
        if (formId === form.formId) {
          tempObject.file = file;
        }
        tempState.push(tempObject);
      });

      setUploadFiles(tempState);

      if (
        signPadName === "ausForm-applicant" ||
        signPadName === "hongkongform"
      ) {
        let temp = [...toCacheValues.current]?.map((form) => {
          if (formId === form.formId) {
            form.isSigned = signRef.current?.isEmpty() ? false : true;
          }
          return form;
        });

        toCacheValues.current = [...temp];
      }
    } catch (error) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "clearSignatureFunctionality"
      );
      return dispatch(
        setToastNotification(
          ERROR,
          "Please Upload a Valid PDF File",
          logDetails
        )
      );
    }
  };

  const saveSignature = async (signRef, signPadName) => {
    let updateParams = {};
    let clearParams = {};

    if (formId === 3) {
      if (signPadName === "ausForm-applicant") {
        clearParams = {
          signRef,
          signPadName,
          pageNo: 1,
          signatureX: 165,
          signatureY: 422,
          signImageOffsetOnPDF: 52,
          signImgWidth: 220,
        };

        updateParams = {
          signRef,
          signPadName,
          pageNo: 1,
          signatureX: 170,
          signatureY: 372,
          signImageOffsetOnPDF: 90,
          signImgWidth: 210,
        };
      } else if (signPadName === "ausForm-parent/gaurdian") {
        clearParams = {
          signRef,
          signPadName,
          pageNo: 1,
          signatureX: 165,
          signatureY: 503,
          signImageOffsetOnPDF: 52,
          signImgWidth: 220,
        };

        updateParams = {
          signRef,
          signPadName,
          pageNo: 1,
          signatureX: 170,
          signatureY: 453,
          signImageOffsetOnPDF: 90,
          signImgWidth: 210,
        };
      }
      await clearSignatureFunctionality(pdfUrlRef.current, clearParams);
      await updateSignatureForFormId(pdfUrlRef.current, updateParams);
      return;
    }

    clearParams = {
      signRef,
      signPadName,
      pageNo: 0,
      signatureX: 390,
      signatureY: 625,
      signImageOffsetOnPDF: 80,
      signImgWidth: 200,
    };

    updateParams = {
      signRef,
      signPadName,
      pageNo: 0,
      signatureX: 390,
      signatureY: 545,
      signImageOffsetOnPDF: 60,
      signImgWidth: 200,
    };

    await clearSignatureFunctionality(pdfUrlRef.current, clearParams);
    await updateSignatureForFormId(pdfUrlRef.current, updateParams);
  };

  const clearSignature = async (signRef, signPadName) => {
    let clearParams = {};

    if (formId === 3) {
      signRef.current?.clear();
      if (signPadName === "ausForm-applicant") {
        clearParams = {
          signRef,
          signPadName,
          pageNo: 1,
          signatureX: 165,
          signatureY: 422,
          signImageOffsetOnPDF: 52,
          signImgWidth: 220,
        };
      } else if (signPadName === "ausForm-parent/gaurdian") {
        clearParams = {
          signRef,
          signPadName,
          pageNo: 1,
          signatureX: 165,
          signatureY: 503,
          signImageOffsetOnPDF: 52,
          signImgWidth: 220,
        };
      }

      await clearSignatureFunctionality(pdfUrlRef.current, clearParams);
      return;
    }

    clearParams = {
      signRef,
      signPadName,
      pageNo: 0,
      signatureX: 390,
      signatureY: 625,
      signImageOffsetOnPDF: 80,
      signImgWidth: 200,
    };

    signatureCanvasRef.current?.clear();
    await clearSignatureFunctionality(pdfUrlRef.current, clearParams);
  };

  const toEnableSign = (checkRequired = true) => {
    let flag = true;

    uploadFiles?.forEach((file) => {
      if (file?.savedFormCdnPath) {
        flag = false;
      }

      if (checkRequired) {
        flag = toCacheValues.current
          ?.find((curr) => curr.formId == formId)
          .hasOwnProperty("isSigned")
          ? !toCacheValues.current?.find((curr) => curr.formId == formId)
              .isSigned
          : flag;
      }
    });

    return flag;
  };

  console.log("11111258", uploadFiles, toCacheValues.current);

  return (
    <Grid
      container
      display="flex"
      alignItems={{ xs: "center", md: "flex-start" }}
      flexDirection={{ xs: "column", md: "row" }}
    >
      {console.log("check-cond-comp", toEnableSign())}
      {toEnableSign() ? (
        <Grid item xs={12} mb={2}>
          <Typography variant="h4" fontWeight="500" textAlign="center">
            Please sign your form before submitting it
          </Typography>
        </Grid>
      ) : null}

      <Grid md={toEnableSign(false) ? 8 : 12} xs={12}>
        {pdfUrl ? (
          <div>
            <embed src={pdfUrl} width="100%" height="500px" />
            {/* Or use iframe instead:
        <iframe src={pdfUrl} title="PDF Viewer" width="100%" height="500px" />
        */}
          </div>
        ) : null}
      </Grid>
      {toEnableSign(false) ? (
        <>
          {formId === 1 ? (
            <Grid
              item
              md={4}
              xs={12}
              p={1}
              sx={{ background: theme.palette.grey[150], borderRadius: "5px" }}
            >
              <Typography
                variant="h4"
                fontWeight={500}
                textAlign="center"
                my={1}
              >
                Sign :{" "}
              </Typography>
              <Box sx={{ minWidth: "100%", background: "#fff" }}>
                <SignatureCanvas
                  ref={signatureCanvasRef}
                  canvasProps={{
                    style: {
                      width: "100%",
                      cursor: "pointer",
                      height: 100,
                    },
                  }}
                />
              </Box>
              <Box mt={2} display="flex" justifyContent="space-around">
                <Button
                  variant="contained"
                  onClick={() =>
                    clearSignature(signatureCanvasRef, "hongkongform")
                  }
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    saveSignature(signatureCanvasRef, "hongkongform")
                  }
                >
                  Save
                </Button>
              </Box>
            </Grid>
          ) : formId === 3 ? (
            <Grid
              item
              md={4}
              xs={12}
              p={1}
              sx={{ background: theme.palette.grey[150], borderRadius: "5px" }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  fontWeight={500}
                  textAlign="center"
                  my={1}
                >
                  Applicant's Sign* :{" "}
                </Typography>
                <Box sx={{ minWidth: "100%", background: "#fff" }}>
                  <SignatureCanvas
                    ref={signatureCanvasRef}
                    canvasProps={{
                      style: {
                        width: "100%",
                        cursor: "pointer",
                        height: 100,
                      },
                    }}
                  />
                </Box>
                <Box mt={2} display="flex" justifyContent="space-around">
                  <Button
                    variant="contained"
                    onClick={() =>
                      clearSignature(signatureCanvasRef, "ausForm-applicant")
                    }
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      saveSignature(signatureCanvasRef, "ausForm-applicant")
                    }
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} mt={5}>
                <Typography
                  variant="h4"
                  fontWeight={500}
                  textAlign="center"
                  my={1}
                >
                  Parent/Gaurdian's Sign :{" "}
                </Typography>
                <Box sx={{ minWidth: "100%", background: "#fff" }}>
                  <SignatureCanvas
                    ref={signatureCanvasRef2}
                    canvasProps={{
                      style: {
                        width: "100%",
                        cursor: "pointer",
                        height: 100,
                      },
                    }}
                  />
                </Box>
                <Box mt={2} display="flex" justifyContent="space-around">
                  <Button
                    variant="contained"
                    onClick={() =>
                      clearSignature(
                        signatureCanvasRef2,
                        "ausForm-parent/gaurdian"
                      )
                    }
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      saveSignature(
                        signatureCanvasRef2,
                        "ausForm-parent/gaurdian"
                      )
                    }
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : null}
        </>
      ) : null}
    </Grid>
  );
}

export default EditablePdfForm;
