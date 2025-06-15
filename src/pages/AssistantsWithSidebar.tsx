import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import Assistants from "./Assistants";

const AssistantsWithSidebar = () => {
  return (
    <DashboardLayout>
      <Assistants />
    </DashboardLayout>
  );
};

export default AssistantsWithSidebar;
