import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { hideToastNotification } from "../../store/actions/toastNotificationActions";
import { deleteToken } from "./../../store/actions/authorizationAction";
import { uploadLogs } from "./../../store/actions/helperActions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ToastNotifications = (props) => {
  const isOpen = useSelector((state) => state.toastNotification.isOpen);
  const error = useSelector((state) => state.toastNotification.notification);
  const severity = useSelector((state) => state.toastNotification.status);
  const position = useSelector((state) => state.toastNotification.position);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error && position && severity) {
      let payload = {
        errorMsg: error,
        errorPosition: position,
        level: severity === "success" ? "info" : severity,
      };
      dispatch(uploadLogs(payload));
    }
  }, [isOpen, error, severity, position]);

  function handleClose() {
    dispatch(hideToastNotification());

    //when the api error sends 401 unauthorized error , we will logout the user
    if (error === "Unauthorized!") {
      deleteToken();
      window.location.reload();
    }
  }

  return (
    <>
      {isOpen && error && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={isOpen}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{
              width: "100%",
              color: "#fff",
              whiteSpace: "pre-line",
              textTransform: "capitalize",
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default ToastNotifications;
