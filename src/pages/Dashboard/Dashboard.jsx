import React from "react";
import { useRef } from "react";
import HH from "../../assets/img/Hotel-header.jpg";
import H1 from "../../assets/img/H1.jpeg";
import H2 from "../../assets/img/Hotel-2.jpeg";
import France from "../../assets/img/France.jpeg";
import France1 from "../../assets/img/France1.jpeg";
import France2 from "../../assets/img/France2.jpeg";
import H4 from "../../assets/img/Hotel-4.jpeg";
import H5 from "../../assets/img/Hotel-5.jpeg";
import H6 from "../../assets/img/Hotel-6.jpeg";
import Istanbul from "../../assets/img/istanbul.jpeg";
import London from "../../assets/img/London.jpeg";
import LocationCard from "../../components/Card/LocationCard";
import HotelCard from "../../components/Card/HotelCard";
import ExploreCard from "../../components/Card/ExploreCard";
import InputDropdown from "../../components/Input/InputDropdown";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const quoteBoxRef = useRef(null);

  const scrollLeft = () => {
    quoteBoxRef.current.scrollLeft -= 100;
  };
  const scrollRight = () => {
    quoteBoxRef.current.scrollRight += 100;
  };

  const notify = () => toast.success("Done!");

  return (
    <>
      <div className="">
        <div className="flex flex-col gap-6">
          <div className="relative flex flex-col justify-center items-center">
            <img
              src={HH}
              alt="Hotel"
              className="w-full h-28 object-cover object-center rounded-2xl z-0"
            />
            <div className=" bg-white w-[95%] flex items-center h-16 rounded-xl absolute z-10 bottom-[-25px]">
              <div className="w-full relative border-6 flex justify-between px-4 items-center rounded-xl">
                <InputDropdown
                  Icon="location-outline"
                  Placeholder="Where are you going?"
                  Item1="Paris"
                  Item2="London"
                  Item3="Istanbul"
                />
                <InputDropdown
                  Icon="calendar-outline"
                  Placeholder="Check-in date"
                />
                <InputDropdown
                  Icon="person-outline"
                  Placeholder="How many people?"
                  Item1="1 Adult"
                  Item2="2 Adult"
                  Item3="3 Adult"
                />
                <button
                  onClick={notify}
                  type="submit"
                  className="capitalize px-2 py-1 w-24 h-10 justify-center items-center flex font-medium bg-blue-950 shadow-sm shadow-gray-400 text-gray-300 rounded-xl tracking-wider"
                >
                  Search
                  <Toaster />
                </button>
              </div>
            </div>
          </div>

          <div className=" flex flex-col gap-3 mt-10">
            <div className=" flex justify-between">
              <h2 className="font-semibold text-blue-950">
                Trending Destinations
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="flex cursor-pointer shadow-md shadow-gray-300 items-center justify-center h-[25px] w-[25px] bg-transparent rounded-md border-[1px] border-blue-950 hover:border-none hover:bg-blue-950 hover:text-white"
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>
                <button
                  onClick={scrollRight}
                  className="flex cursor-pointer shadow-md shadow-gray-300 items-center justify-center h-[25px] w-[25px] bg-transparent rounded-md border-[1px] border-blue-950 hover:border-none hover:bg-blue-950 hover:text-white"
                >
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </button>
              </div>
            </div>

            <div
              ref={quoteBoxRef}
              className="slide bg-transparent px-3 flex gap-6 py-2 h-40"
            >
              <LocationCard
                Img={France}
                Location="Montmartre, France"
                Rating={4}
                Description="Visiting the best tourist areas chosen by the audience."
                Price="450,000,00"
              />
              <LocationCard
                Img={Istanbul}
                Location="istanbul, Turkey"
                Rating={5}
                Description="One of our best-selling tours to turkey and visiting it's regions..."
                Price="600,000,00"
              />
              <LocationCard
                Img={London}
                Location="London, UK"
                Rating={4}
                Description="London is one of the most beautiful places to visit that..."
                Price="360,000,00"
              />
            </div>
          </div>

          <div className=" flex flex-col gap-3 mt-10">
            <div className=" flex justify-between">
              <h2 className="font-semibold capitalize text-blue-950">
                Best Offers
              </h2>

              <div className="flex gap-2">
                <span className=" capitalize font-semibold cursor-pointer text-blue-950">
                  View all
                </span>
              </div>
            </div>

            <div className="w-full bg-transparent px-3 grid lg:grid-cols-5 grid-cols-2 overflow-y-hidden gap-2 py-2 h-52">
              <HotelCard
                Img={H1}
                Location="Kensington / London"
                Rating={4}
                Description="7Season Apartment"
                Price="65,00"
              />
              <HotelCard
                Img={H2}
                Location="Hungary / Budapest"
                Rating={4}
                Description="Along with the villa"
                Price="65,00"
              />
              <HotelCard
                Img={H4}
                Location="Wiliamstreet / Boxon"
                Rating={4}
                Description="Resort and Recreation"
                Price="65,00"
              />
              <HotelCard
                Img={H5}
                Location="Citadines Opera Paris / France"
                Rating={4}
                Description="Beautiful and Classy"
                Price="65,00"
              />
              <HotelCard
                Img={H6}
                Location="Sugar Apartments / Brazil"
                Rating={4}
                Description="Permanent Peace"
                Price="65,00"
              />
            </div>
          </div>

          <div className=" flex flex-col gap-3 mt-10">
            <div className=" flex justify-between">
              <h2 className="font-semibold text-blue-950">Explore France</h2>
            </div>

            <div className="slide bg-transparent px-3 flex gap-6 py-2 h-40">
              <ExploreCard
                Img={France1}
                Location="Eiffel Tower,Paris, France"
                // Rating={4}
                Description="Visiting the best tourist areas chosen by the audience."
                Price="450,000,00"
              />
              <ExploreCard
                Img={France}
                Location="L'Arc de Triomphe de I'Etoile"
                // Rating={5}
                Description="One of our best-selling tours to turkey and visiting it's regions..."
                Price="600,000,00"
              />
              <ExploreCard
                Img={France2}
                Location="Paris, France"
                // Rating={4}
                Description="London is one of the most beautiful places to visit that..."
                Price="360,000,00"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
