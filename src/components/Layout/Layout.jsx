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
        <div className="flex w-screen h-screen overflow-hidden">
          <div className="overflow-hidden flex h-full">
            <Sidebar />
          </div>
          <div className="w-full flex-1 px-4 flex-col h-screen overflow-y-auto">
            <Header />
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="w-full mx-1 mt-4">
          <div className="flex overflow-hidden">
            <Sidebar />
            <Header />
          </div>
          <div className="">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export default Layout;
