import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const CommonUpdateRelationshipDetails = ({
  heading = "All User(s)",
  id = "allLists",
  columns,
}) => {
  const theme = useTheme();

  return (
    <Grid
      item
      sm={5}
      xs={6}
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
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? theme.palette.grey[200]
                  : theme.palette.grey[400],
              }}
              minHeight="10vh"
              maxHeight={{ xs: "60vh", xxl: "65vh" }}
              overflow="auto"
              p={1}
              borderRadius={1}
            >
              {columns[id]?.length ? (
                columns[id]?.map((item, index) => {
                  return (
                    <Draggable
                      key={item?.assignee || item?.userId}
                      draggableId={String(item?.assignee || item?.userId)}
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
                                ? theme.palette.secondary[800]
                                : theme.palette.primary.main,
                              ...provided.draggableProps.style,
                            }}
                            mb={1}
                            p={1}
                            borderRadius={1}
                            textAlign="center"
                            color="#fff"
                            fontSize={{ xs: 8, sm: "initial" }}
                            width={{ xs: 100, sm: 280 }}
                            sx={{
                              whiteSpace: "normal !important",
                              wordWrap: "break-word !important",
                            }}
                          >
                            {item?.assigneeName || item?.userName}
                            <br />({item.subRoleName})
                          </Box>
                        );
                      }}
                    </Draggable>
                  );
                })
              ) : (
                <Box
                  p={1}
                  borderRadius={1}
                  textAlign="center"
                  color="#fff"
                  border="1px dashed #fff"
                  fontWeight={600}
                  py={{ xs: "none", sm: 2 }}
                  fontSize={{ xs: 8, sm: "initial" }}
                  width={{ xs: 100, sm: 280 }}
                >
                  Drop your items here
                </Box>
              )}
              {provided.placeholder}
            </Grid>
          );
        }}
      </Droppable>
    </Grid>
  );
};

export default CommonUpdateRelationshipDetails;
