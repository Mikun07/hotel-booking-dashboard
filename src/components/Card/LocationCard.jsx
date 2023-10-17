import React from "react";

function LocationCard({ Img, Price, Rating, Location, Description }) {
  return (
    <>
      <div className="bg-white p-1 rounded-lg flex gap-2 w-full shadow-md shadow-gray-300">
        <div className="w-[120px] h-full">
          <img src={Img} alt="" className="object-cover object-center rounded-lg w-full h-full" />
        </div>

        <div className="flex text-xs flex-col gap-4 justify-center ">
          <div className="flex justify-between ">
            <p className="capitalize  font-semibold text-gray-700">{Location}</p>

            <span className="flex text-xs items-center gap-1 text-yellow-500">
              <ion-icon name="star" className=" "></ion-icon>
              <p className=" font-medium text-gray-700">{Rating}</p>
            </span>
          </div>

          <p className=" text-gray-400 text-xs font-medium leading-4">
            {Description}
          </p>

          <p className=" font-semibold text-blue-950">
            ${Price}
          </p>
        </div>
      </div>
    </>
  );
}

export default LocationCard;
