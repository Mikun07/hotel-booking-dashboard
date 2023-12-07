import React, {useEffect, useState}  from "react";
import InputSearch from "../Input/InputSearch";

function Header() {
  const [date, setDate] = useState('')
  useEffect(() => {
    setDate()
  })
  return (
    <>
      <div className="bg-transparent h-14 rounded-2xl w-full flex items-center justify-between px-3">
        <InputSearch />

        <div className="flex gap-4 items-center">
          <span className=" font-semibold text-xs lg:text-base">{new Date().toDateString()}</span>

          <div className="relative flex">
            <button className=" bg-transparent w-[35px] h-[35px] shadow-md shadow-gray-300 border-2 rounded-lg flex items-center justify-center">
              <ion-icon name="notifications"></ion-icon>
            </button>
            <span className="bg-red-600 shadow-sm shadow-red-500 text-white w-4 h-4 text-xs flex justify-center rounded-full absolute left-[-6px] top-[-6px]">2</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;