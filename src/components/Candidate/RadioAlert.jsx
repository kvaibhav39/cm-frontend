import { InfoOutlined } from "@mui/icons-material";
import {
  FormControlLabel,
  Radio,
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
import CustomTooltip from '../common/CustomTooltip'

const RadioAlert = ({ label, tooltip }) => {
  return (
    <>
      <Alert
        icon={
          <CustomTooltip title={tooltip}>
            <InfoOutlined style={{ color: "#5874F6" }} />
          </CustomTooltip>
        }
        style={{
          color: "#565261",
          maxWidth: "1200px",
          border: "1px solid #6983f6",
          wordBreak: "break-word",
          backgroundColor: "#fff",
        }}
      >
        <FormControlLabel
          control={
            <Typography
              style={{
                margin: "0 0 0 10px",
                fontSize: "0.875rem",
                fontWeight: "400",
                color: "#616161",
                lineHeight: "1.334em",
              }}
            />
          }
          label={label}
        />
      </Alert>      
    </>
  );
};

export { RadioAlert };
