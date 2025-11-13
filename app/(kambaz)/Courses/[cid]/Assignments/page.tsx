"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  Button,
  InputGroup,
  Form,
  Card,
  ListGroup,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  BsSearch,
  BsPlusLg,
  BsGripVertical,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaRegFileAlt, FaTrash } from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { deleteAssignment, setAssignments, Assignment } from "./reducer";
import { RootState } from "../../../store";
import * as client from "./client";

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchAssignments = async () => {
    const assignments = await client.findAssignmentsForCourse(cid);
    dispatch(setAssignments(assignments));
  };

  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (assignmentToDelete) {
      await client.deleteAssignment(assignmentToDelete);
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments" className="p-3">
      <div className="clearfix mb-3">
        <div className="float-start me-2" style={{ minWidth: 320 }}>
          <InputGroup>
            <InputGroup.Text className="bg-white">
              <BsSearch />
            </InputGroup.Text>
            <Form.Control id="wd-search-assignment" placeholder="Search..." />
          </InputGroup>
        </div>
        {isFaculty && (
          <div className="float-end">
            <Button
              id="wd-add-assignment-group"
              variant="secondary"
              className="me-2"
            >
              <BsPlusLg className="me-2" /> Group
            </Button>
            <Link href={`/Courses/${cid}/Assignments/new`}>
              <Button id="wd-add-assignment" variant="danger">
                <BsPlusLg className="me-2" /> Assignment
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 text-secondary" />
            <div className="fw-semibold">ASSIGNMENTS</div>
            <div className="ms-auto d-flex align-items-center">
              <Badge bg="light" text="dark" className="me-2">
                40% of Total
              </Badge>
              <BsThreeDotsVertical className="text-secondary" />
            </div>
          </div>
        </Card.Header>

        <ListGroup
          variant="flush"
          id="wd-assignment-list"
          className="wd-assignment-list"
        >
          {assignments.filter((assignment: Assignment) => {
            return assignment.course === cid;
          }).map((assignment: Assignment) => {
            return (
              <ListGroup.Item key={assignment._id} className="wd-assignment-list-item py-3 px-3">
              <div className="d-flex align-items-start">
                <BsGripVertical className="me-2 mt-1 text-secondary" />
                <FaRegFileAlt className="me-2 mt-1 text-secondary fs-6" />
                <div className="flex-fill">
                  <Link
                    href={`/Courses/${cid}/Assignments/${assignment._id}`}
                    className="wd-assignment-link fw-semibold text-decoration-none"
                  >
                    {assignment.title}
                  </Link>
                  <div className="text-muted small mt-1">
                    <span className="text-success">Multiple Modules</span>
                    {assignment.availableDate && (
                      <>&nbsp;|&nbsp;<b>Not available until</b> {new Date(assignment.availableDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at 12:00am</>
                    )}
                    {assignment.dueDate && (
                      <>&nbsp;|&nbsp;<b>Due</b> {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at 11:59pm</>
                    )}
                    &nbsp;|&nbsp; {assignment.points} pts
                  </div>
                </div>
                <div className="ms-2 d-flex align-items-center">
                  {isFaculty && (
                    <FaTrash 
                      className="text-danger me-2 mb-1" 
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteClick(assignment._id);
                      }}
                    />
                  )}
                  <GreenCheckmark />
                  <BsThreeDotsVertical className="ms-2 text-secondary" />
                </div>
              </div>
            </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Card>

      <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
