"use client";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Eye, EyeOff, Save, Shield, ShieldUser } from "lucide-react";
import { useEffect, useState } from "react";
import Switch from "react-switch";

const Privacy = () => {
  const { user } = useGetSession();

  const [seeProfile, setSeeProfile] = useState(false);
  const [seeEmail, setSeeEmail] = useState(false);
  const [seePhone, setSeePhone] = useState(false);
  const [seeFacebook, setSeeFacebook] = useState(false);
  const [seeAddress, setSeeAddress] = useState(false);
  const [seeWorkExprerience, setSeeWorkExperince] = useState(false);

  const [allowedAlumniSendEmail, setAllowedAlumniText] = useState(false);
  const [allowedProfessorSendEmail, setAllowedProfessorText] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchPrivacy = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/alumni/privacy", {
        withCredentials: true,
      });

      setSeeProfile(res?.data?.seeProfile);
      setSeeEmail(res?.data.seeEmail);
      setSeePhone(res?.data?.seePhone);
      setSeeFacebook(res?.data?.seeFacebook);
      setSeeAddress(res?.data?.seeAddress);
      setSeeWorkExperince(res?.data?.seeWorkExprerience);

      setAllowedAlumniText(res?.data?.allowedAlumniSendEmail);
      setAllowedProfessorText(res?.data?.allowedProfessorSendEmail);
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPrivacy();
  }, [user]);

  //   loading while save
  const [saving, setSaving] = useState(false);
  const save = async () => {
    const { isConfirmed } = await alerts.confirmDialog(
      "บันทึกการเปลี่ยนแปลง",
      "ต้องการบันทึกการเปลี่ยนแปลงหรือไม่?"
    );
    if (!isConfirmed) return;

    setSaving(true);
    try {
      const payload = {
        seeProfile,
        seeEmail,
        seePhone,
        seeFacebook,
        seeAddress,
        seeWorkExprerience,
        allowedAlumniSendEmail,
        allowedProfessorSendEmail,
      };

      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/privacy-update",
        payload,
        { withCredentials: true }
      );
      if (res?.status === 200) {
        await alerts.success();
        fetchPrivacy();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-2">
        <Loading />
        <p>กำลังโหลด...</p>
      </div>
    );

  return (
    <div className="w-full p-5 flex flex-col items-center gap-5 bg-gradient-to-r from-sky-50 to-gray-50">
      <div className="lg:w-1/2 bg-white w-full flex flex-col gap-2 p-5 rounded-lg border border-gray-300 shadow-md">
        <span className="flex items-center gap-3">
          <ShieldUser size={35} color="blue" />
          <h1 className="text-xl font-bold">จัดการความเป็นส่วนตัว</h1>
        </span>
        <p className="text-gray-600">ควบคุมข้อมูลที่จะแสดงในสาธารณะของคุณ</p>
      </div>
      <div className=" lg:w-1/2 w-full flex flex-col rounded-lg p-5 border border-blue-300 bg-blue-100 shadow-md">
        <div className="flex items-center gap-2">
          <Shield size={25} color="blue" />
          <p>หมายเหตุ</p>
        </div>
        <li className="mt-2 ml-3 text-sm text-red-500">
          เมื่อเกิดการเปลี่ยนแปลงกรุณากดปุ่ม "บันทึกการตั้งค่า" เพื่อบันทึก
        </li>
      </div>

      <div className="bg-white lg:w-1/2 w-full flex flex-col rounded-lg p-5 border border-gray-300 shadow-md">
        <h2 className="font-bold">ข้อมูลส่วนบุคคล</h2>
        <p className="text-sm text-gray-600 mt-2">
          เลือกข้อมูลที่ต้องการแสดงในสาธารณะ
        </p>
        {/* profile */}
        <span className="mt-3.5 pb-5 border-b border-gray-300 flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="">รูปโปรไฟล์</label>
            <p className="text-sm text-gray-500">
              อนุญาตให้ผู้ใช้ระบบคนอื่นมองเห็นรูปโปรไฟล์ของคุณ
            </p>
          </div>
          <div className="flex items-center gap-3">
            {seeProfile ? (
              <Eye size={18} color="green" />
            ) : (
              <EyeOff size={18} color="red" />
            )}

            <Switch
              onColor="#32CD32"
              checked={seeProfile}
              onChange={() => setSeeProfile(!seeProfile)}
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              width={60}
              height={28}
            />
          </div>
        </span>
        {/* email */}
        <span className="mt-6 pb-5 border-b border-gray-300 flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="">อีเมล</label>
            <p className="text-sm text-gray-500">
              อนุญาตให้ผู้ใช้ระบบคนอื่นมองเห็นที่อยู่อีเมล์ของคุณ
            </p>
          </div>
          <div className="flex items-center gap-3">
            {seeEmail ? (
              <Eye size={18} color="green" />
            ) : (
              <EyeOff size={18} color="red" />
            )}

            <Switch
              onColor="#32CD32"
              checked={seeEmail}
              onChange={() => setSeeEmail(!seeEmail)}
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              width={60}
              height={28}
            />
          </div>
        </span>
        {/* phone */}
        <span className="mt-6 pb-5 border-b border-gray-300 flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="">หมายเลขโทรศัพท์</label>
            <p className="text-sm text-gray-500">
              อนุญาตให้ผู้ใช้ระบบคนอื่นมองเห็นหมายเลขโทรศัพท์ของคุณ
            </p>
          </div>
          <div className="flex items-center gap-3">
            {seePhone ? (
              <Eye size={18} color="green" />
            ) : (
              <EyeOff size={18} color="red" />
            )}

            <Switch
              onColor="#32CD32"
              checked={seePhone}
              onChange={() => setSeePhone(!seePhone)}
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              width={60}
              height={28}
            />
          </div>
        </span>
        {/* facebook */}
        <span className="mt-6 pb-5 border-b border-gray-300 flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="">เฟสบุ๊ค</label>
            <p className="text-sm text-gray-500">
              อนุญาตให้ผู้ใช้ระบบคนอื่นมองเห็นเฟสบุ๊คของคุณ
            </p>
          </div>
          <div className="flex items-center gap-3">
            {seeFacebook ? (
              <Eye size={18} color="green" />
            ) : (
              <EyeOff size={18} color="red" />
            )}

            <Switch
              onColor="#32CD32"
              checked={seeFacebook}
              onChange={() => setSeeFacebook(!seeFacebook)}
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              width={60}
              height={28}
            />
          </div>
        </span>
        {/* address */}
        <span className="mt-6 pb-5 border-b border-gray-300 flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="">ที่อยู่</label>
            <p className="text-sm text-gray-500">
              อนุญาตให้ผู้ใช้ระบบคนอื่นมองเห็นที่อยู่ของคุณ
            </p>
          </div>
          <div className="flex items-center gap-3">
            {seeAddress ? (
              <Eye size={18} color="green" />
            ) : (
              <EyeOff size={18} color="red" />
            )}

            <Switch
              onColor="#32CD32"
              checked={seeAddress}
              onChange={() => setSeeAddress(!seeAddress)}
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              width={60}
              height={28}
            />
          </div>
        </span>
        {/* work experience */}
        {user?.roleId < 2 && (
          <span className="mt-6 pb-5 border-b border-gray-300 flex items-center justify-between w-full">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="">ประวัติการทำงาน</label>
              <p className="text-sm text-gray-500">
                อนุญาตให้ผู้ใช้ระบบคนอื่นมองเห็นประวัติการทำงานของคุณ
              </p>
            </div>
            <div className="flex items-center gap-3">
              {seeWorkExprerience ? (
                <Eye size={18} color="green" />
              ) : (
                <EyeOff size={18} color="red" />
              )}

              <Switch
                onColor="#32CD32"
                checked={seeWorkExprerience}
                onChange={() => setSeeWorkExperince(!seeWorkExprerience)}
                offColor="#d1d5db"
                uncheckedIcon={false}
                checkedIcon={false}
                width={60}
                height={28}
              />
            </div>
          </span>
        )}
      </div>

      <div className="lg:w-1/2 bg-white w-full flex flex-col rounded-lg p-5 border border-gray-300 shadow-md">
        <h2 className="font-bold">อนุญาตส่งข้อความ</h2>
        <p className="text-sm text-gray-600 mt-2">
          กำหนดให้ผู้ใช้งานคนอื่นสามารถส่งขอความหาคุณได้ทางอีเมล์
        </p>
        {/* send from professor */}
        <span className="mt-6 pb-4 border-b border-gray-300 flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="">อนุญาตศิษย์เก่าส่งข้อความ</label>
            <p className="text-sm text-gray-500">
              อนุญาตให้ศิษย์เก่าสามารถส่งข้อความหาคุณได้ทางอีเมล์
            </p>
          </div>
          <div className="flex items-center gap-3">
            {allowedAlumniSendEmail ? (
              <Eye size={18} color="green" />
            ) : (
              <EyeOff size={18} color="red" />
            )}

            <Switch
              onColor="#32CD32"
              checked={allowedAlumniSendEmail}
              onChange={() => setAllowedAlumniText(!allowedAlumniSendEmail)}
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              width={60}
              height={28}
            />
          </div>
        </span>
        <span className="mt-6 pb-4 border-b border-gray-300 flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="">อนุญาตอาจารย์ส่งข้อความ</label>
            <p className="text-sm text-gray-500">
              อนุญาตให้อาจารย์สามารถส่งข้อความหาคุณได้ทางอีเมล์
            </p>
          </div>
          <div className="flex items-center gap-3">
            {allowedProfessorSendEmail ? (
              <Eye size={18} color="green" />
            ) : (
              <EyeOff size={18} color="red" />
            )}

            <Switch
              onColor="#32CD32"
              checked={allowedProfessorSendEmail}
              onChange={() =>
                setAllowedProfessorText(!allowedProfessorSendEmail)
              }
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              width={60}
              height={28}
            />
          </div>
        </span>
      </div>

      <div className="w-full lg:w-1/2 flex justify-end my-3">
        <button
          onClick={save}
          className="p-3 rounded-lg border border-blue-500 hover:bg-blue-600 hover:shadow-md bg-blue-500 text-white flex items-center gap-2.5"
        >
          {saving ? <Loading type={1} /> : <Save color="white" size={20} />}

          <p className="text-[0.9rem]">
            {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
          </p>
        </button>
      </div>
    </div>
  );
};
export default Privacy;
