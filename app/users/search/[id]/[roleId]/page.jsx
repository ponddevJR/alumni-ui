"use client";
import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";
import { departmentText, facultyText } from "@/components/faculty-p";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import { formatPhoneNumber } from "@/libs/validate";
import axios from "axios";
import dayjs from "@/libs/dayjs";
import {
  ArrowLeft,
  Award,
  Bath,
  Book,
  BriefcaseBusiness,
  Calendar,
  Clock,
  Coins,
  Eye,
  Facebook,
  GraduationCap,
  Mail,
  Map,
  MapPinHouse,
  MessageCircle,
  Phone,
  PhoneCall,
  Receipt,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useGetSession from "@/hook/useGetSeesion";
import SendEmail from "@/components/sendEmail";
import { useAppContext } from "@/context/app.context";

const UserDetail = () => {
  const { user } = useGetSession();
  const { id, roleId } = useParams();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [showSendEmail, setSendEmail] = useState(false);
  const { prevPath } = useAppContext();

  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/alumni/user/${id}/${roleId}`,
        { withCredentials: true }
      );
      if (res?.status === 200) {
        setUserData(res?.data);
        // console.log("🚀 ~ fetchData ~ res?.data:", res?.data)
      }
    } catch (error) {
      console.error(error);
      alerts.err();
      router.push("/users/search");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const canview = (field, data) => {
    const loginUserId = user?.id;
    if (
      loginUserId ===
        (roleId < 2 ? userData?.alumni_id : userData?.professor_id) ||
      (user?.roleId >= 3 && user?.facultyId === userData?.facultyId) ||
      (user?.roleId === 2 && user?.departmentId === userData?.departmentId) ||
      user?.roleId > 3
    ) {
      return data || "ไม่ระบุ";
    }

    if (!field) {
      return (
        <Link
          href="/"
          className="text-[0.9rem] hover:text-blue-500 hover:underline"
        >
          ผู้ใช้งานปิดการมองเห็นข้อมูลส่วนนี้
        </Link>
      );
    }

    return data || "ไม่ระบุ";
  };

  const canviewProfile = () => {
    const loginUserId = user?.id;
    if (
      loginUserId ===
        (roleId < 2 ? userData?.alumni_id : userData?.professor_id) ||
      (user?.roleId >= 3 && user?.facultyId === userData?.facultyId) ||
      (user?.roleId === 2 && user?.departmentId === userData?.departmentId) ||
      user?.roleId > 3
    ) {
      return userData?.profile
        ? apiConfig.imgAPI + userData?.profile
        : NO_PROFILE_IMG;
    }

    if (!userData?.user_privacy?.seeProfile) {
      return NO_PROFILE_IMG;
    }

    return userData?.profile
      ? apiConfig.imgAPI + userData?.profile
      : NO_PROFILE_IMG;
  };

  const canviewWorkExprerience = () => {
    const loginUserId = user?.id;
    if (
      loginUserId ===
        (roleId < 2 ? userData?.alumni_id : userData?.professor_id) ||
      (user?.roleId >= 3 && user?.facultyId === userData?.facultyId) ||
      (user?.roleId === 2 && user?.departmentId === userData?.departmentId) ||
      user?.roleId > 3
    ) {
      return true;
    }

    if (!userData?.user_privacy?.seeWorkExprerience) {
      return false;
    }

    return true;
  };

  const canViewSalary = () => {
    const loginUserId = user?.id;
    if (
      loginUserId ===
        (roleId < 2 ? userData?.alumni_id : userData?.professor_id) ||
      (user?.roleId >= 3 && user?.facultyId === userData?.facultyId) ||
      (user?.roleId === 2 && user?.departmentId === userData?.departmentId) ||
      user?.roleId > 3
    ) {
      return true;
    }

    if (!userData?.user_privacy?.seeSalary) {
      return false;
    }

    return true;
  };

  if (loading)
    return (
      <div className="w-full items-center justify-center h-full flex flex-col gap-2">
        <Loading type={2} />
        <p>กำลังโหลด...</p>
      </div>
    );

  return (
    <>
      <div className="bg-gradient-to-br from-sky-50 via-green-50 to-blue-200 w-full flex flex-col p-8">
        <button
          onClick={() => {
            router.push(prevPath || "/users/search");
          }}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="cursor-pointer" />
          <p>ย้อนกลับ</p>
        </button>

        <div
          className={`bg-white relative mt-5 w-full flex lg:flex-row flex-col gap-8 p-5 px-8 rounded-lg shadow-sm border border-gray-200 mb-3`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="overflow-hidden w-[120px] h-[120px] border-4 border-white shadow-md rounded-full bg-gray-200">
              <img
                alt="profile"
                className="w-full h-full object-cover"
                width={50}
                height={50}
                src={canviewProfile()}
              />
            </div>
            {roleId > 1 && (
              <span className="flex items-center gap-1 mt-2 p-1 rounded-full px-3 text-white bg-blue-500">
                {userData?.univercity_position !== "อาจารย์" && (
                  <Award size={18} color="yellow" />
                )}

                {userData?.univercity_position}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold text-xl lg:text-2xl">
              {roleId < 2 ? userData?.prefix : userData?.academic_rank}
              {userData?.fname} {userData?.lname}
            </label>

            {roleId < 2 ? (
              <>
                <p className="pb-2 my-2 border-b border-gray-200 text-sm text-gray-700">
                  ข้อมูลทั่วไป
                </p>
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3">
                  <span className="flex items-center gap-2">
                    <User size={18} color="blue" />
                    <p>: {userData?.alumni_id}</p>
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={18} color="blue" />
                    <p>
                      : ปีการศึกษา พ.ศ. {userData?.year_start} - พ.ศ.{" "}
                      {userData?.year_end}
                    </p>
                  </span>
                  <span className="flex items-center gap-2">
                    <GraduationCap size={18} color="blue" />
                    <p>
                      :{" "}
                      {facultyText(userData?.facultyId || id?.substring(3, 5))}
                    </p>
                  </span>
                  <span className="flex items-center gap-2">
                    <Book size={18} color="blue" />
                    <p>
                      :{" "}
                      {departmentText(
                        userData?.departmentId || id?.substring(4, 8)
                      )}
                    </p>
                  </span>
                  <p className="col-span-2 pb-2 mt-2 border-b border-gray-200 text-sm text-gray-700">
                    สถานะปัจจุบัน
                  </p>
                  <span className="col-span-2 flex items-end gap-2">
                    <Clock size={15} className="mb-0.5" color="blue" />
                    <p className="text-sm">
                      : อัปเดตล่าสุด{" "}
                      {dayjs(userData?.updatedAt).format(`D MMMM BBBB`)}
                    </p>
                  </span>
                  {!canviewWorkExprerience() ? (
                    <Link
                      href="/"
                      className="text-[0.9rem] hover:text-blue-500 hover:underline"
                    >
                      ผู้ใช้งานปิดการมองเห็นข้อมูลส่วนนี้
                    </Link>
                  ) : userData?.work_expreriences?.find(
                      (w) => w.continued_study && w?.isCurrent
                    ) ? (
                    <span className="flex items-center p-2.5 rounded-md bg-gradient-to-r from-green-600 to-lime-500 gap-2.5">
                      <div className="p-2 rounded-full bg-white">
                        <GraduationCap size={18} color="green" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-50">
                          กำลังศึกษาต่อในระดับ{" "}
                          {
                            userData?.work_expreriences?.find(
                              (w) => w.continued_study && w?.isCurrent
                            )?.edu_level
                          }
                        </p>
                        <p className="text-white">
                          {
                            userData?.work_expreriences?.find(
                              (w) => w.continued_study && w?.isCurrent
                            )?.edu_dep
                          }{" "}
                          ,{" "}
                          {
                            userData?.work_expreriences?.find(
                              (w) => w.continued_study && w?.isCurrent
                            )?.edu_university
                          }
                        </p>
                      </div>
                    </span>
                  ) : userData?.work_expreriences?.find((w) => w?.isCurrent) ? (
                    <span className="flex items-center p-2.5 rounded-md bg-gradient-to-r from-blue-600 to-teal-500 gap-2.5">
                      <div className="p-2 rounded-full bg-white">
                        <BriefcaseBusiness size={18} color="blue" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-50">
                          ทำงานอยู่ที่{" "}
                          {
                            userData?.work_expreriences?.find(
                              (w) => w?.isCurrent
                            )?.company_name
                          }
                        </p>
                        <p className="text-white">
                          {
                            userData?.work_expreriences?.find(
                              (w) => w?.isCurrent
                            )?.job_position
                          }{" "}
                          ,{" "}
                          {
                            userData?.work_expreriences?.find(
                              (w) => w?.isCurrent
                            )?.company_place
                          }
                        </p>
                      </div>
                    </span>
                  ) : userData?.work_expreriences?.length < 1 ? (
                    <p className="text-red-500">
                      ระบบไม่พบข้อมูลการทำงาน/การศึกษาต่อ
                    </p>
                  ) : (
                    <span className="flex items-center p-2.5 rounded-md bg-gradient-to-r from-rose-600 to-red-500 gap-2.5">
                      <div className="p-2 rounded-full bg-white">
                        <BriefcaseBusiness size={18} color="red" />
                      </div>
                      <p className="text-white">ปัจจุบันว่างงาน</p>
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="flex items-start gap-2.5 mt-2 p-3 px-5 rounded-lg border border-gray-300 shadow-sm">
                  <GraduationCap size={20} color="blue" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-gray-600 text-sm">สังกัด</p>
                    <p className="font-bold">
                      {facultyText(userData?.facultyId)}
                    </p>
                    <p className="">{departmentText(userData?.departmentId)}</p>
                  </div>
                </span>

                <div className="w-full flex lg:flex-row gap-5 flex-col my-3">
                  <div className="flex flex-col">
                    <p className="mt-8 pb-3 border-b border-gray-300">
                      ช่องทางติดต่อ
                    </p>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 gap-y-2 flex-wrap items-center">
                      <span className=" flex items-start gap-2.5 mt-3 p-4 px-5 rounded-lg border border-gray-300 shadow-sm">
                        <Mail size={20} color="red" />
                        <div className="flex flex-col gap-0.5">
                          <p className="text-gray-600 text-sm">อีเมล</p>
                          {userData?.email1 && (
                            <p className="">
                              {canview(
                                userData?.user_privacy?.seeEmail,
                                userData?.email1
                              )}
                            </p>
                          )}
                          {userData?.email2 && (
                            <p className="">
                              {canview(
                                userData?.user_privacy?.seeEmail,
                                userData?.email2
                              )}
                            </p>
                          )}
                        </div>
                      </span>
                      <span className=" flex items-start gap-2.5 mt-3 p-4 px-5 rounded-lg border border-gray-300 shadow-sm">
                        <PhoneCall size={20} color="green" />
                        <div className="flex flex-col gap-0.5">
                          <p className="text-gray-600 text-sm">เบอร์โทรศัพท์</p>
                          {userData?.phone1 ? (
                            <p className="">
                              {canview(
                                userData?.user_privacy?.seePhone,
                                formatPhoneNumber(userData?.phone1)
                              )}
                            </p>
                          ) : (
                            "ไม่ระบุ"
                          )}
                          {userData?.phone2 && (
                            <p className="">
                              {canview(
                                userData?.user_privacy?.seePhone,
                                formatPhoneNumber(userData?.phone2)
                              )}
                            </p>
                          )}
                        </div>
                      </span>
                      <span className="lg:col-span-2 flex items-start gap-2.5 mt-3 p-4 px-5 rounded-lg border border-gray-300 shadow-sm">
                        <MapPinHouse size={20} color="orange" />
                        <div className="flex flex-col gap-0.5">
                          <p className="text-gray-600 text-sm">ที่อยู่</p>
                          {userData?.address ? (
                            <p className="">
                              {canview(
                                userData?.user_privacy?.seeAddress,
                                `${userData?.address || ""} ${
                                  userData?.tambon
                                    ? "ตำบล" + userData?.tambon
                                    : ""
                                } ${
                                  userData?.amphure
                                    ? "อำเภอ" + userData?.amphure
                                    : ""
                                } ${
                                  userData?.province
                                    ? "จังหวัด" + userData?.province
                                    : ""
                                } ${userData?.zipcode || ""}`
                              ) || "ไม่ระบุ"}
                            </p>
                          ) : (
                            "ไม่ระบุ"
                          )}
                        </div>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:w-[350px] border-l border-gray-200  pl-5">
                    <p className="mt-5 pb-3 border-b border-gray-300 text-blue-600">
                      โซเชียลมีเดีย
                    </p>
                    <span className=" flex items-start gap-2.5 mt-3 p-3 px-5 rounded-lg border border-gray-300 shadow-sm">
                      <Facebook size={20} color="blue" />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-gray-600 text-sm">เฟสบุ๊ค</p>
                        {userData?.facebook ? (
                          <p className="text-sm">
                            {canview(
                              userData?.user_privacy?.seeFacebook,
                              userData?.facebook
                            )}
                          </p>
                        ) : (
                          <p className="text-sm">ไม่ระบุ</p>
                        )}
                      </div>
                    </span>
                  </div>
                </div>
              </>
            )}

            {id !== user?.id ? (
              <button
                onClick={() => setSendEmail(true)}
                className={`${
                  roleId < 2 && "absolute lg:top-4 right-4 top-2"
                } my-3.5 hover:bg-blue-600 hover:shadow-lg justify-center p-3 rounded-lg shadow-sm text-white flex items-center bg-blue-500 gap-2`}
              >
                <MessageCircle color="white" size={18} />
                <p>ส่งข้อความ</p>
              </button>
            ) : (
              <Link
                href="/users/profile"
                className={`${
                  roleId < 2 && "absolute lg:top-4 right-4 top-2"
                } my-3.5 hover:bg-blue-600 hover:shadow-lg justify-center p-3 rounded-lg shadow-sm text-white flex items-center bg-blue-500 gap-2`}
              >
                <Eye color="white" size={18} />
                <p>ดูโปรไฟล์</p>
              </Link>
            )}
          </div>
        </div>
        {roleId < 2 && (
          <>
            <div className="bg-white w-full p-5 rounded-lg shadow-md border border-gray-200">
              <p className="text-lg lg:text-lg font-bold pb-3 mb-5 border-b border-gray-200">
                ช่องทางติดต่อ
              </p>
              <div className="w-full flex items-start flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-1/2 flex flex-col lg:grid lg:grid-cols-2 gap-4 pr-5 border-r border-gray-300">
                  {userData?.email1 && (
                    <span className="flex items-center gap-3 p-2 py-3 border rounded-md border-gray-200 shadow-sm">
                      <Mail size={17} color="red" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">อีเมล</p>
                        <p className="text-sm">
                          {canview(
                            userData?.user_privacy?.seeEmail,
                            userData?.email1
                          )}
                        </p>
                      </div>
                    </span>
                  )}

                  {userData?.email2 && (
                    <span className="flex items-center gap-3 p-2 py-3 border rounded-md border-gray-200 shadow-sm">
                      <Mail size={17} color="red" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">อีเมล</p>
                        <p className="text-sm">
                          {canview(
                            userData?.user_privacy?.seeEmail,
                            userData?.email2
                          )}
                        </p>
                      </div>
                    </span>
                  )}
                  {userData?.phone1 && (
                    <span className="flex items-center gap-3 p-2 py-3 border rounded-md border-gray-200 shadow-sm">
                      <Phone size={17} color="green" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {canview(
                            userData?.user_privacy?.seePhone,
                            formatPhoneNumber(userData?.phone1)
                          )}
                        </p>
                      </div>
                    </span>
                  )}

                  {userData?.phone2 && (
                    <span className="flex items-center gap-3 p-2 py-3 border rounded-md border-gray-200 shadow-sm">
                      <Phone size={17} color="green" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {canview(
                            userData?.user_privacy?.seePhone,
                            formatPhoneNumber(userData?.phone2)
                          )}
                        </p>
                      </div>
                    </span>
                  )}
                  <span className="col-span-2 w-full flex items-center gap-4 p-2 py-3 border rounded-md border-gray-200 shadow-sm">
                    <MapPinHouse size={17} color="orange" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-600">ที่อยู่</p>
                      <p className="w-full text-sm">
                        {canview(
                          userData?.user_privacy?.seeAddress,
                          `${userData?.address || ""} ${
                            userData?.tambon ? "ตำบล" + userData?.tambon : ""
                          } ${
                            userData?.amphure ? "อำเภอ" + userData?.amphure : ""
                          } ${
                            userData?.province
                              ? "จังหวัด" + userData?.province
                              : ""
                          } ${userData?.zipcode || ""}`
                        )}
                      </p>
                    </div>
                  </span>
                </div>
                <div className="flex flex-col w-full lg:w-1/2 ">
                  <p className="pb-2 border-b border-blue-300 text-blue-400 text-sm">
                    โซเชียลมีเดีย
                  </p>
                  <span className="mt-3 flex items-center gap-4 p-2 py-3 border rounded-md border-gray-200 shadow-sm">
                    <Facebook size={18} color="blue" />
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-600 text-sm">เฟสบุ๊ค</p>
                      <p className="text-sm">
                        {canview(
                          userData?.user_privacy?.seeFacebook,
                          userData?.facebook
                        )}
                      </p>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
              <div
                className={`bg-white col-span-3 lg:col-span-2 p-5 rounded-lg border border-gray-200 shadow-md flex flex-col`}
              >
                <p className="text-xl font-bold pb-3 border-b border-gray-200 ">
                  ข้อมูลการทำงาน/การศึกษาต่อ
                </p>

                <div className=" w-full flex flex-col h-[400px] overflow-auto mt-5">
                  {!canviewWorkExprerience() ? (
                    <Link
                      href="/"
                      className="text-[0.9rem] hover:text-blue-500 hover:underline"
                    >
                      ผู้ใช้งานปิดการมองเห็นข้อมูลส่วนนี้
                    </Link>
                  ) : userData?.work_expreriences?.length > 0 ? (
                    userData?.work_expreriences?.map((w, index) =>
                      w?.continued_study ? (
                        <div
                          key={index}
                          className="cursor-pointer text-sm lg:text-md hover:bg-green-50 p-2 transition-all duration-300 relative px-5 border-l-4 border-green-600 w-full flex flex-col my-2"
                        >
                          {w?.isCurrent && (
                            <span className="absolute top-2 right-10 p-1 px-2.5 rounded-full text-xs lg:text-sm text-white bg-green-500">
                              กำลังศึกษาอยู่ในปัจจุบัน
                            </span>
                          )}
                          <GraduationCap color="green" size={20} />
                          <p className="text-sm lg:text-lg font-bold mt-2">
                            {w?.edu_level} ,{w?.edu_dep}
                          </p>
                          <p className="text-green-600">
                            {w?.edu_university + " "},{" " + w?.company_place}
                          </p>
                          <p className="text-gray-600">
                            {"พ.ศ. " + w?.year_start} -{" "}
                            {w?.isCurrent ? "ปัจจุบัน" : "พ.ศ. " + w?.year_end}
                          </p>
                          <p className="mt-2 text-gray-600">
                            {w?.edu_performance}
                          </p>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="cursor-pointer text-sm lg:text-md hover:bg-blue-50 transition-all duration-300 relative p-2 px-5 border-l-4 border-blue-600 w-full flex flex-col my-4"
                        >
                          {w?.isCurrent && (
                            <span className="absolute top-2 right-10 p-1 px-2.5 rounded-full text-xs lg:text-sm text-white bg-blue-500">
                              ปัจจุบัน
                            </span>
                          )}
                          <BriefcaseBusiness color="blue" size={18} />
                          <p className="text-sm lg:text-lg font-bold mt-2">
                            {w?.job_position}
                          </p>
                          <p className="text-blue-600">{w?.company_name}</p>
                          <span className="flex items-center gap-2 my-0.5">
                            <Map size={18} color="gray" />
                            <p>{w?.company_place}</p>
                          </span>
                          <p className="text-gray-600">
                            {dayjs(w?.start_date).format(`D MMMM BBBB`)} -{" "}
                            {w?.isCurrent
                              ? "ปัจจุบัน"
                              : dayjs(w?.start_date).format(`D MMMM BBBB`)}
                          </p>
                          <p className="text-gray-600 mt-1.5">
                            {w?.job_detail}
                          </p>
                          {w?.remark && (
                            <p className="mt-2 text-sm bg-blue-50 p-2">
                              หมายเหตุ : {w?.remark}
                            </p>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p>ไม่พบประวัติการทำงานของศิษย์เก่า</p>
                  )}
                </div>
              </div>
              <div className="bg-white  col-span-3 lg:col-span-1 p-5 rounded-lg border border-gray-200 shadow-md flex flex-col gap-3">
                <p className="text-xl font-bold pb-3 border-b border-gray-200 ">
                  สรุปข้อมูลการทำงานของศิษย์เก่า
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {!canViewSalary() ? (
                    <Link
                      href="/"
                      className="text-[0.9rem] hover:text-blue-500 hover:underline"
                    >
                      ผู้ใช้งานปิดการมองเห็นข้อมูลส่วนนี้
                    </Link>
                  ) : (
                    <>
                      <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-blue-500 to-sky-400">
                        <div className="p-2 rounded-full bg-white">
                          <BriefcaseBusiness size={18} color="blue" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-50">จำนวนงานที่ทำ</p>
                          <p className="text-white">
                            {userData?.workTimes} งาน
                          </p>
                        </div>
                      </span>
                      <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-green-500 to-lime-400">
                        <div className="p-2 rounded-full bg-white">
                          <Coins size={18} color="green" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-50">
                            เงินเดือนเฉลี่ย
                          </p>
                          <p className="text-white">
                            {userData?.avgSalary?.toLocaleString() || 0} บาท
                          </p>
                        </div>
                      </span>

                      <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-orange-500 to-yellow-400">
                        <div className="p-2 rounded-full bg-white">
                          <TrendingUp size={18} color="orange" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-50">
                            เงินเดือนสูงที่สุด
                          </p>
                          <p className="text-white">
                            {userData?.maxSalary?.toLocaleString() || 0} บาท
                          </p>
                        </div>
                      </span>
                      <span className="flex items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-purple-500 to-pink-400">
                        <div className="p-2 rounded-full bg-white">
                          <TrendingDown size={18} color="purple" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-50">
                            เงินเดือนน้อยที่สุด
                          </p>
                          <p className="text-white">
                            {userData?.minSalary?.toLocaleString() || 0} บาท
                          </p>
                        </div>
                      </span>
                      <span className="flex lg:col-span-2 items-center gap-2 p-2.5 rounded-md shadow-sm bg-gradient-to-r from-gray-700 to-gray-500">
                        <div className="p-2 rounded-full bg-white">
                          <Receipt size={18} color="black" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-50">
                            เงินเดือนที่ได้รับในปัจจุบัน
                          </p>
                          <p className="text-white">
                            {userData?.currentSalary?.toLocaleString() || 0} บาท
                          </p>
                        </div>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* sendEmail */}
      <SendEmail
        show={showSendEmail}
        onclose={() => setSendEmail(false)}
        type={roleId}
        sendToData={userData}
      />
    </>
  );
};
export default UserDetail;
