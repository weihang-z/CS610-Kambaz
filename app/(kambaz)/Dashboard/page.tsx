"use client";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, Course } from "../Courses/reducer";
import { enrollInCourse, unenrollFromCourse, Enrollment } from "../Database/reducer";
import { useState } from "react";
import { RootState } from "../store";

export default function Dashboard() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
    department: "",
    credits: 0,
  });
  const [showAllCourses, setShowAllCourses] = useState(false);

  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: Enrollment) =>
        enrollment.user === currentUser?._id && enrollment.course === courseId
    );
  };

  // Handle enrollment actions
  const handleEnroll = (courseId: string) => {
    if (currentUser) {
      dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
    }
  };

  const handleUnenroll = (courseId: string) => {
    if (currentUser) {
      dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
    }
  };

  // Determine which courses to show
  const displayedCourses = showAllCourses
    ? courses
    : courses.filter((course: Course) => isEnrolled(course._id));

  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => dispatch(addNewCourse(course))}
            >
              {" "}
              Add{" "}
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourse(course))}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>{" "}
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "Published Courses"} ({displayedCourses.length})
      </h2>{" "}
      <hr />
      <Button
        variant="primary"
        className="float-end mb-3"
        onClick={() => setShowAllCourses(!showAllCourses)}
      >
        {showAllCourses ? "My Courses" : "Enrollments"}
      </Button>
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course: Course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/Courses/${course?._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    src="/images/reactjs.jpg"
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}{" "}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}{" "}
                    </CardText>
                    {(isEnrolled(course._id) || isFaculty) && (
                      <Button variant="primary"> Go </Button>
                    )}
                    
                    {showAllCourses && (
                      <>
                        {isEnrolled(course._id) ? (
                          <Button
                            variant="danger"
                            onClick={(event) => {
                              event.preventDefault();
                              handleUnenroll(course._id);
                            }}
                            className="float-end"
                          >
                            Unenroll
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            onClick={(event) => {
                              event.preventDefault();
                              handleEnroll(course._id);
                            }}
                            className="float-end"
                          >
                            Enroll
                          </Button>
                        )}
                      </>
                    )}
                    
                    {isFaculty && !showAllCourses && (
                      <>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            dispatch(deleteCourse(course._id));
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </Button>
                        <Button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
