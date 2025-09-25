import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import {
  Calendar,
  CalendarCheck,
  Edit,
  Eye,
  HandCoins,
  Heart,
  Newspaper,
  Trash,
} from "lucide-react";
import dayjs from "@/libs/dayjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { alerts } from "@/libs/alerts";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const NewsAvtivity = ({ item, screenWidth, fetchData }) => {
  const { user } = useGetSession();
  const router = useRouter();

  const updateView = async (id) => {
    try {
      axios.put(
        apiConfig.rmuAPI + `/president/update-news-view/${id}`,
        {},
        { withCredentials: true }
      );
      router.push(`/users/news/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ต้องการลบข้อมูลนี้หรือไม่?",
      "ลบแล้วจะไม่สามารถกู้คืนได้",
      "ลบ"
    );
    if (!isConfirmed) return;
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-news/${id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        alerts.success("ลบข้อมูลแล้ว");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  return (
    <FadeInSection
      className={`w-[${screenWidth}px] hover:scale-101 cursor-pointer hover:shadow-gray-400 flex flex-col gap-2 rounded-lg shadow-md transition-all duration-200 overflow-hidden border border-gray-300`}
    >
      <div className="w-full h-[180px] relative">
        {" "}
        <img
          alt="news-img"
          className="w-full h-full object-cover"
          width={50}
          height={50}
          src={apiConfig.imgAPI + item?.thumnail}
        />
        <p className="text-sm p-1.5 shadow-md rounded-full absolute top-1.5 right-1.5 bg-gradient-to-r from-teal-300 to-yellow-100">
          {item?.category == 0 ? (
            <>
              <Newspaper size={15} color="blue" />
            </>
          ) : (
            <><HandCoins size={15} color="orange"/></>
          )}
        </p>
      </div>

      <div className="w-full flex flex-col gap-2.5 p-3">
        <div className="flex items-center w-full justify-between">
          <span className="flex items-center gap-1">
            <Calendar size={17} color="gray" />
            <p className="text-sm text-gray-600">
              : {dayjs(item?.createdAt).format("D MMMM BBBB")}
            </p>
          </span>
          <span className="flex items-center gap-1">
            <Eye size={17} color="gray" />
            <p className="text-sm text-gray-600">
              {item?.view?.toLocaleString()}
            </p>
          </span>
        </div>
        <p className="font-bold">{item?.title}</p>
        <p className="text-sm w-full break-words">{item?.short_detail} </p>

        {item?.category == 1 && Number(item?.target_money) > 0 && (
          <div className="w-full flex flex-col gap-1">
            <span className="w-full flex items-center justify-between">
              <p className="text-sm text-gray-600">ยอดบริจาคปัจจุบัน</p>
              <p className="text-green-500 text-sm">
                {Math.round((item?.current_money / item?.target_money) * 100)}%
              </p>
            </span>
            <div className="relative p-1.5 w-full bg-gray-200 rounded-full">
              <span
                style={{
                  width: `${Math.round(
                    (item?.current_money / item?.target_money) * 100
                  )}%`,
                }}
                className={`absolute bg-blue-400 top-0 h-full left-0 ${
                  Math.round(
                    (item?.current_money / item?.target_money) * 100
                  ) === 100
                    ? "rounded-full"
                    : " rounded-tl-full rounded-bl-full"
                }`}
              ></span>
            </div>
            <span className="flex w-full items-center text-sm justify-between">
              <p>{item?.current_money?.toLocaleString()} บาท</p>
              <p className="text-sm text-gray-600">
                เป้าหมาย: {item?.target_money?.toLocaleString()}
              </p>
            </span>
          </div>
        )}

        {item?.category == 1 && (
          <span className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarCheck size={18} color="gray" />
              <p className="">
                {item?.donate_end ? (
                  <>
                    โครงการสิ้นสุด{" "}
                    {dayjs(new Date(item?.donate_end)).format("D MMMM YYYY")}
                  </>
                ) : (
                  <>ไม่มีกำหนดวันสิ้นสุดโครงการ</>
                )}
              </p>
            </div>

            {!item?.target_money && (
              <p className="flex items-center gap-1.5 p-1.5 px-2 text-xs text-white bg-green-600 rounded-full w-fit">
                <FaHeart />
                <label htmlFor="">โครงการนี้ไม่กำหนดยอดบริจาค</label>
              </p>
            )}
          </span>
        )}

        {!user ? (
          <></>
        ) : Number(user?.roleId) > 4 ? (
          <FadeInSection className="w-full flex items-center justify-between gap-2">
            <p
              className={`p-1.5 px-2.5 text-xs ${
                item?.isPublish ? "bg-green-500" : "bg-gray-500"
              } text-white rounded-full `}
            >
              {item?.isPublish ? "เผยแพร่อยู่" : "ฉบับร่าง"}
            </p>
            <span className="flex items-center gap-2">
              <button
                onClick={() =>
                  router.push(
                    `/alumni-president/alumni-news/${item?.id}/add-new-activity`
                  )
                }
                className="text-sm flex items-center gap-2 p-2 px-3  hover:bg-blue-600 rounded-lg bg-blue-500 text-white"
              >
                <Edit size={17} /> <p>แก้ไข</p>
              </button>
              <button
                onClick={() => handleDelete(item?.id)}
                className="text-sm flex items-center gap-2 p-2 px-3  hover:bg-red-600 rounded-lg bg-red-500 text-white"
              >
                <Trash size={17} /> <p>ลบ</p>
              </button>
            </span>
          </FadeInSection>
        ) : (
          <FadeInSection
            className={
              "w-full text-center p-2 rounded-lg border border-gray-400 mt-1 hover:text-white hover:bg-blue-600"
            }
          >
            <button onClick={() => updateView(item?.id)}>
              {item?.category == 0 ? "อ่านต่อ" : "รายละเอียด"}
            </button>
          </FadeInSection>
        )}
      </div>
    </FadeInSection>
  );
};
export default NewsAvtivity;
