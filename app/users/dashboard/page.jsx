"use client";
import PieChartComponent from "@/components/chart-pie";
import ChartSimple from "@/components/chart-simple";
import DropdownMenu from "@/components/dropdown-menu";
import {
  BookCopy,
  BriefcaseBusiness,
  Building,
  Building2,
  Check,
  CheckCircle,
  CircleDollarSign,
  Coins,
  Eye,
  GraduationCap,
  MapPin,
  MapPinHouse,
  Menu,
  University,
  Users,
  X,
} from "lucide-react";
import { faculties, departments } from "@/data/faculty";
import { useEffect, useState } from "react";
import Link from "next/link";
import MostLiveProvince from "./most-live-province";
import useGetSession from "@/hook/useGetSeesion";
import { departmentText, facultyText } from "@/components/faculty-p";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Loading from "@/components/loading";
import Image from "next/image";
import { NO_PROFILE_IMG } from "../profile/alumni-profile";
import { useDashboardContext } from "./dashboard-context";
import NoData from "@/components/nodata";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/navigation";
import { FaCoins, FaGlobe, FaGraduationCap, FaMapMarked } from "react-icons/fa";
import WorkPlaceRatePieChartComponent from "./work-place-rate";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";

const Dashboard = () => {
  const { user } = useGetSession();
  const {
    setFaculty,
    setDepartment,
    selectYearStart,
    selectYearEnd,
    setSelectYearStart,
    setSelectYearEnd,
  } = useDashboardContext();
  const { setPrevPath } = useAppContext();
  const router = useRouter();

  const [selectFaculty, setSelectFaculty] = useState("");
  const [selectDepartment, setSelectDepartment] = useState("");
  const [selectFacultyMenus, setSelectFacultyMenus] = useState(
    faculties.map((f) => ({
      id: f.id,
      title: f.name,
      func: () => {
        setSelectFaculty(f);
        setFaculty(f);
        setDepartment();
      },
    }))
  );

  const [selectDepartmentMenus, setSelectDepartmentMenus] = useState(
    departments.map((d) => ({
      id: d.id,
      title: d.name,
      func: () => {
        setSelectDepartment(d);
        setDepartment(d);
      },
    }))
  );
  useEffect(() => {
    if (!user || user?.roleId > 3) return;

    const { facultyId } = user;

    let data = departments;
    const facSub = Number(`${facultyId}`.substring(1, 2));
    if (facultyId < 18) {
      data = departments.filter((d) => `${d.id}`.substring(0, 1) == facSub);
    } else if (facultyId > 18) {
      data = departments.filter((d) => `${d.id}`.substring(0, 2) == 62);
    } else {
      data = departments.filter((d) => `${d.id}`.substring(0, 2) == 21);
    }

    setSelectDepartmentMenus(
      data.map((d) => ({
        id: d.id,
        title: d.name,
        func: () => {
          setSelectDepartment(d);
          setDepartment(d);
        },
      }))
    );
  }, [user]);

  useEffect(() => {
    if (!selectFaculty) return;

    setSelectDepartmentMenus(() => {
      const facId = selectFaculty.id;
      const facSub = Number(`${selectFaculty.id}`.substring(1, 2));
      let data = [];
      if (facId < 18) {
        data = departments.filter((d) => `${d.id}`.substring(0, 1) == facSub);
      } else if (facId > 18) {
        data = departments.filter((d) => `${d.id}`.substring(0, 2) == 62);
      } else {
        data = departments.filter((d) => `${d.id}`.substring(0, 2) == 21);
      }
      setSelectDepartment("");

      return data.map((d) => ({
        id: d.id,
        title: d.name,
        func: () => {
          setSelectDepartment(d);
          setDepartment(d);
        },
      }));
    });
  }, [selectFaculty]);

  const [headerTitle, setHeaderTitle] = useState("");
  const titleText = () => {
    let title = "";
    if (!selectDepartment && !selectFaculty) {
      title = "ทั้งหมด";
    }

    if (selectFaculty) {
      title = selectFaculty.name + " ";
    }
    if (selectDepartment) {
      title = title + "สาขาวิชา" + selectDepartment.name;
    }

    setHeaderTitle(title);
  };
  useEffect(() => {
    titleText();
  }, [selectDepartment, selectFaculty]);

  const clearQuery = () => {
    setSelectYearStart("");
    setSelectYearEnd("");
    setSelectFacultyMenus(
      faculties.map((d) => ({
        id: d.id,
        title: d.name,
        func: () => {
          setSelectFaculty(d);
          setFaculty(d);
          setDepartment("");
        },
      }))
    );
    setSelectDepartmentMenus(
      departments.map((d) => ({
        id: d.id,
        title: d.name,
        func: () => {
          setSelectDepartment(d);
          setDepartment(d);
        },
      }))
    );
    setSelectDepartment("");
    setSelectFaculty("");
  };

  const [loadAllAvg, setLoadAllAvg] = useState(false);
  const [headerData, setHeaderData] = useState();
  const fetchPageStart = async (
    facultyId = "",
    departmentId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    setLoadAllAvg(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/all-avg", {
        withCredentials: true,
        params: {
          facultyId,
          departmentId,
          selectYearStart,
          selectYearEnd,
        },
      });
      if (res.status === 200) {
        setHeaderData(res?.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoadAllAvg(false);
    }
  };

  const [chartbarData, setChartbarData] = useState([]);
  const fetchChartBarData = async (
    facultyId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/chart-bar-data",
        {
          withCredentials: true,
          params: {
            facultyId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        const data = res.data;
        const result = data.map((d) => ({
          name:
            user?.roleId < 3 || selectFaculty
              ? departments.find((f) => f.id == d.id)?.name
              : faculties.find((f) => f.id == d?.id)?.name,
          working: d?.working,
          unemployed: d?.unemployed,
        }));
        setChartbarData(result);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  const [pieData, setPieData] = useState([]);
  const fetchPieData = async (
    facultyId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/pie-chart-data",
        {
          withCredentials: true,
          params: {
            facultyId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        const data = res.data;
        const result = data.map((d) => ({
          name:
            user?.roleId < 4 || selectFaculty
              ? departments.find((f) => f.id == d.departmentId).name
              : faculties.find((f) => f.id == d.facultyId).name,
          value: d.avg_salary,
        }));
        setPieData(result);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  const [pieWorkRate, setPieWorkRate] = useState([]);
  const [otherCountryList, setOtherCountryList] = useState([]);
  const fetchWorkPlaceRate = async (
    facultyId = "",
    departmentId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/work-place-rate",
        {
          withCredentials: true,
          params: {
            facultyId,
            departmentId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        setPieWorkRate(res.data.result);
        setOtherCountryList(res?.data?.countryList);
        // console.log(
        //   "🚀 ~ fetchWorkPlaceRate ~ res?.data?.countryList:",
        //   res?.data?.countryList
        // );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  const [populationJob, setPopulationJob] = useState([]);
  const fetchMostPopular = async (
    facultyId = "",
    departmentId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/population-job",
        {
          withCredentials: true,
          params: {
            facultyId,
            departmentId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        const data = res.data;
        const result = data.map((d) => ({
          name: d?.job_position,
          count: d?._count?.alumniId,
        }));
        setPopulationJob(result);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  const [mostLiverPercent, setMostLivePercent] = useState([]);
  const fetchMostLive = async (
    facultyId = "",
    departmentId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/most-live-province",
        {
          withCredentials: true,
          params: {
            facultyId,
            departmentId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        setMostLivePercent(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  const [workRatePercent, setWorkRatePercent] = useState([]);
  const fetchWorkRatePercent = async (
    facultyId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/workrate-percent",
        {
          withCredentials: true,
          params: {
            facultyId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        const data = res.data;
        const result = data.map((d) => ({
          name:
            user?.roleId < 3 || selectFaculty
              ? departments.find((f) => f.id == d.id)?.name
              : faculties.find((f) => f.id == d.id)?.name,
          percent: Math.round(d?.percent),
        }));
        setWorkRatePercent(result);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  const [noWorkData, setNoWorkData] = useState([]);
  const [alumniNoWorkList, setAlumniNoWorkList] = useState([]);
  const fetchNoWorkData = async (
    facultyId = "",
    departmentId = "",
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/no-work-data",
        {
          withCredentials: true,
          params: {
            facultyId,
            departmentId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        setNoWorkData(res.data.result);
        if (user.roleId < 3 || selectDepartment) {
          setAlumniNoWorkList(res.data.alumniNoWork);
        }
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchPageStart(
      selectFaculty?.id,
      selectDepartment?.id,
      selectYearStart,
      selectYearEnd
    );
    fetchChartBarData(selectFaculty?.id, selectYearStart, selectYearEnd);
    fetchPieData(selectFaculty?.id, selectYearStart, selectYearEnd);
    fetchMostPopular(
      selectFaculty?.id,
      selectDepartment?.id,
      selectYearStart,
      selectYearEnd
    );
    fetchMostLive(
      selectFaculty?.id,
      selectDepartment?.id,
      selectYearStart,
      selectYearEnd
    );
    fetchWorkRatePercent(selectFaculty?.id, selectYearStart, selectYearEnd);
    fetchNoWorkData(
      selectFaculty?.id,
      selectDepartment?.id,
      selectYearStart,
      selectYearEnd
    );
    fetchWorkPlaceRate(
      selectFaculty.id,
      selectDepartment.id,
      selectYearStart,
      selectYearEnd
    );
  }, [user, selectDepartment, selectFaculty, selectYearStart, selectYearEnd]);

  const seeMostMinSalary = async (
    type,
    facultyId,
    departmentId,
    selectYearStart,
    selectYearEnd
  ) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/name/most-salary",
        {
          withCredentials: true,
          params: {
            type,
            facultyId,
            departmentId,
            selectYearStart,
            selectYearEnd,
          },
        }
      );
      if (res.status === 200) {
        setPrevPath("/users/dashboard");
        router.push(`/users/search/${res.data}/1`);
      }
    } catch (error) {
      alerts.err();
      console.error(error);
    }
  };

  if (!user)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <Loading type={2} />
        <p>กำลังโหลด...</p>
      </div>
    );

  return (
    <div className="w-full h-auto mb-5">
      <span className="w-full flex md:flex-row flex-col gap-1 pb-3 px-2 mt-2 border-b border-blue-200 items-center justify-between">
        <span className="flex items-center gap-2 text-wrap">
          <h1 className="">
            ภาพรวมสรุปข้อมูลของศิษย์เก่า {headerTitle} ภายใน
            {user?.roleId < 3
              ? "สาขา" + departmentText(user?.departmentId) || ""
              : user?.roleId > 3
              ? "มหาวิทยาลัยราชภัฏมหาสารคาม"
              : facultyText(user?.facultyId) || ""}
            {selectYearStart && ` ปีการศึกษา พ.ศ. ${selectYearStart}`}
            {selectYearEnd && selectYearStart
              ? ` - พ.ศ. ${selectYearEnd}`
              : selectYearEnd && ` ปีที่สำเร็จการศึกษา พ.ศ. ${selectYearEnd}`}
          </h1>

          {(selectDepartment ||
            selectFaculty ||
            selectYearStart ||
            selectYearEnd) && (
            <X
              color="red"
              onClick={clearQuery}
              size={18}
              className="cursor-pointer"
            />
          )}
        </span>

        <div className="flex items-center gap-2">
          {user?.roleId > 3 && (
            <DropdownMenu
              icon={<Building size={20} />}
              menus={selectFacultyMenus}
              buttonTitle="เลือกคณะ"
            />
          )}
          {user?.roleId > 2 && (
            <DropdownMenu
              icon={<BookCopy size={20} />}
              buttonTitle="เลือกสาขา"
              menus={selectDepartmentMenus}
            />
          )}
          <SelectYearStart
            selectYearStart={selectYearStart}
            setSelectYearStart={setSelectYearStart}
            setPage={() => {}}
          />
          <SelectYearEnd
            selectYearEnd={selectYearEnd}
            setSelectYearEnd={setSelectYearEnd}
            setPage={() => {}}
          />
        </div>
      </span>

      <div className="px-2 mt-5 w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2.5 gap-y-3.5">
        {/* all */}
        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/work-unemployed");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-blue-400 bg-gradient-to-r from-blue-600 to-sky-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-gray-50 rounded-full border border-blue-500">
            <Users color="blue" size={20} />
          </span>
          <label className=" text-white text-[0.9rem]">ศิษย์เก่าทั้งหมด</label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.allAlumni || 0).toLocaleString() || 0
            )}
          </div>
          <label htmlFor="" className="text-white">
            คน
          </label>
        </div>

        {/* work */}
        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/work-unemployed");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-green-400 bg-gradient-to-r from-green-600 to-green-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-green-500">
            <Check color="green" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            ศิษย์เก่าปัจจุบันมีงานทำ
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.alumniWorking || 0).toLocaleString() || 0
            )}
          </div>
          <label htmlFor="" className="text-white">
            คน
          </label>
        </div>

        {/* coin */}
        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/list-salary");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-yellow-400 bg-gradient-to-r from-orange-400 bg-yellow-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-yellow-500">
            <Coins color="orange" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">เงินเดือนเฉลี่ย</label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : headerData?.salaryAvg ? (
              Number(Math.round(headerData?.salaryAvg || 0)).toLocaleString() ||
              "โหลด..."
            ) : (
              0
            )}
          </div>
          <label htmlFor="" className="text-white">
            บาท
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/work-unemployed");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-zinc-400 bg-gradient-to-r from-stone-600 to-neutral-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-indigo-500">
            <University color="brown" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            ศิษย์เก่าที่ปัจจุบันกำลังศึกษาต่อ
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.currentStudy || 0).toLocaleString() ||
              "ไม่พบข้อมูล"
            )}
          </div>
          <label htmlFor="" className="text-white">
            คน
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/master-degree-list");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-purple-400 bg-gradient-to-r from-purple-500 bg-pink-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-purple-500">
            <GraduationCap color="purple" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาโท
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.alumniStudy || 0).toLocaleString() || 0
            )}
          </div>
          <label htmlFor="" className="text-white">
            คน
          </label>
        </div>
        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/doctoral-degree-list");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-pink-400 bg-gradient-to-l from-fuchsia-500 to-rose-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-pink-500">
            <FaGraduationCap color="purple" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาเอก
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.alumniStudyMax || 0).toLocaleString() || 0
            )}
          </div>
          <label htmlFor="" className="text-white">
            คน
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/list-place");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-gray-400 bg-gradient-to-r from-gray-600 to-gray-300"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-gray-500">
            <BriefcaseBusiness color="black" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">อาชีพยอดนิยม</label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              headerData?.mostPopulationJob || "ไม่พบข้อมูล"
            )}
          </div>
          <label htmlFor="" className="text-white">
            {headerData?.countPoplationJob
              ? Number(headerData?.countPoplationJob || 0).toLocaleString() +
                  " คน" || "กำลังโหลด..."
              : "ไม่พบข้อมูล"}
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/list-place");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-indigo-400 bg-gradient-to-r from-indigo-600 to-indigo-300"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-indigo-500">
            <MapPinHouse color="blue" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            จังหวัดที่ศิษย์เก่าอยู่มากที่สุด
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              headerData?.mostLiveProvince || "ไม่พบข้อมูล"
            )}
          </div>
          <label htmlFor="" className="text-white">
            {headerData?.countMostLive
              ? Number(headerData?.countMostLive || 0).toLocaleString() +
                  " คน" || "กำลังโหลด..."
              : "ไม่พบข้อมูล"}
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/list-place");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-rose-400 bg-gradient-to-r from-rose-600 to-red-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-indigo-500">
            <Building2 color="red" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            จังหวัดที่ศิษย์เก่าทำงานมากที่สุด
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              headerData?.workPlaceLive?.company_place || "ไม่พบข้อมูล"
            )}
          </div>
          <label htmlFor="" className="text-white">
            {headerData?.workPlaceLive?._count?.alumniId
              ? Number(
                  headerData?.workPlaceLive?._count?.alumniId || 0
                ).toLocaleString() + " คน" || "กำลังโหลด..."
              : "ไม่พบข้อมูล"}
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            seeMostMinSalary(
              1,
              selectFaculty.id,
              selectDepartment.id,
              selectYearStart,
              selectYearEnd
            );
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-emerald-400 bg-gradient-to-r from-emerald-600 to-teal-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-indigo-500">
            <CircleDollarSign color="green" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            รับเงินเดือนสูงที่สุดในปัจจุบัน
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.mostSalary || 0).toLocaleString() ||
              "ไม่พบข้อมูล"
            )}
          </div>
          <label htmlFor="" className="text-white">
            บาท
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/study-other-country")
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-orange-400 bg-gradient-to-l from-amber-400 to-red-400"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-indigo-500">
            <FaMapMarked color="orange" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            ศิษย์เก่าที่ไปศึกษาต่อที่ต่างประเทศ
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.studyOtherCountry || 0).toLocaleString() ||
              "ไม่พบข้อมูล"
            )}
          </div>
          <label htmlFor="" className="text-white">
            คน
          </label>
        </div>

        <div
          onClick={() => {
            setPrevPath("/users/dashboard");
            router.push("/users/dashboard/work-other-country-list");
          }}
          className="cursor-pointer hover:shadow-gray-400 transition-all duration-300 relative flex flex-col gap-1 p-2.5 px-5 rounded-lg shadow-md border border-blue-400 bg-gradient-to-l from-sky-500 to-cyan-500"
        >
          <span className="absolute top-2 right-2.5 p-1.5 bg-white rounded-full border border-indigo-500">
            <FaGlobe color="blue" size={20} />
          </span>
          <label className="text-white text-[0.9rem]">
            ศิษย์เก่าที่เคยทำงานอยู่ต่างประเทศ
          </label>
          <div className="font-bold text-xl text-white">
            {loadAllAvg ? (
              <Loading type={1} />
            ) : (
              Number(headerData?.countryWork || 0).toLocaleString() ||
              "ไม่พบข้อมูล"
            )}
          </div>
          <label htmlFor="" className="text-white">
            คน
          </label>
        </div>
      </div>
      {user?.roleId < 3 ||
        (!selectDepartment && (
          <>
            {" "}
            <div className="relative p-5 rounded-lg border bg-gray-800 border-blue-300 mx-2 shadow-md mt-6">
              <Link
                href="/users/dashboard/work-unemployed"
                className="absolute top-4 right-4"
                title="ดูเพิ่มเติม"
              >
                <Menu color="#8DD1E1" />
              </Link>
              <label className="font-bold text-white">
                แผนภูมิแท่งแสดงภาพรวมการมีงานทำของแต่ละ
                {user?.roleId < 3 || selectFaculty ? "สาขา" : "คณะ"}
              </label>
              <span className="flex items-center gap-2">
                <label htmlFor="" className="text-red-500">
                  unemployed
                </label>
                <p className="text-white">
                  = ว่างงาน (
                  {chartbarData.reduce(
                    (sum, current) => sum + current.unemployed,
                    0
                  ) + " คน"}
                  )
                </p>
                <label htmlFor="" className="text-green-500">
                  working
                </label>
                <p className="text-white">
                  = ทำงาน (
                  {chartbarData.reduce(
                    (sum, current) => sum + current.working,
                    0
                  ) + " คน"}
                  )
                </p>
              </span>
              <ChartSimple
                data={chartbarData}
                key1={"working"}
                color1={"#32CD32"}
                color2={"#FF0000"}
                key2={"unemployed"}
              />
            </div>
            <div className="p-5 rounded-lg border bg-gray-800 border-blue-300 mx-2 shadow-md mt-6">
              <label className="font-bold text-white">
                อัตราการมีงานทำของแต่ละ
                {user?.roleId < 3 || selectFaculty ? "สาขา" : "คณะ"} (%)
              </label>

              <ChartSimple
                domain={[0, 100]}
                color1={"#4ECDC4"}
                data={workRatePercent}
                key1={"percent"}
              />
            </div>
          </>
        ))}

      <div className="w-full flex lg:flex-row flex-col gap-4 mt-8">
        {user?.roleId < 3 ||
          (!selectDepartment && (
            <div className="bg-gray-800 w-full lg:w-1/2 p-5 rounded-lg border border-blue-300 mx-2 shadow-md">
              <span className="w-full flex items-center justify-between">
                <label className="font-bold text-white">
                  สัดส่วนเงินเดือนเฉลี่ยของศิษย์เก่า
                  {user?.roleId < 3 || selectFaculty ? "สาขา" : "คณะ"}
                </label>
              </span>

              <PieChartComponent openToolTip={true} data={pieData} />
            </div>
          ))}

        <div
          className={`flex w-full gap-5 ${
            user.roleId < 3 || selectDepartment
              ? "lg:flex-row flex-col"
              : "flex-col lg:w-1/2"
          } `}
        >
          <MostLiveProvince {...mostLiverPercent} />
          <div className="w-full rounded-lg border border-blue-500 bg-gray-800 p-5 shadow-md">
            <span className="w-full flex items-center justify-between">
              <label htmlFor="" className="text-white font-bold">
                ศิษย์เก่าที่ไม่พบข้อมูลประวัติการทำงาน
                {user?.roleId < 3 || selectFaculty
                  ? ""
                  : user?.roleId > 3
                  ? "แต่ละคณะ"
                  : "แต่ละสาขา"}
              </label>
              {noWorkData?.length > 0 && (
                <button
                  onClick={() => {
                    setPrevPath("/users/dashboard");
                    router.push("/users/dashboard/list-no-data");
                  }}
                >
                  <Eye color="#8DD1E1" size={20} className="cursor-pointer" />
                </button>
              )}
            </span>

            <div className="w-full flex flex-col gap-2.5 h-[200px] mt-3 overflow-y-auto pb-3 ">
              {headerData?.allAlumni < 1 ? (
                <NoData bg={2} />
              ) : noWorkData.length > 0 ? (
                user?.roleId < 3 || selectDepartment ? (
                  alumniNoWorkList.map((a, index) => (
                    <button
                      onClick={() => {
                        setPrevPath("/users/dashboard");
                        router.push(`/users/search/${a?.alumni_id}/1`);
                      }}
                      key={index}
                      className="flex items-center p-2.5 border-b border-gray-700 cursor-pointer gap-2.5 transition-all duration-200 hover:bg-gray-700 rounded-lg"
                    >
                      <div className="rounded-full bg-blue-500 w-[50px] h-[50px] overflow-hidden">
                        <Image
                          alt="profile"
                          width={50}
                          height={50}
                          priority
                          src={
                            a?.profile
                              ? apiConfig.imgAPI + a?.profile
                              : NO_PROFILE_IMG
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-white">
                          {a?.prefix}
                          {a?.fname} {a?.lname}
                        </p>
                        <p className="ml-0.5 text-sm text-white">
                          ปีที่เข้าศึกษา : พ.ศ.{" "}
                          {25 + `${a?.alumni_id}`.substring(0, 2)}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  noWorkData?.map((r, index) => {
                    return (
                      <span
                        key={index}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center  w-4/5 gap-3">
                          <BriefcaseBusiness size={18} color="red" />
                          <div className="flex w-full flex-col gap-1">
                            <p className="text-[0.9rem] text-white">
                              {user?.roleId < 3 || selectFaculty
                                ? departmentText(r?.departmentId)
                                : facultyText(r?.facultyId)}
                            </p>
                          </div>
                        </div>
                        <p className="text-white">{r?._count?.alumni_id} คน</p>
                      </span>
                    );
                  })
                )
              ) : (
                <div className="w-full flex flex-col mt-10 items-center justify-center gap-2">
                  <CheckCircle size={80} color="#87D068" />
                  <p className="text-white text-sm">
                    ศิษย์เก่ากรอกข้อมูลทุกคนแล้ว
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {user?.roleId > 2 && (
        <div className="w-full flex lg:flex-row-reverse flex-col gap-4 mt-8">
          <div className="bg-gray-800 w-full lg:w-1/2 p-5 rounded-lg border border-blue-300 mx-2 shadow-md">
            <span className="w-full flex items-center justify-between">
              <label className="font-bold text-white">
                สัดส่วนศิษย์เก่าที่ทำงานอยู่ในและต่างประเทศ
              </label>
            </span>

            <WorkPlaceRatePieChartComponent
              data={pieWorkRate}
              openToolTip={true}
            />
          </div>

          <div className="bg-gray-800 w-full lg:w-1/2 p-5 rounded-lg border border-blue-300 mx-2 shadow-md">
            <span className="w-full flex items-center justify-between">
              <label className="font-bold text-white">
                ประเทศที่ศิษย์เก่าไปทำงานมากที่สุด
              </label>
            </span>

            <div className="w-full flex flex-col h-[500px] gap-3.5 mt-3 overflow-y-auto">
              {otherCountryList.length > 0 ? (
                otherCountryList.map((o, index) => (
                  <span
                    key={index}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center  w-4/5 gap-3">
                      <FaGlobe size={18} color="cyan" />
                      <div className="flex w-full flex-col gap-1">
                        <p className="text-[0.9rem] text-white">
                          {o?.company_place}
                          {/* (
                      {r?._count?.alumniId?.toLocaleString() + " คน"}) */}
                        </p>
                        {/* <section className="w-full relative p-1.5 rounded-full border border-gray-400 bg-gray-50">
                      <div
                        className="absolute h-full top-0 left-0 rounded-full bg-green-400 transition-all duration-300"
                        style={{
                          width: `${(
                            (r?._count?.alumniId / total) *
                            100
                          ).toFixed(1)}%`,
                        }}
                      ></div>
                    </section> */}
                      </div>
                    </div>
                    <p className="text-green-400">
                      {o?._count?.alumniId?.toLocaleString() + " คน"}
                    </p>
                  </span>
                ))
              ) : (
                <NoData bg={2} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 mx-2 p-5 bg-gray-800 rounded-lg border border-blue-500 md:col-span-2 shadow-sm flex-col flex">
        <span className="w-full flex items-center justify-between">
          <label className="font-bold text-white">
            อาชีพยอดนิยมของศิษย์เก่า (คน)
          </label>
        </span>
        {populationJob.length > 0 ? (
          <ChartSimple color1={"#FFBB28"} key1={"count"} data={populationJob} />
        ) : (
          <NoData bg={2} />
        )}
      </div>
    </div>
  );
};
export default Dashboard;
