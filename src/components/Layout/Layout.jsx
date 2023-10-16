import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div className="w-full flex items-start">
        <Sidebar />
        <div className="w-full col-span-2 mx-4 h-screen">
          <Header />
          <div className="w-full mt-3 lg:h-[550px] h-[650px] overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
