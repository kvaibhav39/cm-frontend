import CommonDraggableComponent from "./CommonDraggableComponent";
import { DragDropContext } from "react-beautiful-dnd";
import { Grid } from "@mui/material";
import { cloneDeep } from "lodash";

const AddDraggableRatings = ({ columns, setColumns }) => {
  const handleCriteriaDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const copiedItems = cloneDeep(columns[source.droppableId]);
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns(
        (prev) =>
          (prev = {
            ...prev,
            [source.droppableId]: copiedItems,
          })
      );
    }
  };

  return (
    <Grid
      container
      maxWidth={{ xs: "100%", xl: "60vw" }}
      mx="auto"
      display="flex"
    >
      <Grid item xs={12} md={6}>
        {" "}
        <DragDropContext onDragEnd={(result) => handleCriteriaDragEnd(result)}>
          <CommonDraggableComponent
            heading="Enter your Criteria(s) for Rating:"
            id="ratingCriteriaText"
            columns={columns}
            setColumns={setColumns}
          />
        </DragDropContext>
      </Grid>

      <Grid item xs={12} md={6}>
        <DragDropContext onDragEnd={(result) => handleCriteriaDragEnd(result)}>
          <CommonDraggableComponent
            heading="Enter Rating Scale(s):"
            id="scales"
            columns={columns}
            setColumns={setColumns}
          />{" "}
        </DragDropContext>
      </Grid>
    </Grid>
  );
};

export default AddDraggableRatings;
