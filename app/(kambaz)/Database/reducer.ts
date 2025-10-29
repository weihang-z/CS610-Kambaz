import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enrollments } from ".";
import { v4 as uuidv4 } from "uuid";

export interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentsState = {
  enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollInCourse: (state, { payload: { userId, courseId } }: PayloadAction<{ userId: string; courseId: string }>) => {
      const newEnrollment: Enrollment = {
        _id: uuidv4(),
        user: userId,
        course: courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment];
    },
    unenrollFromCourse: (state, { payload: { userId, courseId } }: PayloadAction<{ userId: string; courseId: string }>) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) =>
          !(enrollment.user === userId && enrollment.course === courseId)
      );
    },
  },
});

export const { enrollInCourse, unenrollFromCourse } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;

