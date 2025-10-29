import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { assignments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableDate?: string;
  availableUntilDate?: string;
}

interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: assignments,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload: assignment }: PayloadAction<Partial<Assignment>>) => {
      const newAssignment: Assignment = {
        _id: uuidv4(),
        title: assignment.title || "",
        description: assignment.description,
        points: assignment.points,
        dueDate: assignment.dueDate,
        availableDate: assignment.availableDate,
        availableUntilDate: assignment.availableUntilDate,
        course: assignment.course || "",
      };
      state.assignments = [...state.assignments, newAssignment];
    },
    deleteAssignment: (state, { payload: assignmentId }: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== assignmentId
      );
    },
    updateAssignment: (state, { payload: assignment }: PayloadAction<Assignment>) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignment._id ? assignment : a
      );
    },
    setAssignments: (state, { payload: assignments }: PayloadAction<Assignment[]>) => {
      state.assignments = assignments;
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment, setAssignments } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;

