import React, { memo, useCallback, useEffect } from "react";
import OperationsCandidatesSidebar from "./components/OperationsCandidatesSidebar";
import OperationsCandidatesTable from "./components/OperationsCandidatesTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getOPScandidates,
  getOPSsubCheckLists,
  getOrgsListsByOpsUserId,
} from "../../../store/actions/operationActions";
import OperationsLayout from "../Layout/OperationsLayout";
import ViewCandidateInHR from "../../../common/ViewCandidateInHR";
import {
  GET_OPS_CANDIDATES,
  SET_OPS_COMPONENT,
} from "../../../store/actions/actionTypes";
import { useSearchParams } from "react-router-dom";
import { rangeSelectors } from "../../constants/filterData";
import { getExtractPathWithParams } from "../../../utils/getExtractedPathWithParams";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import moment from "moment";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction.js";

const OperationsCandidates = memo(() => {
  const dispatch = useDispatch();
  const { opsComponent, OpsCandidatesList, totalCandidateCaseCount } =
    useSelector((state) => state.operations);
  const [searchParams, setSearchParams] = useSearchParams();

  let currentLoginProfile = localStorage.getItem("loginProfile");

  let { CheckMinistryUser } = JSON.parse(
    localStorage.getItem(`${currentLoginProfile}_login`)
  );

  const loggedInUser = JSON.parse(CheckMinistryUser);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );
    dispatch(
      getOrgsListsByOpsUserId({ opsUserId: loggedInUser?.usersId }, logDetails)
    );
  }, []);

  useEffect(() => {
    getFilteredCandidates();
  }, [searchParams]);

  //filter search params for fetching candidates
  let getFilteredCandidates = useCallback(() => {
    const filterParams = {
      toggledOpsTableView:
        searchParams.get("toggledOpsTableView") || "candidates",
      hrOrganizationIds: searchParams.get("hrOrganizationIds") || "all",
      verificationProcessId: searchParams.get("verificationProcessId") || "2,3",
      verificationResultId: searchParams.get("verificationResultId") || "3",
      internalStatusId:
        searchParams.get("internalStatusId") || "1,5,6,7,8,9,10,11,12",
      searchText: searchParams.get("searchText") || "",
      pageNumber: searchParams.get("pageNumber") || "1",
      fromDate:
        searchParams.get("fromDate") || rangeSelectors[1]?.dates?.fromDate,
      toDate: searchParams.get("toDate") || rangeSelectors[1]?.dates?.toDate,
      dateRange: searchParams.get("dateRange") || 1,
    };

    //setting params to url
    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        ...filterParams,
      });
    });

    if (
      filterParams?.hrOrganizationIds &&
      filterParams?.verificationProcessId &&
      filterParams?.verificationResultId
    ) {
      delete filterParams?.dateRange;

      const from = moment(filterParams?.fromDate);
      const to = moment(filterParams?.toDate);
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "getFilteredCandidates"
      );

      // Compare the dates
      if (from >= to) {
        dispatch(
          setToastNotification(
            ERROR,
            "From date should be smaller than To date",
            logDetails
          )
        );
        dispatch({
          type: GET_OPS_CANDIDATES,
          payload: {
            data: OpsCandidatesList || [],
            totalCandidateCaseCount: totalCandidateCaseCount || 0,
          },
        });
      } else {
        if (filterParams?.toggledOpsTableView === "candidates") {
          delete filterParams?.internalStatusId;
          delete filterParams?.toggledOpsTableView;

          dispatch(getOPScandidates(filterParams, logDetails));
        } else {
          filterParams.verificationProcessId = filterParams?.internalStatusId;
          delete filterParams?.internalStatusId;
          delete filterParams?.toggledOpsTableView;

          dispatch(getOPSsubCheckLists(filterParams,logDetails));
        }

        localStorage.setItem(
          "OpsCandidateFilterUrl",
          JSON.stringify(getExtractPathWithParams())
        );
      }
    }
  }, [searchParams]);

  const setOpsComponent = (value) => {
    dispatch({ type: SET_OPS_COMPONENT, payload: value });
  };

  return (
    <>
      {isNaN(opsComponent) ? (
        <OperationsLayout
          SidebarComponent={<OperationsCandidatesSidebar />}
          MainComponent={
            <OperationsCandidatesTable
              setOpsComponent={setOpsComponent}
            />
          }
        />
      ) : (
        <ViewCandidateInHR
          candidatesCasesId={opsComponent}
          setOpsComponent={setOpsComponent}
        />
      )}
    </>
  );
});

export default OperationsCandidates;
