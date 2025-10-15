"use client";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  List,
  RotateCcw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ExportBtn from "./export-btn";
import { useDashboardContext } from "@/app/users/dashboard/dashboard-context";
import { departmentText, facultyText } from "./faculty-p";
import { useRouter } from "next/navigation";
import Select from "./select";
import { departments, faculties } from "@/data/faculty";
import { debounce } from "lodash";
import Modal from "./modal";
import useGetSession from "@/hook/useGetSeesion";
import { useAppContext } from "@/context/app.context";
import { SelectYearEnd, SelectYearStart } from "./select-year-start";

const TablePage = ({
  header,
  children,
  theads,
  fetchData,
  exportData,
  totalPage,
  total,
  filterBtn,
  // ✅ state มาจาก parent
  page,
  setPage,
  take,
  setTake,
  sort,
  setSort,
  search,
  setSearch,
  facultyId,
  setFacultyId,
  departmentId,
  setDepartmentId,
  setSelectYearStart,
  setSelectYearEnd,
  selectYearStart,
  selectYearEnd,
  extraFilter = {},
  setExtraFilter,
  showExportBtn = true, // ✅ optional filter
}) => {
  const { user } = useGetSession();
  const { faculty, department, setFaculty, setDepartment } =
    useDashboardContext();
  const { setPrevPath } = useAppContext();

  const router = useRouter();
  const [description, setDescription] = useState("");

  const debounceSearch = useMemo(() => debounce(fetchData, 700), [fetchData]);

  useEffect(() => {
    let desc = "ภายใน";
    if (facultyId) {
      desc += facultyText(faculty?.id || faculty?.value || facultyId);
    }
    if (departmentId) {
      desc +=
        " " +
        departmentText(department?.id || department?.value || departmentId);
    }
    desc += " มหาวิทยาลัยราชภัฏมหาสารคาม";
    setDescription(desc);
  }, [faculty, department, facultyId, departmentId]);

  const forwardPage = () => {
    if (page >= totalPage) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const resetData = () => {
    setFacultyId(user?.roleId <= 3 ? `${user?.facultyId}` : "");
    setDepartmentId(user?.roleId < 3 ? `${user?.departmentId}` : "");
    setSearch("");
    setPage(1);
    setSort(JSON.stringify({ year_start: "desc" }));
    setExtraFilter({});
    setSelectYearEnd("");
    setSelectYearStart("");
  };

  // ✅ โหลดข้อมูลทุกครั้งที่ state เปลี่ยน
  useEffect(() => {
    debounceSearch(
      page,
      take,
      search,
      facultyId,
      departmentId,
      sort,
      selectYearStart,
      selectYearEnd,
      extraFilter
    );
  }, [
    page,
    take,
    search,
    facultyId,
    departmentId,
    sort,
    extraFilter,
    selectYearEnd,
    selectYearStart,
  ]);
  return (
    <>
      <div className="w-full h-full items-start flex flex-col px-5 pt-3">
        {user?.roleId < 5 && (
          <button
            onClick={() => {
              setFaculty(null);
              setDepartment(null);
              setPrevPath("");
              router.push("/users/dashboard");
            }}
            className="w-fit flex items-center gap-2"
          >
            <ArrowLeft size={20} color="blue" />
          </button>
        )}

        <span className="w-full flex flex-col lg:flex-row lg:items-end gap-2 justify-between lg:border-b lg:pb-3 lg:border-gray-300">
          <div className="flex flex-col mt-2">
            <h1 className="font-bold text-lg">{header}</h1>
            <p className="text-[0.9rem] text-gray-700">
              {description +
                `${selectYearStart ? ` ปีการศึกษา พ.ศ. ${selectYearStart}` : ""}
            ${
              selectYearEnd && selectYearStart
                ? ` - พ.ศ. ${selectYearEnd}`
                : selectYearEnd
                ? ` ปีที่สำเร็จการศึกษา พ.ศ. ${selectYearEnd}`
                : ""
            }`}{" "}
              ({total} คน)
            </p>
          </div>
          <div className="lg:w-1/3 col-span-5 p-2 px-3 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (page > 1) {
                  setPage(1);
                }
              }}
              type="text"
              placeholder="พิมพ์ค้นหา"
              className="text-[0.9rem] w-[90%]"
            />
          </div>
        </span>

        <div className="gap-2.5 w-full lg:flex items-center grid grid-cols-5 my-2.5">
          {user?.roleId > 3 && (
            <Select
              placeholder="ค้นหาคณะ"
              className="z-50 lg:w-1/6 col-span-5 text-sm"
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
                setDepartment();
                setFaculty(option);
              }}
            />
          )}
          {user?.roleId > 2 && (
            <Select
              placeholder="ค้นหาสาขาวิชา"
              className="z-50 lg:w-1/6 col-span-5 text-sm"
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
          )}

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

          {filterBtn}

          <button
            title="ล้างการค้นหา"
            onClick={resetData}
            className="p-2 px-3.5 justify-center rounded-lg border border-gray-300 shadow-md flex items-center gap-2"
          >
            <RotateCcw size={17} />
            <p className="text-sm hidden lg:inline-flex">รีเซ็ต</p>
          </button>

          <div
            title="เลือกจำนวนที่ต้องการแสดง"
            className="relative inline-block"
          >
            <select
              onChange={(e) => {
                setTake(Number(e.target.value));
                setPage(1);
              }}
              value={take}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value={10} className="text-sm">
                10
              </option>
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
              <p className="text-sm hidden lg:inline-flex">{take}</p>
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
                ปีที่การศึกษาปัจจุบัน
              </option>
              <option
                value={JSON.stringify({ year_start: "asc" })}
                className="text-sm"
              >
                ปีที่การศึกษาอดีต
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

          {showExportBtn && <ExportBtn exportname={header} data={exportData} />}
        </div>

        <div className="lg:w-full w-auto overflow-x-auto h-auto overflow-y-auto rounded-tl pb-3">
          <table className="lg:w-full w-auto">
            <thead>
              <tr className="sticky top-0 bg-white z-30">
                {[
                  "ที่",
                  "ชื่อ - นามสกุล",
                  "คณะ",
                  "สาขา",
                  "ปีการศึกษา(พ.ศ.)",
                ].map((h, index) => (
                  <th
                    key={index}
                    className="text-start p-2.5 text-[0.9rem] bg-sky-100 font-normal"
                  >
                    {h}
                  </th>
                ))}
                {theads?.map((t, index) => (
                  <th
                    className="text-start p-2.5 text-[0.9rem] bg-sky-100 font-normal"
                    key={index}
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>

        {totalPage > 1 && (
          <div className="w-full justify-end flex items-center my-3.5 gap-4">
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
        )}
      </div>
      <Modal></Modal>
    </>
  );
};
export default TablePage;
