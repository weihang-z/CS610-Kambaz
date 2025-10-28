import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "../ReduxExamples/HelloRedux/helloReducer";
import counterReducer from "../ReduxExamples/CounterRedux/counterReducer";
const store = configureStore({
  reducer: {
    helloReducer,
    counterReducer,
  },
});
export default store;