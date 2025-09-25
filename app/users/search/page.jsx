"use client";
import {
  Book,
  Box,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Eye,
  GraduationCap,
  List,
  MessageCircle,
  RotateCw,
  Search,
  Send,
  Table2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { departments, faculties } from "@/data/faculty";
import { alerts } from "@/libs/alerts";
import { debounce } from "lodash";
import Loading from "@/components/loading";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Select from "@/components/select";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
dayjs.locale("th");
dayjs.extend(relativeTime);
import { departmentText, facultyText } from "@/components/faculty-p";
import useGetSession from "@/hook/useGetSeesion";
import SendEmail from "@/components/sendEmail";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";
import {v4 as uuid} from "uuid";

const SearchPage = () => {
  const { user } = useGetSession();
  const [showSendEmail, setSendEmail] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(1);
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resultLenth, setResultLength] = useState("");
  const { setPrevPath } = useAppContext();
  const router = useRouter();

  const [dataList, setDataList] = useState([]);
  const [sort, setSort] = useState(JSON.stringify({ year_start: "desc" }));
  const [take, setTake] = useState(25);
  const [selectYearStart, setSelectYearStart] = useState("");
  const [selectYearEnd, setSelectYearEnd] = useState("");

  const fetchData = async (
    search = "",
    type = 0,
    fac = "",
    dep = "",
    page = 1,
    sort,
    take,
    selectYearStart,
    selectYearEnd
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/alumni/search-user", {
        withCredentials: true,
        params: {
          page,
          search,
          fac,
          type,
          dep,
          sort,
          take,
          selectYearStart,
          selectYearEnd,
        },
      });

      if (res.status === 200) {
        setDataList(res?.data?.data);
        setTotalPage(res?.data?.totalPage);
        setResultLength(res?.data?.all);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(fetchData, 500), []);

  useEffect(() => {
    debounceSearch(
      search,
      type,
      faculty,
      department,
      page,
      sort,
      take,
      selectYearStart,
      selectYearEnd
    );
  }, [
    search,
    type,
    faculty,
    department,
    page,
    sort,
    take,
    selectYearStart,
    selectYearEnd,
  ]);

  const resetSearch = () => {
    setSearch("");
    setFaculty("");
    setDepartment("");
    setType(1);
    setPage(1);
    setSelectYearEnd("");
    setSelectYearStart("");
    setTake(25);
  };

  const [sendToData, setSendToData] = useState();
  const handleShowSendEmail = (user) => {
    setSendEmail(true);
    setSendToData(user);
  };

  const [showAstTableFormat, setShowAsTableFormat] = useState(true);

  return (
    <>
      <div
        className={`w-full flex flex-col p-2 ${
          showAstTableFormat
            ? " bg-white"
            : "bg-gradient-to-r from-blue-50 via-yellow-50 to-green-50"
        }`}
      >
        <span className="flex items-end gap-2 pb-2 w-full border-b border-gray-300">
          <h1 className="text-2xl font-bold">ค้นหาศิษย์เก่าและอาจารย์</h1>
          <p className="text-gray-600 text-[0.9rem]">
            ค้นหาและติดต่อกับศิษย์เก่าหรืออาจารย์
          </p>
        </span>

        <span className="bg-white mt-3.5 p-4 w-full flex flex-col border border-gray-300 rounded-lg shadow-md">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search />
              <p className="text-lg font-bold">ค้นหาและกรอง</p>
            </div>

            {/* {(search || faculty || department) && ( */}
            <button onClick={resetSearch} title="ล้างการค้นหา">
              <RotateCw size={18} color="blue" />
            </button>
            {/* )} */}
          </div>

          <div className="mt-3 flex items-center flex-col gap-2 lg:flex-row">
            <span className="w-full lg:w-1/2 flex items-center gap-2 p-2 rounded-md  shadow-sm border border-gray-300">
              <Search size={18} color="gray" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="w-[90%] text-[0.9rem]"
                placeholder="พิมพ์ค้นหา"
              />
            </span>
            <Select
              placeholder="เลือกคณะ"
              className="w-full lg:w-1/4 shadow-sm text-sm z-20"
              options={faculties.map((f) => ({
                label: f.name,
                value: f.id,
              }))}
              value={
                faculties
                  .map((f) => ({
                    label: f.name,
                    value: f.id,
                  }))
                  .find((f) => Number(f.value) == faculty) || null
              }
              onChange={(option) => setFaculty(option.value)}
            />
            <Select
              placeholder="เลือกสาขา"
              className="w-full lg:w-1/4 shadow-sm text-sm z-20"
              options={departments.map((d) => ({
                label: d.name,
                value: d.id,
              }))}
              value={
                departments
                  .map((f) => ({
                    label: f.name,
                    value: f.id,
                  }))
                  .find((f) => Number(f.value) == department) || null
              }
              onChange={(option) => setDepartment(option.value)}
            />
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 w-full gap-5 mt-5">
            <div className="flex flex-col gap-2 col-span-2">
              <p className="text-sm text-gray-600 pb-2 border-b border-gray-200">
                เมนูค้นหา
              </p>

              <span className="flex gap-1.5 lg:gap-2  lg:flex-row lg:items-center">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  name=""
                  id=""
                  className="outline-0 text-sm w-full lg:w-1/4 p-2 rounded-md bg-gray-50 shadow-sm border border-gray-100"
                >
                  <option value={1}>ศิษย์เก่า</option>
                  <option value={2}>อาจารย์</option>
                </select>
                {type < 2 && (
                  <>
                    {" "}
                    <SelectYearStart
                      setSelectYearStart={setSelectYearStart}
                      selectYearStart={selectYearStart}
                      setPage={setPage}
                    />
                    <SelectYearEnd
                      setSelectYearEnd={setSelectYearEnd}
                      selectYearEnd={selectYearEnd}
                      setPage={setPage}
                    />
                    <div title="แสดงจำนวนแถว" className="relative inline-block">
                      <select
                        onChange={(e) => {
                          setTake(e.target.value);
                          setPage(1);
                        }}
                        value={take}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      >
                        <option value={25} className="text-sm">
                          25
                        </option>
                        <option value={50} className="text-sm">
                          50
                        </option>
                        <option value={100} className="text-sm">
                          100
                        </option>
                      </select>
                      <label
                        htmlFor="select-row"
                        className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <List size={17} />
                        <p className="text-sm hidden lg:inline-flex">
                          แสดง {take} แถว
                        </p>
                      </label>
                    </div>
                    <div title="เรียงตาม" className="relative inline-block">
                      <select
                        onChange={(e) => {
                          setSort(e.target.value);
                          setPage(1);
                        }}
                        value={sort}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      >
                        <option
                          value={JSON.stringify({ year_start: "desc" })}
                          className="text-sm"
                        >
                          ปีที่เข้ารับการศึกษา (มากไปน้อย)
                        </option>
                        <option
                          value={JSON.stringify({ year_start: "asc" })}
                          className="text-sm"
                        >
                          ปีที่เข้ารับการศึกษา (น้อยไปมาก)
                        </option>
                        <option
                          value={JSON.stringify({ updatedAt: "desc" })}
                          className="text-sm"
                        >
                          อัปเดตล่าสุด
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
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-2 ">
              <p className="text-sm text-gray-600 pb-2 border-b border-gray-200">
                เลือกรูปแบบการแสดงผล
              </p>
              <span className="flex items-center gap-2">
                <button
                  onClick={() => setShowAsTableFormat(true)}
                  className={`${
                    showAstTableFormat && "bg-blue-600 text-white"
                  } border border-gray-300 text-xs lg:text-sm p-2 rounded-sm shadow-md flex items-center gap-2 hover:shadow-lg`}
                >
                  <Table2 size={17} />
                  <p>แสดงในรูปแบบตาราง</p>
                </button>
                <button
                  onClick={() => setShowAsTableFormat(false)}
                  className={`${
                    !showAstTableFormat && "bg-blue-600 text-white"
                  } border border-gray-300 text-xs lg:text-sm p-2 rounded-sm shadow-md flex items-center gap-2 hover:shadow-lg`}
                >
                  <Box size={17} />
                  <p>แสดงในรูปแบบบล็อค</p>
                </button>
              </span>
            </div>
          </div>
        </span>

        <span className="w-full flex items-center justify-between">
          <label htmlFor="" className="font-bold text-sm mt-7">
            ผลการค้นหา{type < 2 ? "ข้อมูลศิษย์เก่า" : "ข้อมูลอาจารย์"} (
            {loading ? "กำลังโหลด..." : resultLenth + " คน" || "0"})
          </label>
          {totalPage > 1 && (
            <div className="items-center flex gap-5 mt-5 justify-center text-sm">
              {page > 1 && (
                <button
                  onClick={() => {
                    setPage((prev) => prev - 1);
                  }}
                  className="shadow-md hover:bg-blue-600 rounded-md p-1.5 bg-blue-500 text-white"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <p>
                {page} จาก {totalPage}
              </p>
              {page < totalPage && (
                <button
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                  className="shadow-md hover:bg-blue-600 rounded-md p-1.5 bg-blue-500 text-white"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </span>

        {loading ? (
          <div className="w-full my-5 py-5 flex flex-col gap-2 items-center justify-center">
            <Loading type={2} />
            <p>กำลังโหลด...</p>
          </div>
        ) : dataList?.length > 0 ? (
          showAstTableFormat ? (
            <div className="w-full h-[600px] mt-3 rounded-tl-md rounded-tr-md overflow-auto">
              <table className="w-auto lg:w-full">
                <thead className="sticky top-0 z-10">
                  <tr>
                    {[
                      "ที่",
                      "ชื่อ-นามสกุล",
                      "คณะ",
                      "สาขา",

                      ...(type < 2 ? ["ปีการศึกษา (พ.ศ.)"] : ["ตำแหน่ง"]),

                      "แอ็คชัน",
                    ].map((h) => (
                      <td key={uuid()} className="p-3 bg-blue-100 text-sm">
                        {h}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((d,index) => (
                    <tr
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrevPath("/users/search");
                        router.push(
                          `/users/search/${
                            type < 2 ? d?.alumni_id : d?.professor_id
                          }/${type}`
                        );
                      }}
                      key={uuid()}
                      className="text-sm hover:bg-sky-100 transition-all duration-200 cursor-pointer border-b border-gray-200"
                    >
                      <td className="p-2 px-2.5">
                        {index + (page - 1) * take + 1}
                      </td>
                      <td className="p-2.5 py-3 text-start">
                        {type < 2 ? d?.prefix : d?.academic_rank || "อ."}
                        {d?.fname} {d?.lname}
                      </td>
                      <td className="p-2.5 py-3 text-start">
                        {facultyText(d?.facultyId)}
                      </td>
                      <td className="p-2.5 py-3 text-start">
                        {departmentText(d?.departmentId)}
                      </td>
                      <td className="p-2.5 py-3 text-start">
                        {type < 2
                          ? `${d?.year_start} - ${d?.year_end}`
                          : d?.univercity_position}
                      </td>
                      <td className="">
                        <div className="flex items-center justify-center">
                          {user?.id !==
                          (type < 2 ? d?.alumni_id : d?.professor_id) ? (
                            <button
                              title="ส่งข้อความ"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowSendEmail(d);
                              }}
                              className="w-1/2 p-2 border border-gray-400 bg-blue-500 text-white hover:bg-blue-400 rounded-md flex justify-center items-center"
                            >
                              <MessageCircle size={15} color="white" />
                            </button>
                          ) : (
                            <Link
                              href="/users/profile"
                              title="โปรไฟล์ของฉัน"
                              className="w-1/2 z-30 p-2 border border-gray-400 hover:bg-yellow-300 rounded-md flex justify-center items-center"
                            >
                              <Eye size={15} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 mt-5">
              {dataList?.map((d) => (
                <div
                  key={uuid()}
                  className="relative p-4 rounded-md border bg-white border-gray-300 shadow-md flex flex-col gap-3"
                >
                  <span className="absolute top-2 right-2 my-1 text-xs p-1 px-2 border border-gray-400 rounded-full ">
                    {type > 1 ? d?.univercity_position : "ศิษย์เก่า"}
                  </span>
                  <span className="flex items-start gap-3">
                    <div className="flex flex-col gap-0.5 items-start">
                      <h2 className="text-lg font-bold">
                        {type < 2 ? d?.prefix : d?.academic_rank}
                        {d?.fname} {d?.lname}
                      </h2>

                      <span className="flex items-center gap-2">
                        <GraduationCap size={15} color="gray" />
                        <p className="text-sm text-gray-500">
                          {facultyText(
                            d?.facultyId || d?.alumni_id?.substring(3, 5)
                          )}
                        </p>
                      </span>
                      <span className="flex items-center gap-2">
                        <Book size={15} color="gray" />
                        <p className="text-sm text-gray-500">
                          {departmentText(
                            d?.departmentId || d?.alumni_id?.substring(4, 8)
                          )}
                        </p>
                      </span>
                      {type < 2 && (
                        <>
                          {" "}
                          <span className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar size={15} color="gray" /> ปีการศึกษา
                            (พ.ศ.) {d?.year_start} - {d?.year_end}
                          </span>
                          <span className="flex items-center gap-2 text-gray-600 text-sm">
                            <Clock size={15} color="gray" />
                            {d?.updatedAt
                              ? "อัปเดตล่าสุด " + dayjs(d?.updatedAt).fromNow()
                              : "ไม่มีการอัปเดตข้อมูล"}
                          </span>
                        </>
                      )}
                    </div>
                  </span>
                  <span className="w-full flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        setPrevPath("/users/search");
                        router.push(
                          `/users/search/${
                            type < 2 ? d?.alumni_id : d?.professor_id
                          }/${type}`
                        );
                      }}
                      className="w-1/2 p-2 border border-gray-400 hover:bg-yellow-300 rounded-md flex justify-center items-center gap-2"
                    >
                      <Eye size={15} />
                      <p className="text-sm">ดูเพิ่มเติม</p>
                    </button>
                    {user?.id !==
                      (type < 2 ? d?.alumni_id : d?.professor_id) && (
                      <button
                        onClick={() => handleShowSendEmail(d)}
                        className="w-1/2 p-2 border border-gray-400 bg-blue-500 text-white hover:bg-blue-400 rounded-md flex justify-center items-center gap-2"
                      >
                        <MessageCircle size={15} color="white" />
                        <p className="text-sm">ส่งข้อความ</p>
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )
        ) : (
          <p className="my-5 w-full text-center text-xl">ไม่พบข้อมูล</p>
        )}
      </div>

      <SendEmail
        type={type}
        sendToData={sendToData}
        show={showSendEmail}
        onclose={() => {
          setSendEmail(false);
        }}
      />
    </>
  );
};
export default SearchPage;
