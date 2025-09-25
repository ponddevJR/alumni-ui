"use client";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import useProvince from "@/hook/useProvince";
import useCountry from "@/hook/ีuseCountry";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  Briefcase,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Coins,
  Filter,
  GraduationCap,
  Plus,
  Receipt,
  Save,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { debounce } from "lodash";
import WorkCard from "./work-card";
import StudyCard from "./study-card";
import { v4 as uuid } from "uuid";

const WorkHistory = () => {
  const { user } = useGetSession();
  const router = useRouter();
  useEffect(() => {
    if (user?.id) {
      if (user?.roleId > 1) {
        router.push("/users/dashboard");
      }
    }
  }, [user]);

  // province
  const { loading, provinceOptions } = useProvince();
  // country
  const { load, countryOptions } = useCountry();

  const [showJobForm, setShowJobForm] = useState(false);
  const [workInThai, setWorkInThai] = useState(true);
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  // loading while save data
  const [saving, setSaving] = useState(false);

  const [isOnTheLine, setIsOnTheLine] = useState(0);
  const [showOnTheLineErr, setShowOnTheLineErr] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    job_position: "",
    company_name: "",
    company_place: "",
    salary: "",
    start_date: "",
    end_date: "",
    job_detail: "",
    job_responsibility: "",
    job_skills: "",
    edu_level: "",
    edu_faculty: "",
    edu_dep: "",
    edu_university: "",
    year_start: "",
    year_end: "",
    edu_performance: "",
  });

  const [isEditing, setIsEditing] = useState(null);
  const handleEdit = async (work) => {
    setShowJobForm(true);
    setIsOnTheLine(work?.isOnTheLine ? 1 : 2);
    setIsEditing(work?.id);
    setIsCurrentJob(work?.isCurrent);
    setWorkInThai(!/[a-zA-Z]/.test(work?.company_place));
    reset({
      job_position: work?.job_position,
      company_name: work?.company_name,
      company_place: work?.company_place,
      start_date: work?.start_date,
      end_date: work?.end_date,
      job_detail: work?.job_detail,
      job_responsibility: work?.job_responsibility,
      job_skills: work?.job_skills,
      remark: work?.remark,
      salary: work?.salary,
      edu_level: work?.edu_level,
      edu_faculty: work?.edu_faculty,
      edu_dep: work?.edu_dep,
      edu_university: work?.edu_university,
      year_start: work?.year_start,
      year_end: work?.year_end,
      edu_performance: work?.edu_performance,
    });
    setContinuedStudy(work?.continued_study);
    setWorkInThai(work?.isInThai);
  };

  const [continuedStudy, setContinuedStudy] = useState(false);

  const handleCreate = () => {
    setIsOnTheLine(0);
    setShowJobForm(true);
    setIsEditing("");
    setWorkInThai(true);
    setIsCurrentJob(false);
    reset({
      job_position: "",
      company_name: "",
      salary: "",
      company_place: "",
      start_date: "",
      end_date: "",
      job_detail: "",
      job_responsibility: "",
      job_skills: "",
      edu_level: "",
      edu_faculty: "",
      edu_dep: "",
      edu_university: "",
      year_start: "",
      year_end: "",
      edu_performance: "",
    });
  };

  const save = async (data) => {
    if (!continuedStudy && isOnTheLine === 0) {
      setShowOnTheLineErr(true);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...data,
        isOnTheLine: isOnTheLine > 1 ? false : true,
        isCurrent: isCurrentJob,
        continued_study: continuedStudy,
        isInThai: workInThai,
      };

      const api = isEditing
        ? "/alumni/work-update/" + isEditing
        : "/alumni/work-create";

      const res = await axios.post(apiConfig.rmuAPI + api, payload, {
        withCredentials: true,
      });
      if (res?.data?.err) {
        return alerts.err();
      }
      if (res?.status === 200) {
        await alerts.success();
        setIsCurrentJob(false);
        setWorkInThai(false);
        setShowJobForm(false);
        setShowOnTheLineErr(false);
      }
      reset();
      fetchWorkExprerience();
    } catch (error) {
      console.error(error);
      alerts.err("โปรดตรวจสอบเครือข่ายแล้วลองอีกครั้ง");
    } finally {
      setSaving(false);
    }
  };

  const [searchText, setSearchText] = useState("");
  const [dataType, setDataType] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sort, setSort] = useState(JSON.stringify({ createdAt: "desc" }));

  const [fetching, setFetching] = useState(false);
  const [dataAvg, setDataAvg] = useState();
  const [experience, setExperience] = useState([]);
  const fetchWorkExprerience = async (
    search = "",
    dataType = 0,
    page = 1,
    sort = JSON.stringify({ createdAt: "desc" })
  ) => {
    setFetching(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + `/alumni/work-list`, {
        withCredentials: true,
        params: {
          search,
          type: dataType,
          page,
          sort,
        },
      });
      if (res.status === 200) {
        setDataAvg(res?.data?.dataAvg);
        setExperience(res?.data?.workExprerience);
        setTotalPage(res?.data?.totalPage);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetching(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(fetchWorkExprerience, 500), []);

  useEffect(() => {
    debounceSearch(searchText, dataType, page, sort);
  }, [searchText, dataType, page, sort]);

  const deleteWork = async (id) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบประวัติ",
      "ต้องการลบประวัตินี้หรือไม่?"
    );
    if (!isConfirmed) return;

    setSaving(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + "/alumni/work-delete/" + id,
        { withCredentials: true }
      );
      if (res?.status === 200) {
        alerts.success("ลบข้อมูลแล้ว");
        fetchWorkExprerience(searchText);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col p-2 bg-gradient-to-r from-gray-50 via-sky-50 to-green-50 mb-5 pl-2">
        <span className="w-full mb-7 flex items-center justify-between">
          <label htmlFor="" className="flex flex-col">
            <h1 className="text-2xl font-bold">ประวัติการทำงาน</h1>
            <p className="text-gray-600 text-sm lg:text-md">
              จัดการประสบการณ์การทำงานของคุณ
            </p>
          </label>

          <button
            onClick={handleCreate}
            className="p-2 hover:bg-blue-600 hover:shadow-md hover:shadow-gray-400 rounded-md flex items-center gap-2 border border-blue-400 bg-blue-500 text-white"
          >
            <Plus size={18} color="white" />
            <p className="text-sm">เพิ่มประวัติ</p>
          </button>
        </span>

        <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-3">
          <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-blue-500 to-sky-400">
            <div className="p-2 rounded-full bg-white">
              <BriefcaseBusiness size={18} color="blue" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-50">จำนวนงานที่เคยทำ</p>
              <p className="text-white">{dataAvg?.workTimes || 0} งาน</p>
            </div>
          </span>
          <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-green-500 to-lime-400">
            <div className="p-2 rounded-full bg-white">
              <Coins size={18} color="green" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-50">เงินเดือนเฉลี่ย</p>
              <p className="text-white">
                {dataAvg?.avgSalary
                  ? Math.round(dataAvg?.avgSalary)?.toLocaleString()
                  : 0}{" "}
                บาท
              </p>
            </div>
          </span>

          <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-orange-500 to-yellow-400">
            <div className="p-2 rounded-full bg-white">
              <TrendingUp size={18} color="orange" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-50">เงินเดือนสูงที่สุด</p>
              <p className="text-white">
                {dataAvg?.maxSalary?.toLocaleString() || 0} บาท
              </p>
            </div>
          </span>
          <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-purple-500 to-pink-400">
            <div className="p-2 rounded-full bg-white">
              <TrendingDown size={18} color="purple" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-50">เงินเดือนน้อยที่สุด</p>
              <p className="text-white">
                {dataAvg?.minSalary?.toLocaleString() || 0} บาท
              </p>
            </div>
          </span>
          <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-gray-700 to-gray-500">
            <div className="p-2 rounded-full bg-white">
              <Receipt size={18} color="black" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-50">
                เงินเดือนที่ได้รับในปัจจุบัน
              </p>
              <p className="text-white">
                {dataAvg?.currentSalary?.toLocaleString() || 0} บาท
              </p>
            </div>
          </span>
        </div>

        <span className="bg-white mt-5 p-4 w-full flex flex-col border border-gray-300 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <Filter />
            <p className="text-lg font-bold">กรองข้อมูล</p>
          </div>
          <div className="mt-3 flex items-center justify-between flex-col gap-4 lg:flex-row">
            <span className="w-full lg:w-1/2 flex items-center gap-2 p-2 rounded-md bg-gray-50 shadow-sm border border-gray-100">
              <Search size={18} color="gray" />
              <input
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                type="text"
                className="w-[90%] text-[0.9rem]"
                placeholder="ค้นหา ชื่อบริษัท , สถานที่ทำงาน , วันที่ , รายละเอียดหรือหน้าที่รับผิดชอบ"
              />
            </span>
            <select
              disabled={fetching || load}
              onChange={(e) => {
                setDataType(e.target.value);
              }}
              name=""
              id=""
              className="outline-0 text-sm w-full lg:w-1/2 p-2 rounded-md bg-gray-50 shadow-sm border border-gray-100"
            >
              <option value="0">ทั้งหมด</option>
              <option value="1">งานปัจจุบัน</option>
              <option value="2">งานในอดีต</option>
              <option value="3">ศึกษาต่อ</option>
            </select>
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
                <option
                  value={JSON.stringify({ isCurrent: "desc" })}
                  className="text-sm"
                >
                  ปัจจุบัน
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
        </span>

        {fetching ? (
          <div className="w-full my-24 h-full flex flex-col gap-2 items-center justify-center">
            <Loading />
            <p>กำลังโหลด...</p>
          </div>
        ) : experience?.length < 1 ? (
          <p className="w-full text-center mt-10">ไม่พบประวัติการทำงาน</p>
        ) : (
          <div className="w-full grid lg:grid-cols-3 gap-5 gap-y-1 grid-cols-1">
            {experience.map((e) =>
              e?.continued_study ? (
                <StudyCard
                  e={e}
                  deleteWork={deleteWork}
                  handleEdit={handleEdit}
                  key={uuid()}
                />
              ) : (
                <WorkCard
                  key={uuid()}
                  e={e}
                  handleEdit={handleEdit}
                  deleteWork={deleteWork}
                />
              )
            )}
          </div>
        )}
        {totalPage > 1 && (
          <div className="w-full items-center flex gap-5 mt-5 justify-center">
            {page > 1 && (
              <button
                onClick={() => {
                  setPage(page - 1);
                }}
                className="shadow-md hover:bg-blue-600 rounded-md p-2 bg-blue-500 text-white"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <p>
              {page} จาก {totalPage}
            </p>
            {page < totalPage && (
              <button
                onClick={() => {
                  setPage(page + 1);
                }}
                className="shadow-md hover:bg-blue-600 rounded-md p-2 bg-blue-500 text-white"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* form */}
      <Modal isOpen={showJobForm} onClose={() => setShowJobForm(false)}>
        <form
          onSubmit={handleSubmit(save)}
          className="z-50 w-full mx-8 lg:w-1/3 h-[90%] overflow-y-auto flex flex-col items-start p-5 rounded-lg bg-white shadow-md"
        >
          <span className="w-full flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {isEditing ? "แก้ไข" : "เพิ่ม"}ประวัติ
            </h2>
            <X
              onClick={() => setShowJobForm(false)}
              size={25}
              className="cursor-pointer"
            />
          </span>
          {!isEditing && (
            <div className="w-full flex items-center justify-between my-2">
              <button
                type="button"
                onClick={() => {
                  setContinuedStudy(false);
                  reset();
                }}
                className={` w-1/2 flex items-center gap-1 flex-col p-3 border-b border-blue-300 ${
                  !continuedStudy &&
                  "text-white bg-gradient-to-r from-blue-300 to-blue-400 rounded-tl-lg rounded-tr-lg"
                }`}
              >
                <Briefcase
                  size={20}
                  color={!continuedStudy ? "white" : "blue"}
                />
                <p className="text-[0.9rem]">ประวัติการทำงาน</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setContinuedStudy(true);
                  reset();
                }}
                className={`w-1/2 flex items-center gap-1 flex-col p-3 border-b border-blue-300 ${
                  continuedStudy &&
                  "text-white bg-gradient-to-r from-blue-300 to-blue-400 rounded-tl-lg rounded-tr-lg"
                }`}
              >
                <GraduationCap
                  size={20}
                  color={!continuedStudy ? "blue" : "white"}
                />
                <p className="text-[0.9rem]">ประวัติการศึกษา</p>
              </button>
            </div>
          )}

          {continuedStudy ? (
            <>
              <label htmlFor="" className="mt-5">
                ปริญญา<small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="edu_level"
                rules={{
                  required: "โปรดเลือกระดับปริญญาที่คุณศึกษาต่อ",
                }}
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value || ""}
                    {...field}
                    name="edu_level"
                    className="p-2 border border-gray-300 rounded-lg w-full mt-1 text-[0.9rem] outline-none"
                  >
                    <option value="" className="text-gray-500" disabled>
                      เลือกระดับปริญญา
                    </option>
                    <option value="ปริญญาโท">ปริญญาโท</option>
                    <option value="ปริญญาเอก">ปริญญาเอก</option>
                  </select>
                )}
              />
              {errors.edu_level && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.edu_level.message}
                </small>
              )}
              <label htmlFor="" className="mt-5">
                คณะ <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="edu_faculty"
                rules={{
                  required: "โปรดระบุคณะที่คุณศึกษาต่อ",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="text"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น วิศวกรรมศาสตร์"
                  />
                )}
              />
              {errors.edu_faculty && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.edu_faculty.message}
                </small>
              )}
              <label htmlFor="" className="mt-5">
                สาขาวิชา <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="edu_dep"
                rules={{
                  required: "โปรดระบุสาขาวิชาที่คุณศึกษาต่อ",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="text"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น วิศวกรรมคอมพิวเตอร์"
                  />
                )}
              />
              {errors.edu_dep && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.edu_dep.message}
                </small>
              )}
              <label htmlFor="" className="mt-5">
                มหาวิทยาลัย <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="edu_university"
                rules={{
                  required: "โปรดระบุชื่อมหาวิทยาลัยที่คุณเข้าศึกษาต่อ",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="text"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น มหาวิทยาลัยราชภัฏมหาสารคาม"
                  />
                )}
              />
              {errors.edu_university && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.edu_university.message}
                </small>
              )}
              <label htmlFor="" className="mt-5">
                ที่ตั้งมหาวิทยาลัย{" "}
                <small className="text-red-500 text-sm">*</small>
              </label>
              <span className="relative my-1.5">
                <input
                  checked={!workInThai}
                  onChange={() => {
                    setWorkInThai(!workInThai);
                    setValue("company_place", "");
                  }}
                  type="checkbox"
                  className="absolute top-1.5"
                />
                <p className="text-sm text-gray-700 ml-5">
                  ศึกษาต่อที่ต่างประเทศ
                </p>
              </span>
              <Controller
                name="company_place"
                rules={{
                  required:
                    "โปรดระบุจังหวัด หรือประเทศหากคุณศึกษาต่อที่ต่างประเทศ",
                }}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isDisabled={loading || load}
                    options={workInThai ? provinceOptions : countryOptions}
                    placeholder={workInThai ? "เลือกจังหวัด" : "เลือกประเทศ"}
                    isSearchable
                    value={
                      (workInThai ? provinceOptions : countryOptions).find(
                        (i) => i.value === watch("company_place")
                      ) || null
                    }
                    onChange={(option) =>
                      setValue("company_place", option.value)
                    }
                    className="mt-1 w-full"
                  />
                )}
              />
              {errors.company_place && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.company_place.message}
                </small>
              )}
              <label htmlFor="" className="mt-5">
                ปีที่เข้าศึกษา (พ.ศ.){" "}
                <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="year_start"
                rules={{
                  required: "โปรดระบุปีที่เข้ารับการศึกษา",
                  validate: (value) => {
                    if (value.length !== 4 || value < 0) {
                      return "โปรดระบุปี พ.ศ. ให้ถูกต้อง";
                    }
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="number"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="ระบุปีที่คุณเข้าศึกษา"
                  />
                )}
              />
              {errors.year_start && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.year_start.message}
                </small>
              )}
              <span className="relative mt-5">
                <input
                  checked={isCurrentJob}
                  onChange={() => {
                    setIsCurrentJob(!isCurrentJob);
                  }}
                  type="checkbox"
                  className="absolute top-1.5"
                />
                <p className="text-sm text-gray-700 ml-5">
                  กำลังศึกษาอยู่ในปัจจุบัน
                </p>
              </span>
              {!isCurrentJob && (
                <>
                  <label htmlFor="" className="mt-5">
                    ปีที่สำเร็จการศึกษา (พ.ศ.){" "}
                    <small className="text-red-500 text-sm">*</small>
                  </label>
                  <Controller
                    name="year_end"
                    rules={{
                      required: "โปรดระบุปีที่สำเร็จการศึกษา",
                      validate: (value) => {
                        if (value.length !== 4 || value < 0) {
                          return "โปรดระบุปี พ.ศ. ให้ถูกต้อง";
                        }
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value || ""}
                        type="number"
                        className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                        placeholder="ระบุปีที่คุณสำเร็จการศึกษา"
                      />
                    )}
                  />
                  {errors.year_end && (
                    <small className="mt-2 text-red-500 lg:text-sm text-xs">
                      {errors.year_end.message}
                    </small>
                  )}
                </>
              )}
              <label htmlFor="" className="mt-5">
                กิจกรรมและผลงานวิจัย
              </label>
              <Controller
                name="edu_performance"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="text"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น โครงการพัฒนาแอปพลิเคชัน"
                  />
                )}
              />
              {errors.edu_performance && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.edu_performance.message}
                </small>
              )}
            </>
          ) : (
            <>
              <label htmlFor="" className="mt-5">
                งานตรงกับสายที่เรียนหรือไม่{" "}
                <small className="text-red-500 text-sm">*</small>
              </label>
              <span className="mt-1.5 flex items-center gap-1.5 pb-2 pl-2 border-b border-gray-300 w-full">
                <input
                  type="radio"
                  checked={isOnTheLine === 1}
                  name="online"
                  onChange={() => setIsOnTheLine(1)}
                />
                <p className="text-[0.95rem]">ตรงสาย</p>
                <input
                  type="radio"
                  checked={isOnTheLine === 2}
                  name="online"
                  className="ml-3"
                  onChange={() => setIsOnTheLine(2)}
                />
                <p className="text-[0.95rem]">ไม่ตรงสาย</p>
              </span>
              {showOnTheLineErr && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  โปรดระบุงานนี้ตรงกับสายที่เรียนหรือไม่
                </small>
              )}
              <label htmlFor="" className="mt-5">
                ตำแหน่งงาน <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="job_position"
                rules={{
                  required: "โปรดระบุตำแหน่งงานที่คุณทำ",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="text"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น นักพัฒนาซอฟต์แวร์"
                  />
                )}
              />
              {errors.job_position && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.job_position.message}
                </small>
              )}

              <label htmlFor="" className="mt-5">
                บริษัท/องค์กร <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="company_name"
                rules={{
                  required:
                    "โปรดกรอกชื่อบริษัทหรือองค์กรที่คุณทำงานหรือเคยทำงานอยู่",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="text"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น บริษัท เทคโนโลยี จำกัด"
                  />
                )}
              />
              {errors.company_name && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.company_name.message}
                </small>
              )}

              <label htmlFor="" className="mt-5">
                เงินเดือน (บาท){" "}
                <small className="text-red-500 text-sm">*</small>
                {/* <small className="text-xs text-gray-600 ml-3">
                  ( ข้อมูลนี้จะไม่เปิดเผยสู่สาธารณะ )
                </small> */}
              </label>
              <Controller
                name="salary"
                rules={{
                  required: "โปรดระบุเงินเดือนที่คุณได้รับ",
                  validate: (value) => {
                    if (value < 0) {
                      return "จำนวนเงินไม่ถูกต้อง";
                    }
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="number"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                    placeholder="ระบุเงินเดือน"
                  />
                )}
              />
              {errors.salary && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.salary.message}
                </small>
              )}

              <label htmlFor="" className="mt-5">
                สถานที่ทำงาน <small className="text-red-500 text-sm">*</small>
              </label>
              <span className="relative my-1.5">
                <input
                  checked={!workInThai}
                  onChange={() => {
                    setWorkInThai(!workInThai);
                    setValue("company_place", "");
                  }}
                  type="checkbox"
                  className="absolute top-1.5"
                />
                <p className="text-sm text-gray-700 ml-5">
                  ทำงานอยู่ต่างประเทศ
                </p>
              </span>
              <Controller
                name="company_place"
                rules={{
                  required:
                    "โปรดระบุจังหวัด หรือประเทศหากคุณทำงานอยู่ต่างประเทศ",
                }}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isDisabled={loading || load}
                    options={workInThai ? provinceOptions : countryOptions}
                    placeholder={workInThai ? "เลือกจังหวัด" : "เลือกประเทศ"}
                    isSearchable
                    value={
                      (workInThai ? provinceOptions : countryOptions).find(
                        (i) => i.value === watch("company_place")
                      ) || null
                    }
                    onChange={(option) => {
                      if (option.label === "Thailand") {
                        return setWorkInThai(true);
                      }
                      setValue("company_place", option.value);
                    }}
                    className="mt-1 w-full"
                  />
                )}
              />
              {errors.company_place && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.company_place.message}
                </small>
              )}

              <label htmlFor="" className="mt-5">
                วันที่เริ่มงาน <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="start_date"
                rules={{
                  required: "โปรดระบุวันที่คุณเริ่มงานที่นี่",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="date"
                    className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
              {errors.start_date && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.start_date.message}
                </small>
              )}

              <span className="relative mt-4">
                <input
                  checked={isCurrentJob}
                  onChange={() => setIsCurrentJob(!isCurrentJob)}
                  type="checkbox"
                  className="absolute top-1.5"
                />
                <p className="text-sm text-gray-700 ml-5">
                  ยังคงทำงานอยู่ในปัจจุบัน
                </p>
              </span>

              {!isCurrentJob && (
                <>
                  <label htmlFor="" className="mt-4">
                    วันที่สิ้นสุดงาน{" "}
                    <small className="text-red-500 text-sm">*</small>
                  </label>
                  <Controller
                    name="end_date"
                    rules={{
                      required: "โปรดระบุวันที่สิ้นสุดการทำงานที่นี่",
                    }}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value || ""}
                        type="date"
                        className="w-full mt-1 p-2 px-3 border border-gray-400 rounded-lg text-[0.9rem] focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  />
                  {errors.end_date && (
                    <small className="mt-2 text-red-500 lg:text-sm text-xs">
                      {errors.end_date.message}
                    </small>
                  )}
                </>
              )}

              <label htmlFor="" className="mt-4">
                รายละเอียดงาน <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="job_detail"
                rules={{
                  required: "โปรดกรอกรายละเอียดของงาน",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    className="w-full outline-none mt-2.5 p-2 px-3 border border-gray-400 resize-none h-[100px] rounded-lg text-base leading-relaxed focus:ring-1 focus:ring-blue-500"
                    placeholder="อธิบายเกี่ยวกับงานที่ทำ บทบาทหน้าที่..."
                  />
                )}
              />
              {errors.job_detail && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.job_detail.message}
                </small>
              )}

              <label htmlFor="" className="mt-4">
                หน้าที่รับผิดชอบ{" "}
                <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="job_responsibility"
                rules={{
                  required: "โปรดกรอกสิ่งที่ได้รับผิดชอบในงานนี้",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    className="w-full outline-none mt-2.5 p-2 px-3 border border-gray-400 resize-none h-[100px] rounded-lg text-base leading-relaxed focus:ring-1 focus:ring-blue-500"
                    placeholder="ได้รับผิดชอบทำอะไรบ้าง เช่น พิมพ์งานเอกสาร,ส่งเอกสาร"
                  />
                )}
              />
              {errors.job_responsibility && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.job_responsibility.message}
                </small>
              )}

              <label htmlFor="" className="mt-4">
                ทักษะที่ใช้ <small className="text-red-500 text-sm">*</small>
              </label>
              <Controller
                name="job_skills"
                rules={{
                  required: "โปรดระบุทักษะที่ใช้ในงานนี้",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    className="w-full outline-none mt-2.5 p-2 px-3 border border-gray-400 resize-none h-[100px] rounded-lg text-base leading-relaxed focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น ใช้ Microsoft Words,Microsoft Excel"
                  />
                )}
              />
              {errors.job_skills && (
                <small className="mt-2 text-red-500 lg:text-sm text-xs">
                  {errors.job_skills.message}
                </small>
              )}
            </>
          )}

          <label htmlFor="" className="mt-4">
            หมายเหตุ
          </label>
          <Controller
            name="remark"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ""}
                className="w-full outline-none mt-2.5 p-2 px-3 border border-gray-400 resize-none h-[100px] rounded-lg text-base leading-relaxed focus:ring-1 focus:ring-blue-500"
                placeholder="รายละเอียดอื่นๆที่ต้องการบอกเพิ่มเติม"
              />
            )}
          />

          <button
            disabled={loading || load}
            type="submit"
            className="mt-7 p-2.5 px-3 text-white rounded-lg bg-blue-500 hover:bg-blue-600 hover:shadow-md flex items-center gap-2.5"
          >
            {saving ? <Loading type={1} /> : <Save size={18} color="white" />}
            <p className="text-[0.9rem]">
              {saving ? "กำลังดำเนินการ..." : "บันทึก"}
            </p>
          </button>
        </form>
      </Modal>
    </>
  );
};
export default WorkHistory;
