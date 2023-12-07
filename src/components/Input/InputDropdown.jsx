import React, { useState } from "react";

function InputDropdown({ Icon, Item1, Item2, Item3, Placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative flex flex-col items-center h-full rounded-xl">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white px-2 py-1 lg:p-4 w-full flex items-center justify-between font-medium text-gray-500 rounded-xl tracking-wider"
        >
          <div className="flex items-center gap-2">
            <ion-icon name={Icon}></ion-icon>
            <span className="capitalize text-xs lg:flex sm:flex hidden">{Placeholder}</span>
          </div>
          {!isOpen ? (
            <ion-icon
              name="chevron-down-outline"
              className="text-black"
            ></ion-icon>
          ) : (
            <ion-icon
              name="chevron-up-outline"
              className="text-black"
            ></ion-icon>
          )}
        </button>

        {isOpen && (
          <div className=" bg-white lg:w-full w-[100px] absolute top-20 flex flex-col gap-2 items-start rounded-xl">
            <div className=" flex hover:bg-gray-400 p-2 cursor-pointer w-full border-l-gray-400 hover:border-l-blue-950 hover:border-l-4">
              <h3 className=" capitalize font-bold text">{Item1}</h3>
            </div>
            <div className=" flex hover:bg-gray-400 p-2 cursor-pointer w-full border-l-gray-400 hover:border-l-blue-950 hover:border-l-4">
              <h3 className="capitalize font-bold">{Item2}</h3>
            </div>
            <div className=" flex hover:bg-gray-400 p-2 cursor-pointer w-full border-l-gray-400 hover:border-l-blue-950 hover:border-l-4">
              <h3 className="capitalize font-bold">{Item3}</h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default InputDropdown;
