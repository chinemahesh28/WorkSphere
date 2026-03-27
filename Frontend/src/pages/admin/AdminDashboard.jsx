import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "../../components/Header";

const AdminDashboard = () => {
  return (
    <div className="bg-gray-100">
      
     
      
      <div className="">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;