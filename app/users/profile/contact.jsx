"use client";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import {
  formatPhoneNumber,
  isValidEmail,
  isValidThaiPhoneNumber,
} from "@/libs/validate";
import axios from "axios";
import {
  Check,
  CircleAlert,
  Contact2,
  Edit,
  Facebook,
  Mail,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

const Contact = ({ p1, p2, e1, e2, f, reload, roleId }) => {
  const [editing, setEditing] = useState(
    !p1 && !p2 && !e1 && !e2 && !f ? true : false
  );
  const [updating, setUpdating] = useState(false);

  const [showOtherPhone, setShowOtherPhone] = useState(!!p2);
  const [showOtherEmail, setShowOtherEmail] = useState(!!e2);

  const [phone1, setPhone1] = useState(p1 ? p1 : p2 || "");
  const [phone2, setPhone2] = useState(p2 || "");
  const [email1, setEmail1] = useState(!e1 ? e2 : e1 || "");
  const [email2, setEmail2] = useState(e2 || "");
  const [facebook, setFacebook] = useState(f || "");

  const cancelEditing = () => {
    setEditing(false);
    if (!p2) {
      setShowOtherPhone(false);
    }
    if (!e2) {
      setShowOtherEmail(false);
    }

    setPhone1(p1 ? p1 : p2 || "");
    setPhone2(p2);
    setEmail1(!e1 ? e2 : e1 || "");
    setEmail2(e2 || "");
    setFacebook(f || "");
  };

  const updateContact = async () => {
    if (phone1) {
      if (!isValidThaiPhoneNumber(phone1)) {
        return alerts.err("เบอร์โทรศัพท์ไม่ถูกต้อง");
      }
    }
    if (phone2) {
      if (!isValidThaiPhoneNumber(phone2)) {
        return alerts.err("เบอร์โทรศัพท์ไม่ถูกต้อง");
      }
    }
    if (email1) {
      if (!isValidEmail(email1)) {
        return alerts.err("อีเมลไม่ถูกต้อง");
      }
    }
    if (email2) {
      if (!isValidEmail(email2)) {
        return alerts.err("อีเมลไม่ถูกต้อง");
      }
    }
    if (!email1 && !email2) {
      return alerts.err("โปรดกรอกอย่างน้อย 1 อีเมล");
    }

    setUpdating(true);
    try {
      const payload = {
        phone1,
        phone2,
        email1,
        email2,
        facebook,
      };
      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/update-contact",
        payload,
        {
          withCredentials: true,
        }
      );
      if (res?.status === 200) {
        await alerts.success();
        cancelEditing();
        reload();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <span className="relative flex items-center gap-2">
        <Contact2 size={30} color="blue" />
        <p className="text-lg font-bold">ช่องทางการติดต่อ</p>
        {editing ? (
          <span className="flex items-center gap-2 absolute top-0 right-2">
            <button
              disabled={updating}
              onClick={cancelEditing}
              className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-gray-300 shadow-md bg-white"
            >
              <X size={15} color="red" />
              <p>ยกเลิก</p>
            </button>
            <button
              disabled={updating}
              onClick={updateContact}
              className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-gray-300 shadow-md bg-white"
            >
              <Check size={15} color="green" />

              <p>{updating ? "กำลังบันทึก..." : "บันทึก"}</p>
            </button>
          </span>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 absolute top-0 right-2 p-1.5 px-2 hover:bg-yellow-400 rounded-lg border border-gray-300 shadow-md bg-gray-50"
          >
            <Edit size={15} />
            <p>แก้ไข</p>
          </button>
        )}
      </span>

      <span className="w-full mt-5 flex items-center gap-3">
        <Phone size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col items-start gap-0.5">
          <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
          <input
            disabled={!editing}
            type="text"
            value={formatPhoneNumber(phone1)}
            onChange={(e) => {
              const value = e.target.value;
              if (value.split("-").join("").length > 10) return;
              setPhone1(value.split("-").join(""));
            }}
            placeholder="เพิ่มเบอร์โทรศัพท์ที่สามารถติดต่อได้"
            className={`w-full ${
              editing && " p-2 border border-gray-300 shadow-sm rounded-md px-3"
            }`}
          />
          {showOtherPhone && (
            <input
              disabled={!editing}
              type="text"
              value={phone1 === phone2 ? "" : formatPhoneNumber(phone2)}
              placeholder="เพิ่มเบอร์โทรศัพท์ที่สามารถติดต่อได้"
              onChange={(e) => {
                const value = e.target.value;
                if (value.split("-").join("").length > 10) return;
                setPhone2(value.split("-").join(""));
              }}
              className={`w-full ${
                editing &&
                "mt-1.5 p-2 border border-gray-300 shadow-sm rounded-md px-3"
              }`}
            />
          )}
          {!showOtherPhone && editing && (
            <button
              onClick={() => setShowOtherPhone(true)}
              className="text-sm border border-gray-300 bg-blue-500 rounded-lg text-white mt-1 p-2 hover:bg-blue-600 px-2.5 flex items-center gap-2"
            >
              <Plus size={18} color="white" />
              <p>เพิ่ม</p>
            </button>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-center gap-3">
        <Mail size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex items-start flex-col gap-0.5">
          <p className="text-sm text-gray-500">อีเมล</p>
          {roleId < 2 &&
            (email1?.includes("@rmu.ac.th") ||
              email2?.includes("@rmu.ac.th")) && (
              <span className="flex items-center gap-2 my-1">
                <CircleAlert color="orange" size={15} />
                <p className="text-xs text-gray-500">
                  อีเมลมหาลัยมีอายุการใช้งานที่จำกัด
                </p>
              </span>
            )}
          <input
            disabled={!editing}
            type="email"
            value={email1}
            onChange={(e) => setEmail1(e.target.value)}
            placeholder="เพิ่มอีเมล์ที่สามารถติดต่อได้"
            className={`w-full ${
              editing && "p-2 border border-gray-300 shadow-sm rounded-md px-3"
            }`}
          />
          {showOtherEmail && (
            <input
              disabled={!editing}
              type="email"
              value={email2 === email1 ? "" : email2}
              placeholder="เพิ่มอีเมล์ที่สามารถติดต่อได้"
              onChange={(e) => setEmail2(e.target.value)}
              className={`w-full ${
                editing &&
                " mt-1.5 p-2 border border-gray-300 shadow-sm rounded-md px-3"
              }`}
            />
          )}
          {!showOtherEmail && editing && (
            <button
              onClick={() => setShowOtherEmail(true)}
              className="text-sm border border-gray-300 bg-blue-500 rounded-lg text-white mt-1 p-2 hover:bg-blue-600 px-2.5 flex items-center gap-2"
            >
              <Plus size={18} color="white" />
              <p>เพิ่ม</p>
            </button>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-center gap-3">
        <Facebook size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">เฟสบุ๊ค</p>
          <input
            disabled={!editing}
            type="text"
            placeholder="เฟสบุ๊คที่สามารถติดต่อได้"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className={`${
              editing && "p-2 border border-gray-300 shadow-sm rounded-md px-3"
            }`}
          />
        </div>
      </span>
    </div>
  );
};
export default Contact;
