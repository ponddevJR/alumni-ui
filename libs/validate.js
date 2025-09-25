// ตรวจสอบรูปแบบอีเมล
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ตรวจสอบรูปแบบเบอร์โทรศัพท์ไทย (เริ่มด้วย 0 ตามด้วย 9 หรือ 8 หรือ 6 หลักแรก และตามด้วยตัวเลขรวมทั้งหมด 10 หลัก)
export function isValidThaiPhoneNumber(phone) {
  const phoneRegex = /^(0[689])\d{8}$/;
  return phoneRegex.test(phone);
}

export function formatPhoneNumber(phone) {
  // ลบอักขระที่ไม่ใช่ตัวเลขออก
  const cleaned = phone.replace(/\D/g, '');

  // ตรวจว่ามีความยาว 10 หลักหรือไม่ (เบอร์มือถือไทย)
  if (cleaned.length !== 10) return phone;

  // แปลงเป็นรูปแบบ xxx-xxx-xxxx
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}