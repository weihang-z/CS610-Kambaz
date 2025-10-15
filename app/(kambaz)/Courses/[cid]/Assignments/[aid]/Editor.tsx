"use client";

import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { useParams } from "next/navigation";
import Link from "next/link";
import { assignments } from "@/app/(kambaz)/Database";

export default function Editor() {
  const { cid, aid } = useParams();
  const assignment = assignments.find((a: any) => a._id === aid);

  if (!assignment) {
    return <div className="p-3">Assignment not found</div>;
  }

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control defaultValue={assignment.title} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="wd-description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            defaultValue={assignment.description}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={2} className="d-flex align-items-center">
            <Form.Label>Points</Form.Label>
          </Col>
          <Col md={4}>
            <Form.Group controlId="wd-points" className="mb-3">
              <Form.Control defaultValue={assignment.points} />
            </Form.Group>
          </Col>
        </Row>

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
                    defaultValue={assignment.dueDate}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Col md={6} className="d-flex align-items-center">
                    <Form.Group controlId="wd-available-from" className="mb-3">
                      <Form.Label>Available from</Form.Label>
                      <Form.Control
                        type="date"
                        defaultValue={assignment.availableDate}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="d-flex align-items-center">
                    <Form.Group controlId="wd-available-until" className="mb-3">
                      <Form.Label>Until</Form.Label>
                      <Form.Control
                        type="date"
                        defaultValue="2024-05-28"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
        </Link>
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="danger">Save</Button>
        </Link>
      </Form>
    </div>
  );
}
