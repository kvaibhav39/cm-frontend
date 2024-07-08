import { Alert, Box, Button, Grid, Modal, Typography } from "@mui/material";
import React from "react";

const DeleteConfirmationModal = ({
  open,
  handleClose,
  handleDeleteFailedData,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40vw",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    padding: 4,
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h4' mb={3}>
          Remove registration entry
        </Typography>
        <Alert
          variant="outlined"
          severity="error"
          style={{
            backgroundColor: "rgba(234, 84, 85, 0.25)",
            color: "rgba(234, 84, 85, 1)",
            fontWeight: "500",
          }}
        >
          Please click Delete to confirm.
        </Alert>
        <Grid
          container
          item
          xs={12}
          direction="row"
          justifyContent={"flex-end"}
          gap={2}
          sx={{
            margin: "1rem 0",
          }}
        >
          <Button
            variant="standard"
            disableElevation
            sx={{
              backgroundColor: "transparent",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            sx={{
              backgroundColor: "rgba(234, 84, 85, 1)",
            }}
            disableElevation
            onClick={handleDeleteFailedData}
          >
            Delete
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
