"use client";

import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment, Assignment } from "../reducer";
import { RootState } from "../../../../store";

export default function Editor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const isFaculty = currentUser?.role === "FACULTY";
  const isNewAssignment = aid === "new";
  const existingAssignment = !isNewAssignment 
    ? assignments.find((a: Assignment) => a._id === aid)
    : null;

  const [assignment, setAssignment] = useState<Assignment>({
    _id: "",
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntilDate: "",
    course: cid as string,
  });

  useEffect(() => {
    if (existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, [existingAssignment]);

  const handleSave = () => {
    if (isNewAssignment) {
      dispatch(addAssignment(assignment));
    } else {
      dispatch(updateAssignment(assignment));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  useEffect(() => {
    if (isNewAssignment && !isFaculty) {
      router.push(`/Courses/${cid}/Assignments`);
    }
  }, [isNewAssignment, isFaculty, router, cid]);

  if (!isNewAssignment && !existingAssignment) {
    return <div className="p-3">Assignment not found</div>;
  }

  if (isNewAssignment && !isFaculty) {
    return null;
  }

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control 
            value={assignment.title}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
            disabled={!isFaculty}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="wd-description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={assignment.description}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
            disabled={!isFaculty}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={2} className="d-flex align-items-center">
            <Form.Label>Points</Form.Label>
          </Col>
          <Col md={4}>
            <Form.Group controlId="wd-points" className="mb-3">
              <Form.Control 
                type="number"
                value={assignment.points}
                onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })}
                disabled={!isFaculty}
              />
            </Form.Group>
          </Col>
        </Row>
        
        {isFaculty && (
          <>
        <Row className="mb-3">
          <Col md={2} className="d-flex align-items-center">
            <Form.Label>Assignment Group</Form.Label>
          </Col>
          <Col md={4}>
            <Form.Group controlId="wd-group" className="mb-3">
              <Form.Select defaultValue="ASSIGNMENTS">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={2} className="d-flex align-items-center">
            <Form.Label>Display Grade as</Form.Label>
          </Col>
          <Col md={4}>
            <Form.Group controlId="wd-display-grade-as" className="mb-3">
              <Form.Select defaultValue="Percentage">
                <option>Percentage</option>
                <option>Points</option>
                <option>Complete/Incomplete</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={2} className="d-flex align-items-center">
            <Form.Label>Assignment Group</Form.Label>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Form.Group className="mb-3" controlId="wd-submission-type">
                  <Form.Select defaultValue="Online">
                    <option>Online</option>
                    <option>On Paper</option>
                    <option>External Tool</option>
                  </Form.Select>
                </Form.Group>

                <div className="border rounded p-3">
                  <div className="fw-semibold mb-2">Online Entry Options</div>
                  <Form.Check
                    id="wd-text-entry"
                    type="checkbox"
                    label="Text Entry"
                  />
                  <Form.Check
                    id="wd-website-url"
                    type="checkbox"
                    label="Website URL"
                    defaultChecked
                  />
                  <Form.Check
                    id="wd-media-recordings"
                    type="checkbox"
                    label="Media Recordings"
                  />
                  <Form.Check
                    id="wd-student-annotation"
                    type="checkbox"
                    label="Student Annotation"
                  />
                  <Form.Check
                    id="wd-file-upload"
                    type="checkbox"
                    label="File Uploads"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={2} className="d-flex align-items-center">
            <Form.Label>Assign</Form.Label>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Form.Group controlId="wd-assign-to" className="mb-3">
                  <Form.Label>Assign to</Form.Label>
                  <Form.Select defaultValue="Everyone">
                    <option>Everyone</option>
                    <option>Section 1</option>
                    <option>Section 2</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="wd-due-date" className="mb-3">
                  <Form.Label>Due</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignment.dueDate}
                    onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                    disabled={!isFaculty}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Col md={6} className="d-flex align-items-center">
                    <Form.Group controlId="wd-available-from" className="mb-3">
                      <Form.Label>Available from</Form.Label>
                      <Form.Control
                        type="date"
                        value={assignment.availableDate}
                        onChange={(e) => setAssignment({ ...assignment, availableDate: e.target.value })}
                        disabled={!isFaculty}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="d-flex align-items-center">
                    <Form.Group controlId="wd-available-until" className="mb-3">
                      <Form.Label>Until</Form.Label>
                      <Form.Control
                        type="date"
                        value={assignment.availableUntilDate || ""}
                        onChange={(e) => setAssignment({ ...assignment, availableUntilDate: e.target.value })}
                        disabled={!isFaculty}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button variant="secondary" className="me-2" onClick={handleCancel}>
          {isFaculty ? "Cancel" : "Back"}
        </Button>
        {isFaculty && (
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        )}
        </>
        )}
      </Form> 
    </div>
  );
}
