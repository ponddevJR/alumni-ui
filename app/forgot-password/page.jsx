"use client";
import Image from "next/image";
import login_bg from "@/assets/images/login_background.jpg";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  CheckCircle2,
  CircleQuestionMark,
  Eye,
  EyeClosed,
  Save,
  Search,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import logo from "@/assets/images/logo_rmu.png";
import Modal from "@/components/modal";
import { useEffect, useState } from "react";
import { alerts } from "@/libs/alerts";
import Loading from "@/components/loading";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useRouter } from "next/navigation";
import useGetSession from "@/hook/useGetSeesion";

const ForgetPassword = () => {
  const router = useRouter();

  const { user, checking } = useGetSession();

  useEffect(() => {
    if (checking) return;
    if (user) {
      return router.push("/");
    }
  }, [user, checking]);

  const [showUsernameDetail, setShowUsernameDetail] = useState(false);
  const [showConfuse, setShowConfuse] = useState(false);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState("");
  const checkUsername = async () => {
    if (!username) {
      return alerts.err("ไม่พบผู้ใช้งาน");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        apiConfig.rmuAPI + "/auth/forgot-pass/checkuser",
        { username }
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res?.status === 200) {
        alerts.success("โปรดตรวจอีเมลเพื่อรับรหัสยืนยันตัวตน");
        setAuth(res?.data?.auth);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const [userAuth, setUserAuth] = useState("");
  const [authCorrect, setAuthCorrect] = useState(false);
  const checkAuthCorrect = () => {
    if (auth == userAuth) {
      alerts.success("รหัสถูกต้อง");
      setAuthCorrect(true);
    } else {
      alerts.err("รหัสยืนยันไม่ถูกต้อง");
    }
  };

  const [newPass, setNewPass] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  const saveNewPass = async () => {
    if (newPass.length < 8) {
      return alerts.err("รหัสผ่านต้องมากกว่า 8 ตัวอักษร");
    }
    if (!/[A-Za-z]/.test(newPass)) {
      return alerts.err("รหัสผ่านต้องเป็นตัวพยัญชนะภาษาอังกฤษเท่านนั้น");
    }
    if (!/[^A-Za-z0-9]/.test(newPass)) {
      return alerts.err("รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว");
    }
    if (!/\d/.test(newPass)) {
      return alerts.err("รหัสผ่านต้องประกอบด้วยตัวเลขอย่างน้อย 1 ตัว");
    }
    if (newPass !== confirmNew) {
      return alerts.err("รหัสผ่านไม่ตรงกัน");
    }

    setLoading(true);
    try {
      const payload = {
        username,
        newPass,
      };
      const res = await axios.put(
        apiConfig.rmuAPI + "/auth/forgot-pass/newpass",
        payload
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res?.status === 200) {
        alerts.success("บันทึกรหัสผ่านใหม่แล้ว");
        router.push("/");
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
      <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-10 w-screen h-screen flex items-center justify-center">
        <Image
          className="w-full h-full object-cover absolute top-0"
          alt="bg"
          priority
          src={login_bg}
        />
        <div className="w-full h-full absolute top-0 bg-white/10 backdrop-blur-sm"></div>

        <div className="relative z-50 lg:w-1/2 w-full p-5 rounded-lg border border-gray-300 shadow-sm bg-white flex flex-col items-center">
          <Link href="/" className="w-full absolute top-3 left-4">
            <ArrowLeft size={20} />
          </Link>
          <Image alt="logo" priority src={logo} className="w-1/5 h-auto" />
          <h1 className="text-2xl text-blue-600 font-bold my-2">ลืมรหัสผ่าน</h1>
          <p className="mt-1 text-gray-700 text-center text-sm lg:text-md">
            กรุณกรอกรหัสผู้ใช้งาน
            จากนั้นตรวจสอบอีเมลที่คุณเคยให้ไว้เพื่อรับรหัสยืนยันตัวตน
          </p>
          <span className="flex items-center w-full gap-2 ml-2 mt-4">
            <label htmlFor="" className="">
              รหัสผู้ใช้งาน
            </label>
            <CircleQuestionMark
              onClick={() => setShowUsernameDetail(true)}
              size={18}
              color="gray"
              className="cursor-pointer"
            />
          </span>
          <input
            disabled={!!auth}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className={`mt-1.5 w-full p-2 px-3 rounded-lg border border-gray-300 text-[0.9rem] ${
              auth && "bg-gray-200"
            }`}
            placeholder="กรอกรหัสผู้ใช้งาน"
          />
          {auth && (
            <>
              <span className="w-full mt-4 flex items-center gap-2">
                <label htmlFor="" className="">
                  รหัสยืนยันตัวตน
                </label>
                {authCorrect && <CheckCircle2 size={18} color="green" />}
              </span>

              <input
                disabled={!auth}
                value={userAuth}
                onChange={(e) => setUserAuth(e.target.value)}
                type="text"
                className={`mt-1.5 w-full p-2 px-3 rounded-lg border border-gray-300 text-[0.9rem] ${
                  authCorrect && "bg-gray-200"
                }`}
                placeholder="กรอกรหัสยืนยันตัวตน"
              />
            </>
          )}
          {authCorrect && (
            <>
              <span className="mt-4 w-full flex items-center justify-between">
                <label htmlFor="" className="w-full">
                  สร้างรหัสผ่านใหม่
                </label>
                {showNewPass ? (
                  <Eye
                    onClick={() => setShowNewPass(!showNewPass)}
                    size={20}
                    className="cursor-pointer"
                  />
                ) : (
                  <EyeClosed
                    onClick={() => setShowNewPass(!showNewPass)}
                    size={20}
                    className="cursor-pointer"
                  />
                )}
              </span>

              <input
                disabled={!authCorrect}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                type={showNewPass ? "text" : "password"}
                className="mt-1.5 w-full p-2 px-3 rounded-lg border border-gray-300 text-[0.9rem]"
                placeholder="สร้างรหัสผ่านใหม่"
              />

              <span className="mt-4 w-full flex items-center justify-between">
                <label htmlFor="" className="w-full">
                  ยืนยัน รหัสผ่านใหม่
                </label>
                {showConfirmNew ? (
                  <Eye
                    onClick={() => setShowConfirmNew(!showConfirmNew)}
                    size={20}
                    className="cursor-pointer"
                  />
                ) : (
                  <EyeClosed
                    onClick={() => setShowConfirmNew(!showConfirmNew)}
                    size={20}
                    className="cursor-pointer"
                  />
                )}
              </span>

              <input
                disabled={!authCorrect}
                value={confirmNew}
                onChange={(e) => setConfirmNew(e.target.value)}
                type={showConfirmNew ? "text" : "password"}
                className="mt-1.5 w-full p-2 px-3 rounded-lg border border-gray-300 text-[0.9rem]"
                placeholder="กรอกรหัสผ่านใหม่ของคุณอีกครั้ง"
              />
            </>
          )}
          <button
            onClick={() => setShowConfuse(true)}
            className="w-full text-end mt-4 hover:underline text-sm text-gray-600"
          >
            มีข้อสงสัย?
          </button>
          <button
            disabled={loading}
            onClick={
              !auth && !authCorrect
                ? () => checkUsername()
                : auth && !authCorrect
                ? () => checkAuthCorrect()
                : () => saveNewPass()
            }
            className="flex items-center justify-center gap-2 mt-5 shadow-md border border-gray-200 w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-sky-300 text-white hover:bg-gradient-to-l"
          >
            {loading ? (
              <>
                <Loading type={1} />
                <p>กำลังตรวจสอบ...</p>
              </>
            ) : !auth && !authCorrect ? (
              <>
                <Send size={20} />
                <p>ส่งรหัสยืนยัน</p>
              </>
            ) : auth && !authCorrect ? (
              <>
                <Search size={20} />
                <p>ตรวจสอบรหัส</p>
              </>
            ) : (
              authCorrect && (
                <>
                  <Save size={20} />
                  <p>บันทึก</p>
                </>
              )
            )}
          </button>
        </div>
      </div>
      {/* username detail */}
      <Modal
        isOpen={showUsernameDetail}
        onClose={() => setShowUsernameDetail(false)}
      >
        <div className="p-4 rounded-lg bg-gray-50 shadow-md">
          <X
            size={20}
            onClick={() => setShowUsernameDetail(false)}
            className="mb-2 cursor-pointer"
          />
          <p className="font-bold text-sm">การกรอกรหัสผู้ใช้งาน</p>
          <p className="text-sm text-gray-700 mt-1">
            สำหรับนักศึกษา: กรอกรหัสนักศึกษา 12 หลัก
          </p>
          <p className="text-sm text-gray-700 mt-1">
            สำหรับอาจารย์: กรอกรหัสอาจารย์
          </p>
        </div>
      </Modal>

      <Modal isOpen={showConfuse} onClose={() => setShowConfuse(false)}>
        <div className="p-4 rounded-lg bg-gray-50 shadow-md">
          <X
            size={20}
            onClick={() => setShowConfuse(false)}
            className="mb-2 cursor-pointer"
          />
          <p className="font-bold">หากลืมรหัสผ่าน</p>
          <p className="text-sm">
            กรอกรหัสผู้ใช้งาน จากนั้นตรวจสอบอีเมล @rmu.ac.th หรืออีเมลอื่นๆ
            ที่เคยกรอกไว้ในระบบศิษย์เก่า
            <br />
            เพื่อรับรหัสยืนยันตัวตน เปลี่ยนรหัสผ่าน
          </p>

          <p className="font-bold mt-3">เงื่อนไขการสร้างรหัสผ่าน</p>
          <p className="text-sm">
            - รหัสผ่านต้องมากกว่า 8 ตัวอักษร<br />
            - รหัสผ่านเป็นตัวอักษรพยัญชนะภาษาอังกฤษเท่านั้น <br />
            - รหัสผ่านต้องประกอบด้วยอักขระพิเศษอย่างน้อย 1 ตัว <br />
            - รหัสผ่านต้องประกอบด้วยตัวเลขอย่างน้อย 1 ตัว
          </p>
        </div>
      </Modal>
    </>
  );
};
export default ForgetPassword;
