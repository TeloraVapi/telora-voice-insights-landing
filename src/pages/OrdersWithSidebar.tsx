import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import Orders from "./Orders";

const OrdersWithSidebar = () => {
  return (
    <DashboardLayout>
      <Orders />
    </DashboardLayout>
  );
};

export default OrdersWithSidebar;
