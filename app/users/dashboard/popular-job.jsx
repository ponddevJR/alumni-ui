
const PoplarJob = () => {
  return (
    <div className="w-full lg:w-1/2 p-5 flex flex-col gap-2 rounded-lg border border-green-300 mx-2 shadow-md bg-green-50">
      <span className="w-full flex items-center justify-between">
        <label className="font-bold flex items-center">อาชีพยอดนิยม (%) </label>
      </span>
      <span className="w-full flex items-center justify-between">
        <p>ศึกษาต่อ</p>
        <p className="text-blue-500">45%</p>
      </span>
      <span className="w-full flex items-center justify-between">
        <p>รับราชการ</p>
        <p className="text-blue-500">23%</p>
      </span>
      <span className="w-full flex items-center justify-between">
        <p>โปรแกรมเมอร์</p>
        <p className="text-blue-500">17%</p>
      </span>
      <span className="w-full flex items-center justify-between">
        <p>ธุรกิจส่วนตัว</p>
        <p className="text-blue-500">14%</p>
      </span>
      <span className="w-full flex items-center justify-between">
        <p>อื่นๆ</p>
        <p className="text-blue-500">1%</p>
      </span>
    </div>
  );
};
export default PoplarJob;
