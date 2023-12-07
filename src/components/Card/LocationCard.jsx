import React from "react";

function LocationCard({ Img, Price, Rating, Location, Description }) {
  return (
    <>
      <article className="bg-white p-1 rounded-lg flex gap-2 h-[180px] shadow-md shadow-gray-300">
        <div className="w-[220px] h-full">
          <img
            src={Img}
            alt=""
            className="object-cover rounded-lg w-full h-full"
          />
        </div>

        <div className="flex w-[250px] text-xs flex-col gap-4 justify-center ">
          <div className="flex justify-between pr-4">
            <p className="capitalize  font-semibold text-gray-700">
              {Location}
            </p>

            <span className="flex text-xs items-center gap-1 text-yellow-500">
              <ion-icon name="star" className=" "></ion-icon>
              <p className=" font-medium text-gray-700">{Rating}</p>
            </span>
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

export default LocationCard;
