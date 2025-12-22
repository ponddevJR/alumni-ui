import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full pt-5 border-t border-blue-100 mt-10 mb-5 text-gray-800 flex flex-col items-center gap-0.5 text-xs">
      <p>&copy;. All rights reserved.</p>
      <span className="flex items-center gap-1">
        <p>พัฒนาโดย</p>{" "}
        <p className="text-blue-600">มหาวิทยาลัยราชภัฏมหาสารคาม</p>
      </span>
      <p className="text-center">
        เลขที่ 80 ถนนนครสวรรค์ ตำบลตลาด อำเภอเมือง จังหวัดมหาสารคาม 44000
        โทรศัพท์ 0-43722118-9
      </p>
      <p>นายปฐมพร วงสุวรรณ ผู้พัฒนา</p>
    </div>
  );
};
export default Footer;
