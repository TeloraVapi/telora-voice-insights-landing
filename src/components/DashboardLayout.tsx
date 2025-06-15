import React from "react";
import Navigation from "./Navigation";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen" style={{ backgroundColor: "rgb(243, 241, 245)" }}>
      <Navigation />
      <Header />
      <div className="ml-60 pt-16 overflow-auto h-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
