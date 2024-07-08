import { Typography } from "@mui/material";

const CheckDescription = ({ description }) => {
  return (
    <Typography marginBottom={"20px"} variant="body1" gutterBottom>
      {description}
    </Typography>
  );
};

export default CheckDescription;
