import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import dayjs from "@/libs/dayjs";
import axios from "axios";
import {
  Briefcase,
  Building,
  Calendar,
  Check,
  DollarSign,
  Edit,
  Map,
  Trash,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
const WorkCard = ({ e, handleEdit, fetchWorkExprerience }) => {
  const { user } = useGetSession();
  const pathName = usePathname();

  const deleteWork = async (id) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบประวัติ",
      "ต้องการลบประวัตินี้หรือไม่?"
    );
    if (!isConfirmed) return;

    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + "/alumni/work-delete/" + id,
        { withCredentials: true }
      );
      if (res?.status === 200) {
        alerts.success("ลบข้อมูลแล้ว");
        fetchWorkExprerience();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  return (
    <div className="w-full flex flex-col mt-5 p-5 rounded-xl border border-gray-300 shadow-md bg-white">
      <span className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase size={25} color="blue" />
          <p className="text-xl font-bold">{e?.job_position}</p>

          {e?.isCurrent && (
            <label
              htmlFor=""
              className="p-1 px-2.5 text-white bg-blue-500 text-xs rounded-full"
            >
              ปัจจุบัน
            </label>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user?.id === e?.alumniId && (
            <button
              onClick={() => handleEdit(e)}
              title="แก้ไข"
              className="hover:bg-yellow-300 p-1.5 rounded-md shadow-md border border-gray-400"
            >
              <Edit size={18} />
            </button>
          )}
          {user?.id === e?.alumniId && (
            <button
              onClick={() => deleteWork(e?.id)}
              title="ลบ"
              className="hover:bg-rose-400 p-1.5 rounded-md shadow-md border border-gray-400"
            >
              <Trash size={18} />
            </button>
          )}
        </div>
      </span>
      {pathName === "/users/work-history"&& (
        <span className="my-1 flex items-center gap-2">
          {e?.isOnTheLine ? (
            <Check color="green" size={17} />
          ) : (
            <X color="gray" size={17} />
          )}
          <p
            className={`text-sm ${
              e?.isOnTheLine ? "text-green-600" : "text-gray-600"
            }`}
          >
            {e?.isOnTheLine ? "งานตรงสายที่เรียน" : "งานไม่ตรงสายที่เรียน"}
          </p>
        </span>
      )}

      <span className="flex items-center gap-2 mt-2">
        <Building size={17} color="gray" />
        <p className="text-gray-600 text-[0.9rem]">{e?.company_name}</p>
      </span>
      <span className="flex items-center gap-2 mt-2">
        <Map size={17} color="gray" />
        <p className="text-gray-600 text-[0.9rem]">{e?.company_place}</p>
      </span>
      {user?.id === e?.alumniId && (
        <span className="flex items-center gap-2 mt-2">
          <DollarSign size={17} color="gray" />
          <p className="text-gray-600 text-[0.9rem]">
            {Number(e?.salary)?.toLocaleString("th")} บาท / เดือน
          </p>
        </span>
      )}

      <span className="flex items-center gap-2 mt-2">
        <Calendar size={17} color="gray" />
        <p className="text-gray-600 text-[0.9rem]">
          {" "}
          {dayjs(e?.start_date).format(`D MMMM BBBB`)} -{" "}
          {e?.isCurrent
            ? "ปัจจุบัน"
            : dayjs(e?.start_date).format(`D MMMM BBBB`)}
        </p>
      </span>

      <p className="w-full my-3 text-gray-600">{e?.job_detail}</p>

      {pathName === "/users/work-history" && (
        <>
          <label htmlFor="" className="text-[0.9rem]">
            หน้าที่รับผิดชอบ
          </label>
          {e?.job_responsibility?.split(",").map((t, index) => (
            <li key={index} className="ml-2 text-[0.9rem] text-gray-600">
              {t}
            </li>
          ))}

          <label htmlFor="" className="text-[0.9rem] mt-3">
            ทักษะที่ใช้
          </label>
          <p className="text-sm text-gray-600">{e?.job_skills}</p>
          {e?.remark && (
            <p className="p-2 text-sm bg-blue-50 mt-2">
              หมายเหตุ : {e?.remark}
            </p>
          )}
        </>
      )}
    </div>
  );
};
export default WorkCard;
