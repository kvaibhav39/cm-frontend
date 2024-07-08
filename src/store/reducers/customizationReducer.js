// action - state management
import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  isOpen: [], // for active default menu
  opened: true,
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
  let id;
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id],
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened,
      };
      case actionTypes.CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
};

export default customizationReducer;
