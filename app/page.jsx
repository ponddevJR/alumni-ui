// login page
"use client";

import Image from "next/image";
import login_bg from "@/assets/images/login_background.jpg";
import logo from "@/assets/images/logo_rmu.png";
import {
  Check,
  CircleQuestionMark,
  Eye,
  EyeClosed,
  GraduationCap,
  Key,
  RectangleEllipsis,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { useForm, Controller } from "react-hook-form";
import { alerts } from "@/libs/alerts";
import Modal from "@/components/modal";
import { authService } from "@/service/auth";
import useGetSession from "@/hook/useGetSeesion";
import { useRouter } from "next/navigation";

const Page = () => {
  const { checking, user } = useGetSession();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUsernameDetail, setShowUsernameDetail] = useState(false);
  const [showPassDetail, setShowPassDetail] = useState(false);
  const [showWonderDetail, setShowWonderDetail] = useState(false);
  const [showAuthKeyDetail, setShowAuthKeyDetail] = useState(false);

  const [passKey, setPassKey] = useState("");
  const [firstLogin, setFirstLogin] = useState(false);
  const [authkey, setAuthKey] = useState("");
  const [passkeyID, setPassKeyID] = useState("");

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitForm = async (data) => {
    if (errors.username || errors.password) return;

    setLoading(true);
    try {
      const res = await authService.login(data);
      if (res?.data?.isFirstLogin) {
        setFirstLogin(true);
        setPassKey(res?.data?.key);
        setPassKeyID(res?.data?.alumni_id);
      }

      if (res?.data?.ok) {
        alerts.success("เข้าสู่ระบบแล้ว!");
        if (res?.data?.roleId > 1 && res?.data?.roleId < 5) {
          router.push("/users/dashboard");
        } else if (res?.data?.roleId === 5) {
          router.push("/alumni-president/alumni-manage");
        } else {
          router.push("/users/profile");
        }
      }
    } catch (error) {
      console.error(error);
      const status = error?.response?.status || error?.status;
      console.log("🚀 ~ submitForm ~ status:", status)

      if (status === 429) {
        return alerts.err(
          "คุณพยายามเข้าสู่ระบบบ่อยเกินไป กรุณาลองใหม่อีกครั้งภายหลัง"
        );
      }
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async (e) => {
    e.preventDefault();
    if (passKey !== Number(authkey) || !authkey) {
      return alerts.err("รหัสยืนยันตัวตนไม่ถูกต้อง!");
    }
    setLoading(true);
    try {
      const res = await authService.authSuccess({ alumni_id: passkeyID });
      if (res?.data?.ok) {
        alerts.success("เข้าสู่ระบบแล้ว!");
        if (res?.data?.roleId > 1) {
          router.push("/users/dashboard");
        } else {
          router.push("/users/profile");
        }
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      if (user?.roleId > 1 && user?.roleId < 5) {
        router.push("/users/dashboard");
      } else if (user?.roleId === 5) {
        router.push("/alumni-president/alumni-manage");
      } else {
        router.push("/users/profile");
      }
    }
  }, [user]);

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

        <form
          onSubmit={!firstLogin ? handleSubmit(submitForm) : authenticate}
          className="z-50 lg:w-1/3 w-full bg-white rounded-md shadow-md shadow-gray-600 border border-gray-400 p-8 flex flex-col items-center justify-center"
        >
          {/* logo */}
          <Image alt="logo" priority src={logo} className="w-1/5 h-auto" />

          <h1 className="font-bold text-3xl mt-2 text-blue-700">RMU ALUMNI</h1>
          <p className="mt-1 text-sm w-full text-center">
            ระบบศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
          </p>
          {!firstLogin ? (
            <>
              {/* username */}
              <div className="mt-3 w-full flex flex-col gap-1.5">
                <span className="flex items-center gap-3">
                  <label className="">รหัสผู้ใช้งาน</label>
                  <CircleQuestionMark
                    size={18}
                    color="gray"
                    className="cursor-pointer"
                    onClick={() => setShowUsernameDetail(true)}
                  />
                </span>

                <div
                  className={`flex items-center gap-3 py-3 border-b-2 ${
                    errors.username ? "border-red-500" : "border-blue-500"
                  }`}
                >
                  <User size={20} />
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: "กรุณากรอกรหัสผู้ใช้งาน" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value || ""}
                        className="w-[95%] text-[0.9rem]"
                        placeholder="กรอกรหัสผู้ใช้งาน"
                      />
                    )}
                  />
                </div>
              </div>
              {errors.username && (
                <small className="w-full text-xs text-red-500 mt-2">
                  {errors.username.message}
                </small>
              )}

              {/* password */}
              <div className="mt-8 w-full flex flex-col gap-1.5">
                <span className="flex items-center gap-3">
                  <label className="">รหัสผ่าน</label>
                  <CircleQuestionMark
                    size={18}
                    color="gray"
                    className="cursor-pointer"
                    onClick={() => setShowPassDetail(true)}
                  />
                </span>
                <div
                  className={`flex items-center gap-3 py-3 border-b-2 ${
                    errors.password ? "border-red-500" : "border-blue-500"
                  }`}
                >
                  <Key size={20} />
                  <Controller
                    name="password"
                    rules={{ required: "กรุณากรอกรหัสผ่าน" }}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value || ""}
                        type={showPass ? "text" : "password"}
                        className="w-[88%] text-[0.9rem]"
                        placeholder="กรอกรหัสผ่าน"
                      />
                    )}
                  />

                  {showPass ? (
                    <Eye
                      onClick={() => setShowPass(!showPass)}
                      size={20}
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeClosed
                      onClick={() => setShowPass(!showPass)}
                      size={20}
                      className="cursor-pointer"
                    />
                  )}
                </div>
              </div>
              {errors.password && (
                <small className="w-full text-xs text-red-500 mt-2">
                  {errors.password.message}
                </small>
              )}
            </>
          ) : (
            <div className="mt-8 w-full flex flex-col gap-1.5">
              <span className="flex items-center gap-3">
                <label className="">รหัสยืนยันตัวตน</label>
                <CircleQuestionMark
                  size={18}
                  color="gray"
                  className="cursor-pointer"
                  onClick={() => setShowAuthKeyDetail(true)}
                />
              </span>
              <div className="flex items-center gap-3 py-3 border-b-2">
                <RectangleEllipsis size={18} />
                <input
                  value={authkey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  type="text"
                  className="w-[88%] text-[0.9rem]"
                  placeholder="กรอกตัวเลขที่ได้จากอีเมล เพื่อยืนยันตัวตน"
                />
              </div>
            </div>
          )}

          {/* more */}
          <div className="w-full flex lg:flex-row flex-col items-center gap-1 justify-between mt-5">
            <button
              type="button"
              onClick={() => setShowWonderDetail(true)}
              className="text-sm text-gray-500 hover:underline hover:text-gray-800"
            >
              มีข้อสงสัย?
            </button>
            {!firstLogin && (
              <Link
                href="/forgot-password"
                className="text-sm text-blue-800 hover:underline hover:text-blue-600"
              >
                ลืมรหัสผ่าน?
              </Link>
            )}
          </div>

          <button
            disabled={loading || checking}
            className="mt-7 hover:bg-gradient-to-l rounded-lg flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-blue-300 w-full text-white gap-3"
          >
            {loading ? (
              <Loading type={1} />
            ) : !firstLogin ? (
              <>
                <GraduationCap size={22} color="white" />
                <p>เข้าสู่ระบบ</p>
              </>
            ) : (
              <>
                <Check size={22} color="white" />
                <p>ยืนยันตัวตน</p>
              </>
            )}
          </button>
        </form>
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

      {/* password detail */}
      <Modal isOpen={showPassDetail} onClose={() => setShowPassDetail(false)}>
        <div className="p-4 rounded-lg bg-gray-50 shadow-md">
          <X
            size={20}
            onClick={() => setShowPassDetail(false)}
            className="mb-2 cursor-pointer"
          />
          <p className="font-bold text-sm">เข้าสู่ระบบครั้งแรก</p>
          <p className="text-sm text-gray-700 mt-1">
            สำหรับนักศึกษา: กรอกรหัสนักศึกษา 12 หลัก
          </p>
          <p className="text-sm text-gray-700 mt-1">
            สำหรับอาจารย์: กรอกรหัสอาจารย์
          </p>
          <p className="text-sm text-gray-700 mt-1">
            หลังจากเข้าสู่ระบบแล้วท่านสามารถเปลี่ยนหรือไม่เปลี่ยนรหัสผ่านของท่านก็ได้
            <br></br>
            หากต้องการเปลี่ยน ไปที่ "บัญชี" -{"> "}"เปลี่ยนรหัสผ่าน"
          </p>
        </div>
      </Modal>

      {/* detail */}
      <Modal
        isOpen={showWonderDetail}
        onClose={() => setShowWonderDetail(false)}
      >
        <div className="lg:w-[500px] w-[300px] p-4 rounded-lg bg-gray-50 shadow-md">
          <X
            size={20}
            onClick={() => setShowWonderDetail(false)}
            className="mb-2 cursor-pointer"
          />
          <p className="font-bold text-sm">เข้าสู่ระบบครั้งแรก</p>
          <p className="text-sm text-gray-700 mt-1">
            {"    - "}เข้าสู่ระบบครั้งแรก
            หลังจากรอกรหัสผู้ใช้งานและรหัสผ่านถูกต้องแล้ว
            เพื่อยืนยันตัวตนระบบจะส่งรหัสยืนยันตัวตนไปทางอีเมล (@rmu.ac.th)
            คุณจะได้รับรหัส เพื่อนำมากรอกและยืนยันตัวตนเข้าสู่ระบบ
            {"\n - "}
            หลังจากนั้นสามารถเลือกที่จะเปลี่ยนหรือไม่เปลี่ยนรหัสผ่านก็ได้
            หากต้องการเปลี่ยนรหัสผ่านไปที่ "บัญชี" -{"> "} "เปลี่ยนรหัสผ่าน"
          </p>

          <p className="font-bold text-sm mt-2.5">เข้าสู่ระบบ</p>
          <p className="text-sm text-gray-700 mt-1">
            กรอกรหัสผู้ใช้งาน และรหัสผ่านให้ถูกต้องเพื่อเข้าใช้งานระบบศิษย์เก่า
          </p>

          <p className="font-bold text-sm mt-2.5">หากยังไม่เปลี่ยนรหัสผ่าน</p>
          <p className="text-sm text-gray-700 mt-1">
            {"    - "}
            ทุกครั้งที่คุณเข้าสู่ระบบหากคุณยังไม่เปลี่ยนรหัสผ่านจากการเข้าสู่ระบบครั้งแรก
            หลังจากกรอกรหัสผู้ใช้งานและรหัสผ่านถูกต้องแล้ว
            เพื่อยืนยันตัวตนระบบจะส่งรหัสยืนยันตัวตนไปทางอีเมล คุณจะได้รับรหัส
            เพื่อนำมากรอกและยืนยันตัวตนเข้าสู่ระบบ
          </p>
        </div>
      </Modal>

      {/* authend pass modal */}
      <Modal
        isOpen={showAuthKeyDetail}
        onClose={() => setShowAuthKeyDetail(false)}
      >
        <div className="lg:w-[500px] w-[300px] p-4 rounded-lg bg-gray-50 shadow-md">
          <X
            size={20}
            onClick={() => setShowAuthKeyDetail(false)}
            className="mb-2 cursor-pointer"
          />
          <p className="font-bold text-sm">วิธีดูรหัส</p>
          <p className="text-sm text-gray-700 mt-1">
            {"    - "}หากสู่ระบบครั้งแรก
            โปรดตรวจสอบอีเมลที่คุณใช้ภายในมหาวิทยาลัยราชภัฏมหาสารคาม
            (@rmu.ac.th)
            {"\n - "}
            หากเคยเข้าสู่ระบบแล้วแต่ยังไม่ได้เปลี่ยนรหัสผ่าน
            โปรดตรวจสอบอีเมล(@rmu.ac.th)หรืออีเมลอื่นๆที่คุณระบุไว้ที่ "โปรไฟล์"
            -{"> "} "ช่องทางติดต่อ"
          </p>
        </div>
      </Modal>
    </>
  );
};
export default Page;
