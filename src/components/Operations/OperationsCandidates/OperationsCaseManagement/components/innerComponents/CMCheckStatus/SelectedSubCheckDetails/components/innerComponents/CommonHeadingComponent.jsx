import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const CommonHeadingComponent = ({ open, setOpen, IconComponent, title }) => {
  const { selectedCheckId, selectedSubCheckId } = useSelector(
    (state) => state.operations
  );

  useEffect(() => {
    //on click of every new check/sub-check component we will collapse the headings
    setOpen(false);
  }, [selectedCheckId, selectedSubCheckId]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        background: (theme) => theme.palette.primary[100],
        border: (theme) => `1px solid ${theme.palette.grey[400]}`,
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={() => setOpen(!open)}
    >
      <Box display="flex" alignItems="center" pl={1}>
        {IconComponent}
        <Typography
          fontWeight={550}
          textTransform="capitalize"
          letterSpacing="1px"
          textAlign="center"
          ml={1}
        >
          {title}
        </Typography>
      </Box>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpen(!open)}
      >
        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
    </Box>
  );
};

export default CommonHeadingComponent;
