import {
  CLEAR_NOTIFICATION_STORE,
  HIDE_TOAST_NOTIFICATION,
  SET_TOAST_NOTIFICATION,
} from "./actionTypes";

export const clearToastNotificationStore = () => {
  return {
    type: CLEAR_NOTIFICATION_STORE,
  };
};

export const setToastNotification = (
  status,
  notification,
  position
) => {
  return {
    type: SET_TOAST_NOTIFICATION,
    status,
    notification: notification || "Operation is successful!",
    position
  };
};

export const hideToastNotification = () => {
  return {
    type: HIDE_TOAST_NOTIFICATION,
  };
};
