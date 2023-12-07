import React from "react";
import toast, { Toaster } from "react-hot-toast";

function HotelCard({ Img, Price, Rating, Location, Description }) {
  const notify = () => toast.success("Added to Favorite!");

  return (
    <>
      <div className="bg-white px-1 py-2 rounded-lg flex flex-col gap-2 shadow-md shadow-gray-300">
        <div className=" flex justify-center w-[300px] h-[140px]">
          <img
            src={Img}
            alt=""
            className="object-cover rounded-lg w-full h-full"
          />
        </div>

        <div className="flex flex-col gap-2 px-2 justify-center h-[120px]">
          <p className="capitalize text-sm font-semibold text-gray-700">
            {Description}
          </p>
          <div className="flex gap-1 truncate items-center text-gray-400 font-medium leading-5 text-sm">
            <ion-icon name="location-outline"></ion-icon>
            <p className=" text-xs ">{Location}</p>
          </div>

          <div className="flex justify-between">
            <p className=" font-semibold text-blue-950">
              ${Price}
              <span className=" font-medium text-gray-400"> / Night</span>
            </p>

            <button
              onClick={notify}
              className=" bg-transparent w-[25px] h-[25px] shadow-md shadow-gray-300 border-2 text-gray-400 rounded-lg flex items-center justify-center hover:border-none hover:bg-blue-950 hover:text-white"
            >
              <Toaster />
              <ion-icon name="heart-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HotelCard;
