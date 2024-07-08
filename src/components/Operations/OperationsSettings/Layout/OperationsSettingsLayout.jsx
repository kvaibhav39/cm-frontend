import React from "react";
import OperationsSettingsSidebar from "../components/OperationsSettingsSidebar";
import OperationsLayout from "../../Layout/OperationsLayout";
import { Outlet } from "react-router-dom";

const OperationsSettingsLayout = () => {
  return (
    <>
      <OperationsLayout
        SidebarComponent={<OperationsSettingsSidebar />}
        MainComponent={<Outlet />}
      />
    </>
  );
};

export default OperationsSettingsLayout;
