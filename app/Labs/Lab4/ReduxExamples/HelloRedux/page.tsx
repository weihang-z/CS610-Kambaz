"use client";
import { useSelector } from "react-redux";
import { Lab4RootState } from "../../store";

export default function HelloRedux() {
  const { message } = useSelector((state: Lab4RootState) => state.helloReducer);
  return (
    <div id="wd-hello-redux">
      <h3>Hello Redux</h3>
      <h4>{message}</h4> <hr />
    </div>
  );
}
