import {
  CLEAR_STORE,
  GET_ALL_INDUSTRIES,
  GET_ORGANIZATIONS,
  HR_DASHBOARD_STATISTICS,
  LOADING
} from "../actions/actionTypes";

const initialState = {
  loading:false,
  organizations: [],
  allIndustries: null,
  hrDashboardStatistics: null,
};

export default function organizationsReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case GET_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case GET_ALL_INDUSTRIES: {
      let tempIndustries = [];

      action.payload?.map((industry) => {
        tempIndustries.push({
          label: industry.industryName,
          id: industry.industriesId,
        });
      });

      return {
        ...state,
        allIndustries: tempIndustries,
      };
    }
    case HR_DASHBOARD_STATISTICS:
      return {
        ...state,
        hrDashboardStatistics: action.payload,
      };
    case CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
