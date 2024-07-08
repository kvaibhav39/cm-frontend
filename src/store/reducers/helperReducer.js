import {
  CLEAR_STORE,
  GET_ALL_COUNTRIES,
  GET_CHECKS_DATA_BASED_ON_COUNTRY,
  GET_QUERY_OPERATIONS_LISTS,
  GET_QUERY_OPERATION_RESULT_LISTS,
  LOADING,
  SET_SELECTED_QUERY_OPERATION,
} from "../actions/actionTypes";

const initialState = {
  checksDataBasedOnCountry: [],
  allCountries: null,
  allCountriesModified: null,
  queryOperationsLists: null,
  queryOperationResultLists: null,
  selectedQueryOperation: null,
  loading: false,
};

export default function helperReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHECKS_DATA_BASED_ON_COUNTRY:
      return {
        ...state,
        checksDataBasedOnCountry: [
          ...state.checksDataBasedOnCountry,
          action.payload,
        ],
      };
    case GET_ALL_COUNTRIES: {
      let tempModified = [];

      action.payload?.map((country) =>
        tempModified.push({
          label: country.name,
          value: country.countryMasterId,
        })
      );

      return {
        ...state,
        allCountries: action.payload,
        allCountriesModified: tempModified,
      };
    }
    case GET_QUERY_OPERATIONS_LISTS:
      return {
        ...state,
        queryOperationsLists: action.payload,
      };
    case GET_QUERY_OPERATION_RESULT_LISTS:
      return {
        ...state,
        queryOperationResultLists: action.payload,
      };
    case SET_SELECTED_QUERY_OPERATION:
      return {
        ...state,
        selectedQueryOperation: action.payload,
      };
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
