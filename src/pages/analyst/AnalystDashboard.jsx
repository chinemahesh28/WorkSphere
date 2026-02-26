import React, { useState } from "react";
import AnalystNavbar from "./AnalystNavbar";
import Dashboard from "./Dashboard";
import CreateBatch from "./CreateBatch";
import ManageBatch from "./ManageBatch";

const AnalystDashboard = () => {
  // default page = dashboard
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "create-batch":
        return <CreateBatch setActivePage={setActivePage} />;

      case "manage-batch":
        return <ManageBatch setActivePage={setActivePage} />;

      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className=" min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AnalystNavbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderPage()}
      </div>
    </div>
  );
};

export default AnalystDashboard;