import React from "react";
import { Outlet } from "react-router-dom";
import OperationsDashboardSidebar from "../components/OperationsDashboardSidebar";
import OperationsLayout from "../../Layout/OperationsLayout";

const OperationsDashboardLayout = () => {
  return (
    <>
      <OperationsLayout
        SidebarComponent={<OperationsDashboardSidebar />}
        MainComponent={<Outlet />}
      />
    </>
  );
};

export default OperationsDashboardLayout;
