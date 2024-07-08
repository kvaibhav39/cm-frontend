import {Grid} from "@mui/material";
import CustomQuestionnaire from "./CustomQuestionnaire";
import PanelCard from "../../../common/cards/PanelCard";
import ScrollableGrid from "../../../common/ScrollableGrid";


const CreateQuestionnaire = () => {

  return (
      <ScrollableGrid container spacing={2} screen='xxxl'>
        <Grid item xs={12} mt={{ xs: 10, md: 0 }}>
          <PanelCard>
          <CustomQuestionnaire />
          </PanelCard>
        </Grid>
    </ScrollableGrid>
  );
};

export default CreateQuestionnaire;
