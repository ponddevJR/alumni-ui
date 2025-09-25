"use client";

import NewsAvtivity from "@/app/users/news/news-activity";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  Calendar,
  Calendar1,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  Heart,
  Newspaper,
  Plus,
  RotateCcw,
  Users,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const Page = () => {
  const [screenWidth, setScreenWidth] = useState(null);
  useEffect(() => {
    // ตั้งค่า screenWidth ตอนที่อยู่บน client เท่านั้น
    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setSearchType("0");
  };

  const [loadAvg, setLoadAvg] = useState(false);
  const [avgAll, setAvgAll] = useState(null);
  const getAvg = async () => {
    setLoadAvg(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/all-avg-news",
        { withCredentials: true }
      );
      if (res.status === 200) {
        setAvgAll(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoadAvg(false);
    }
  };

  useEffect(() => {
    getAvg();
  }, []);

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

  return (
    <>
      {" "}
      <div className="w-full flex flex-col p-2">
        <div className="flex flex-col">
          <h1 className="font-bold text-xl">
            จัดการข่าวสาร กิจกรรม และโครงการบริจาค
          </h1>
          <p className="text-gray-700 w-full text-xs lg:text-[1rem]">
            จัดการข่าวสารและการบริจาค
            เพื่อแสดงบนระบบศิษย์เก่ามหาวิทยาลัยราชภัฏมหาสารคาม
          </p>
        </div>

        <div className="p-2 bg-blue-50 mt-5 rounded-md grid-cols-1 grid lg:grid-cols-3 gap-8">
          <span className="p-3.5 px-5 bg-white border border-gray-300 shadow-sm rounded-lg flex flex-col gap-2">
            <div className="w-full flex items-center justify-between">
              <p className="text-sm text-gray-600">ข่าวสารและกิจกรรมทั้งหมด</p>
              <Newspaper size={18} color="blue" />
            </div>
            <span className="text-2xl font-bold">
              {loadAvg ? (
                <Loading type={2} />
              ) : (
                avgAll?.allNews?.toLocaleString()
              )}
            </span>
            <p className="text-sm text-gray-600">ข่าว</p>
          </span>
          <span className="p-3.5 px-5 bg-white border border-gray-300 shadow-sm rounded-lg flex flex-col gap-2">
            <div className="w-full flex items-center justify-between">
              <p className="text-sm text-gray-600">โครงการบริจาคทั้งหมด</p>
              <Heart size={18} color="red" />
            </div>
            <span className="text-2xl font-bold">
              {loadAvg ? (
                <Loading type={2} />
              ) : (
                avgAll?.allDonation?.toLocaleString()
              )}
            </span>
            <p className="text-sm text-gray-600">โครงการ</p>
          </span>
          <span className="p-3.5 px-5 bg-white border border-gray-300 shadow-sm rounded-lg flex flex-col gap-2">
            <div className="w-full flex items-center justify-between">
              <p className="text-sm text-gray-600">ผู้เข้าชมข่าวสาร</p>
              <Users size={18} color="green" />
            </div>
            <span className="text-2xl font-bold">
              {loadAvg ? (
                <Loading type={2} />
              ) : (
                avgAll?.allViews?.toLocaleString()
              )}
            </span>
            <p className="text-sm text-gray-600">คน</p>
          </span>
        </div>

        <span className="w-full flex lg:flex-row flex-col items-center justify-between">
          <div className="flex items-center mt-5 gap-1 pr-10 border-r border-gray-300">
            <div title="เลือกจัดการ" className="relative inline-block">
              <select
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setPage(1);
                }}
                value={searchType}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="0">ทั้งหมด</option>
                <option value="1">ข่าวสารและกิจกรรม</option>
                <option value="2">การบริจาค</option>
              </select>
              <label
                htmlFor="select-row"
                className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <p className="text-sm">จัดการ </p>
                <p className="text-sm hidden lg:inline-flex">
                  :{" "}
                  {searchType == 0
                    ? "ทั้งหมด"
                    : searchType == 1
                    ? "ข่าวสารและกิจกรรม"
                    : "การบริจาค"}
                </p>
              </label>
            </div>
            <div title="กรอง" className="relative inline-block">
              <select
                onChange={(e) => {
                  setSearchCategory(e.target.value);
                  setPage(1);
                }}
                value={searchCategory}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="0">ทั้งหมด</option>
                <option value="1">เผยแพร่อยู่</option>
                <option value="2">ฉบับร่าง</option>
              </select>
              <label
                htmlFor="select-row"
                className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Filter size={17} />
                <p className="text-sm hidden lg:inline-flex">
                  {searchCategory == 0
                    ? "ทั้งหมด"
                    : searchCategory == 1
                    ? "เผยแพร่อยู่"
                    : "ฉบับร่าง"}
                </p>
              </label>
            </div>
            <div title="ค้นหาวันที่" className="relative inline-block">
              <select
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setPage(1);
                }}
                value={searchDate}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d, index) => (
                  <option key={index} className="text-sm" value={d}>
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
            <Link
              href="/alumni-president/alumni-news/0/add-new-activity"
              className="text-sm flex items-center hover:bg-blue-600 gap-2 p-2 px-3.5 rounded-lg border border-gray-300 shadow-sm bg-blue-500 text-white"
            >
              <Plus size={17} />
              <p className="hidden lg:inline">เพิ่มข้อมูลใหม่</p>
            </Link>
          </div>

          <div className="justify-end flex items-center mt-3 gap-4">
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

        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 my-5">
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
      </div>
    </>
  );
};
export default Page;
