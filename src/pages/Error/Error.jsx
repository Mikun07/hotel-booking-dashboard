import React from "react";

function Error({Title}) {
  return (
    <>
      <div className="flex items-center justify-center text-center rounded-lg">
        <div className=" bg-white p-8 flex flex-col text-center items-center">
            <h1 className=" capitalize font-bold">{Title} Page not available</h1>
        </div>
      </div>
    </>
  );
}

export default Error;
