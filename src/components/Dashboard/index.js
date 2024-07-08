import { Grid } from "@mui/material";
import Cards from "./Cards";
import PanelCard from "../../common/cards/PanelCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { omitEmpties } from "../../utils/ObjectHelper";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import TeamRangeSelection from "../common/TeamRangeSelection";
import ScrollableGrid from "../../common/ScrollableGrid";
import { getOrganizationStatistics } from "../../store/actions/organizationAction";
import { useDispatch } from "react-redux";
import moment from "moment";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { ERROR } from "../../store/constant";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const Dashboard = () => {
  const [filter, setFilter] = useState({});
  const dispatch = useDispatch();

  const params = useMemo(() => {
    return omitEmpties(filter);
  }, [filter]);

  const loadStatisticsData = useCallback(() => {
    delete params?.rangeValue;

    const from = moment(params?.fromDate);
    const to = moment(params?.toDate);

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "loadStatisticsData"
    );

    // Compare the dates
    if (from >= to) {
      return dispatch(
        setToastNotification(
          ERROR,
          "From date should be smaller than To date",
          logDetails
        )
      );
    }

    dispatch(
      getOrganizationStatistics(
        params,
        {
          orgId: getLoggedInUserHrOrganizationId(),
        },
        logDetails
      )
    );
  }, [params]);

  useEffect(() => {
    Object.keys(params).length && loadStatisticsData();
  }, [params]);

  return (
    <ScrollableGrid container spacing={2}>
      <Grid item md={2} sm={12} xs={12} mt={{ xs: 10, md: 0 }}>
        <PanelCard>
          <TeamRangeSelection onChange={(v) => setFilter(v)} />
        </PanelCard>
      </Grid>
      <ScrollableGrid item md={10} xs={12} applyScrollToScreenAndBelow={false}>
        <PanelCard>
          <Cards />
        </PanelCard>
      </ScrollableGrid>
    </ScrollableGrid>
  );
};

export default Dashboard;
