import React, { useState } from "react";
import TrainerNavbar from "./TrainerNavbar";
import TrainerHome from "./TrainerHome";
import ClassUpdate from "./ClassUpdate";
import ManageRecords from "./ManageRecords";

const TrainerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "class-update":
        return <ClassUpdate setActivePage={setActivePage} />;
      case "manage-records":
        return <ManageRecords setActivePage={setActivePage} />;
      case "dashboard":
      default:
        return <TrainerHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TrainerNavbar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-8">
        {renderPage()}
      </div>
    </div>
  );
};

export default TrainerDashboard;