const Loading = ({type}) => {
  return (
    <div className={`w-8 h-8 border-3 ${type < 2 ? "border-white" : "border-blue-500"}  border-t-transparent rounded-full animate-spin`}></div>
  );
};
export default Loading;
