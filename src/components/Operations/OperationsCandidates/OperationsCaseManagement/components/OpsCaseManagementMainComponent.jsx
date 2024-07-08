import { Grid } from "@mui/material";
import CMOverview from "./innerComponents/CMOverview";
import CMCheckStatus from "./innerComponents/CMCheckStatus";
import CMReportUpload from "./innerComponents/CMReportUpload";
import CMInternalUploads from "./innerComponents/CMInternalUploads";
import CMAttachments from "./innerComponents/CMAttachments";
import CMCaseAuditTrailActivity from "./innerComponents/CMCaseAuditTrailActivity";
import CMAddResearchCountryInChecks from "./innerComponents/CMAddResearchCountryInChecks";
import { useDispatch, useSelector } from "react-redux";
import { HIDE_OPS_CM_SECTION } from "../../../../../store/actions/actionTypes";
import CMHeading from "./innerComponents/CMHeading";

const OpsCaseManagementMainComponent = ({ smallDevice }) => {
  const dispatch = useDispatch();
  const { toHideOpsCMSection } = useSelector((state) => state.operations);

  return (
    <Grid
      xs={12}
      p={1}
      display="flex"
      flexDirection="column"
      gap={3}
      mt={{ xs: 8, md: 0 }}
      pr={1.5}
    >
      {smallDevice && (
        <Grid xs={12}>
          <CMHeading />
        </Grid>
      )}
      <Grid xs={12}>
        <CMOverview />
      </Grid>
      <Grid xs={12}>
        <CMCaseAuditTrailActivity />
      </Grid>
      <Grid
        xs={12}
        display={
          toHideOpsCMSection === "CMAddResearchCountryInChecks"
            ? "none"
            : "block"
        }
      >
        <CMAddResearchCountryInChecks
          toHideCMAddResearchCountryInChecks={() =>
            dispatch({
              type: HIDE_OPS_CM_SECTION,
              payload: "CMAddResearchCountryInChecks",
            })
          }
          toShowCMAddResearchCountryInChecks={() =>
            dispatch({
              type: HIDE_OPS_CM_SECTION,
              payload: null,
            })
          }
        />
      </Grid>   
      <Grid xs={12}>
        <CMCheckStatus />
      </Grid>
      {/* <Grid  xs={12}>
        <CMReportUpload />
      </Grid>
      <Grid  xs={12}>
        <CMInternalUploads />
      </Grid>
      <Grid  xs={12}>
        <CMAttachments />
      </Grid> */}{" "}
    </Grid>
  );
};

export default OpsCaseManagementMainComponent;
