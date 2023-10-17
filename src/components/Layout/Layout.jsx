import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import useScreenSize from "../../hook/useScreenSize";

function Layout() {
  const { width } = useScreenSize();
  return (
    <>
      {width > 768 ? (
        <div className="w-full flex items-start">
          <Sidebar />
          <div className="w-full col-span-2 mx-4 mt-3 h-screen">
            <Header />
            <div className="w-full mt-3 pt-3 mb-16 h-[550px] overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-full mx-3 mt-3 mb-16">
          <div className=" flex gap-2 items-center mb-3">
            <Sidebar />
            <Header />
          </div>
          <div className=" w-[590px] pt-3 h-[540px] overflow-y-auto">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export default Layout;
