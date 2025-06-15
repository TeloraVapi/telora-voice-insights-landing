import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import Dashboard from "./Dashboard";

const DashboardWithSidebar = () => {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
};

export default DashboardWithSidebar;
