"use client";
import { ReactNode, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import { RootState } from "../../store";

interface Enrollment {
  user: string;
  course: string;
}

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const course = courses.find((course) => course._id === cid);

  const isEnrolled = enrollments.some(
    (enrollment: Enrollment) =>
      enrollment.user === currentUser?._id && enrollment.course === cid
  );

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    if (!currentUser) {
      alert("Please sign in to access this course.");
      router.push("/Dashboard");
    } else if (!isEnrolled && !isFaculty) {
      alert("You are not enrolled in this course.");
      router.push("/Dashboard");
    }
  }, [currentUser, isEnrolled, isFaculty, router]);

  if (!currentUser || (!isEnrolled && !isFaculty)) {
    return null;
  }

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        <Breadcrumb course={course}   />
      </h2>{" "}
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
