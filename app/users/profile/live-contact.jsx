import { apiConfig } from "@/config/api.config";
import useProvince from "@/hook/useProvince";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  Building2,
  Check,
  Edit,
  Mailbox,
  Map,
  MapPin,
  MapPinCheck,
  MapPinHouse,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const LiveContact = ({ address, tambon, amphure, province, reload }) => {
  const [editing, setEditing] = useState(false);
  const { loading, provinceOptions, provinces } = useProvince();
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      address: address || "",
      tambon: tambon || "",
      amphure: amphure || "",
      province: province || "",
    },
  });
  const amphures = provinces.filter((p) => p.name_th === watch("province"))[0]
    ?.districts;
  const tambons = amphures?.filter((p) => p.name_th === watch("amphure"))[0]
    ?.sub_districts;
  const zipCode = tambons?.filter((p) => p.name_th === watch("tambon"))[0]
    ?.zip_code;

  const [saving, setSaving] = useState(false);
  const saveData = async (data) => {
    setSaving(true);
    try {
      const payload = {
        address: data.address,
        tambon: data.tambon,
        amphure: data.amphure,
        province: data.province,
        zipcode: zipCode,
      };

      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/update-live",
        payload,
        { withCredentials: true }
      );

      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res?.status === 200) {
        await alerts.success();
        reload();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <span className="relative flex items-center gap-2">
        <MapPinHouse size={30} color="blue" />
        <p className="text-lg font-bold">ที่อยู่ที่ติดต่อได้</p>
        {editing ? (
          <span className="flex items-center gap-2 absolute top-0 right-2">
            <button
              onClick={() => {
                setEditing(false);
                reset();
              }}
              className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-gray-300 shadow-md bg-white"
            >
              <X size={15} color="red" />
              <p>ยกเลิก</p>
            </button>
            <button
              onClick={handleSubmit(saveData)}
              className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-gray-300 shadow-md bg-white"
            >
              <Check size={15} color="green" />
              <p>{saving ? "กำลังบันทึก..." : "บันทึก"}</p>
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
        <Building2 size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500 mb-1">ที่อยู่</p>
          {editing ? (
            <Controller
              name="address"
              rules={{ required: "โปรดระบุรายละเอียดที่อยู่" }}
              control={control}
              render={({ field }) => (
                <input
                  disabled={!editing}
                  {...field}
                  type="text"
                  value={field.value || ""}
                  placeholder="รายละเอียดที่อยู่"
                  className={`w-full ${
                    editing &&
                    " p-2 border border-gray-300 shadow-sm rounded-md px-3"
                  }`}
                />
              )}
            />
          ) : (
            <p>{watch("address") || address || "-"}</p>
          )}
          {errors.address && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.address.message}
            </small>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-center gap-3">
        <MapPin size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">ตำบล/แขวง</p>
          {editing ? (
            <Controller
              name="tambon"
              rules={{
                required: "โปรดเลือกตำบล",
              }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={
                    loading || !watch("province") || !watch("amphure")
                  }
                  options={tambons?.map((a) => ({
                    label: a.name_th,
                    value: a.name_th,
                  }))}
                  value={
                    tambons
                      ?.map((a) => ({
                        label: a.name_th,
                        value: a.name_th,
                      }))
                      .find((t) => t.value === watch("tambon")) || null
                  }
                  placeholder={"เลือกตำบล"}
                  onChange={(option) => {
                    setValue("tambon", option.value);
                  }}
                  isSearchable
                  className="mt-1 w-full"
                />
              )}
            />
          ) : (
            <p>{watch("tambon") || "-"}</p>
          )}
          {errors.tambon && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.tambon.message}
            </small>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-center gap-3">
        <Map size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">อำเภอ/เขต</p>
          {editing ? (
            <Controller
              name="amphure"
              rules={{
                required: "โปรดเลือกอำเภอ",
              }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={loading || !watch("province")}
                  options={amphures?.map((a) => ({
                    label: a.name_th,
                    value: a.name_th,
                  }))}
                  value={
                    amphures
                      ?.map((a) => ({
                        label: a.name_th,
                        value: a.name_th,
                      }))
                      .find((t) => t.value === watch("amphure")) || null
                  }
                  placeholder={"เลือกอำเภอ"}
                  onChange={(option) => {
                    setValue("tambon", "");
                    setValue("amphure", option.value);
                  }}
                  isSearchable
                  className="mt-1 w-full"
                />
              )}
            />
          ) : (
            <p>{watch("amphure") || "-"}</p>
          )}
          {errors.amphure && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.amphure.message}
            </small>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-center gap-3">
        <MapPinCheck size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">จังหวัด</p>
          {editing ? (
            <Controller
              name="province"
              rules={{
                required: "โปรดระบุจังหวัด",
              }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={loading}
                  options={provinceOptions}
                  placeholder={"เลือกจังหวัด"}
                  value={
                    provinces
                      ?.map((a) => ({
                        label: a.name_th,
                        value: a.name_th,
                      }))
                      .find((t) => t.value === watch("province")) || null
                  }
                  isSearchable
                  onChange={(option) => {
                    setValue("amphure", "");
                    setValue("tambon", "");
                    setValue("province", option.value);
                  }}
                  className="mt-1 w-full"
                />
              )}
            />
          ) : (
            <p>{watch("province") || "-"}</p>
          )}
          {errors.province && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.province.message}
            </small>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-center gap-3">
        <Mailbox size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">รหัสไปรษณีย์</p>
          <p>{zipCode || "-"}</p>
        </div>
      </span>
    </div>
  );
};
export default LiveContact;
