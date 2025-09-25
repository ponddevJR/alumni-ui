const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="z-[60] w-full h-full fixed top-0 right-0 bg-black/45 flex items-center justify-center">
      <div onClick={onClose} className="inset-0 absolute top-0 w-full h-full" />
      {children}
    </div>
  );
};
export default Modal;
