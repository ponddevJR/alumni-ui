import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";

export const authService = {
  login: async (payload) => {
    const res = await axios.post(apiConfig.rmuAPI + "/auth/login", payload, {
      withCredentials: true,
    });

    if (res.data?.err) {
      return alerts.err(res?.data?.err);
    }

    if (res?.data?.isFirstLogin) {
      alerts.success(
        "พบว่าคุณยังไม่เปลี่ยนรหัสผ่าน เพื่อยืนยันตัวตนโปรดตรวจสอบอีเมล จากนั้นกรอกรหัสผ่านในขั้นตอนถัดไป"
      );
    }

    return res;
  },

  authSuccess: async (payload) => {
    return await axios.post(apiConfig.rmuAPI + "/auth/key-auth", payload, {
      withCredentials: true,
    });
  },
};
