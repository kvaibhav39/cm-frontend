import { Close } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { Buffer } from "buffer";

const Signature = ({
  onChange = () => {},
  headerMessage = "Draw your Signatures",
  canvasCleared,
  setCanvasCleared,
  candidateConsentSubmitted,
  candidateConsentSignature,
}) => {
  const sigCanvas = useRef(null);

  useEffect(() => {
    if (candidateConsentSignature && candidateConsentSignature !== "") {
      sigCanvas?.current?.fromDataURL(
        Buffer.from(candidateConsentSignature, "base64").toString()
      );
      setCanvasCleared(false);
    }
  }, [candidateConsentSubmitted, candidateConsentSignature]);

  const save = () => {
    if (!sigCanvas.current) return;
    if (sigCanvas.current.isEmpty()) return;

    let base64 = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

    onChange(base64);
    setCanvasCleared(true);
  };

  const handleClear = () => {
    sigCanvas?.current?.clear();
    onChange("");
    setCanvasCleared(true);
  };

  return (
    <Grid
      item
      xs={12}
      sx={{
        marginBottom: "1rem",
        pointerEvents: candidateConsentSubmitted ? "none" : "all",
      }}
    >
      <div onMouseUp={save} onTouchEnd={save}>
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={{ marginBottom: "0.5rem" }}>
            {headerMessage}
          </Typography>

          {!sigCanvas?.current?.isEmpty() && !candidateConsentSubmitted && (
            <IconButton size="small" onClick={handleClear}>
              <Close fontSize="14px" />
            </IconButton>
          )}
        </Box>
        {canvasCleared ? (
          <div
            style={{
              border: "2px dotted lightgrey",
              width: "100%",
              borderRadius: "10px",
              height: "200px",
            }}
          >
            <SignaturePad
              ref={sigCanvas}
              canvasProps={{
                style: {
                  width: "100%",
                  cursor: "pointer",
                  height: "200px",
                },
              }}
            />
          </div>
        ) : (
          <div
            style={{
              border: "2px dotted lightgrey",
              width: "100%",
              borderRadius: "10px",
              height: "200px",
            }}
          >
            <img
              src={Buffer.from(candidateConsentSignature, "base64").toString()}
              alt="Sign"
              style={{
                display: "block",
                margin: "auto",
                maxWidth: "100%",
                height: "200px",
                pointerEvents: "none",
                transform: "scale(0.7)",
              }}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </Grid>
  );
};

export default Signature;
