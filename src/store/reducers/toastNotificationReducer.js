import {
  CLEAR_NOTIFICATION_STORE,
  HIDE_TOAST_NOTIFICATION,
} from "../actions/actionTypes";

const initState = {
  notification: null,
  status: null,
  isOpen: false,
  position: "",
};

export default function toastNotificationReducer(state = initState, action) {
  const { status, notification, position } = action;

  if (notification) {
    return {
      notification,
      status,
      isOpen: true,
      position,
    };
  } else if (action.type === HIDE_TOAST_NOTIFICATION) {
    return {
      notification: null,
      status: null,
      isOpen: false,
      position,
    };
  } else if (action.type === CLEAR_NOTIFICATION_STORE) {
    return { ...initState };
  }

  return state;
}
