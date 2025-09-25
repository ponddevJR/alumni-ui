"use client";
import { departmentText, facultyText } from "@/components/faculty-p";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import NoData from "@/components/nodata";
import TablePage from "@/components/table-page";
import { apiConfig } from "@/config/api.config";
import { useAppContext } from "@/context/app.context";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
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
        apiConfig.rmuAPI + "/dashboard/list/alumni-salary",
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

  // const [filterAvgSalary, setFilterAvgSalary] = useState(false);
  // const [filterMaxSalary, setFilterMaxSalary] = useState(false);
  // const [filterCurrentSalary, setFilterCurrentSalary] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [filterSalary, setFIlterSalary] = useState("");
  // const [filterSalaryType, setFilterSalaryType] = useState(0);

  // const searchFilterSalary = () => {
  //   if (filterSalary && filterSalaryType === 0) {
  //     return alerts.err("กรุณาเลือกวิธีค้นหา มากกว่าหรือน้อยกว่า");
  //   }
  //   const salary = Number(filterSalary);
  //   if (salary < 0) {
  //     return alerts.err("จำนวนเงินไม่ถูกต้อง");
  //   }

  //   let filter = {};
  //   if (filterSalary === 1) {
  //     filter = JSON.stringify({
  //       work_expreriences: {
  //         some: {
  //           salary: {
  //             gte: salary,
  //             not: null,
  //           },
  //         },
  //       },
  //     });
  //   } else {
  //     filter = JSON.stringify({
  //       work_expreriences: {
  //         some: {
  //           salary: {
  //             lte: salary,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   setExtraFilter(filter);
  // };

  return (
    <>
      <TablePage
        header={"รายชื่อและเงินเดือนของศิษย์เก่า"}
        theads={[
          "เงินเดือนเฉลี่ย",
          "เงินสูงสุดที่เคยได้",
          "เงินที่รับอยู่ในปัจจุบัน",
        ]}
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
          เงินเดือนเฉลี่ย: d?.avg_salary
            ? d?.avg_salary?.toLocaleString() + " บาท"
            : "ไม่พบข้อมูล",
          เงินสูงสุดที่ได้รับ: d?.max_salary
            ? d?.max_salary?.toLocaleString() + " บาท"
            : "ไม่พบข้อมูล",
          เงินเดือนที่ได้รับในปัจจุบัน: d?.current_salary
            ? d?.current_salary?.toLocaleString() + " บาท"
            : "ไม่พบข้อมูล",
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
            <td className="p-2" colSpan={8}>
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
                setPrevPath("/users/dashboard/list-salary");
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
                {d?.avg_salary
                  ? Math.round(d?.avg_salary)?.toLocaleString() + " บาท"
                  : "ไม่พบข้อมูล"}
              </td>
              <td className="p-2.5 py-3">
                {d?.max_salary
                  ? d?.max_salary?.toLocaleString() + " บาท"
                  : "ไม่พบข้อมูล"}
              </td>
              <td className="p-2.5 py-3">
                {d?.current_salary
                  ? d?.current_salary?.toLocaleString() + " บาท"
                  : "ไม่พบข้อมูล"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-2" colSpan={8}>
              <div className="flex justify-center items-center py-20 flex-col gap-2">
                <NoData bg={1} />
              </div>
            </td>
          </tr>
        )}
      </TablePage>

      {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="relative lg:w-1/3 w-full mx-20 p-5 rounded-md bg-white shadow-md">
          <button
            onClick={() => {
              setShowModal(false);
              setFilterSalaryType(0);
            }}
            className="rounded-md p-2 hover:bg-gray-100 absolute top-3 right-3"
          >
            <X size={20} />
          </button>
          <p className="font-bold pb-3 border-b border-gray-300 w-full">
            กรองเพิ่มเติม
          </p>{" "}
          <p className="mt-5">เงินเดือน :</p>
          <span className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setFilterSalaryType(1)}
              className={`${
                filterSalaryType === 1 && "bg-blue-500 text-white"
              } text-sm p-1.5 px-2 rounded-lg border border-gray-300 shadow-md`}
            >
              เงินเดือนเฉลี่ย
            </button>
            <button
              onClick={() => setFilterSalaryType(1)}
              className={`${
                filterSalaryType === 1 && "bg-blue-500 text-white"
              } text-sm p-1.5 px-2 rounded-lg border border-gray-300 shadow-md`}
            >
              เงินเดือนสูงสุดที่เคยได้
            </button>
            <button
              onClick={() => setFilterSalaryType(1)}
              className={`${
                filterSalaryType === 1 && "bg-blue-500 text-white"
              } text-sm p-1.5 px-2 rounded-lg border border-gray-300 shadow-md`}
            >
              เงินเดือนที่ได้รับอยู่ในปัจจุบัน
            </button>
          </span>
          <p className="mt-5">กรองโดย :</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setFilterSalaryType(1)}
              className={`${
                filterSalaryType === 1 && "bg-blue-500 text-white"
              } text-sm p-1.5 px-2 rounded-lg border border-gray-300 shadow-md`}
            >
              มากกว่า
            </button>
            <button
              onClick={() => setFilterSalaryType(2)}
              className={`${
                filterSalaryType === 2 && "bg-blue-500 text-white"
              } text-sm p-1.5 px-2 rounded-lg border border-gray-300 shadow-md`}
            >
              น้อยกว่า
            </button>
          </div>
          <input
            type="text"
            value={filterSalary}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setFIlterSalary(val);
              }
            }}
            className="mt-2.5 p-2 px-3 rounded-md lg:w-1/2 w-full text-sm border border-gray-300 shadow-sm"
            placeholder="ป้อนเงินเดือน"
          />
          <button
            onClick={searchFilterSalary}
            className="mt-3 p-2 px-3 flex items-center gap-2 text-sm text-white bg-blue-500 shadow-md border border-gray-300 rounded-md"
          >
            <Search size={17} color="white" />
            <p className="">ค้นหา</p>
          </button>
        </div>
      </Modal> */}
    </>
  );
};
export default Page;
