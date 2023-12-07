import React from "react";

function ExploreCard({ Img, Price, Location, Description }) {
  return (
    <>
      <article className="bg-white p-1 rounded-lg flex gap-2 h-[180px] shadow-md shadow-gray-300">
        <div className="w-[200px] h-full">
          <img
            src={Img}
            alt=""
            className="object-cover rounded-lg w-full h-full"
          />
        </div>

        <div className="flex text-xs w-[250px] flex-col gap-4 justify-center ">
          <div className="flex">
            <p className="capitalize text-xs font-semibold text-gray-700">
              {Location}
            </p>
          </div>

          <p className=" text-gray-400 text-xs font-medium leading-4">
            {Description}
          </p>

          <p className=" font-semibold text-blue-950">${Price}</p>
        </div>
      </article>
    </>
  );
}

export default ExploreCard;
