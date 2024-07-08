import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DeleteOutline } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { cloneDeep, uniqueId } from "lodash";

const CommonDraggableComponent = ({ heading, id, columns, setColumns }) => {
  const theme = useTheme();

  const handleAnswerAdd = () => {
    let oldValue = cloneDeep(columns[id]);

    let addNewValue = {
      id: +uniqueId(),
      value: "",
    };

    if (id === "scales") {
      addNewValue = {
        id: +uniqueId(),
        scaleNumber: oldValue?.length + 1,
        scaleText: "",
      };
    }

    setColumns(
      (prev) => (prev = { ...prev, [id]: [...oldValue, addNewValue] })
    );
  };

  const handleAnswerDelete = (i) => {
    let newValue = cloneDeep(columns[id])?.filter((_, index) => index !== i);

    newValue = newValue?.map((curr, index) => ({
      ...curr,
      scaleNumber: index + 1,
    }));

    setColumns((prev) => (prev = { ...prev, [id]: [...newValue] }));
  };

  return (
    <Grid
      item
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      m={{ xs: 1, xl: 2 }}
    >
      <Typography variant="h5" mb={0.5} fontSize={{ xs: 8, sm: "initial" }}>
        {heading}
      </Typography>
      <Droppable droppableId={id} key={id}>
        {(provided, snapshot) => {
          return (
            <Grid
              key={id}
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? theme.palette.grey[200]
                  : theme.palette.grey[400],
              }}
              p={1}
              borderRadius={1}
              width={{ xs: "100%", md: "60%" }}
            >
              {columns[id]?.map((item, index) => {
                return (
                  <Draggable
                    draggableId={String(item?.id)}
                    key={+item?.id}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      return (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            backgroundColor: snapshot.isDragging
                              ? theme.palette.warning.dark
                              : theme.palette.primary.main,
                            borderRadius: "5px",
                            ...provided.draggableProps.style,
                          }}
                          mb={1}
                          p={1}
                          textAlign="center"
                          color="#fff"
                          fontSize={{ xs: 8, sm: "initial" }}
                        >
                          <Box mb="5px">
                            <Typography color="white" fontWeight={550}>
                              {id === "scales" ? "Rating" : "Criteria"}{" "}
                              {index + 1}
                            </Typography>
                          </Box>

                          <TextField
                            id={item?.id}
                            value={
                              id === "scales" ? item?.scaleText : item?.value
                            }
                            placeholder={`Please add ${
                              id === "scales" ? "Scale" : "Criteria"
                            } here`}
                            type="text"
                            fullWidth={true}
                            size="small"
                            variant="outlined"
                            onChange={(e) =>
                              setColumns(
                                (prev) =>
                                  (prev = {
                                    ...prev,
                                    [id]: cloneDeep(columns[id])?.map(
                                      (curr, ind) => {
                                        if (ind === index) {
                                          curr[
                                            id === "scales"
                                              ? "scaleText"
                                              : "value"
                                          ] = e.target.value;
                                        }
                                        return curr;
                                      }
                                    ),
                                  })
                              )
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {columns[id]?.length > 1 ? (
                                    <IconButton
                                      onClick={() => handleAnswerDelete(index)}
                                      edge="end"
                                      color="error"
                                    >
                                      <DeleteOutline />
                                    </IconButton>
                                  ) : null}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      );
                    }}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </Grid>
          );
        }}
      </Droppable>
      <Box display="flex" justifyContent="flex-start" p={1}>
        <Button variant="contained" onClick={handleAnswerAdd}>
          <AddIcon />
        </Button>
      </Box>
    </Grid>
  );
};

export default CommonDraggableComponent;
