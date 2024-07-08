import { Tabs, Tab, styled } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultIcon from "@mui/icons-material/AdjustOutlined";

function tabProps(index) {
  return {
    id: `hr-tab-${index}`,
    "aria-controls": `hr-tabpanel-${index}`,
    iconPosition: "start",
    icon: <DefaultIcon />,
  };
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textAlign: "left",
  justifyContent: "flex-start",
  width: "100%",
  color: "#5E5873",
  fontSize: "14px",
  minHeight: "42px",
  wordBreak: "break-word",
  "&.Mui-selected": {
    backgroundColor: "rgba(104, 137, 255, 0.1)",
    color: "rgba(82, 122, 251, 1)",
    borderRadius: "5px",
  },
}));

const SystemAdminSideBar = ({ items, disabled = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {items?.length > 0 &&
        items.map((item, index) => (
          <Tabs
            id={item.url}
            orientation="vertical"
            variant="scrollable"
            value={item.url}
            aria-label="Hr Tabs"
            indicatorColor="transparent"
            key={index}
            sx={{ alignItems: "flex-start" }}
          >
            <StyledTab
              disabled={disabled}
              label={item.name}
              onClick={(event) => {
                navigate(item.url);
              }}
              {...tabProps(0)}
              icon={item.icon}
              style={
                location.pathname === item.url
                  ? {
                      backgroundColor: "rgba(104, 137, 255, 0.1)",
                      color: "rgba(82, 122, 251, 1)",
                      borderRadius: "5px",
                    }
                  : null
              }
            />
          </Tabs>
        ))}
    </>
  );
};

export default SystemAdminSideBar;
