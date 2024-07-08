import {Avatar, Chip, Stack} from '@mui/material';

const ChecksIncluded = ({checksCount}) => {
    const checks = checksCount.length > 0 && checksCount.map(function (key) {
        const count = key.count;
        return <Chip label={key.checkTypeName}
                     avatar={<Avatar sx={{ backgroundColor: count > 0 ? "#E5F8ED" : "#FAE5E5" }}>{count}</Avatar>}
                     size="small"
                     variant="outlined"
                     color={count > 0 ? "success" : "error"}
                     key={`chk-${key.checkTypesId}`}
                     sx={{ border: "none", fontSize: "10px", backgroundColor: count > 0 ? "#E5F8ED" : "#FAE5E5" }}
        />
    });
    return (
        <Stack direction="row" spacing={0.5}>
            {checks}
        </Stack>
    )
};

export default ChecksIncluded;
