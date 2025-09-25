import Swal from "sweetalert2";

export const alerts = {
  err: (text = "โปรดตรวจสอบเครือข่ายและลองอีกครั้ง") => {
    return Swal.fire("เกิดข้อผิดพลาด", text, "error");
  },
  success: (text = "บันทึกข้อมูลแล้ว") => {
    return Swal.fire("สำเร็จ", text, "success");
  },
  confirmDialog: (
    title,
    text,
    confirmButtonText = "ยืนยัน",
    denyButtonText = "ยกเลิก"
  ) => {
    return Swal.fire({
      icon: "question",
      title,
      text,
      confirmButtonText,
      showDenyButton: true,
      denyButtonText,
    });
  },
};
