import { Box } from "@material-ui/core";
import { Button } from "@mui/material";
import { setNestedObjectValues } from "formik";

const DisplayAddBtnForMultipleFields = ({
  values,
  fieldArrayName,
  form,
  pushNewRef,
  newFields,
  runWhenNewAdd = () => {},
  addSectionText,
}) => {
  return (
    <>
      {" "}
      <Box mt={2} display="flex" justifyContent="center">
        <Button
          color="primary"
          variant="contained"
          onClick={async (e) => {
            e.preventDefault()

            let updatedValues = values?.map((curr, index) => {
              curr.selectedTab = false;
              return curr;
            });

            form.setFieldValue(fieldArrayName, updatedValues);

            await Promise.resolve();

            pushNewRef.current(newFields());

            runWhenNewAdd();

            //setting fields untouched so that the error disappears when new fields are added
            form.setTouched(setNestedObjectValues(values, false));

            //scrolling back to the top in fields section
            const scrollContainer = document.querySelector(
              "#candidate-multiple-fields-scroll"
            );

            if (scrollContainer) {
              scrollContainer.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
        >
          {addSectionText()}
        </Button>
      </Box>
    </>
  );
};

export default DisplayAddBtnForMultipleFields;
