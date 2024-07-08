import { ExpandMore } from "@mui/icons-material";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  styled,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

const StyledAccordion = styled(Box)`
  border: 1px solid
    ${(v) =>
      v.expanded || v.helptext
        ? v.bordercolor
          ? `${v.bordercolor}`
          : "#d5d5d5"
        : "transparent"};
  overflow: hidden !important;
  border-radius: ${(v) => v.accordionborderradius || "12px !important"};
  background-color: transparent !important;
  position: relative;
  .helpText {
    max-height: 0;
    overflow: hidden;
    transition: ${(v) => v.helptransition};
    &.visible {
      max-height: 500px;
    }
  }
  .MuiAccordionSummary-root {
    color: #565261;
    font-weight: 500;
    background-color: ${(v) =>
      v.expanded ? v.headerbg || "#dce2fa" : v.closedheaderbg || "#F6F6F6"};
    border-radius: ${(v) => v.headerborderradius || "12px !important"};   
  }
  .MuiAccordionDetails-root {
    padding: 0 !important;
    background-color: white !important;
  }
  .MuiAccordion-root.Mui-expanded {
    margin: 0 !important;
  }
  .MuiAccordionSummary-expandIconWrapper { /*accordion expand icon */
    position: ${(v) => (v.makeaccordioniconpositionabsolute ? "absolute" : "static")}; /*make sure to add semi-colon else the styles wont get applied */
    right:${(v) => (v.makeaccordioniconpositionabsolute ? "20px" : "none")};
  }
`;

const BaseAccordion = ({
  header,
  children,
  expanded = false,
  stateless = false,
  keepClosed = false,
  keepExpanded = false,
  headerbg = "#dce2fa",
  closedheaderbg = "",
  headerborderradius = "",
  accordionborderradius = "",
  expandIcon = <ExpandMore fontSize="medium" />,
  onChange = () => {},
  helpText,
  helpTransition = "all 200ms ease",
  index,
  listValues,
  setFieldValue,
  listKey,
  reviewKey,
  noPaddingInAccordionDetails = false,
  toRemoveAccordionIcon = false,
  makeaccordioniconpositionabsolute = false,
  ...props
}) => {
  // const [innerExpanded, setInnerExpanded] = useState(() => {
  //   if (keepClosed) return false;
  //   return keepExpanded || expanded;
  // });
  const [innerExpanded, setInnerExpanded] = useState(expanded);
  // console.log("form-inner-expanded--innerExpanded\n", innerExpanded, index);

  const isStateless = useMemo(() => {
    return stateless || keepExpanded || keepClosed;
  }, [stateless, keepExpanded, keepClosed]);

  // const innerOnChange = useCallback(
  //   (_, v) => {
  //     onChange(v);

  //     if (isStateless) return;
  //     setInnerExpanded(v);
  //   },
  //   [isStateless]
  // );

  const innerOnChange = async (e, v) => {
    // setInnerExpanded(v);
    if (!listValues && !reviewKey) {
      return onChange(v);
    }
    if (reviewKey) {
      setInnerExpanded(v);
    } else {
      let tempValues = listValues.map((val, idx) => {
        if (idx === index) {
          // setInnerExpanded(v);
          val.isExpanded = v;
        } else {
          val.isExpanded = false;
        }
        return val;
      });
      setFieldValue(listKey, tempValues);
      await Promise.resolve();
    }
  };

  useEffect(() => {
    if (isStateless) return;
    onChange(innerExpanded);
  }, [isStateless, innerExpanded]);

  // useEffect(() => {
  //   console.log("form-inner-expanded\n", index, innerExpanded, expanded);
  //   if (isStateless) return;
  //   setInnerExpanded(expanded);
  // }, [expanded, isStateless]);

  // useEffect(() => {
  //   // if (isStateless) return;
  //   listValues?.forEach((val, idx) => {
  //     if (listValues.length - 1 === index) {
  //       setInnerExpanded(!innerExpanded);
  //     } else {
  //       setInnerExpanded(false);
  //     }
  //   });
  // }, [expanded]);

  return (
    <StyledAccordion
      headerbg={headerbg}
      closedheaderbg={closedheaderbg}
      headerborderradius={headerborderradius}
      accordionborderradius={accordionborderradius}
      expanded={!reviewKey ? expanded : innerExpanded}
      helptext={helpText}
      helptransition={helpTransition}
      makeaccordioniconpositionabsolute={makeaccordioniconpositionabsolute}
      {...props}
    >
      <Accordion
        expanded={!reviewKey ? expanded : innerExpanded}
        onChange={innerOnChange}
      >
        <AccordionSummary expandIcon={toRemoveAccordionIcon ? null : expandIcon}>
          {typeof header === "function"
            ? header({ expanded: !reviewKey ? expanded : innerExpanded })
            : header}
        </AccordionSummary>
        <AccordionDetails>
          {noPaddingInAccordionDetails ? (
            <>{children}</>
          ) : (
            <Box p={{ xs: 2, md: 4 }}>{children}</Box>
          )}
        </AccordionDetails>
      </Accordion>
      <Box
        className={[
          "helpText",
          !(!reviewKey ? expanded : innerExpanded) && helpText ? "visible" : "",
        ].join(" ")}
      >
        <Box p={{ xs: 1, md: 4 }}>
          {typeof helpText === "function"
            ? helpText({ expanded: !reviewKey ? expanded : innerExpanded })
            : helpText}
        </Box>
      </Box>
    </StyledAccordion>
  );
};

export { BaseAccordion };
