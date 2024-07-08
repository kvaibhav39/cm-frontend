import { Box, Typography } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GET_SUB_CHECKS_LIST,
  REMOVE_CHECK_AND_SUBCHECK,
  UPDATE_CHECK_SELECTED_STATE,
  UPDATE_SUBCHECK_SELECTED_STATE,
} from "../../../../../../../../store/actions/actionTypes";
import { toNotAllowSubCheckAddition } from "../utils/toNotAllowSubCheckAddition";
import { useDispatch } from "react-redux";
import { isEqual } from "lodash";
import AddSubCheck from "../AddSubCheck";

const CheckLists = memo(
  ({ caseCheck }) => {
    const {
      subChecksList,
      addedChecksAndSubCheck,
      allSubChecksLists,
      selectedCheckId,
      selectedSubCheckId,
    } = useSelector((state) => state.operations);

    const dispatch = useDispatch();

    //if the subcheck is already added , then we will first display the added subcheck in subcheck lists
    // useEffect(() => {
    //   if (
    //     addedChecksAndSubCheck?.find(
    //       (check) =>
    //         check?.candidatesChecksMappingId ===
    //         caseCheck?.candidatesChecksMappingId
    //     )
    //   ) {
    //     handleUpdateReduxConstant(
    //       UPDATE_SUBCHECK_SELECTED_STATE,
    //       "add-sub-check"
    //     );
    //   }
    // }, [addedChecksAndSubCheck]);

    //removing added subcheck
    const removeSubCheck = () => {
      handleUpdateReduxConstant(
        UPDATE_SUBCHECK_SELECTED_STATE,
        subChecksList[0]?.id
      );

      dispatch({
        type: REMOVE_CHECK_AND_SUBCHECK,
        payload: caseCheck?.checksId,
      });
    };

    //handles onclick on check to select
    const handleSelectCheck = () => {
      let subCheckLists = [];
      allSubChecksLists?.forEach((curr) => {
        if (
          curr?.candidatesChecksMappingId ===
          caseCheck?.candidatesChecksMappingId
        ) {
          subCheckLists.push(curr);
        }
      });

      //setting selectedSubCheckId state to first value from subChecksList
      handleUpdateReduxConstant(
        UPDATE_SUBCHECK_SELECTED_STATE,
        subCheckLists[0]?.id
      );

      handleUpdateReduxConstant(GET_SUB_CHECKS_LIST, subCheckLists);
      handleUpdateReduxConstant(
        UPDATE_CHECK_SELECTED_STATE,
        caseCheck?.candidatesChecksMappingId
      );
      scrollBackUp();
    };

    //custom function to update redux state
    const handleUpdateReduxConstant = (CONSTANT, value) => {
      dispatch({
        type: CONSTANT,
        payload: value,
      });
    };

    const scrollBackUp = () => {
      //scrolling back to the top of subcheck details
      const scrollContainer = document.querySelector(
        "#ops-candidate-select-check-or-subcheck-scroll"
      );

      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    return (
      <>
        {selectedCheckId === caseCheck?.candidatesChecksMappingId ? (
          <Box
            sx={{
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              borderRadius: "5px",
            }}
            px={0.5}
            py={1}
            mb={1}
          >
            <Box>
              <Box
                sx={{
                  border: (theme) => `1px solid ${theme.palette.grey[400]}`,
                  borderRadius: "5px",
                  background: (theme) => theme.palette.primary.main,
                }}
                p={0.5}
              >
                <Typography
                  fontWeight="550"
                  fontSize="12px"
                  color="#fff"
                  pl={1}
                >
                  {caseCheck?.checkName}
                </Typography>
              </Box>
              {subChecksList?.length
                ? subChecksList?.map((subCheck, index) => (
                    <Box key={subCheck?.id} display="flex" ml={3}>
                      <Box
                        sx={{
                          borderLeft: (theme) =>
                            `1px dashed ${theme.palette.grey[400]}`,
                          minHeight:
                            index === subChecksList?.length - 1 ? "none" : 25,
                          height:
                            index === subChecksList?.length - 1 ? 25 : "none",
                        }}
                      />
                      <Box
                        marginTop="25px"
                        sx={{
                          borderTop: (theme) =>
                            `1px dashed ${theme.palette.grey[400]}`,
                          minWidth: 25,
                        }}
                      />
                      <Box
                        marginTop="12.5px"
                        sx={{
                          border: (theme) =>
                            `1px solid ${theme.palette.grey[400]}`,
                          borderRadius: "5px",
                          background: (theme) =>
                            selectedSubCheckId === subCheck?.id
                              ? theme.palette.primary[100]
                              : "none",
                          cursor: "pointer",
                        }}
                        p={0.5}
                        onClick={() => {
                          handleUpdateReduxConstant(
                            UPDATE_SUBCHECK_SELECTED_STATE,
                            subCheck?.id
                          );
                          scrollBackUp();
                        }}
                      >
                        <Typography fontWeight="550" fontSize="12px">
                          {subCheck?.subCheckDisplayName}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                : null}
            </Box>
            {!toNotAllowSubCheckAddition?.find(
              (c) => c.checksId === caseCheck?.checksId
            ) ? (
              <AddSubCheck
                removeSubCheck={removeSubCheck}
                caseCheck={caseCheck}
              />
            ) : null}
          </Box>
        ) : (
          <Box
            sx={{
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              borderRadius: "5px",
              cursor: "pointer",
            }}
            px={0.5}
            py={1}
            mb={1}
            onClick={handleSelectCheck}
          >
            <Typography fontWeight="550" fontSize="12px" pl={1}>
              {caseCheck?.checkName}
            </Typography>
          </Box>
        )}
      </>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default CheckLists;
