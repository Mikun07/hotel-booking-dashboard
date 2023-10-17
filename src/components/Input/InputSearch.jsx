import React from "react";

function InputSearch() {
  return (
    <>
      <div className="relative flex items-center text-gray-300">
        <input
          type="search"
          name="search"
          id="search"
          autoComplete="off"
          placeholder="Search any things.. "
          className="px-3 py-2 font-semibold lg:w-64 placeholder-gray-300 text-black rounded-2xl border-none ring-2 ring-gray-300 focus:ring-black focus:border-none focus:ring-2 hover:ring-black hover:ring-2 transition-all duration-300"
        />
      </div>
    </>
  );
}

export default InputSearch;
