"use client";
import { departmentText, facultyText } from "@/components/faculty-p";
import Loading from "@/components/loading";
import NoData from "@/components/nodata";
import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Filter } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import {
  FaEllipsisV,
  FaEye,
  FaFolderOpen,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import Modal from "@/components/modal";
import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";
import WorkCard from "@/app/users/work-history/work-card";
import StudyCard from "@/app/users/work-history/study-card";
import { formatPhoneNumber } from "@/libs/validate";
import DropdownMenu from "@/components/dropdown-menu";

const { default: TablePage } = require("@/components/table-page");
const Page = () => {
  const { user } = useGetSession();
  const [showModalReason, setShowModalReason] = useState(false);
  const [isDeleteContract, setIsDeleteContract] = useState(true);
  const [reasonToDelete, setReasonToDelete] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [fetchAlumni, setFetchAlumni] = useState(false);
  const [alumniData, setAlumniData] = useState(null);
  const handleManageAlumni = async (alumniId) => {
    setShowModal(true);
    setFetchAlumni(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/alumni/user/${alumniId}/1`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setAlumniData(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchAlumni(false);
    }
  };

  const handleDeleteContract = async () => {
    if (!reasonToDelete) {
      return alerts.err("โปรดระบุเหตุผล");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบช่องทางการติดต่อของศิษย์เก่า",
      "ต้องการลบช่องทางการติดต่อทั้งหมดนี้หรือไม่?",
      "ลบ"
    );
    if (!isConfirmed) return;
    setFetchAlumni(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI +
          `/president/delete-contract/${alumniData?.alumni_id}`,
        {
          withCredentials: true,
          params: {
            reasonToDelete,
          },
        }
      );
      if (res.data.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("ลบช่องทางการติดต่อแล้ว");
        handleManageAlumni(alumniData?.alumni_id);
        setShowModalReason(false);
        setReasonToDelete("");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchAlumni(false);
    }
  };

  const handleDeleteWorkExprerience = async () => {
    if (!reasonToDelete) {
      return alerts.err("โปรดระบุเหตุผล");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบประวัติของศิษย์เก่า",
      "ต้องการลบประวัติการทำงานและประวัติเข้าศึกษาต่อทั้งหมดหรือไม่?",
      "ลบ"
    );
    if (!isConfirmed) return;

    if (alumniData?.work_expreriences?.length < 1) {
      return alerts.err("ไม่พบประวัติการทำงานหรือประวัติการเข้าศึกษาต่อ");
    }
    setFetchAlumni(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-work-ex/${alumniData?.alumni_id}`,
        {
          withCredentials: true,
          params: {
            reasonToDelete,
          },
        }
      );
      if (res.data.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("ลบข้อมูลแล้ว");
        handleManageAlumni(alumniData?.alumni_id);
        setShowModalReason(false);
        setReasonToDelete("");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchAlumni(false);
    }
  };

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
  const [selectYearStart, setSelectYearStart] = useState("");
  const [selectYearEnd, setSelectYearEnd] = useState("");

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
      const res = await axios.get(apiConfig.rmuAPI + "/president/alumni-list", {
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
      });
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

  const handleAllowedAccount = async (user_id, canUse) => {
    if (canUse) {
      return alerts.success("อนุมัติบัญชีแล้ว");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "อนุมัติการใช้งานบัญชี้นี้",
      "บัญชีนี้จะสามารถเข้าใช้งานระบบได้ปกติ",
      "อนุมัติ"
    );
    if (!isConfirmed) return;

    setLoading(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/manage-account/${user_id}`,
        { canUse: !canUse, isAlumni: true },
        { withCredentials: true }
      );
      if (res.status === 200) {
        fetchData(
          page,
          take,
          search,
          facultyId,
          departmentId,
          sort,
          selectYearStart,
          selectYearEnd,
          filterWork
        );
        alerts.success("อนุมัติบัญชี้นี้แล้ว");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const handleBlockAccount = async (user_id, canUse) => {
    if (!canUse) {
      return alerts.warning("ระงับบัญชีแล้ว");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ระงับการใช้งานบัญชี้นี้",
      "บัญชีนี้จะไม่สามารถเข้าใช้งานระบบได้จนกว่าคุณจะอนุมัติ",
      "ระงับ"
    );
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/manage-account/${user_id}`,
        { canUse: !canUse, isAlumni: true },
        { withCredentials: true }
      );
      if (res.status === 200) {
        fetchData(
          page,
          take,
          search,
          facultyId,
          departmentId,
          sort,
          selectYearStart,
          selectYearEnd,
          filterWork
        );
        alerts.warning("ระงับบัญชีนี้แล้ว");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TablePage
        header="รายชื่อศิษย์เก่า"
        theads={["สถานะบัญชี", "จัดการ"]}
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
          "ปีการศึกษา(พ.ศ.)": `${d?.year_start} - ${d?.year_end}`,
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
                value={JSON.stringify({
                  work_expreriences: {
                    none: {},
                  },
                })}
                className="text-sm"
              >
                ไม่พบประวัติ
              </option>
              <option
                value={JSON.stringify({
                  work_expreriences: {
                    some: {},
                  },
                })}
                className="text-sm"
              >
                ศิษย์เก่าที่กรอกประวัติแล้ว
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
            <td className="p-2" colSpan={8}>
              <div className="flex justify-center items-center py-20 flex-col gap-2">
                <Loading type={2} />
                <p className="text-sm">กำลังโหลด...</p>
              </div>
            </td>
          </tr>
        ) : data.length > 0 ? (
          data.map((d, index) => (
            <tr
              key={uuid()}
              className="border-b border-gray-200 cursor-pointer hover:bg-gray-100 text-sm"
            >
              <td className="p-2 py-3 text-start">
                {index + (page - 1) * take + 1}
              </td>
              <td className="p-2 py-3 text-start">
                {d?.prefix}
                {d?.fname} {d?.lname}
              </td>
              <td className="p-2 py-3 text-start">
                {facultyText(d?.facultyId)}
              </td>
              <td className="p-2 py-3 text-start">
                {departmentText(d?.departmentId)}
              </td>
              <td className="p-2 py-3 text-start">
                {d?.year_start} - {d?.year_end}
              </td>
              <td className="p-2">
                <p
                  className={`p-2 rounded-md shadow-sm text-xs w-fit text-center ${
                    d?.canUse
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {d?.canUse ? "เข้าใช้ระบบได้" : "ระงับชั่วคราว"}
                </p>
              </td>
              <td className="p-2 py-3">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => handleManageAlumni(d?.alumni_id)}
                    className="p-1.5 rounded-full hover:bg-orange-100"
                  >
                    <FaEye size={15} className="" />
                  </button>
                  <DropdownMenu
                    icon={<FaEllipsisV size={15} />}
                    menus={[
                      {
                        title: "อนุมัติการใช้งาน",
                        func: () =>
                          handleAllowedAccount(d?.alumni_id, d?.canUse),
                      },
                      {
                        title: "ระงับบัญชีนี้ชั่วคราว",
                        func: () => handleBlockAccount(d?.alumni_id, d?.canUse),
                      },
                    ]}
                  />
                </div>
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

      {/* info modal  */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5 px-8 z-[999] h-[600px] overflow-auto rounded-lg bg-white shadow-md w-full lg:w-3/4 flex flex-col">
          {fetchAlumni ? (
            <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
              <Loading type={2} />
              <p>กำลังโหลด...</p>
            </div>
          ) : (
            <>
              <span className="w-full flex items-center justify-between pb-3 border-b border-gray-300">
                <p className="text-lg font-bold">ข้อมูลศิษย์เก่า</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-md"
                >
                  <FaTimes size={20} />
                </button>
              </span>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-start items-center mt-5">
                {/* profile img */}
                <div className="lg:w-[25%] w-full flex flex-col ">
                  <p className="text-sm">โปรไฟล์</p>
                  <div className="mt-2.5 w-[250px] h-[200px] rounded-lg border border-gray-300 shadow-sm">
                    <img
                      src={
                        alumniData?.profile
                          ? apiConfig.imgAPI + alumniData?.profile
                          : NO_PROFILE_IMG
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                </div>
                {/* infomation */}
                <div className="lg:w-[75%] w-full lg:pl-8 lg:border-l border-gray-300">
                  {/* normal */}
                  <div className="flex flex-col pb-3 border-b border-gray-200">
                    <p className="text-sm">ข้อมูลทั่วไป</p>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 mt-3">
                      {/* fullname */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">ชื่อ-นามสกุล</p>
                        <p className="text-sm">
                          {alumniData?.prefix}
                          {alumniData?.fname} {alumniData?.lname}
                        </p>
                      </span>
                      {/* id */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">รหัสนักศึกษา</p>
                        <p className="text-sm">{alumniData?.alumni_id}</p>
                      </span>
                      {/* faculty */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">คณะ</p>
                        <p className="text-sm">
                          {facultyText(alumniData?.facultyId)}
                        </p>
                      </span>
                      {/* dep */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">สาขาวิชา</p>
                        <p className="text-sm">
                          {departmentText(alumniData?.departmentId)}
                        </p>
                      </span>
                      {/* year */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">
                          ปีการศึกษา (พ.ศ.)
                        </p>
                        <p className="text-sm">
                          {alumniData?.year_start} - {alumniData?.year_end}
                        </p>
                      </span>
                    </div>
                  </div>
                  {/* contract */}
                  <div className="flex flex-col items-end mt-3 pb-3 border-b border-gray-200">
                    <p className="text-sm w-full">ช่องทางการติดต่อ</p>
                    <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-3 mt-3">
                      {/* emaiil1 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-red-600">อีเมล</p>
                        <p className="text-sm">
                          {alumniData?.email1 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* email2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-red-600">อีเมล</p>
                        <p className="text-sm">
                          {alumniData?.email2 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel1 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {alumniData?.phone1
                            ? formatPhoneNumber(alumniData?.phone1)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {" "}
                          {alumniData?.phone2
                            ? formatPhoneNumber(alumniData?.phone2)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* facebook */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">facebook</p>
                        <p className="text-sm">
                          {alumniData?.facebook || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* address */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">ที่อยู่</p>
                        <p className="text-sm">{`${alumniData?.address || ""} ${
                          alumniData?.tambon ? "ตำบล" + alumniData?.tambon : ""
                        } ${
                          alumniData?.amphure
                            ? "อำเภอ" + alumniData?.amphure
                            : ""
                        } ${
                          alumniData?.province
                            ? "จังหวัด" + alumniData?.province
                            : "ไม่ระบุ"
                        } ${alumniData?.zipcode || ""}`}</p>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowModalReason(true);
                        setIsDeleteContract(true);
                      }}
                      className="p-3 mt-3 text-sm rounded-md hover:bg-red-600 bg-red-500 text-white flex items-center gap-2"
                    >
                      <FaTrash />
                      <p>ลบช่องทางการติดต่อ</p>
                    </button>
                  </div>
                  {/* ประวัติการทำงาน/การศึกษาต่อ */}
                  <div className="flex flex-col items-end mt-3 pb-3 border-b border-gray-200">
                    <p className="text-sm w-full">
                      ประวัติการทำงาน/ประวัติการศึกษาต่อ
                    </p>
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3 h-[350px] overflow-auto">
                      {alumniData?.work_expreriences?.length > 0 ? (
                        alumniData?.work_expreriences.map((a) => {
                          if (a?.continued_study) {
                            return (
                              <StudyCard
                                key={uuid()}
                                e={a}
                                fetchWorkExprerience={() =>
                                  handleManageAlumni(a?.alumni_id)
                                }
                              />
                            );
                          } else {
                            return (
                              <WorkCard
                                key={uuid()}
                                e={a}
                                fetchWorkExprerience={() =>
                                  handleManageAlumni(a?.alumni_id)
                                }
                              />
                            );
                          }
                        })
                      ) : (
                        <div className="lg:col-span-2 flex flex-col justify-center items-center py-10 gap-1 text-gray-600 text-sm">
                          <FaFolderOpen size={25} />
                          <p>ไม่พบประวัติการทำงานหรือประวัติการเข้าศึกษาต่อ</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowModalReason(true);
                        setIsDeleteContract(false);
                      }}
                      className="p-3 mt-3 text-sm rounded-md hover:bg-red-600 bg-red-500 text-white flex items-center gap-2"
                    >
                      <FaTrash />
                      <p>ลบประวัติทั้งหมด</p>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* reason modal */}
      <Modal isOpen={showModalReason} onClose={() => setShowModalReason(false)}>
        <div className="w-full z-50 lg:w-1/3 p-5 shadow-md bg-white rounded-lg flex flex-col">
          <p className="font-bold text-lg">กรุณาระบุเหตุผลในการลบ</p>
          <p className="mt-3 text-sm">โปรดบอกเหตุผลที่ต้องลบข้อมูลนี้</p>
          <textarea
            value={reasonToDelete}
            onChange={(e) => setReasonToDelete(e.target.value)}
            className="w-full h-[150px] p-2.5 text-sm outline-none mt-2 border border-gray-400 resize-none shadow-xs rounded-md"
            placeholder="ระบุเหตุผลที่นี่..."
          ></textarea>
          <div className="mt-3 w-full justify-end flex items-end gap-2">
            <button
              disabled={fetchAlumni}
              onClick={() => {
                isDeleteContract
                  ? handleDeleteContract()
                  : handleDeleteWorkExprerience();
              }}
              className="p-2.5 bg-red-500 text-white rounded-md"
            >
              {fetchAlumni ? <Loading type={2} /> : "ยืนยันการลบ"}
            </button>
            <button
              onClick={() => setShowModalReason(false)}
              className="p-2.5 bg-blue-500 text-white rounded-md"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Page;
