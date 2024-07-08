import { Chip } from "@mui/material";

const ProcessStatus = (props) => {
  const INPROGRESS = { color: "#F59008", backgroundColor: "#FFF6E1" };
  const COMPLETED = { color: "#00C95C", backgroundColor: "#D9F9EB" };
  const TERMINATED = { color: "#6E6B7B", backgroundColor: "#F3F2F7" };
  const WAITING = { color: "#EA5455", backgroundColor: "#FAE5E5" };
  let statusColor = TERMINATED;
  switch (props?.processStatus) {
    case "In Progress":
      statusColor = INPROGRESS;
      break;
    case "Completed":
      statusColor = COMPLETED;
      break;
    case "Waiting Third Party":
      statusColor = WAITING;
      break;
  }
  return (
    <Chip
      label={props?.processStatus}
      size={props?.size || 'small'}
      sx={statusColor}
    />
  );
};

export default ProcessStatus;
