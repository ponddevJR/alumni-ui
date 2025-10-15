import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Book, Calendar, Edit, GraduationCap, Map, Trash } from "lucide-react";

const StudyCard = ({ e, handleEdit, fetchWorkExprerience }) => {
  const { user } = useGetSession();

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
    <div className="p-5 rounded-lg bg-white shadow-md border border-gray-200 mt-5">
      <span className="w-full flex items-center justify-between">
        {e?.isCurrent && (
          <label
            htmlFor=""
            className="p-1 px-2.5 text-white bg-green-500 text-xs rounded-full"
          >
            กำลังศึกษาอยู่ในปัจจุบัน
          </label>
        )}
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
      <span className="mt-3 flex items-center gap-2">
        <GraduationCap size={25} color="green" />
        <p className="text-xl font-bold">
          {e?.edu_level} - {e?.edu_dep}
        </p>
      </span>
      <div className="flex flex-col gap-1.5 mt-3">
        <span className="flex items-center gap-2">
          <Book size={18} color="gray" />
          <p className="text-gray-600 text-[0.9rem]">
            {e?.edu_faculty} , {e?.edu_university}
          </p>
        </span>
        <span className="flex items-center gap-2">
          <Map size={18} color="gray" />
          <p className="text-gray-600 text-[0.9rem]">{e?.company_place}</p>
        </span>
        <span className="flex items-center gap-2">
          <Calendar size={18} color="gray" />
          <p className="text-gray-600 text-[0.9rem]">
            {e?.year_start} - {e?.isCurrent ? "ปัจจุบัน" : e?.year_end}
          </p>
        </span>
        <p className="mt-1.5">กิจกรรมและผลงานวิจัย</p>
        {e?.edu_performance ? (
          <>
            {" "}
            <div className="mt-1 flex ml-2.5 flex-col gap-0.5">
              {e?.edu_performance?.split(",").map((p, index) => (
                <li className="text-sm text-gray-600" key={index}>
                  {p}
                </li>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">ไม่พบข้อมูล</p>
        )}
      </div>
    </div>
  );
};
export default StudyCard;
