import React, { useState } from "react";
import CounsellorNavbar from "./CounsellorNavbar";
import CounsellorHome from "./CounsellorHome";
import AddStudent from "./AddStudent";
import ManageStudents from "./ManageStudents";
import AssignBatch from "./AssignBatch";
import AssignTrainer from "./AssignTrainer";

const CounsellorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "add-student":
        return <AddStudent setActivePage={setActivePage} />;

      case "manage-students":
        return <ManageStudents setActivePage={setActivePage} />;

      case "assign-batch":
        return <AssignBatch />;

      case "assign-trainer":
        return <AssignTrainer />;

      case "dashboard":
      default:
        return <CounsellorHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CounsellorNavbar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-8">
        {renderPage()}
      </div>
    </div>
  );
};

export default CounsellorDashboard;
