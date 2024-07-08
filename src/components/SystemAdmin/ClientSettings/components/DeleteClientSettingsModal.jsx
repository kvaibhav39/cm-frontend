import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const DeleteClientSettingsModal = ({
  open,
  handleClose,
  handleDelete,
  deleteText = "Custom Field will be permanently deleted!",
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          minWidth: 500,
          minHeight: 250,
        }}
      >
        <DialogTitle>
          <Typography variant="h2" style={{ fontWeight: "normal" }}>
            Delete
          </Typography>
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <Alert
            variant="outlined"
            severity="error"
            style={{
              backgroundColor: "rgba(234, 84, 85, 0.25)",
              color: "rgba(234, 84, 85, 1)",
              fontWeight: "500",
            }}
          >
            {deleteText}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button variant="standard" onClick={handleClose} disableElevation>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={()=> {handleDelete(); handleClose();}}
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DeleteClientSettingsModal;
