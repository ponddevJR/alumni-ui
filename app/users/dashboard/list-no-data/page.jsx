"use client";
import { departmentText, facultyText } from "@/components/faculty-p";
import Loading from "@/components/loading";
import NoData from "@/components/nodata";
import TablePage from "@/components/table-page";
import { apiConfig } from "@/config/api.config";
import { useAppContext } from "@/context/app.context";
import useGetSession from "@/hook/useGetSeesion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../dashboard-context";
import { v4 as uuid } from "uuid";

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
  const [extraFilter, setExtraFilter] = useState({});
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
    sort = "desc",
    selectYearStart,
    selectYearEnd,
    extraFilter = {}
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/list/no-work-data",
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
            extraFilter,
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
  return (
    <TablePage
      header={"รายชื่อศิษย์เก่าที่ไม่พบข้อมูลประวัติการทำงาน"}
      theads={["รหัสนักศึกษา"]}
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
      }))}
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
      extraFilter={extraFilter}
      setExtraFilter={setExtraFilter}
      setDepartmentId={setDepartmentId}
      selectYearEnd={selectYearEnd}
      selectYearStart={selectYearStart}
      setSelectYearEnd={setSelectYearEnd}
      setSelectYearStart={setSelectYearStart}
    >
      {loading ? (
        <tr>
          <td className="p-2" colSpan={7}>
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
              setPrevPath("/users/dashboard/list-no-data");
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
            <td className="p-2.5 py-3">{d?.alumni_id}</td>
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
  );
};
export default Page;
