"use client";
import { departmentText, facultyText } from "@/components/faculty-p";
import Loading from "@/components/loading";
import NoData from "@/components/nodata";
import { apiConfig } from "@/config/api.config";
import { useAppContext } from "@/context/app.context";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../dashboard-context";
import { v4 as uuid } from "uuid";

const { default: TablePage } = require("@/components/table-page");

const Page = () => {
  const { user } = useGetSession();
  const router = useRouter();
  const { setPrevPath } = useAppContext();

  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [total, setTotal] = useState(0);

  // ✅ ควบคุม pagination/filter state ที่นี่ (parent)
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(25);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(JSON.stringify({ year_start: "desc" }));
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [filterWork, setFilterWork] = useState({});
  const {
    selectYearStart,
    setSelectYearStart,
    selectYearEnd,
    setSelectYearEnd,
  } = useDashboardContext();

  useEffect(() => {
    setFacultyId(user?.roleId <= 3 ? `${user?.facultyId}` : "");
    setDepartmentId(user?.roleId < 3 ? `${user?.departmentId}` : "");
  }, [user]);

  const [loading, setLoading] = useState(false);

  const fetchData = async (
    page = 1,
    take = 25,
    search = "",
    facultyId = "",
    departmentId = "",
    sort,
    selectYearStart,
    selectYearEnd,
    current = {}
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/list/work-unemployed",
        {
          withCredentials: true,
          params: {
            page,
            take,
            search,
            facultyId,
            departmentId,
            sort,
            selectYearStart,
            selectYearEnd,
            current,
          },
        }
      );
      if (res.status === 200) {
        setData(res.data.result);
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

  const filterByWork = (e) => {
    const { value } = e.target;
    setFilterWork(value); // ✅ เก็บค่า filterWork
    setPage(1); // reset page
  };

  return (
    <>
      <TablePage
        header="รายชื่อและสถานะปัจจุบันของศิษย์เก่า"
        theads={["สถานะปัจจุบัน"]}
        fetchData={fetchData}
        totalPage={totalPage}
        total={total}
        exportData={data.map((d) => ({
          รหัสนักศึกษา: d?.alumni_id,
          คำนำหน้า: d?.prefix,
          ชื่อ: d?.fname,
          นามสกุล: d?.lname,
          คณะ: facultyText(d?.facultyId),
          สาขาวิชา: departmentText(d?.departmentId),
          "ปีที่เข้ารับการศึกษา(พ.ศ.)": 25 + `${d?.alumni_id}`.substring(0, 2),
          สถานะปัจจุบัน:
            d?.work_expreriences?.find((w) => w.isCurrent) &&
            d?.work_expreriences?.find((w) => w.continued_study)
              ? "กำลังศึกษาต่อ"
              : d?.work_expreriences?.find((w) => w.isCurrent)
              ? "ทำงาน"
              : "ว่างงาน",
        }))}
        filterBtn={
          <div title="กรอง" className="relative inline-block">
            <select
              onChange={filterByWork}
              name=""
              id="select-row"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="" className="text-sm">
                ทั้งหมด
              </option>
              <option
                value={JSON.stringify({ some: { isCurrent: true } })}
                className="text-sm"
              >
                ทำงาน
              </option>
              <option
                value={JSON.stringify({ none: { isCurrent: true } })}
                className="text-sm"
              >
                ว่างงาน
              </option>
              <option
                value={JSON.stringify({
                  some: { AND: [{ continued_study: true, isCurrent: true }] },
                })}
                className="text-sm"
              >
                กำลังศึกษาต่อ
              </option>
            </select>

            <label
              htmlFor="select-row"
              className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Filter size={17} />
              <p className="text-sm hidden lg:inline-flex">กรอง</p>
            </label>
          </div>
        }
        // ✅ ควบคุม state จาก parent
        page={page}
        setPage={setPage}
        take={take}
        setTake={setTake}
        sort={sort}
        setSort={setSort}
        search={search}
        setSearch={setSearch}
        facultyId={facultyId}
        setFacultyId={setFacultyId}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
        extraFilter={filterWork}
        setExtraFilter={setFilterWork}
        selectYearEnd={selectYearEnd}
        selectYearStart={selectYearStart}
        setSelectYearEnd={setSelectYearEnd}
        setSelectYearStart={setSelectYearStart} // ✅ optional filter
      >
        {loading ? (
          <tr>
            <td className="p-2" colSpan={6}>
              <div className="flex justify-center items-center py-20 flex-col gap-2">
                <Loading type={2} />
                <p className="text-sm">กำลังโหลด...</p>
              </div>
            </td>
          </tr>
        ) : data.length > 0 ? (
          data.map((d,index) => (
            <tr
              key={uuid()}
              onClick={() => {
                setPrevPath("/users/dashboard/work-unemployed");
                router.push(`/users/search/${d?.alumni_id}/1`);
              }}
              className="border-b border-gray-200 cursor-pointer hover:bg-gray-100 text-sm"
            >
              <td className="p-2.5 py-3 text-start">
                {index + (page - 1) * take + 1}
              </td>
              <td className="p-2.5 py-3 text-start">
                {d?.prefix}
                {d?.fname} {d?.lname}
              </td>
              <td className="p-2.5 py-3 text-start">
                {facultyText(d?.facultyId)}
              </td>
              <td className="p-2.5 py-3 text-start">
                {departmentText(d?.departmentId)}
              </td>
              <td className="p-2.5 py-3 text-start">
                {d?.year_start} - {d?.year_end}
              </td>
              <td className="p-2.5 py-3">
                <p
                  className={`p-1.5 px-2 rounded-lg shadow-sm text-xs border font-bold w-fit ${
                    d?.work_expreriences?.find(
                      (w) => w.continued_study && w.isCurrent
                    )
                      ? "border-green-100 bg-green-100 text-green-600 "
                      : d?.work_expreriences?.find((w) => w.isCurrent)
                      ? "border-blue-100 bg-sky-100 text-blue-600"
                      : "border-red-100 bg-red-100 text-red-600"
                  }`}
                >
                  {d?.work_expreriences?.find(
                    (w) => w.continued_study && w.isCurrent
                  )
                    ? "กำลังศึกษาต่อ"
                    : d?.work_expreriences?.find((w) => w.isCurrent)
                    ? "ทำงาน"
                    : "ว่างงาน"}
                </p>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-2" colSpan={7}>
              <div className="flex justify-center items-center py-20 flex-col gap-2">
                <NoData bg={1} />
              </div>
            </td>
          </tr>
        )}
      </TablePage>
    </>
  );
};
export default Page;
