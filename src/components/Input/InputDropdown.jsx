import React, { useState } from "react";

function InputDropdown({ Icon, Item1, Item2, Item3, Placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className=" relative flex flex-col items-center h-full rounded-xl">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white border-4 border-transparent active:border-black active:text-black duration-300 p-4 w-full flex items-center justify-between font-medium text-gray-300 rounded-xl tracking-wider"
        >
          <div className="flex items-center gap-2">
            <ion-icon name={Icon}></ion-icon>
            <span className=" capitalize text-xs">{Placeholder}</span>
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
          <div className=" bg-white absolute top-20 flex flex-col gap-2 items-start rounded-xl p-2 w-full">
            <div className=" flex hover:bg-gray-400 p-2 cursor-pointer w-full rounded-r-xl border-l-gray-400 hover:border-l-blue-950 hover:border-l-4">
              <h3 className=" capitalize font-bold text">{Item1}</h3>
            </div>
            <div className=" flex hover:bg-gray-400 p-2 cursor-pointer w-full rounded-r-xl border-l-gray-400 hover:border-l-blue-950 hover:border-l-4">
              <h3 className="capitalize font-bold">{Item2}</h3>
            </div>
            <div className=" flex hover:bg-gray-400 p-2 cursor-pointer w-full rounded-r-xl border-l-gray-400 hover:border-l-blue-950 hover:border-l-4">
              <h3 className="capitalize font-bold">{Item3}</h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default InputDropdown;
