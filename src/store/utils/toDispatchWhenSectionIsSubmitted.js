import { CANDIDATE_SECTION_LOADING } from "../actions/actionTypes";

export const toDispatchWhenSectionIsSubmitted = (dispatch, CONSTANT, res) => {
  dispatch({ type: CONSTANT, payload: res.data.data });
  dispatch({ type: CANDIDATE_SECTION_LOADING, payload: false });
};
