import React, { useState } from "react";
import DP from "../../assets/img/Dp.jpg";
import { NavLink } from "react-router-dom";
import useScreenSize from "../../hook/useScreenSize";

function Sidebar() {
  const [active, setActive] = useState(0);
  const { width } = useScreenSize();
  const [nav, setNav] = useState(false);

  const Menus = [
    {
      id: 1,
      name: "Dashboard",
      link: "/dashboard",
      icon: "home",
      iconOutline: "home-outline",
    },
    {
      id: 4,
      name: "Explore City",
      link: "/explore",
      icon: "grid",
      iconOutline: "grid-outline",
    },
    {
      id: 3,
      name: "Ticket",
      link: "/ticket",
      icon: "mail",
      iconOutline: "mail-outline",
    },
    {
      id: 2,
      name: "Favorites",
      link: "favorites",
      icon: "star",
      iconOutline: "star-outline",
    },
    {
      id: 5,
      name: "Settings",
      link: "settings",
      icon: "settings",
      iconOutline: "settings-outline",
    },
  ];
  return (
    <>
      {width > 768 ? (
        <div className="bg-white w-64 h-screen flex justify-center py-4 ">
          <div className="flex flex-col justify-between py-2">
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-bold text-blue-950">
                Mima<span className=" text-gray-700">Booking</span>
              </h1>

              <div className="relative flex justify-center py-2 w-full h-full">
                <div className="bg-gray-200 w-[110px] h-[110px] rounded-full"></div>
                <img
                  src={DP}
                  alt="Display picture"
                  className="w-[110px] h-[110px] border-2 border-blue-950 rounded-full absolute z-10"
                />
                <button className="bg-blue-950 rounded-full w-[30px] h-[30px] flex items-center justify-center bottom-[-4px] text-white absolute z-20">
                  <ion-icon name="create-outline"></ion-icon>
                </button>
              </div>

              <h3 className=" text-sm font-semibold pt-4">
                Festus-Olaleye Ayomikun
              </h3>
            </div>

            <ul className="flex flex-col gap-3">
              {Menus.map(({ id, link, name, icon, iconOutline }) => (
                <li key={id} className=" flex justify-center ">
                  <NavLink
                    to={link}
                    className={({ isActive, isPending }) => {
                      return isPending
                        ? ""
                        : isActive
                        ? "text-blue-900 w-[130px] capitalize flex font-semibold items-center text-center gap-3"
                        : "w-[130px] capitalize flex font-semibold items-center text-center gap-3";
                    }}
                  >
                    <ion-icon name={icon}></ion-icon>
                    {name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button className="w-[130px] flex font-medium items-center text-center text-red-600 gap-3 justify-center capitalize">
              <ion-icon name="chevron-forward-circle-outline"></ion-icon>
              logout
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            onClick={() => setNav(!nav)}
            className=" bg-white w-[50px] h-[50px] relative rounded-xl text-gray-400 shadow-sm shadow-gray-400  border-2 border-gray-400 flex items-center justify-center"
          >
            <ion-icon name="menu" size="large"></ion-icon>
          </div>
          {nav && (
            <div className="bg-white w-64 h-screen flex justify-center py-4 absolute top-0 left-0 z-20">
              <div className="flex flex-col justify-between py-2">
                <div className="flex flex-col items-center gap-2">
                  <h1 className="font-bold text-blue-950">
                    Mima<span className=" text-gray-700">Booking</span>
                  </h1>

                  <div className="relative flex justify-center py-2 w-full h-full">
                    <div className="bg-gray-200 w-[110px] h-[110px] rounded-full"></div>
                    <img
                      src={DP}
                      alt="Display picture"
                      className="w-[110px] h-[110px] border-2 border-blue-950 rounded-full absolute z-10"
                    />
                    <button className="bg-blue-950 rounded-full w-[30px] h-[30px] flex items-center justify-center bottom-[-4px] text-white absolute z-20">
                      <ion-icon name="create-outline"></ion-icon>
                    </button>
                  </div>

                  <h3 className=" text-sm font-semibold pt-4">
                    Festus-Olaleye Ayomikun
                  </h3>
                </div>

                <ul className="flex flex-col gap-3">
                  {Menus.map(({ id, link, name, icon, iconOutline }) => (
                    <li key={id} className=" flex justify-center ">
                      <NavLink
                        onClick={() => setNav(!nav)}
                        to={link}
                        className={({ isActive, isPending }) => {
                          return isPending
                            ? ""
                            : isActive
                            ? "text-blue-900 w-[130px] capitalize flex font-semibold items-center text-center gap-3"
                            : "w-[130px] capitalize flex font-semibold items-center text-center gap-3";
                        }}
                      >
                        <ion-icon name={icon}></ion-icon>
                        {name}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <button className="w-[130px] flex font-medium items-center text-center text-red-600 gap-3 justify-center capitalize">
                  <ion-icon name="chevron-forward-circle-outline"></ion-icon>
                  logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;
