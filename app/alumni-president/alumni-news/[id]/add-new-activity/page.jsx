"use client";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Eye,
  HandCoins,
  Newspaper,
  RotateCcw,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { alerts } from "@/libs/alerts";
import { useParams } from "next/navigation";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/loading";
const TiptapEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

const page = () => {
  const params = useParams();
  const router = useRouter();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      short_detail: "",
      detail: "",
      target_money: "",
      current_money: "",
      donate_end: "",
    },
  });
  const [addType, setAddType] = useState(0);
  const [isPublish, setIsPublish] = useState(true);
  const [thumnailPreview, setThumnailPreview] = useState("");
  const [thumnailFile, setThumnailFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needMoney, setNeedMoney] = useState(true);
  const [fixedMoney, setFixedMoney] = useState(true);
  const [fiexedEndDate, setFixedEndDonate] = useState(true);

  const handleThumnail = (e) => {
    const file = e.target.files[0];
    setThumnailPreview(URL.createObjectURL(file));
    setThumnailFile(file);
  };

  // ฟังก์ชันสำหรับ strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  // ฟังก์ชันสำหรับเช็คว่า content มีเนื้อหาจริงหรือไม่
  const hasContent = (html) => {
    if (!html) return false;
    const textContent = stripHtmlTags(html).trim();
    return textContent.length > 0;
  };

  // ฟังก์ชันสำหรับ upload รูปภาพและแปลง base64 เป็น URL
  const uploadImage = async (base64Data) => {
    try {
      // แปลง base64 เป็น File object
      const response = await fetch(base64Data);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "image.png");

      // เรียก API upload (ต้องสร้าง API route นี้)
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await uploadResponse.json();
      return result.url; // คืนค่า URL ของรูปที่ upload แล้ว
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  // ฟังก์ชันสำหรับประมวลผล content และแปลง base64 images
  const processContentImages = async (htmlContent) => {
    if (!htmlContent) return htmlContent;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll('img[src^="data:image"]');

    // ถ้าไม่มีรูป base64 ให้ return เลย
    if (images.length === 0) return htmlContent;

    // Upload รูปทั้งหมด
    for (let img of images) {
      try {
        const imageUrl = await uploadImage(img.src);
        img.src = imageUrl;
      } catch (error) {
        console.error("Failed to upload image:", error);
        // ถ้า upload ไม่สำเร็จ ให้ลบรูปออก
        img.remove();
      }
    }

    return doc.body.innerHTML;
  };

  const saveData = async (data) => {
    if (!thumnailPreview) {
      return alerts.err("กรุณาเพิ่มรูปภาพปกของข่าว");
    }

    try {
      setIsLoading(true);

      // ประมวลผล content และ upload รูปภาพ
      const processedContent = await processContentImages(data.detail);

      // ข้อมูลที่จะส่งไป server
      const finalData = {
        ...data,
        detail: processedContent,
        isPublish,
        category: addType,
      };
      const formData = new FormData();
      for (const key in finalData) {
        formData.append(key, finalData[key]);
      }
      formData.append("thumnail", thumnailFile);

      const api =
        params.id == 0
          ? "/president/create-news"
          : "/president/update-news/" + params.id;

      const res = await axios.post(apiConfig.rmuAPI + api, formData, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        alerts.success();
        return router.push("/alumni-president/alumni-news");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alerts.err();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataEdit = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/get-news/${id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        reset({
          title: res.data?.title,
          short_detail: res.data.short_detail,
          detail: res.data.detail,
          target_money: res.data.target_money,
          current_money: res.data.current_money,
          donate_end: res.data.donate_end,
        });
        setIsPublish(res.data?.isPublish);
        setAddType(Number(res?.data?.category));
        setThumnailPreview(apiConfig.imgAPI + res.data.thumnail);
        setFixedMoney(res?.data?.target_money);
        setFixedEndDonate(res?.data?.donate_end);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  // fetchId toEdit
  useEffect(() => {
    if (params?.id == 0) {
      return;
    }

    fetchDataEdit(params.id);
  }, [params]);

  if (loading) {
    <div className="w-full py-10 flex flex-col items-center justify-center gap-2">
      <Loading type={2} />
      <p>กำลังโหลด...</p>
    </div>;
  }

  return (
    <div className=" p-5 rounded-lg bg-white w-full md:h-auto overflow-y-auto flex flex-col gap-2">
      <span className="flex items-center gap-2">
        <Link
          href="/alumni-president/alumni-news"
          className="flex items-center gap-2 p-2 px-3 text-sm shadow-md bg-blue-500 w-fit text-white rounded-lg"
        >
          <ArrowLeft size={20} />
          <p>กลับ</p>
        </Link>
        {params.id != 0 && (
          <button
            onClick={() => location.reload()}
            className=" p-2 px-3 flex items-center gap-2 text-sm shadow-md border border-gray-300 w-fit rounded-lg"
          >
            <RotateCcw size={20} />
            <p>โหลดใหม่อีกครั้ง</p>
          </button>
        )}
      </span>

      {params?.id == 0 && (
        <div className="w-full flex p-1 mt-2 rounded-md bg-gray-200 gap-2">
          <button
            onClick={() => setAddType(0)}
            className={`p-2 w-1/2 ${
              addType === 0 ? "bg-blue-500 text-white" : "bg-white"
            } flex text-xs items-center justify-center gap-2 lg:text-sm`}
          >
            <Newspaper size={17} /> <p>เพิ่มข่าวสารหรือกิจกรรมใหม่</p>
          </button>
          <button
            onClick={() => setAddType(1)}
            className={`p-2 w-1/2 flex items-center ${
              addType === 1 ? "bg-blue-500 text-white" : "bg-white"
            } justify-center gap-2 text-xs lg:text-sm`}
          >
            <HandCoins size={17} /> <p>เพิ่มโครงการบริจาค</p>
          </button>
        </div>
      )}

      <h1 className="text-xl font-bold mt-2">
        {params?.id == 0 ? "เพิ่ม" : "แก้ไข"}
        {addType === 0 ? "ข่าวสาร" : "โครงการบริจาค"}ใหม่
      </h1>
      <div className="flex flex-col pb-5 border-b border-gray-300">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 w-full flex-col flex">
            <label htmlFor="">
              {addType === 0 ? "หัวข้อข่าว/กิจกรรม" : "ชื่อโครงการบริจาค"}{" "}
              <small className="text-red-500 text-sm">*</small>
            </label>
            <Controller
              rules={{
                required:
                  addType === 0
                    ? "โปรดระบุหัวข้อข่าว"
                    : "โปรดระบุชื่อโครงการบริจาค",
              }}
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="mt-1 p-1.5 px-3 border border-gray-400 rounded-md text-[0.9rem]"
                  placeholder={
                    addType === 0 ? "ระบุหัวข้อข่าว" : "ระบุชื่อโครงการบริจาค"
                  }
                  value={field.value || ""}
                />
              )}
            />
            {errors.title && (
              <small className="text-red-500 text-sm">
                {errors.title.message}
              </small>
            )}

            {addType === 1 && (
              <span className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  value={!needMoney}
                  onChange={() => setNeedMoney(!needMoney)}
                  className="mt-0.5"
                />
                <p className="">โครงการนี้ไม่ต้องการเงินบริจาค</p>
              </span>
            )}

            {addType === 1 && needMoney && (
              <>
                <div className="flex lg:items-start gap-3 flex-col lg:flex-row mt-4">
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <label htmlFor="" className="">
                      เป้าหมายเงิน (บาท)
                      <small className="text-red-500 text-sm">*</small>
                    </label>
                    {fixedMoney ? (
                      <>
                        {" "}
                        <Controller
                          name="target_money"
                          rules={{
                            required: "โปรดระบุเป้ายอดบริจาค",
                            validate: (value) => {
                              if (value < 0) {
                                return "จำนวนเงินไม่ถูกต้อง";
                              }
                            },
                          }}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              {...field}
                              value={field.value || ""}
                              placeholder="เป้ายอดบริจาค"
                              className="mt-1 p-1.5 px-3 border border-gray-400 rounded-md text-[0.9rem]"
                            />
                          )}
                        />
                        {errors.target_money && (
                          <small className="text-sm text-red-500">
                            {errors.target_money.message}
                          </small>
                        )}
                      </>
                    ) : (
                      <div className="mt-1 p-1.5 px-3 border border-gray-400 rounded-md text-[0.9rem] bg-gray-300">
                        <p className="text-gray-500">ไม่กำหนดยอดบริจาค</p>
                      </div>
                    )}
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!fixedMoney}
                        onChange={() => setFixedMoney(!fixedMoney)}
                        className="mt-0.5"
                      />
                      <p className="text-sm mt-1 text-gray-700">
                        ไม่กำหนดยอดบริจาค
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <label htmlFor="" className="">
                      ยอดบริจาคปัจจุบัน (บาท)
                      <small className="text-red-500 text-sm">*</small>
                    </label>
                    <Controller
                      name="current_money"
                      rules={{
                        required: "โปรดระบุยอดบริจาคปัจจุบันหรือ 0",
                        validate: (value) => {
                          if (value < 0) {
                            return "จำนวนเงินไม่ถูกต้อง";
                          }
                        },
                      }}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="number"
                          {...field}
                          value={field.value}
                          placeholder="ยอดบริจาคปัจจุบัน"
                          className="mt-1 p-1.5 px-3 border border-gray-400 rounded-md text-[0.9rem]"
                        />
                      )}
                    />
                    {errors.current_money && (
                      <small className="text-sm text-red-500">
                        {errors.current_money.message}
                      </small>
                    )}
                  </div>
                </div>
              </>
            )}
            {addType === 1 && (
              <>
                <label htmlFor="" className="mt-4">
                  วันที่สิ้นสุดโครงการ (โปรดระบุเป็น ค.ศ.)
                  <small className="text-red-500 text-sm">*</small>
                </label>
                {fiexedEndDate ? (
                  <>
                    <Controller
                      name="donate_end"
                      rules={{ required: "โปรดระบุวันสิ้นสุดโครงการนี้" }}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="mt-1 p-1.5 px-3 border border-gray-400 rounded-md text-[0.9rem]"
                        />
                      )}
                    />
                    {errors.donate_end && (
                      <small className="text-sm text-red-500">
                        {errors.donate_end.message}
                      </small>
                    )}
                  </>
                ) : (
                  <div className="mt-1 p-1.5 px-3 border border-gray-400 rounded-md text-[0.9rem] bg-gray-300">
                    <p className="text-gray-500">ไม่กำหนดวันสิ้นสุดโครงการ</p>
                  </div>
                )}

                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!fiexedEndDate}
                    onChange={() => setFixedEndDonate(!fiexedEndDate)}
                    className="mt-0.5"
                  />
                  <p className="text-sm mt-1 text-gray-700">
                    ไม่กำหนดวันสิ้นสุดโครงการ
                  </p>
                </span>
              </>
            )}

            <label htmlFor="" className="mt-4">
              รายละเอียดย่อย{addType === 0 ? "" : "ของโครงการ"}{" "}
              <small className="text-red-500 text-sm">*</small>
            </label>
            <Controller
              rules={{
                required: "โปรดระบุรายละเอียดหรือสรุปสั้นๆ",
                validate: (value) => {
                  if (value && value.length < 18) {
                    return "รายละเอียดย่อยสั้นเกินไป";
                  }
                  if (value && value.length > 300) {
                    return "รายละเอียดย่อยยาวเกินไป";
                  }
                },
              }}
              name="short_detail"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value || ""}
                  className="outline-none p-2.5 rounded-md border border-gray-400 resize-y text-[0.9rem] h-[200px] mt-1"
                  placeholder="รายละเอียดย่อยหรือสรุปสั้นๆ"
                ></textarea>
              )}
            />
            {errors.short_detail && (
              <small className="text-red-500 text-sm">
                {errors.short_detail.message}
              </small>
            )}
          </div>
          <div className="flex flex-col w-full lg:w-1/2">
            <span className="flex gap-2 items-start lg:items-center flex-col lg:flex-row">
              <label htmlFor="" className="">
                รูปภาพปก <small className="text-red-500 text-sm">*</small>
              </label>
              <label
                htmlFor="img-change"
                className="mt-2.5 w-fit shadow-sm p-2 px-3 hover:bg-blue-600 transition-all duration-200 cursor-pointer flex items-center gap-2 text-sm bg-blue-500 text-white rounded-lg"
              >
                <input
                  type="file"
                  name=""
                  id="img-change"
                  onChange={handleThumnail}
                  className="hidden"
                />
                <Upload size={17} />
                <p>{thumnailPreview ? "เปลี่ยนรูป" : "อัปโหลด"}</p>
              </label>
            </span>
            {thumnailPreview && (
              <div className="relative w-full lg:w-2/3 mt-3 h-[200px] md:h-[250px] shadow-md">
                <button
                  onClick={() => {
                    setThumnailFile(null);
                    setThumnailPreview("");
                  }}
                  className="z-30 absolute top-[-0.8rem] right-[-0.5rem] p-1 rounded-full bg-red-500 text-white shadow-md"
                >
                  <X size={18} />
                </button>
                <img
                  src={thumnailPreview}
                  className="w-full h-full object-cover rounded-md border border-gray-400"
                  alt="Preview"
                />
              </div>
            )}
          </div>
        </div>
        <label htmlFor="" className="mt-5">
          รายละเอียดของ{addType === 0 ? "ข่าว" : "โครงการ"}{" "}
          <small className="text-red-500 text-sm">*</small>
        </label>
        <Controller
          rules={{
            required: `โปรดระบุรายละเอียดของ${
              addType === 0 ? "ข่าว" : "โครงการ"
            }`,
            validate: (value) => {
              if (!value) {
                return `โปรดระบุรายละเอียดของ${
                  addType === 0 ? "ข่าว" : "โครงการ"
                }`;
              }

              // เช็คว่ามีเนื้อหาจริงหรือไม่ (ไม่นับ HTML tags)
              if (!hasContent(value)) {
                return `โปรดระบุรายละเอียดของ${
                  addType === 0 ? "ข่าว" : "โครงการ"
                }`;
              }

              // เช็ค text content (ไม่รวม HTML tags)
              const textContent = stripHtmlTags(value).trim();
              if (textContent.length < 50) {
                return "เนื้อหาน้อยเกินไป (ต้องมีอย่างน้อย 50 ตัวอักษร)";
              }

              return true;
            },
          }}
          name="detail"
          control={control}
          render={({ field }) => (
            <TiptapEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.detail && (
          <small className="text-red-500 text-sm">
            {errors.detail.message}
          </small>
        )}
      </div>

      <div className="mt-5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
        <span className="flex items-center gap-2">
          <label htmlFor="" className="text-sm text-gray-700">
            สถานะ :
          </label>
          <select
            value={isPublish}
            onChange={(e) => setIsPublish(e.target.value === "true")}
            className="p-1.5 border border-gray-500 rounded-lg text-sm"
          >
            <option value={true}>เผยแพร่</option>
            <option value={false}>ฉบับร่าง</option>
          </select>
        </span>

        <button
          onClick={handleSubmit(saveData)}
          disabled={isLoading}
          className={`p-2.5 flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white border border-gray-400 shadow-md rounded-md`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <p>กำลังประมวลผล...</p>
            </>
          ) : (
            <>
              {isPublish ? <Eye size={20} /> : <Save size={20} />}
              <p>บันทึก{isPublish ? "และเผยแพร่" : "ฉบับร่าง"}</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default page;
