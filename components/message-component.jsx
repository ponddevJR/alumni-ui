"use client";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  RotateCcw,
  Send,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
const TiptapEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import Select from "@/components/select";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";
import { departments, faculties } from "@/data/faculty";
import { useEffect, useState } from "react";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Loading from "@/components/loading";
import { departmentText, facultyText } from "@/components/faculty-p";
import { v4 as uuid } from "uuid";
import useGetSession from "@/hook/useGetSeesion";

const SendMessage = () => {
  const { user } = useGetSession();
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: "",
      detail: "",
    },
  });

  const [selectYearStart, setSelectYearStart] = useState("");
  const [selectYearEnd, setSelectYearEnd] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(JSON.stringify({ year_start: "desc" }));
  const [alumniList, setAlumniList] = useState([]);

  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectId, setSelectId] = useState([]);

  const forwardPage = () => {
    if (page >= totalPage) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const fetchAlumniList = async (
    page,
    sort,
    facultyId,
    departmentId,
    selectYearStart,
    selectYearEnd
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/alumni/search-user", {
        withCredentials: true,
        params: {
          page,
          fac: facultyId,
          dep: departmentId,
          type: 1,
          search: "",
          sort,
          take: 10,
          selectYearStart,
          selectYearEnd,
          role: user?.roleId,
        },
      });
      if (res.status === 200) {
        setAlumniList(res.data.data);
        setTotalPage(res.data.totalPage);
        setTotal(res.data.all);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumniList(
      page,
      sort,
      facultyId,
      departmentId,
      selectYearStart,
      selectYearEnd
    );
  }, [
    selectYearStart,
    selectYearEnd,
    page,
    sort,
    facultyId,
    departmentId,
    user,
  ]);

  const resetSearch = () => {
    setPage(1);
    setSelectYearEnd("");
    setSelectYearStart("");
    setSort(JSON.stringify({ year_start: "desc" }));
    setFacultyId("");
    setDepartmentId("");
    setIsSelectAll(false);
  };

  const [sending, setSending] = useState(false);
  const handleSend = async (data) => {
    if ((selectId.length < 1 && !isSelectAll) || (isSelectAll && total < 1)) {
      return alerts.err("กรุณาเลือกผู้รับ");
    }

    const { isConfirmed } = await alerts.confirmDialog(
      `ยืนยันการส่งข้อความ`,
      `ต้องการส่งข้อความถึงศิษย์เก่า ${
        isSelectAll ? total : selectId.length
      }คน?`,
      "ส่ง"
    );
    if (!isConfirmed) return;
    setSending(true);
    try {
      const res = await axios.post(
        apiConfig.rmuAPI + "/president/sendemail",
        data,
        {
          withCredentials: true,
          params: {
            fac: facultyId,
            dep: departmentId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if ((res.status = 200)) {
        alerts.success("ระบบกำลังทยอยส่งข้อความถึงศิษย์เก่า");
        reset();
        setSelectId([]);
        resetSearch();
        setValue("detail", "");
        location.reload();
      }
    } catch (err) {
      console.error(err);
      alerts.err();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col p-5 bg-gradient-to-r from-teal-50 via-emerald-50 to-yellow-50">
      <span className="flex flex-col items-start gap-1 pb-3 border-b border-blue-200 w-full">
        <div className="flex items-center gap-3">
          <Mail size={30} color="blue" />
          <p className="text-2xl font-bold text-blue-600">
            ส่งขอความและประชาสัมพันธ์
          </p>
        </div>
        <p className="text-gray-700">ส่งขอความหรือประชาสัมพันธ์ถึงศิษย์เก่า</p>
      </span>

      <div className="mt-5  flex flex-col-reverse lg:grid lg:grid-cols-2 gap-5">
        <div className=" bg-white p-5 rounded-lg border border-gray-300 shadow-md shadow-gray-400">
          <span className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Send size={20} color="blue" />
              <p className="text-lg font-bold">เขียนข้อความ</p>
            </div>
            <p className="text-gray-700">กรอกรายละเอียดข้อความที่ต้องการส่ง</p>
          </span>

          <p className="mt-5">
            หัวข้อ <small className="text-sm text-red-500">*</small>
          </p>
          <Controller
            name="title"
            rules={{ required: "กรุณาระบุหัวข้อ" }}
            control={control}
            render={({ field }) => (
              <input
                value={field.value || ""}
                {...field}
                className="p-2 text-sm px-3 border border-gray-300 shadow-sm mt-2 w-full rounded-lg"
                placeholder="กรอกหัวข้อ เช่น ประชาสัมพันธ์ถึงศิษย์เก่า"
              />
            )}
          />
          {errors.title && (
            <small className="text-sm text-red-500 mt-1.5">
              {errors.title.message}
            </small>
          )}
          <p className="mt-5">
            เนื้อหา <small className="text-sm text-red-500">*</small>
          </p>
          <Controller
            name="detail"
            rules={{ required: "โปรดกรอกเนื้อหา" }}
            control={control}
            render={({ field }) => (
              <TiptapEditor
                value={field.value}
                onChange={field.onChange}
                hiegth={100}
              />
            )}
          />
          {errors.detail && (
            <small className="text-sm text-red-500 mt-1.5">
              {errors.detail.message}
            </small>
          )}

          <p className="mt-4">
            ผู้รับ ({isSelectAll ? total : selectId.length} คน)
          </p>
          <button
            disabled={sending}
            onClick={handleSubmit(handleSend)}
            className="hover:bg-blue-600 mt-5 w-full flex items-center gap-2 justify-center p-2.5 rounded-md bg-blue-500 text-white"
          >
            {sending ? (
              <>
                <Loading type={1} /> <p>กำลังส่งข้อความ อาจใช้เวลานาน...</p>
              </>
            ) : (
              <>
                <Send size={18} />
                <p>ส่งข้อความ</p>
              </>
            )}
          </button>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-md shadow-gray-400">
          <span className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Filter size={20} color="blue" />
              <p className="text-lg font-bold">เลือกผู้รับ</p>
            </div>
            <p className="text-gray-700">กรองและเลือกผู้รับข้อความ</p>
          </span>

          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Select
              placeholder="ค้นหาคณะ"
              className="z-50 lg:col-span-1 col-span-4 text-sm"
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
                  .find((f) => f.value == facultyId) || null
              }
              onChange={(option) => {
                setFacultyId(option.value);
                setDepartmentId("");
                setDepartment(null);
              }}
            />
            <Select
              placeholder="ค้นหาสาขาวิชา"
              className="z-50 lg:col-span-2 col-span-4 text-sm"
              options={
                facultyId
                  ? departments
                      .filter((d) => {
                        if (Number(facultyId) < 18) {
                          return (
                            `${d.id}`.substring(0, 1) ==
                            facultyId?.substring(1, 2)
                          );
                        } else if (Number(facultyId) > 18) {
                          return `${d.id}`.substring(0, 1) == 62;
                        } else {
                          return `${d.id}`.substring(0, 1) == 21;
                        }
                      })
                      .map((d) => ({
                        label: d.name,
                        value: d.id,
                      }))
                  : departments.map((d) => ({
                      label: d.name,
                      value: d.id,
                    }))
              }
              value={
                departments
                  .map((f) => ({
                    label: f.name,
                    value: f.id,
                  }))
                  .find((f) => f.value == departmentId) || null
              }
              onChange={(option) => {
                setDepartmentId(option.value);
                setDepartment(option);
              }}
            />
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
            <button
              onClick={resetSearch}
              className="p-2 border rounded-lg justify-center border-gray-300 shadow-sm flex items-center gap-2 text-sm"
            >
              <RotateCcw size={17} />
              <p className="hidden lg:inline">ล้างการค้นหา</p>
            </button>
          </div>

          <div className="w-full flex text-sm items-center justify-between mt-4 ">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700">เลือกรายชื่อผู้รับ</p>
              <span className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isSelectAll}
                  onChange={() => {
                    setIsSelectAll(!isSelectAll);
                    setSelectId([]);
                  }}
                  className="mt-0.5"
                />
                <p>เลือกทั้งหมด ({total || 0} คน)</p>
              </span>
            </div>

            <div className=" justify-end flex items-center text-sm gap-4">
              <button
                onClick={prevPage}
                className="p-1 rounded-lg shadow-md text-sm text-white bg-blue-500 hover:bg-blue-600"
              >
                <ChevronLeft size={18} />
              </button>
              <p>
                หน้า {page} จาก {totalPage}
              </p>
              <button
                onClick={forwardPage}
                className="p-1 rounded-lg shadow-md text-sm text-white bg-blue-500 hover:bg-blue-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-1.5 w-full h-[420px] overflow-y-auto ">
            {loading ? (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
                <Loading type={2} />
                <p>กำลังโหลด...</p>
              </div>
            ) : alumniList.length > 0 ? (
              alumniList.map((a) => (
                <span
                  onClick={() => {
                    setSelectId((prev) =>
                      prev.includes(a?.alumni_id)
                        ? prev.filter((p) => p !== a?.alumni_id)
                        : [...prev, a?.alumni_id]
                    );
                    setIsSelectAll(false);
                  }}
                  key={uuid()}
                  className="p-3 border-b cursor-pointer border-gray-300 transition-all duration-200 hover:bg-blue-50 flex gap-3.5 items-center"
                >
                  <input
                    checked={selectId.includes(a?.alumni_id) || isSelectAll}
                    type="checkbox"
                    name=""
                    id=""
                    onChange={() => {
                      setSelectId((prev) =>
                        prev !== a?.alumni_id
                          ? [...prev, a?.alumni_id]
                          : prev.filter((p) => p !== a?.alumni_id)
                      );
                    }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="">
                      {a?.prefix}
                      {a?.fname} {a?.lname}
                    </p>
                    <span className="flex items-center text-sm text-gray-700">
                      <Calendar size={15} color="gray" />
                      <p>
                        {" "}
                        : ปีการศึกษา พ.ศ. {a?.year_start} - {a?.year_end}
                      </p>
                    </span>

                    <p className="text-sm text-gray-800">
                      {facultyText(a?.facultyId)}{" "}
                      {departmentText(a?.departmentId)}
                    </p>
                  </div>
                </span>
              ))
            ) : (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
                <p>ไม่พบข้อมูลศิษย์เก่า</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SendMessage;
