import { createContext, useContext, useState } from "react";

const dashbaordProvider = createContext(undefined);

export const DashboardContext = ({ children }) => {
  const [faculty, setFaculty] = useState();
  const [department, setDepartment] = useState();
  const [selectYearStart, setSelectYearStart] = useState();
  const [selectYearEnd, setSelectYearEnd] = useState();

  return (
    <dashbaordProvider.Provider
      value={{
        faculty,
        setFaculty,
        department,
        setDepartment,
        selectYearStart,
        setSelectYearEnd,
        selectYearEnd,
        setSelectYearStart,
      }}
    >
      {children}
    </dashbaordProvider.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(dashbaordProvider);

  return context;
};
