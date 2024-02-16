"use client";
import Plus from "@/assets/plus.svg";
import Button from "@/components/button";
import { WeatherChart } from "@/components/chart";
import City from "@/components/city";
import MapTest from "@/components/map/mapTest";
import Modal, { IModalType } from "@/components/modal";
import CustomTable from "@/components/table";
import { useCountryData } from "@/context";
import selectRandomImage, { imageUrls, items, truncate } from "@/helper";
import Request from "@/services";
import { Endpoints } from "@/services/endpoints";
import { getWeatherForecasts } from "@/services/weather";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

let uploadRQSTController: AbortController | null = null;
type WeatherResponse = {
  day: string;
  high: string;
  low: string;
  text: string;
};
export default function Home() {
  const [countryData, setCountryData] = useState<any>({
    capital: "Lome",
    name: { common: "Togo" },
  });
  const [loading, setLoading] = useState(false);

  const {
    countries,
    value,
    createCountries,
    coordinate,
    countryName,
    place,
    allCountriesArray,
    tableArray,
  } = useCountryData();

  const cache = useRef<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const modalRef = useRef<IModalType>(null);
  const modal = useRef<IModalType>(null);
  const handleOpenModal = () => {
    modalRef?.current?.open();
  };

  const [weatherChartData, setWeatherChartData] = useState([]);

  // get country for search autocomplete fields
  const countryRegex = /<span class="country-name">(.*?)<\/span>/;
  const match = countryName.match(countryRegex);
  const country = match ? match[1] : "";

  const fetchCountryInfo = async () => {
    setLoading(true);
    if (countryName) {
      try {
        const res = await Request.get(`${Endpoints.country}${country}`);
        if (countryName && res) {
          setCountryData(res);
        }
      } catch (error) {
        console.log("error while fetching");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountryInfo();
  }, [countryName]);

  useEffect(() => {
    allCountriesArray(countryData);
  }, [countryData]);

  const handleSubmit = (e: any) => {
    if (!value) return;
    createCountries({
      country: value,
      image: selectRandomImage(imageUrls),
    });
    modalRef?.current?.close();
    setFile(null);
    modal?.current?.open();

    // flor handling file submission

    // const formData = new FormData();
    // formData.append("file", file as File);
    // formData.append("upload_preset", "ml_default");

    // if (!uploadRQSTController) {
    //   uploadRQSTController = new AbortController();
    // }
    // try {
    //   const response = await axios({
    //     url: "https://api.cloudinary.com/v1_1/dcmifr1mx/image/upload",
    //     method: "POST",
    //     data: formData,
    //     signal: uploadRQSTController.signal,
    //   });
    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const columns = [
    {
      title: "Country",
      dataIndex: "name",
      key: "name",
      render: (text: any) => <p className="!text-sm">{text?.common}</p>,
    },
    {
      title: "Capital",
      dataIndex: "capital",
      key: "capital",
    },

    {
      title: "Capital Coords",
      dataIndex: "capitalInfo",
      key: "capitalInfo",
      render: (item: any) => (
        <p className="!text-sm">
          {item?.latlng[0]}, {item?.latlng[1]}
        </p>
      ),
    },

    {
      title: "Currency",
      dataIndex: "currencies",
      key: "currencies",
      render: (value: any) => {
        const values: any = Object.values(value ?? {});
        return (
          <p>
            {values[0]?.name} {values[0]?.symbol}{" "}
          </p>
        );
      },
    },

    {
      title: "Continent",
      dataIndex: "continents",
      key: "continents",
    },

    {
      title: "Sub Region",
      dataIndex: "subregion",
      key: "subregion",
    },

    {
      title: "Coat",
      dataIndex: "coatOfArms",
      key: "coatOfArms",
      render: (value: any) => (
        <Image src={value?.svg} alt="flag" width={20} height={20} />
      ),
    },
    {
      title: "Flag",
      dataIndex: "flags",
      key: "flags",
      render: (value: any) => (
        <Image src={value?.svg} alt="flag" width={20} height={20} />
      ),
    },
    {
      title: "Maps",
      dataIndex: "maps",
      key: "maps",
      render: (text: any) => (
        <a
          href={`${text?.googleMaps}`}
          target="_blank"
          className="text-blue-500"
        >
          {truncate(text?.googleMaps, 15)}
        </a>
      ),
    },

    {
      title: "Coordinates",
      dataIndex: "latlng",
      key: "latlng",
      render: (value: string) => (
        <p>
          lat-lng {value[0]},{value[1]}
        </p>
      ),
    },

    {
      title: "Timezone",
      dataIndex: "timezones",
      key: "timezones",
      render: (text: string) => {
        return <p>{truncate(text, 3)}</p>;
      },
    },
    {
      title: "Fifa",
      dataIndex: "fifa",
      key: "fifa",
    },
    {
      title: "Population",
      dataIndex: "Population",
      key: "population",
    },

    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
  ];

  const fetchChartWeatherForecast = async (location: string) => {
    if (!location || location === "") return;
    else {
      if (cache.current[location]) {
        const data = cache.current[location];
        setWeatherChartData(data);
      } else {
        const res = await getWeatherForecasts({ location: location });
        if (res) {
          cache.current[location] = res?.forecasts;
          setWeatherChartData(res?.forecasts);
        } else {
          setWeatherChartData([]);
        }
      }
    }
  };
  useEffect(() => {
    // fetchChartWeatherForecast("Ghana");
  }, []);

  const weekDays = weatherChartData?.map(
    (weather: WeatherResponse) => weather?.day
  );
  const highWeekDay = weatherChartData?.map(
    (weather: WeatherResponse) => weather?.high
  );
  const lowWeekDay = weatherChartData?.map(
    (weather: WeatherResponse) => weather?.low
  );

  const areaSeries = [
    {
      name: "High",
      data: highWeekDay,
    },

    {
      name: "Low",
      data: lowWeekDay,
    },
  ];

  return (
    <>
      <Modal ref={modal} type="post" />
      <Modal ref={modalRef}>
        <div className="py-5 flex gap-5 flex-col max-w-[90%] mx-auto justify-center">
          {/* <GooglePlaceSearch /> */}
          <div>
            <div
              className="cursor-pointer flex gap-2 justify-between items-center w-full"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <Button>Upload</Button>
              <p
                className={`text-[12px] w-[20%] flex justify-end ${
                  file?.name ? "text-green-500" : "text-red-500"
                }`}
              >
                {file ? truncate(file?.name, 10) : "No File"}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/jpeg, image/png, image/jpg, image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
        <Button
          className="!bg-primary"
          disabled={!value && true}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Modal>

      <main className="max-w-[92%] md:max-w-[95%] mx-auto lg:grid grid-flow-col lg:grid-cols-[55%_40%] lg:justify-between bg-dark text-white">
        <div className="lg:h-screen lg:overflow-y-scroll">
          <div className="pt-4 pb-2 sticky top-0 left-0 bg-dark z-20">
            <div className="w-[80%]">
              {/* <GooglePlaceSearch isClassName /> */}
            </div>
          </div>
          <div className="relative pt-10">
            <div className="w-full grid grid-flow-col grid-cols-[50%_45%] gap-2 md:grid-cols-[70%_25%] justify-between items-center">
              <City />
              <div
                className="bg-transparent border-2 border-secondary w-full flex flex-col gap-2 items-center justify-center h-[170px] md:h-[190px] rounded-xl cursor-pointer"
                onClick={handleOpenModal}
              >
                <Image src={Plus} alt="add city" />
                <p>Add City</p>
              </div>
            </div>

            <div>
              <div className="flex gap-2 justify-between w-full pt-2 md:pt-10 overflow-scroll">
                {items?.map((item, index) => {
                  return (
                    <motion.div
                      key={index}
                      className="bg-secondary px-5 py-3 flex items-center justify-center rounded-sm cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image src={item} alt="" className="w-7" />
                    </motion.div>
                  );
                })}
              </div>
              <div className="pt-4 md:pt-10">
                <div className="flex justify-between items-center text-sm text-[#ACAFC8] ">
                  <p className="">{countryName} Weather Forecast</p>{" "}
                  <p className="text-xs">Forecast for the month</p>
                </div>
                <WeatherChart
                  id="area-chart"
                  type="line"
                  colors={["#B619A6", "#380ABB"]}
                  series={areaSeries}
                  categories={weekDays}
                  curve="smooth"
                  xaxisLabel={false}
                />
              </div>
            </div>

            <div className="grid grid-flow-col grid-cols-[auto] items-center overflow-x-scroll gap-2 pb-4 lg:pb-8">
              {weatherChartData?.map((weather: WeatherResponse, index) => {
                return (
                  <div
                    key={index}
                    className="text-xs items-center gap-2 w-[30%]"
                  >
                    <p className="text-[8px]">{weather?.day}</p>
                    <p className="text-[8px]">{weather?.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full sticky top-0 left-0 z-20 md:h-[100vh] flex flex-col justify-between">
          <div className="md:h-[50vh] sticky top-0 left-0 pb-10 z-20">
            <MapTest />
          </div>

          <div className="md:h-[35vh] sticky top-0 left-0 pb-10 z-10">
            <CustomTable cols={columns} rows={tableArray} isLoading={loading} />
          </div>
        </div>
      </main>
    </>
  );
}
