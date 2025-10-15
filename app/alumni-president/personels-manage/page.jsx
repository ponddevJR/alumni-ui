"use client";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  List,
  RotateCcw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "@/components/select";
import { departments, faculties } from "@/data/faculty";
import { debounce } from "lodash";
import Modal from "@/components/modal";
import useGetSession from "@/hook/useGetSeesion";
import { useAppContext } from "@/context/app.context";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Loading from "@/components/loading";
import { v4 as uuid } from "uuid";
import NoData from "@/components/nodata";
import { departmentText, facultyText } from "@/components/faculty-p";
import DropdownMenu from "@/components/dropdown-menu";
import { FaEllipsisH, FaEllipsisV, FaEye, FaTimes } from "react-icons/fa";
import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";

const TablePage = () => {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchUser, setFetchUser] = useState(false);
  const handleSeeUserData = async (user_id) => {
    setShowModal(true);
    setFetchUser(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/alumni/user/${user_id}/2`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setUserData(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchUser(false);
    }
  };

  // ✅ ควบคุม pagination/filter state ที่นี่ (parent)
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(25);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(JSON.stringify({ updatedAt: "desc" }));
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [filter, setFilter] = useState(null);
  const { user } = useGetSession();
  const { setPrevPath } = useAppContext();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const fetchData = async (
    page,
    take,
    search,
    facultyId,
    departmentId,
    sort,
    filter
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/get-user", {
        withCredentials: true,
        params: {
          page,
          take,
          search,
          facultyId,
          departmentId,
          sort,
          filter,
        },
      });
      if (res.status === 200) {
        setData(res.data?.data);
        setTotal(res.data.total);
        setTotalPage(res.data.totalPage);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(fetchData, 700), [fetchData]);

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
    setSort(JSON.stringify({ createdAt: "desc" }));
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
        { canUse: !canUse },
        { withCredentials: true }
      );
      if (res.status === 200) {
        fetchData(page, take, search, facultyId, departmentId, sort, filter);
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
        { canUse: !canUse },
        { withCredentials: true }
      );
      if (res.status === 200) {
        fetchData(page, take, search, facultyId, departmentId, sort, filter);
        alerts.warning("ระงับบัญชีนี้แล้ว");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  // ✅ โหลดข้อมูลทุกครั้งที่ state เปลี่ยน
  useEffect(() => {
    debounceSearch(page, take, search, facultyId, departmentId, sort, filter);
  }, [page, take, search, facultyId, departmentId, sort, filter]);
  return (
    <>
      <div className="w-full items-start flex flex-col px-5 pt-3">
        {user?.roleId < 5 && (
          <button
            onClick={() => {
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
            <h1 className="font-bold text-lg">จัดการผู้ใช้งาน</h1>
            <p className="text-[0.9rem] text-gray-700">
              ผลการค้นหาผู้ใช้งานทั้งหมด ({total} คน)
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
              }}
            />
          )}
          <div title="กรอง" className="relative inline-block">
            <select
              onChange={(e) => setFilter(e.target.value)}
              name=""
              id="select-row"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="" className="text-sm">
                ทั้งหมด
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "อาจารย์",
                })}
                className="text-sm"
              >
                อาจารย์
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "รองคณบดี",
                })}
                className="text-sm"
              >
                รองคณบดี
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "คณบดี",
                })}
                className="text-sm"
              >
                คณบดี
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "รองอธิการบดี",
                })}
                className="text-sm"
              >
                รองอธิการบดี
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "อธิการบดี",
                })}
                className="text-sm"
              >
                อธิการบดี
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
                value={JSON.stringify({ createdAt: "desc" })}
                className="text-sm"
              >
                เพิ่มล่าสุด
              </option>
              <option
                value={JSON.stringify({ updatedAt: "desc" })}
                className="text-sm"
              >
                แก้ไขล่าสุด
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
                  "ตำแหน่ง",
                  "สถานะบัญชี",
                  "จัดการ",
                ].map((h, index) => (
                  <th
                    key={index}
                    className="text-start p-2.5 text-[0.9rem] bg-sky-100 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                data.map((d, index) => (
                  <tr
                    key={uuid()}
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    <td className="p-2.5 py-3 text-start">
                      {index + (page - 1) * take + 1}
                    </td>
                    <td className="p-2.5">
                      {d?.univercity_position === "อาจารย์"
                        ? d?.prefix
                        : d?.academic_rank}
                      {d?.fname} {d?.lname}
                    </td>
                    <td className="p-2.5">{facultyText(d?.facultyId)}</td>
                    <td className="p-2.5">{departmentText(d?.departmentId)}</td>
                    <td className="p-2.5">{d?.univercity_position}</td>
                    <td className="p-2.5">
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
                    <td className="p-2.5">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleSeeUserData(d?.professor_id)}
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
                                handleAllowedAccount(
                                  d?.professor_id,
                                  d?.canUse
                                ),
                            },
                            {
                              title: "ระงับบัญชีนี้ชั่วคราว",
                              func: () =>
                                handleBlockAccount(d?.professor_id, d?.canUse),
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
            </tbody>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5 px-8 z-[999] h-[600px] overflow-auto rounded-lg bg-white shadow-md w-full lg:w-3/4 flex flex-col">
          {fetchUser ? (
            <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
              <Loading type={2} />
              <p>กำลังโหลด...</p>
            </div>
          ) : (
            <>
              <span className="w-full flex items-center justify-between pb-3 border-b border-gray-300">
                <p className="text-lg font-bold">ข้อมูลผู้ใช้งาน</p>
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
                        userData?.profile
                          ? apiConfig.imgAPI + userData?.profile
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
                          {userData?.univercity_position === "อาจารย์"
                            ? userData?.prefix
                            : userData?.academic_rank}
                          {userData?.fname} {userData?.lname}
                        </p>
                      </span>
                      {/* id */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">รหัสประจำตัว</p>
                        <p className="text-sm">{userData?.professor_id}</p>
                      </span>
                      {/* faculty */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">คณะ</p>
                        <p className="text-sm">
                          {facultyText(userData?.facultyId)}
                        </p>
                      </span>
                      {/* dep */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">สาขาวิชา</p>
                        <p className="text-sm">
                          {departmentText(userData?.departmentId)}
                        </p>
                      </span>
                      <span className="flex flex-col  p-2 bg-gradient-to-r from-yellow-50 via-green-50 to-blue-50 rounded-md">
                        <p className="text-sm text-blue-600">ตำแหน่ง</p>
                        <p className="text-sm">
                          {userData?.univercity_position === "อาจารย์"
                            ? "อาจารย์ประจำสาจา"
                            : userData?.univercity_position}
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
                          {userData?.email1 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* email2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-red-600">อีเมล</p>
                        <p className="text-sm">
                          {userData?.email2 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel1 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {userData?.phone1
                            ? formatPhoneNumber(userData?.phone1)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {" "}
                          {userData?.phone2
                            ? formatPhoneNumber(userData?.phone2)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* facebook */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">facebook</p>
                        <p className="text-sm">
                          {userData?.facebook || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* address */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">ที่อยู่</p>
                        <p className="text-sm">{`${userData?.address || ""} ${
                          userData?.tambon ? "ตำบล" + userData?.tambon : ""
                        } ${
                          userData?.amphure ? "อำเภอ" + userData?.amphure : ""
                        } ${
                          userData?.province
                            ? "จังหวัด" + userData?.province
                            : "ไม่ระบุ"
                        } ${userData?.zipcode || ""}`}</p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
export default TablePage;
