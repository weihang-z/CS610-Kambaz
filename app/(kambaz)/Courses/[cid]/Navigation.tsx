"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function CourseNavigation() {
  const { cid } = useParams<{ cid: string }>();
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href);
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          key={link}
          href={`/Courses/${cid}/${link == "People" ? "People/Table" : link}`}
          id={`wd-course-${link.toLowerCase()}-link`}
          className={`list-group-item text-danger border-0 ${isActive(`/Courses/${cid}/${link == "People" ? "People/Table" : link}`) ? "active" : ""}`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}
