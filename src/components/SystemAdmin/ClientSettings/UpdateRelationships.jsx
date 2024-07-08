import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOPSUserBySubRoleIds } from "../../../store/actions/operationActions";
import { DragDropContext } from "react-beautiful-dnd";
import CircularLoader from "./../../../common/CircularLoader";
import { Box, Button, Grid, Typography } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  getRelationshipDetails,
  updateRelationshipDetails,
} from "../../../store/actions/systemAdminActions";
import CommonUpdateRelationshipDetails from "./components/CommonUpdateRelationshipDetails";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const UpdateRelationships = () => {
  const [columns, setColumns] = useState({
    allLists: [],
    selectedLists: [],
  });

  const dispatch = useDispatch();

  const { selectedOrg, getOrgRelationshipDetails } = useSelector(
    (state) => state.systemAdmin
  );
  const { loading, OpsUserBySubRoleIds } = useSelector(
    (state) => state.operations
  );

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getOPSUserBySubRoleIds(
        {
          subRoleIds: "6,7,8,9,10",
        },
        logDetails
      )
    );
  }, []);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getRelationshipDetails(selectedOrg, logDetails));
    
  }, [selectedOrg]);

  useEffect(() => {
    let temp = OpsUserBySubRoleIds?.filter(
      (curr) =>
        !getOrgRelationshipDetails?.find(
          (val) => val?.userId === curr?.assignee
        )
    );

    setColumns({
      allLists: temp || [],
      selectedLists: getOrgRelationshipDetails || [],
    });
  }, [OpsUserBySubRoleIds, getOrgRelationshipDetails]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn];
      const destItems = [...destColumn];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: copiedItems,
      });
    }
  };

  const handleUpdate = () => {
    let payload = columns.selectedLists?.map((curr, index) => {
      return { userId: curr?.assignee || curr?.userId, priority: index + 1 };
    });

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleUpdate"
    );

    dispatch(updateRelationshipDetails(payload, selectedOrg, logDetails));
  };

  return (
    <>
      {selectedOrg ? (
        <Box width="100%">
          {!loading && columns && getOrgRelationshipDetails ? (
            <>
              <>
                <Grid
                  container
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Grid item md={10.5} xs={12}>
                    {" "}
                    <Typography textAlign="center" variant="h4">
                      Drag & Drop the users from the lists to update their
                      organizational relationship. (You can also change selected
                      users priority by dragging them up or down)
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={1.5}
                    xs={12}
                    display="flex"
                    justifyContent={{ md: "flex-end", xs: "center" }}
                    mt={{ xs: 1, md: 0 }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      disabled={!columns?.selectedLists?.length}
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
                <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                  <Grid
                    container
                    maxWidth={{ xs: "100%", xl: "60vw" }}
                    mx="auto"
                    display="flex"
                    flexWrap="nowrap"
                  >
                    <CommonUpdateRelationshipDetails columns={columns} />
                    <Grid
                      item
                      xs={1}
                      display={{ xs: "none", sm: "flex" }}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <SwapHorizIcon style={{ fontSize: "50px" }} />
                    </Grid>
                    <CommonUpdateRelationshipDetails
                      heading="Selected User(s)"
                      id="selectedLists"
                      columns={columns}
                    />
                  </Grid>
                </DragDropContext>{" "}
              </>
            </>
          ) : (
            <CircularLoader />
          )}
        </Box>
      ) : (
        <Typography textAlign="center" mt={4} fontWeight={600}>
          Please select an organization
        </Typography>
      )}
    </>
  );
};

export default UpdateRelationships;
