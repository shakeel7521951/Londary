import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import AdminPanel from "../components/dashboard/AdminPanel";
import Users from "../components/dashboard/Users";
import Order from "../components/dashboard/Order";
import Delivery from "../components/dashboard/Delivery";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Main Panel");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Main Panel":
        return <AdminPanel />;
      case "Users":
        return <Users />;
      case "Orders":
        return <Order />;
      case "Deliveries":
        return <Delivery />;
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-[#1C1C1C]">
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <div className="flex-1 overflow-auto bg-gradient-to-br from-[#1C1C1C] to-[#2C2C2C]">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
