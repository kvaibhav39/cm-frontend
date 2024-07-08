import { Grid } from "@mui/material";
import { Apartment, PeopleAlt } from "@mui/icons-material";
import DashboardCardComponent from "./common/DashboardCardComponent";
import { useEffect } from "react";
import { getOpsStatistics } from "../../../store/actions/operationActions";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const OperationsDashboard = () => {
  const dispatch = useDispatch();
  const { opsStatistics } = useSelector((state) => state.operations);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );
    dispatch(getOpsStatistics(logDetails));
  }, []);

  return (
    <Grid
      container
      display="flex"
      justifyContent="space-evenly"
      gap={2}
      p={{ xs: 1, sm: 3 }}
      xs={12}
    >
      <Grid item md={5.5} xs={12} mt={{ xs: 4, md: 0 }}>
        <DashboardCardComponent
          heading="Organizations"
          numbers={opsStatistics?.hrOrganizationsCount}
          icon={Apartment}
        />
      </Grid>
      <Grid item md={5.5} xs={12} mt={{ xs: 4, md: 0 }}>
        <DashboardCardComponent
          heading="Candidates"
          numbers={opsStatistics?.candidateCasesCount}
          icon={PeopleAlt}
        />
      </Grid>
    </Grid>
  );
};

export default OperationsDashboard;
