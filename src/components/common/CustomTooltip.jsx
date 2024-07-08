import { withStyles } from "@mui/styles";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

const styles = (theme) => ({
  tooltip: {
    backgroundColor: (props) =>
      props.tooltipbgcolor || theme.palette.background.paper,
    color: (props) => props.tooltipcolor || theme.palette.grey[700],
    maxWidth: (props) => props.tooltipmaxwidth || 250,
    fontSize: (props) => props.tooltipfontsize || theme.typography.pxToRem(12),
    border: (props) => props.tooltipBorder || "1px solid #dadde9",
    boxShadow: (props) =>
      props.tooltipBoxShadow || "-3px 4px 17px rgba(0, 0, 0, 0.25)",
    textTransform: "capitalize",
  },
});

const CustomTooltip = withStyles(styles)(
  ({ title, children, titleContainsAction = false, ...props }) => {
    const [show, setShow] = useState(false);

    return (
      <>
        {/*for 'titleContainsAction', if tooltip title contains any action like onClick , 
      then we will render uncontrolled mui tooltip which will handle it's own state.
      Otherwise we will work with the controlled one*/}
        {titleContainsAction ? (
          <Tooltip title={title} {...props} enterTouchDelay={0}>
            {children}
          </Tooltip>
        ) : (
          <Tooltip
            title={title}
            {...props}
            enterTouchDelay={0}
            open={show}
            disableHoverListener
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            {children}
          </Tooltip>
        )}
      </>
    );
  }
);

export default CustomTooltip;
