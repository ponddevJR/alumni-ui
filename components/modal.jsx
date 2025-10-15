const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="z-[999] w-full h-full fixed top-0 right-0 bg-black/45 flex items-center justify-center p-5 lg:p-10">
      <div onClick={onClose} className="inset-0 absolute top-0 w-full h-full" />
      {children}
    </div>
  );
};
export default Modal;
