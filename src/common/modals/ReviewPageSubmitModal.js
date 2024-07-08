import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ReviewPageSubmitModal(props) {
  const { open, title, description, handleSubmit, setOpenModal } = props;

  return (
    <Dialog
      open={open}
      onClose={() => setOpenModal(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpenModal(false)}
          variant="contained"
          color="error"
          sx={{ marginRight: "10px" }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          variant="contained"
          color="success"
          autoFocus
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
