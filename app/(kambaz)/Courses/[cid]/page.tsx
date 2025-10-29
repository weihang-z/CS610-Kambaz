"use client";

import { redirect } from "next/navigation";
import { use } from "react";

export default function CoursesPage({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = use(params);
  redirect(`/Courses/${cid}/Home`);
}
