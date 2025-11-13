import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Module } from "./[cid]/Modules/reducer";

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  author?: string;
}
interface CoursesState {
  courses: Course[];
  modules: Module[];
}

const initialState: CoursesState = {
 courses: [],
 modules: [],
};

const coursesSlice = createSlice({
 name: "courses",
 initialState,
 reducers: {
  setModules: (state, action) => {
    state.modules = action.payload;
  },

   setCourses: (state, { payload: courses }: PayloadAction<Course[]>) => {
     state.courses = courses;
   },
   addNewCourse: (state, { payload: course }: PayloadAction<Partial<Course>>) => {
     const newCourse: Course = { 
       ...course, 
       _id: uuidv4(),
       name: course.name || "",
       number: course.number || "",
       startDate: course.startDate || "",
       endDate: course.endDate || "",
       department: course.department || "",
       credits: course.credits || 0,
       description: course.description || ""
     };
     state.courses = [...state.courses, newCourse];
   },
   deleteCourse: (state, { payload: courseId }: PayloadAction<string>) => {
     state.courses = state.courses.filter(
       (course) => course._id !== courseId
     );
   },
   updateCourse: (state, { payload: course }: PayloadAction<Course>) => {
     state.courses = state.courses.map((c) =>
       c._id === course._id ? course : c
     );
   },
 },
});
export const { setCourses, addNewCourse, deleteCourse, updateCourse } =
 coursesSlice.actions;
export default coursesSlice.reducer;