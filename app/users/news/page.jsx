"use client";

import Image from "next/image";
import logo from "@/assets/images/logo_rmu.png";
import {} from "react-icons/fa";
import {
  Calendar,
  Calendar1,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  HandCoins,
  Newspaper,
  RotateCcw,
  University,
  WholeWord,
} from "lucide-react";
import { useEffect, useState } from "react";
import FadeInSection from "@/components/fade-in-section";
import NewsAvtivity from "./news-activity";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import Loading from "@/components/loading";
import { v4 as uuid } from "uuid";

const Page = () => {
  const [screenWidth, setScreenWidth] = useState(null);

  const [searchDate, setSearchDate] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchType, setSearchType] = useState("0");
  const [sort, setSort] = useState(JSON.stringify({ createdAt: "desc" }));
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [take, setTake] = useState(4);
  const [searchCategory, setSearchCategory] = useState(0);

  const forwardPage = () => {
    if (page >= totalPage) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const resetAllSearch = () => {
    setPage(1);
    setSort(JSON.stringify({ createdAt: "desc" }));
    setSearchDate("");
    setSearchMonth("");
    setSearchCategory(0);
    setSearchType("1");
  };

  const [newsDonation, setNewsDonation] = useState([]);
  const fetchNewsDonation = async (
    page = 1,
    take = 25,
    sort,
    searchType,
    searchDate,
    searchMonth,
    searchCategory
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-news-donate",
        {
          withCredentials: true,
          params: {
            page,
            take,
            sort,
            searchType,
            searchDate,
            searchMonth,
            searchCategory,
          },
        }
      );
      if (res.status === 200) {
        setNewsDonation(res.data.result);
        setTotalPage(res.data.totalPage);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDonation(
      page,
      take,
      sort,
      searchType,
      searchDate,
      searchMonth,
      searchCategory
    );
  }, [page, take, sort, searchType, searchDate, searchMonth, searchCategory]);

  useEffect(() => {
    // ตั้งค่า screenWidth ตอนที่อยู่บน client เท่านั้น
    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full flex flex-col p-2">
      <FadeInSection className="flex items-center flex-col lg:flex-row gap-2 pb-2 w-full border-b border-gray-300">
        <Image width={80} height={80} alt="logo" priority src={logo} />
        <div className="flex flex-col lg:items-start items-center">
          <h1 className="lg:text-3xl text-xl font-bold text-blue-600">
            ข่าวสารและการบริจาค
          </h1>
          <p className="text-gray-700 text-xs lg:text-[1rem] text-center">
            ติดตามข่าวสารและกิจกรรมล่าสุดของมหาวิทยาลัย
            ร่วมสนับสนุนโครงการพัฒนาสถาบันเพื่ออนาคตที่ยั่งยืน
          </p>
        </div>
      </FadeInSection>

      <div className="w-full flex flex-col lg:flex-row mt-5">
        <div className="flex flex-col gap-1 pr-10 border-r border-gray-300">
          <p className="pb-2 text-sm text-gray-600 border-b border-gray-200">
            ประเภท
          </p>
          <span className="rounded-full w-fit flex mt-1 border border-gray-300 bg-gray-200 shadow-md">
            <button
              onClick={() => setSearchType(0)}
              className={`${
                searchType == 0 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              } flex rounded-full items-center text-xs lg:text-sm gap-2 py-2 px-5  `}
            >
              <University size={20} />
              <p>ทั้งหมด</p>
            </button>
            <button
              onClick={() => setSearchType(1)}
              className={`${
                searchType == 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              } flex rounded-full items-center text-xs lg:text-sm gap-2 py-2 px-5  `}
            >
              <Newspaper size={20} />
              <p>ข่าวสารและกิจกรรม</p>
            </button>
            <button
              onClick={() => setSearchType(2)}
              className={`${
                searchType == 2 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              } flex rounded-full items-center text-xs  lg:text-sm gap-2 py-2 px-5  `}
            >
              <HandCoins size={20} />
              <p>ร่วมบริจาค</p>
            </button>
          </span>
        </div>
        <div className="flex flex-col gap-1 lg:ml-10">
          <p className="pb-2 text-sm text-gray-600 border-b border-gray-200">
            ค้นหา
          </p>
          <span className="rounded-full w-fit flex mt-1 items-center gap-2">
            <div title="ค้นหาวันที่" className="relative inline-block">
              <select
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setPage(1);
                }}
                value={searchDate}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={uuid()} className="text-sm" value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <label
                htmlFor="select-row"
                className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar1 size={17} />
                <p className="text-sm hidden lg:inline-flex">
                  วันที่ {searchDate}
                </p>
              </label>
            </div>
            <div title="ค้นหาเดือน" className="relative inline-block">
              <select
                onChange={(e) => {
                  setSearchMonth(e.target.value);
                  setPage(1);
                }}
                value={searchMonth}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {[
                  { id: 1, name: "มกราคม" },
                  { id: 2, name: "กุมภาพันธ์" },
                  { id: 3, name: "มีนาคม" },
                  { id: 4, name: "เมษายน" },
                  { id: 5, name: "พฤษภาคม" },
                  { id: 6, name: "มิถุนายน" },
                  { id: 7, name: "กรกฎาคม" },
                  { id: 8, name: "สิงหาคม" },
                  { id: 9, name: "กันยายน" },
                  { id: 10, name: "ตุลาคม" },
                  { id: 11, name: "พฤศจิกายน" },
                  { id: 12, name: "ธันวาคม" },
                ].map((d) => (
                  <option key={uuid()} className="text-sm" value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="select-row"
                className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar size={17} />
                <p className="text-sm hidden lg:inline-flex">
                  เดือน{" "}
                  {searchMonth &&
                    [
                      { id: 1, name: "มกราคม" },
                      { id: 2, name: "กุมภาพันธ์" },
                      { id: 3, name: "มีนาคม" },
                      { id: 4, name: "เมษายน" },
                      { id: 5, name: "พฤษภาคม" },
                      { id: 6, name: "มิถุนายน" },
                      { id: 7, name: "กรกฎาคม" },
                      { id: 8, name: "สิงหาคม" },
                      { id: 9, name: "กันยายน" },
                      { id: 10, name: "ตุลาคม" },
                      { id: 11, name: "พฤศจิกายน" },
                      { id: 12, name: "ธันวาคม" },
                    ].filter((d) => d.id == searchMonth)[0].name}
                </p>
              </label>
            </div>
            <div title="เรียง" className="relative inline-block">
              <select
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                value={searchMonth}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option
                  className="text-sm"
                  value={JSON.stringify({ createdAt: "desc" })}
                >
                  ล่าสุด
                </option>
                <option
                  className="text-sm"
                  value={JSON.stringify({ updatedAt: "desc" })}
                >
                  แก้ไขล่าสุด
                </option>
                <option
                  value={JSON.stringify({ view: "desc" })}
                  className="text-sm"
                >
                  เข้าชมเยอะสุด
                </option>
              </select>
              <label
                htmlFor="select-row"
                className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ChevronsUpDown size={17} />
                <p className="text-sm hidden lg:inline-flex">เรียง</p>
              </label>
            </div>
            <button
              title="ล้างการค้นหา"
              onClick={resetAllSearch}
              className="p-2 px-3.5 justify-center rounded-lg border border-gray-300 shadow-md flex items-center gap-2"
            >
              <RotateCcw size={17} />
              <p className="text-sm hidden lg:inline-flex">ล้างการค้นหา</p>
            </button>
          </span>
        </div>
      </div>

      <FadeInSection className={"mt-5 w-full flex flex-col"}>
        <span className="w-full flex flex-col lg:flex-row lg:justify-between pb-2 border-b border-gray-300">
          <h2 className="text-blue-600 lg:text-xl  font-bold">
            {searchType == 0
              ? "ข่าวสาร กิจกรรมและโครงการบริจาคทั้งหมด"
              : searchType == 1
              ? "ข่าวสารและกิจกรรม"
              : "โครงการบริจาค"}{" "}
            มหาวิทยาลัยราชภัฏมหาสารคาม ({total || 0}{" "}
            {searchType == 1 ? "ข่าว" : "โครงการ"})
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={prevPage}
              className="p-2 rounded-full shadow-md text-sm text-white bg-blue-500 hover:bg-blue-600"
            >
              <ChevronLeft size={18} />
            </button>
            <p>
              หน้า {page} จาก {totalPage}
            </p>
            <button
              onClick={forwardPage}
              className="p-2 rounded-full shadow-md text-sm text-white bg-blue-500 hover:bg-blue-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </span>

        <div
          className={`w-full flex flex-col lg:grid lg:grid-cols-4  lg:w-auto w-[${screenWidth}px] gap-4 mt-3  relative`}
        >
          {loading ? (
            <Loading type={2} />
          ) : newsDonation.length > 0 ? (
            newsDonation.map((n) => (
              <NewsAvtivity
                fetchData={() =>
                  fetchNewsDonation(
                    page,
                    take,
                    sort,
                    searchType,
                    searchDate,
                    searchMonth
                  )
                }
                item={n}
                screenWidth={screenWidth}
                key={uuid()}
              />
            ))
          ) : (
            <div className="col-span-4 flex flex-col justify-center items-center">
              ขออภัย ขณะนี้ไม่พบข้อมูลข่าวสารและการบริจาค
            </div>
          )}
        </div>
      </FadeInSection>
    </div>
  );
};
export default Page;
