import { Grid, Typography } from "@mui/material";
import React from "react";
import CustomTooltip from "../../../../../../../../common/CustomTooltip";
import { Delete, InfoOutlined } from "@mui/icons-material";

const AddedCheckHeader = ({ selectedCheckData, handleRemoveCheck }) => {
  return (
    <Grid container xs={12} display="flex" alignItems="center">
      <Grid
        item
        xs={8}
        sm={10}
        md={11}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <CustomTooltip
          title={selectedCheckData?.checkDescription}
          placement="bottom-start"
          onClick={(e) => e.stopPropagation()}
          tooltipmaxwidth="50vw"
        >
          <InfoOutlined
            color="secondary"
            style={{ marginTop: "-1px", marginRight: "1px" }}
          />
        </CustomTooltip>
        <Typography
          fontWeight={500}
          color="#000"
          textAlign="center"
          fontSize={{ xs: "12px", md: "16px" }}
        >
          {selectedCheckData?.checkName}
        </Typography>
      </Grid>
      <Grid
        item
        xs={4}
        sm={2}
        md={1}
        display="flex"
        justifyContent={{ xs: "flex-start", md: "center" }}
      >
        <Delete color="error" onClick={handleRemoveCheck} />
      </Grid>
    </Grid>
  );
};

export default AddedCheckHeader;
