import { useState } from "react";
import Modal from "./modal";
import { Send, X } from "lucide-react";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";

const SendEmail = ({ show, onclose, sendToData, type }) => {
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const sendEmail = async () => {
    if (!text) {
      return alerts.err("ไม่สามารถส่งข้อความได้");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ส่งข้อความทางอีเมล์",
      `ต้องการส่งข้อความนี้หรือไม่?`,
      "ส่ง"
    );
    if (!isConfirmed) return;

    setSending(true);
    try {
      const payload = {
        id: type < 2 ? sendToData?.alumni_id : sendToData?.professor_id,
        roleId: type,
        text,
        sendMyContact,
      };
      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/send-email",
        payload,
        { withCredentials: true }
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res?.status === 200) {
        alerts.success("ส่งข้อความแล้ว");
        onclose();
        setText("");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setSending(false);
    }
  };

  const [sendMyContact, setSendMyContact] = useState(true);

  return (
    <Modal
      isOpen={show}
      onClose={() => {
        onclose();
        setText("");
      }}
    >
      <div className="z-50 lg:w-1/3 w-4/5 p-5 rounded-md border border-gray-300 shadow-md flex flex-col bg-white">
        <span className="w-full items-center flex justify-between">
          <h1 className="font-bold">
            ส่งข้อความหา{" "}
            {type < 2 ? sendToData?.prefix : sendToData?.academic_rank}
            {sendToData?.fname} {sendToData?.lname}
          </h1>
          <X
            onClick={() => {
              onclose();
              setText("");
            }}
            className="cursor-pointer"
          />
        </span>

        <label htmlFor="" className="mt-5">
          ข้อความ
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border resize-y h-32 mt-1 rounded-md border-gray-400 p-2 outline-0"
          placeholder="พิมพ์ข้อความของคุณ..."
        ></textarea>

        <span className="relative mt-3">
          <input
            checked={sendMyContact}
            onChange={() => setSendMyContact(!sendMyContact)}
            type="checkbox"
            className="absolute top-1.5"
          />
          <p className="text-[0.9rem] text-gray-600 ml-5">
            ส่งช่องทางติดต่อกลับของฉันไปด้วย
          </p>
        </span>

        <div className="w-full flex justify-end mt-5">
          <button
            onClick={sendEmail}
            disabled={sending}
            className="flex items-center hover:bg-blue-600 hover:shadow-md gap-2 p-2.5 rounded-md bg-blue-500 text-white text-sm"
          >
            {sending ? (
              "กำลังส่ง..."
            ) : (
              <>
                <Send size={18} color="white" />
                <p>ส่งข้อความ</p>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default SendEmail;
