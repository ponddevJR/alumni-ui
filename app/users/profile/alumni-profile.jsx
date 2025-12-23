"use client";
import {
  BriefcaseBusiness,
  Check,
  Clock,
  Facebook,
  GraduationCap,
  Mail,
  PhoneCallIcon,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LiveContact from "./live-contact";
import Contact from "./contact";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Loading from "@/components/loading";
import { formatPhoneNumber } from "@/libs/validate";
import { departments, faculties } from "@/data/faculty";
import { departmentText, facultyText } from "@/components/faculty-p";
import dayjs from "@/libs/dayjs";

export const NO_PROFILE_IMG =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const AlumniProfile = () => {
  const { user } = useGetSession();

  const [showContactType, setShowContactType] = useState(0);
  const [roleId, setRoleId] = useState(1);
  const [userData, setUserData] = useState();
  const [fileImage, setFileImage] = useState();
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(NO_PROFILE_IMG);
  const [showImgMenu, setShowImgMenu] = useState(false);

  const handleProfileImage = (e) => {
    setShowImgMenu(true);
    const file = e.target.files[0];
    if (!file) {
      return setShowImgMenu(false);
    }
    setProfileImage(URL.createObjectURL(file));
    setFileImage(file);
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/alumni/profile", {
        withCredentials: true,
      });
      if (res?.status === 200) {
        setUserData(res?.data?.alumni);
        setProfileImage(
          res?.data?.alumni?.profile
            ? apiConfig.imgAPI + res?.data?.alumni?.profile
            : NO_PROFILE_IMG
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const [changingImg, setChangingImg] = useState(false);
  const uploadImage = async () => {
    if (!fileImage) return;
    setChangingImg(true);
    try {
      const formData = new FormData();
      formData.append("file", fileImage);

      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/upload-profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }

      if (res?.status === 200) {
        alerts.success("บันทึกรูปภาพแล้ว");
        fetchUserData();
        setShowImgMenu(false);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setChangingImg(false);
    }
  };

  const deleteProfile = async () => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบรูปภาพ",
      "ต้องการลบรูปภาพหรือไม่?",
      "ลบ"
    );
    if (!isConfirmed) return;

    setChangingImg(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + "/alumni/delete-profile",
        { withCredentials: true }
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res?.status === 200) {
        alerts.success("ลบรูปภาพแล้ว");
        fetchUserData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setChangingImg(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    setRoleId(user?.roleId);
  }, [user]);

  if (loading)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <Loading type={2} />
        <p className="">กำลังโหลด...</p>
      </div>
    );

  return (
    <div className="w-full flex flex-col p-5 mb-5 bg-white">
      <div
        className={`relative w-full flex flex-col gap-7 lg:flex-row lg:items-start items-center p-5 px-8 rounded-lg bg-gradient-to-l ${
          roleId > 1
            ? "from-sky-100 via-yellow-100 bg-sky-50"
            : "from-blue-200 to-sky-100"
        } border border-blue-200`}
      >
        {changingImg && (
          <span className="absolute top-2 left-2">
            <Loading type={2} />
          </span>
        )}
        <input
          disabled={changingImg || loading}
          onChange={handleProfileImage}
          type="file"
          id="profile-img"
          accept="image"
          className="hidden"
        />
        <label
          title="เปลี่ยนรูป"
          htmlFor="profile-img"
          className="cursor-pointer"
        >
          {" "}
          <div className="relative flex flex-col items-center">
            <div className="overflow-hidden w-[125px] h-[125px] bg-white rounded-full border-4 border-white shadow-md">
              <img
                alt="profile"
                width={125}
                height={125}
                src={profileImage}
                className="w-full h-full object-cover"
              />
            </div>

            {showImgMenu && (
              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowImgMenu(false);
                    setProfileImage(userData?.profile || NO_PROFILE_IMG);
                  }}
                  className="p-1.5 rounded-md bg-white shadow-sm flex items-center gap-1"
                >
                  <X size={18} color="red" />
                  <p className="text-sm">ยกเลิก</p>
                </button>
                <button
                  disabled={changingImg}
                  onClick={uploadImage}
                  className="p-1.5 rounded-md bg-white shadow-sm flex items-center gap-1"
                >
                  <Check size={18} color="green" />
                  <p className="text-sm">บันทึก</p>
                </button>
              </div>
            )}

            {userData?.profile && (
              <button
                disabled={changingImg}
                title="ล้างรูปภาพ"
                className="absolute top-20 right-[-0.25rem]"
                onClick={deleteProfile}
              >
                <Trash2 color="black" />
              </button>
            )}
          </div>
          {/* ลบรูป */}
        </label>

        <div className="flex flex-col items-center lg:items-start gap-0.5">
          <h1 className="text-xl lg:text-2xl font-bold">
            {roleId > 1 ? userData?.academic_rank : userData?.prefix}
            {userData?.fname} {userData?.lname}
          </h1>
          {roleId > 1 && (
            <p className="my-1 p-1 px-2.5 rounded-full text-sm text-white bg-blue-600">
              {userData?.univercity_position}
            </p>
          )}
          {/* <p className="text-gray-700 text-sm mt-1 w-full">ข้อมูล</p> */}
          <p className="text-lg text-gray-600">
            {roleId > 1 ? "รหัสประจำตัว" : "รหัสนักศึกษา"} :{" "}
            {userData?.alumni_id || userData?.professor_id}
          </p>

          {roleId < 2 && (
            <span className="flex lg:flex-row flex-col lg:gap-1 items-center lg:items-start">
              <p className="text-lg text-gray-600">
                {faculties.find((f) => f.id == userData?.facultyId)?.name}
              </p>
              <p className="text-lg text-gray-600 lg:inline hidden">-</p>
              <p className="text-lg text-gray-600">
                สาขา
                {departments.find((d) => d.id == userData?.departmentId)?.name}
              </p>
            </span>
          )}

          {user?.roleId < 2 && (
            <>
              <p className="text-center lg:text-start text-gray-700 text-sm mt-2 w-full">
                สถานะปัจจุบัน (หลังจากเรียนจบปริญญาตรี)
              </p>
              <span className="flex items-end gap-2">
                <Clock size={15} className="mb-0.5" />
                <p className="text-sm">
                  :อัปเดตล่าสุด{" "}
                  {dayjs(userData?.updatedAt).format(`D MMMM BBBB`)}
                </p>
              </span>
            </>
          )}
          {roleId < 2 ? (
            userData?.work_expreriences?.find(
              (w) => w.continued_study && w.isCurrent
            ) ? (
              <>
                <span className="mt-1.5 flex items-center p-2.5 rounded-md bg-gradient-to-r from-green-600 to-lime-500 gap-2.5">
                  <div className="p-2 rounded-full bg-white">
                    <GraduationCap size={18} color="green" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-50">
                      กำลังศึกษาต่อในระดับ
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
              </>
            ) : userData?.work_expreriences?.find((w) => w?.isCurrent) ? (
              <span className="mt-1 flex items-center p-2.5 rounded-md bg-gradient-to-r from-blue-600 to-teal-500 gap-2.5">
                <div className="p-2 rounded-full bg-white">
                  <BriefcaseBusiness size={18} color="blue" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-50">
                    ทำงานอยู่ที่{" "}
                    {
                      userData?.work_expreriences?.find((w) => w?.isCurrent)
                        ?.company_name
                    }
                  </p>
                  <p className="text-white">
                    {
                      userData?.work_expreriences?.find((w) => w?.isCurrent)
                        ?.job_position
                    }{" "}
                    ,{" "}
                    {
                      userData?.work_expreriences?.find((w) => w?.isCurrent)
                        ?.company_place
                    }
                  </p>
                </div>
              </span>
            ) : userData?.work_expreriences?.length < 1 ? (
              <Link
                href="/users/work-history"
                className="mt-1 text-red-500 p-2 rounded-md bg-white shadow-md"
              >
                ระบบไม่พบข้อมูลการทำงาน/การศึกษาต่อ
              </Link>
            ) : (
              <span className="mt-1 flex items-center p-2.5 rounded-md bg-gradient-to-r from-rose-600 to-red-500 gap-2.5">
                <div className="p-2 rounded-full bg-white">
                  <BriefcaseBusiness size={18} color="red" />
                </div>
                <p className="text-white">ปัจจุบันว่างงาน</p>
              </span>
            )
          ) : roleId > 1 ? (
            <span className="relative p-3 mt-2 w-full rounded-md border bg-white border-gray-100 flex items-start gap-4 shadow-sm">
              <GraduationCap size={20} color="blue" />
              <div className="relative flex flex-col gap-0.5">
                <p className="text-sm text-gray-600">สังกัด</p>
                <p className="text-[0.9rem] font-bold">
                  {facultyText(userData?.facultyId)}
                </p>
                <p className="text-[0.9rem]">
                  {departmentText(userData?.departmentId)}
                </p>
              </div>
            </span>
          ) : (
            <></>
          )}

          <span className="flex mt-3 items-center flex-wrap gap-2">
            <label
              htmlFor=""
              className="shadow-sm flex items-center rounded-md gap-2 p-1 px-2 bg-white"
            >
              <PhoneCallIcon size={18} color="green" />
              <p className="text-[0.9rem]">
                {formatPhoneNumber(userData?.phone1 || "") ||
                  formatPhoneNumber(userData?.phone2 || "") ||
                  "-"}
              </p>
            </label>
            <label
              htmlFor=""
              className="shadow-sm flex items-center rounded-md gap-2 p-1 px-2 bg-white"
            >
              <Mail size={18} color="red" />
              <p className="text-[0.9rem]">
                {userData?.email1
                  ? userData?.email1
                  : userData?.email2 || " -"}
              </p>
            </label>
            <label
              htmlFor=""
              className="shadow-sm flex items-center rounded-md gap-2 p-1 px-2 bg-white"
            >
              <Facebook size={18} color="blue" />
              <p className="text-[0.9rem]">{userData?.facebook || "-"}</p>
            </label>
          </span>
        </div>
      </div>

      <div className="w-full flex p-1 gap-1 bg-gray-300 mt-5 border border-gray-200 shadow-sm">
        <button
          onClick={() => setShowContactType(0)}
          className={`flex-1 text-center p-2 ${
            showContactType < 1 ? "bg-blue-500 text-white" : "bg-white"
          } `}
        >
          ช่องทางติดต่อ
        </button>
        <button
          onClick={() => setShowContactType(1)}
          className={`flex-1 text-center p-2 ${
            showContactType > 0 ? "bg-blue-500 text-white" : "bg-white"
          } `}
        >
          ที่อยู่ที่ติดต่อได้
        </button>
      </div>

      <div className="w-full mt-5 border border-gray-300 p-6 rounded-md shadow-md">
        {showContactType > 0 ? (
          <LiveContact />
        ) : (
          <Contact reload={fetchUserData} />
        )}
      </div>
    </div>
  );
};
export default AlumniProfile;
