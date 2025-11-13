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
import * as client from "../Courses/client";
import { useDispatch, useSelector } from "react-redux";
import { Course, setCourses  } from "../Courses/reducer";
import { enrollInCourse, unenrollFromCourse } from "../Database/reducer";
import { useEffect, useState, useCallback } from "react";
import { RootState } from "../store";

export default function Dashboard() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
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
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const fetchCourses = useCallback(async () => {
    if (!currentUser) {
      return;
    }
    try {
      const myCourses = await client.findMyCourses();
      dispatch(setCourses(myCourses));
    } catch (error) {
      console.error(error);
    }
  }, [currentUser, dispatch]);

  const fetchAllCourses = useCallback(async () => {
    try {
      const courses = await client.fetchAllCourses();
      setAllCourses(courses);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    })));
  };

  useEffect(() => {
    fetchCourses();
    fetchAllCourses();
  }, [fetchCourses, fetchAllCourses]);

  // Check if user is enrolled in a course (derived from Redux state)
  const isEnrolled = (courseId: string) => {
    return courses.some((course: Course) => course._id === courseId);
  };

  // Handle enrollment actions
  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      alert("Please sign in to enroll in courses.");
      return;
    }
    try {
      await client.enrollInCourse(currentUser._id, courseId);
      // Update Redux enrollments state (for course layout access check)
      dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
      // Refetch courses to update enrolled courses list
      await fetchCourses();
    } catch (error) {
      console.error("Failed to enroll:", error);
      alert("Failed to enroll in course.");
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!currentUser) {
      return;
    }
    try {
      await client.unenrollFromCourse(currentUser._id, courseId);
      // Update Redux enrollments state (for course layout access check)
      dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
      // Refetch courses to update enrolled courses list
      await fetchCourses();
    } catch (error) {
      console.error("Failed to unenroll:", error);
      alert("Failed to unenroll from course.");
    }
  };

  // Determine which courses to show
  const displayedCourses = showAllCourses
    ? allCourses
    : courses;

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
              onClick={onAddNewCourse}
            >
              {" "}
              Add{" "}
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
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
                            onDeleteCourse(course._id);
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
