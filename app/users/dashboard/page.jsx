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
import {
  FaCoins,
  FaEllipsisH,
  FaFolderOpen,
  FaGlobe,
  FaGraduationCap,
  FaMapMarked,
} from "react-icons/fa";
import WorkPlaceRatePieChartComponent from "./work-place-rate";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";
import FadeInSection from "@/components/fade-in-section";
import LineChartComponent from "@/components/line-chart";
import AlumniColumnChart from "@/components/column-chart";

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
              ? departments.find((f) => f.id == d.departmentId)?.name
              : faculties.find((f) => f.id == d.facultyId).name,
          value: Math.round(d.avgSalary),
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

  if (!user)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <Loading type={2} />
        <p>กำลังโหลด...</p>
      </div>
    );

  return (
    <div className="w-full h-auto">
      <span className="w-full flex md:flex-row flex-col gap-1 px-5 sticky top-0 bg-white z-50 shadow-md py-3 border-b border-blue-200 items-center justify-between">
        <span className="flex items-center gap-2 text-wrap">
          <h1 className="">
            ภาพรวมสรุปข้อมูลของศิษย์เก่า {headerTitle} ภายใน
            {user?.roleId < 3
              ? departmentText(user?.departmentId) || ""
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

      <div className="w-full flex flex-col h-auto bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 pt-2 px-8">
        <div className=" p-2 pt-3.5 w-full grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* all */}
          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-3 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-blue-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/work-unemployed");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-blue-50 rounded-full border border-blue-500">
              <Users color="blue" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-gray-500  text-sm">ศิษย์เก่าทั้งหมด</label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.allAlumni || 0).toLocaleString() || 0
                )}
              </div>
              <label htmlFor="" className="text-gray-500  text-sm">
                คน
              </label>
            </div>
          </FadeInSection>

          {/* work */}
          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-green-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/work-unemployed");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 rounded-full border border-green-500 bg-green-50">
              <Check color="green" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">
                ศิษย์เก่าปัจจุบันมีงานทำ
              </label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.alumniWorking || 0).toLocaleString() || 0
                )}
              </div>
              <label htmlFor="" className="text-sm text-gray-500">
                คน
              </label>
            </div>
          </FadeInSection>

          {/* coin */}
          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-yellow-500">
            {/* <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/list-salary");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button> */}
            <span className="rounded-full border p-2 border-yellow-500 bg-yellow-50">
              <Coins color="orange" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">
                เงินเดือนเฉลี่ยในปัจจุบันของศิษย์เก่า
              </label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : headerData?.salaryAvg ? (
                  Number(
                    Math.round(headerData?.salaryAvg || 0)
                  ).toLocaleString() || "โหลด..."
                ) : (
                  0
                )}
              </div>
              <label htmlFor="" className="text-sm text-gray-500">
                บาท
              </label>
            </div>
          </FadeInSection>

          {/* study */}
          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-stone-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/work-unemployed");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 rounded-full border border-stone-500 bg-stone-50">
              <University color="brown" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">
                ศิษย์เก่าที่ปัจจุบันกำลังศึกษาต่อ
              </label>
              <div className="font-bold text-xl ">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.currentStudy || 0).toLocaleString() ||
                  "ไม่พบข้อมูล"
                )}
              </div>
              <label htmlFor="" className="text-sm text-gray-500">
                คน
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-purple-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/master-degree-list");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-purple-50 rounded-full border border-purple-500">
              <GraduationCap color="purple" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">
                ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาโท
              </label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.alumniStudy || 0).toLocaleString() || 0
                )}
              </div>
              <label htmlFor="" className="text-sm text-gray-500">
                คน
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-pink-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/doctoral-degree-list");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-pink-50 rounded-full border border-pink-500">
              <FaGraduationCap color="pink" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">
                ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาเอก
              </label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.alumniStudyMax || 0).toLocaleString() || 0
                )}
              </div>
              <label htmlFor="" className="text-sm text-gray-500">
                คน
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-gray-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/list-place");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-gray-50 rounded-full border border-gray-500">
              <BriefcaseBusiness color="black" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">อาชีพยอดนิยม</label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  headerData?.mostPopulationJob || "ไม่พบข้อมูล"
                )}
              </div>
              <label htmlFor="" className="text-sm text-gray-500">
                {headerData?.countPoplationJob
                  ? Number(
                      headerData?.countPoplationJob || 0
                    ).toLocaleString() + " คน" || "กำลังโหลด..."
                  : "ไม่พบข้อมูล"}
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-indigo-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/list-place");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-sky-50 rounded-full border border-indigo-500">
              <MapPinHouse color="blue" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">
                จังหวัดที่ศิษย์เก่าอยู่มากที่สุด
              </label>
              <div className="font-bold text-xl ">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  headerData?.mostLiveProvince || "ไม่พบข้อมูล"
                )}
              </div>
              <label htmlFor="" className="text-gray-500 text-sm">
                {headerData?.countMostLive
                  ? Number(headerData?.countMostLive || 0).toLocaleString() +
                      " คน" || "กำลังโหลด..."
                  : "ไม่พบข้อมูล"}
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-red-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/list-place");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-orange-50 rounded-full border border-red-500">
              <Building2 color="red" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">
                จังหวัดที่ศิษย์เก่าทำงานมากที่สุด
              </label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  headerData?.workPlaceLive?.company_place || "ไม่พบข้อมูล"
                )}
              </div>
              <label htmlFor="" className="text-gray-500 text-sm">
                {headerData?.workPlaceLive?._count?.alumniId
                  ? Number(
                      headerData?.workPlaceLive?._count?.alumniId || 0
                    ).toLocaleString() + " คน" || "กำลังโหลด..."
                  : "ไม่พบข้อมูล"}
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-teal-500">
            <span className="p-2 bg-lime-50 rounded-full border border-lime-500">
              <CircleDollarSign color="green" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">
                รับเงินเดือนสูงที่สุดในปัจจุบัน
              </label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.mostSalary || 0).toLocaleString() ||
                  "ไม่พบข้อมูล"
                )}
              </div>
              <label htmlFor="" className="text-gray-500 text-sm">
                บาท
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-amber-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/study-other-country");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-amber-50 rounded-full border border-orange-500">
              <FaMapMarked color="orange" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">
                ศิษย์เก่าที่ไปศึกษาต่อที่ต่างประเทศ
              </label>
              <div className="font-bold text-xl">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.studyOtherCountry || 0).toLocaleString() ||
                  "ไม่พบข้อมูล"
                )}
              </div>
              <label htmlFor="" className="text-gray-500 text-sm">
                คน
              </label>
            </div>
          </FadeInSection>

          <FadeInSection className="cursor-pointer bg-white border border-gray-200 hover:shadow-gray-400 transition-all duration-300 relative flex items-center justify-center gap-6 p-2.5 px-5 rounded-lg shadow-md border-l-6 flex-row-reverse border-l-cyan-500">
            <button
              onClick={() => {
                setPrevPath("/users/dashboard");
                router.push("/users/dashboard/work-other-country-list");
              }}
              className="absolute top-2 right-2 text-gray-700"
            >
              <FaEllipsisH size={15} />
            </button>
            <span className="p-2 bg-cyan-50 rounded-full border border-indigo-500">
              <FaGlobe color="blue" size={30} />
            </span>
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">
                ศิษย์เก่าที่เคยทำงานอยู่ต่างประเทศ
              </label>
              <div className="font-bold text-xl ">
                {loadAllAvg ? (
                  <Loading type={2} />
                ) : (
                  Number(headerData?.countryWork || 0).toLocaleString() ||
                  "ไม่พบข้อมูล"
                )}
              </div>
              <label htmlFor="" className="text-gray-500 text-sm">
                คน
              </label>
            </div>
          </FadeInSection>
        </div>
        {user?.roleId < 3 ||
          (!selectDepartment && (
            <>
              {" "}
              <FadeInSection className="relative bg-white p-5 rounded-lg border  border-gray-300 mx-2 shadow-md mt-6">
                <div className="w-full flex flex-col lg:flex-row gap-2 lg:items-center justify-between">
                  <label className="font-bold ">
                    แผนภูมิแท่งแสดงภาพรวมการมีงานทำของแต่ละ
                    {user?.roleId < 3 || selectFaculty ? "สาขา" : "คณะ"}
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#007dff]"></span>
                    <p className="text-sm">
                      ทำงาน (
                      {chartbarData.reduce(
                        (sum, current) => sum + current.working,
                        0
                      ) + " คน"}
                      )
                    </p>
                    <span className="p-2 ml-2 bg-[#ff6b3e]"></span>
                    <p className="text-sm">
                      ว่างงาน (
                      {chartbarData.reduce(
                        (sum, current) => sum + current.unemployed,
                        0
                      ) + " คน"}
                      )
                    </p>
                  </div>
                </div>

                <ChartSimple
                  data={chartbarData}
                  key1={"working"}
                  color1={"#007dff"}
                  color2={"#ff6b3e"}
                  key2={"unemployed"}
                />
              </FadeInSection>
              <FadeInSection className="p-5 rounded-lg bg-white mx-2 shadow-md mt-6">
                <div className="w-full flex flex-col lg:flex-row gap-2 lg:items-center justify-between">
                  <label className="font-bold">
                    อัตราการมีงานทำของแต่ละ
                    {user?.roleId < 3 || selectFaculty ? "สาขา" : "คณะ"} (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#4ECDC4]"></span>
                    <p>เปอร์เซ็น</p>
                  </div>
                </div>

                <ChartSimple
                  domain={[0, 100]}
                  color1={"#4ECDC4"}
                  data={workRatePercent}
                  key1={"percent"}
                />
              </FadeInSection>
            </>
          ))}

        <FadeInSection className="w-full flex lg:flex-row flex-col gap-4 mt-8">
          {user?.roleId < 3 ||
            (!selectDepartment && (
              <FadeInSection className="bg-white w-full lg:w-1/2 p-5 rounded-lg mx-2 shadow-md">
                <span className="w-full flex items-center justify-between">
                  <label className="font-bold">
                    สัดส่วนเงินเดือนเฉลี่ยของศิษย์เก่า
                    {user?.roleId < 3 || selectFaculty ? "สาขา" : "คณะ"}
                  </label>
                </span>

                <PieChartComponent openToolTip={true} data={pieData} />
              </FadeInSection>
            ))}

          <FadeInSection
            className={`w-full flex ${
              user?.roleId == 2 || selectDepartment
                ? "flex-row lg:w-full"
                : "flex-col lg:w-1/2"
            } gap-3`}
          >
            <FadeInSection className="w-full rounded-lg bg-white p-5 shadow-md">
              <span className="w-full flex items-center justify-between">
                <label htmlFor="" className="font-bold">
                  ศิษย์เก่าที่ไม่พบข้อมูลประวัติการทำงาน
                  {user?.roleId < 3 || selectFaculty
                    ? ""
                    : user?.roleId > 3
                    ? "แต่ละคณะ"
                    : "แต่ละสาขา"}
                </label>
                {noWorkData?.length > 0 && (
                  <button
                    title="ดูรายชื่อ"
                    onClick={() => {
                      setPrevPath("/users/dashboard");
                      router.push("/users/dashboard/list-no-data");
                    }}
                  >
                    <FaEllipsisH
                      color="gray"
                      size={20}
                      className="cursor-pointer"
                    />
                  </button>
                )}
              </span>

              <FadeInSection className="w-full flex flex-col gap-2.5 h-[200px] mt-3 overflow-y-auto pb-3 ">
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
                        className="flex items-center p-2.5 border-b border-gray-200 cursor-pointer gap-2.5 transition-all duration-200 hover:bg-blue-100"
                      >
                        <FadeInSection className="rounded-full bg-blue-500 w-[50px] h-[50px] overflow-hidden">
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
                        </FadeInSection>
                        <FadeInSection className="flex flex-col gap-0.5">
                          <p className="">
                            {a?.prefix}
                            {a?.fname} {a?.lname}
                          </p>
                          <p className="ml-0.5 text-sm ">
                            ปีที่เข้าศึกษา : พ.ศ.{" "}
                            {25 + `${a?.alumni_id}`.substring(0, 2)}
                          </p>
                        </FadeInSection>
                      </button>
                    ))
                  ) : (
                    noWorkData?.map((r, index) => {
                      return (
                        <span
                          key={index}
                          className="w-full flex items-center justify-between"
                        >
                          <FadeInSection className="flex items-center  w-4/5 gap-3">
                            <BriefcaseBusiness size={18} color="red" />
                            <FadeInSection className="flex w-full flex-col gap-1">
                              <p className="text-[0.9rem] ">
                                {user?.roleId < 3 || selectFaculty
                                  ? departmentText(r?.departmentId)
                                  : facultyText(r?.facultyId)}
                              </p>
                            </FadeInSection>
                          </FadeInSection>
                          <p className="">{r?._count?.alumni_id} คน</p>
                        </span>
                      );
                    })
                  )
                ) : (
                  <FadeInSection className="w-full flex flex-col mt-10 items-center justify-center gap-2">
                    <CheckCircle size={80} color="#87D068" />
                    <p className="text-sm">ศิษย์เก่ากรอกข้อมูลทุกคนแล้ว</p>
                  </FadeInSection>
                )}
              </FadeInSection>
            </FadeInSection>
            <FadeInSection className="bg-white w-full p-5 rounded-lg border border-gray-300 shadow-md">
              <span className="w-full flex items-center justify-between">
                <label className="font-bold ">
                  สัดส่วนศิษย์เก่าที่ทำงานอยู่ในและต่างประเทศ
                </label>
              </span>

              {pieWorkRate
                .map((p) => p.value)
                .reduce((total, p) => (total += p), 0) > 0 ? (
                <WorkPlaceRatePieChartComponent
                  data={pieWorkRate}
                  openToolTip={true}
                />
              ) : (
                <div className="w-full h-full flex flex-col text-sm text-gray-500 items-center justify-center gap-1">
                  <FaFolderOpen size={30} />
                  <p>ไม่พบข้อมูล</p>
                </div>
              )}
            </FadeInSection>
          </FadeInSection>
        </FadeInSection>
        <FadeInSection className="p-5 rounded-lg bg-white mx-2 shadow-md mt-6">
          <LineChartComponent
            data={mostLiverPercent?.result?.map((d) => ({
              company_place: d?.company_place,
              value: d?._count?.alumniId,
            }))}
          />
        </FadeInSection>

        <FadeInSection className="bg-white mt-5 w-ful p-5 rounded-lg border border-gray-300 mx-2 shadow-md">
          <FadeInSection className="w-full flex flex-col gap-3.5 mt-3 overflow-y-auto">
            <AlumniColumnChart rawData={otherCountryList} />
          </FadeInSection>
        </FadeInSection>

        <FadeInSection className="mt-8 mx-2 p-5 bg-white rounded-lg border border-gray-200 md:col-span-2 shadow-sm flex-col flex">
          <div className="w-full flex items-center justify-between">
            <label className="font-bold ">อาชีพยอดนิยมของศิษย์เก่า (คน)</label>
            <span className="flex items-center gap-2">
              <div className="p-2.5 bg-[#FFBB28]"></div>
              <p className="text-sm">จำนวนศิษย์เก่า(คน)</p>
            </span>
          </div>
          {populationJob.length > 0 ? (
            <ChartSimple
              color1={"#FFBB28"}
              key1={"count"}
              data={populationJob}
            />
          ) : (
            <div className="w-full flex items-center justify-center py-36">
              <NoData bg={2} />
            </div>
          )}
        </FadeInSection>
      </div>
    </div>
  );
};
export default Dashboard;
