"use client";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Check, Eye, EyeClosed, KeySquare, Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Setting = () => {
  const router = useRouter();
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [cofirmNew, setConfirmNew] = useState("");

  const [load, setLoad] = useState(false);
  const save = async () => {
    if (!currentPass) {
      return alerts.err("โปรดกรอกรหัสผ่านปัจจุบัน");
    }
    if (
      !/[A-Za-z]/.test(newPass) ||
      newPass.length < 8 ||
      !/\d/.test(newPass) ||
      !/[^A-Za-z0-9]/.test(newPass)
    )
      return;
    if (newPass !== cofirmNew) {
      return alerts.err("รหัสผ่านไม่ตรงกัน");
    }

    const { isConfirmed } = await alerts.confirmDialog(
      "ต้องการบันทึกเป็นรหัสผ่านปัจจุบันหรือไม่?",
      "หลังจากเปลี่ยนแล้วจำเป็นต้องเข้าสู่ระบบใหม่อีกครั้ง",
      "บันทึก"
    );

    if (!isConfirmed) return;

    setLoad(true);
    try {
      const payload = {
        currentPass,
        newPass,
      };
      const res = await axios.put(
        apiConfig.rmuAPI + "/alumni/change-password",
        payload,
        { withCredentials: true }
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }

      if (res?.status === 200) {
        alerts.success("เปลี่ยนรหัสผ่านแล้ว");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      alerts.err("ตรวจสอบเครือข่ายแล้วลองอีกครั้ง");
    } finally {
      setLoad(false);
    }
  };

  function generateSecurePassword() {
    const length = 12;

    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()_+[]{}|;:,.<>?";

    const allChars = letters + numbers + specials;

    let password = "";

    // ใส่อักขระบังคับอย่างน้อย 1 ตัว
    password += letters[Math.floor(Math.random() * letters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specials[Math.floor(Math.random() * specials.length)];

    // เติมส่วนที่เหลือด้วยอักขระผสม
    for (let i = 3; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // สลับตำแหน่งอักขระแบบสุ่มเพื่อความปลอดภัย
    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setNewPass(password);
  }

  return (
    <div className="w-full flex h-full items-center justify-center bg-gradient-to-r from-neutral-100 to-stone-100">
      <div className="w-full lg:w-1/2 p-7 ml-3 border mt-1 flex flex-col bg-white border-gray-300 rounded-lg shadow-lg shadow-gray-400">
        <span className="flex items-center gap-4">
          <Lock size={25} color="blue" />
          <p className="text-xl font-bold">เปลี่ยนรหัสผ่าน</p>
        </span>

        <label htmlFor="" className="mt-5">
          รหัสผ่านปัจจุบัน
        </label>
        <div className="w-full flex items-center p-2 px-3 rounded-md border border-gray-300  mt-2 gap-3">
          <input
            type={showCurrentPass ? "text" : "password"}
            className="w-full text-[0.9rem]"
            placeholder="กรอกรหัสผ่านปัจจุบันของคุณ"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />
          {showCurrentPass ? (
            <Eye
              className="cursor-pointer"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              size={18}
            />
          ) : (
            <EyeClosed
              className="cursor-pointer"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              size={18}
            />
          )}
        </div>

        <label htmlFor="" className="mt-5">
          รหัสผ่านใหม่
        </label>
        <div className="w-full flex items-center p-2 px-3 rounded-md border border-gray-300  mt-2 gap-3">
          <input
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            type={showNewPass ? "text" : "password"}
            className="w-full text-[0.9rem]"
            placeholder="สร้างรหัสผ่านใหม่ของคุณ"
          />
          {showNewPass ? (
            <Eye
              className="cursor-pointer"
              onClick={() => setShowNewPass(!showNewPass)}
              size={18}
            />
          ) : (
            <EyeClosed
              className="cursor-pointer"
              onClick={() => setShowNewPass(!showNewPass)}
              size={18}
            />
          )}
        </div>
        <div className="w-full p-3 rounded-md bg-blue-50 border border-blue-500 flex flex-col gap-1 mt-2">
          <span className="flex items-center gap-2">
            {newPass.length > 8 ? (
              <Check size={13} color="green" />
            ) : (
              <X size={13} color="red" />
            )}
            <p
              className={`text-sm ${
                newPass.length > 8 ? "text-green-600" : "text-red-600"
              }`}
            >
              รหัสผ่านต้องมากกว่า 8 ตัวอักษร
            </p>
          </span>
          <span className="flex items-center gap-2">
            {/[A-Za-z]/.test(newPass) ? (
              <Check size={13} color="green" />
            ) : (
              <X size={13} color="red" />
            )}
            <p
              className={`text-sm ${
                /[A-Za-z]/.test(newPass) ? "text-green-600" : "text-red-600"
              }`}
            >
              รหัสผ่านพยัญชนะต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น
            </p>
          </span>
          <span className="flex items-center gap-2">
            {/[^A-Za-z0-9]/.test(newPass) ? (
              <Check size={13} color="green" />
            ) : (
              <X size={13} color="red" />
            )}
            <p
              className={`text-sm ${
                /[^A-Za-z0-9]/.test(newPass) ? "text-green-600" : "text-red-600"
              }`}
            >
              รหัสผ่านต้องประกอบด้วยอักขระพิเศษอย่างน้อย 1 ตัว
            </p>
          </span>
          <span className="flex items-center gap-2">
            {/\d/.test(newPass) ? (
              <Check size={13} color="green" />
            ) : (
              <X size={13} color="red" />
            )}
            <p
              className={`text-sm ${
                /\d/.test(newPass) ? "text-green-600" : "text-red-600"
              }`}
            >
              รหัสผ่านต้องประกอบด้วยตัวเลขอย่างน้อย 1 ตัว
            </p>
          </span>
        </div>
        <button
          onClick={generateSecurePassword}
          className="mt-2 w-full p-3 rounded-md flex justify-center  items-center gap-2 border border-gray-400 hover:bg-yellow-400 "
        >
          <KeySquare size={15} />
          <p className="text-sm">สร้างอัตโนมัติ</p>
        </button>

        <label htmlFor="" className="mt-5">
          ยืนยัน รหัสผ่านใหม่
        </label>
        <div className="w-full flex items-center p-2 px-3 rounded-md border border-gray-300  mt-2 gap-3">
          <input
            value={cofirmNew}
            onChange={(e) => setConfirmNew(e.target.value)}
            type={showConfirmNew ? "text" : "password"}
            className="w-full text-[0.9rem]"
            placeholder="กรอกรหัสผ่านใหม่ของคุณอีกครั้ง"
          />
          {showConfirmNew ? (
            <Eye
              className="cursor-pointer"
              onClick={() => setShowConfirmNew(!showConfirmNew)}
              size={18}
            />
          ) : (
            <EyeClosed
              className="cursor-pointer"
              onClick={() => setShowConfirmNew(!showConfirmNew)}
              size={18}
            />
          )}
        </div>

        <div className="w-full flex justify-between items-center">
          <button className="text-sm text-gray-600 hover:text-gray-800 hover:underline">
            มีข้อสงสัย?
          </button>
          <button
            disabled={load}
            onClick={save}
            className="mt-6 hover:bg-blue-600 shadow-md flex items-center gap-3 p-2.5 px-3 rounded-lg bg-blue-500 text-white"
          >
            {load ? <Loading type={1} /> : <Check size={18} color="white" />}

            <p className="text-sm">{load ? "กำลังบันทึก..." : "บันทึก"}</p>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Setting;
