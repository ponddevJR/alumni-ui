import { departments, faculties } from "@/data/faculty";

export const facultyText = (facId) => {
  return `${faculties.find((f) => f.id == Number(facId))?.name}`;
};

export const departmentText = (depId) => {
  return `สาขา${
    departments.find((dep) => Number(dep.id) === Number(depId))?.name
  }`;
};
