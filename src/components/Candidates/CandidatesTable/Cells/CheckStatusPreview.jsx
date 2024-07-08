import { Box, Chip, Stack, Typography } from "@mui/material";
import { useState } from "react";
import StatusPreviewModal from "../Modals/StatusPreviewModal";
import CustomTooltip from "../../../common/CustomTooltip";

const CheckStatusPreview = ({
  data,
  assignedChecks = [],
  selectedPackageName,
  width = "22px",
  height = "22px",
  fontSize = "12px",
}) => {
  const [statusPreviewModal, setStatusPreviewModal] = useState(false);
  return (
    <Box
      borderRadius="4rem"
      padding="0.25rem 0.5rem"
      sx={{ backgroundColor: "#F2F4FE" }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing="4px">
          <CustomTooltip title={data?.noDiscrepancy?.tooltip}>
            <Chip
              label={data?.noDiscrepancy?.count}
              size="small"
              sx={{
                color: "#00C95C",
                backgroundColor: "#D9F9EB",
                fontSize: { fontSize },
                width: { width },
                height: { height },
                "> span": {
                  padding: 0,
                },
              }}
            />
          </CustomTooltip>
          <CustomTooltip title={data?.majorDiscrepancy?.tooltip}>
            <Chip
              label={data?.majorDiscrepancy?.count}
              size="small"
              sx={{
                color: "#FF989A",
                backgroundColor: "#FBDDE2",
                fontSize: { fontSize },
                width: { width },
                height: { height },
                "> span": {
                  padding: 0,
                },
              }}
            />
          </CustomTooltip>
          <CustomTooltip title={data?.minorDiscrepancy?.tooltip}>
            <Chip
              label={data?.minorDiscrepancy?.count}
              size="small"
              sx={{
                color: "#FCBB68",
                backgroundColor: "#FDF0D4",
                fontSize: { fontSize },
                width: { width },
                height: { height },
                "> span": {
                  padding: 0,
                },
              }}
            />
          </CustomTooltip>
          <CustomTooltip title={data?.unableToVerify?.tooltip}>
            <Chip
              label={data?.unableToVerify?.count}
              size="small"
              sx={{
                color: "#90919C",
                backgroundColor: "#DCDDE1",
                fontSize: { fontSize },
                width: { width },
                height: { height },
                "> span": {
                  padding: 0,
                },
              }}
            />
          </CustomTooltip>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CustomTooltip title={data?.waitingThirdParty?.tooltip}>
            <Chip
              label={data?.waitingThirdParty?.count}
              size="small"
              sx={{
                color: "#FF989A",
                backgroundColor: "#FBDDE2",
                fontSize: { fontSize },
                width: { width },
                height: { height },
                "> span": {
                  padding: 0,
                },
              }}
            />
          </CustomTooltip>
          <CustomTooltip
            title={`${data?.completed?.tooltip}/${data?.total?.tooltip}`}
          >
            <Typography
              fontSize={fontSize}
              sx={{ cursor: "pointer" }}
              onClick={() => setStatusPreviewModal(true)}
            >
              {data?.completed?.count}/{data?.total?.count-1}
            </Typography>
          </CustomTooltip>
        </Stack>
      </Stack>
      {statusPreviewModal && assignedChecks?.length ? (
        <StatusPreviewModal
          open={statusPreviewModal}
          handleClose={() => setStatusPreviewModal(false)}
          assignedChecks={assignedChecks}
          selectedPackageName={selectedPackageName}
        />
      ) : null}
    </Box>
  );
};

export default CheckStatusPreview;
