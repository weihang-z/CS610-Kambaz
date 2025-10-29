"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./store";

export default function Lab4Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <Provider store={store}>{children}</Provider>;
}

