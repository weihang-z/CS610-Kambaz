"use client";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../client";

interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
}

export default function PeopleTable() {
  const { cid } = useParams<{ cid: string }>();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    role: "STUDENT",
    loginId: "",
    section: "S101",
    lastActivity: new Date().toISOString().split('T')[0],
    totalActivity: "00:00:00"
  });

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchUsers = async () => {
    try {
      const enrolledUsers = await client.findUsersForCourse(cid);
      setUsers(enrolledUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        role: "STUDENT",
        loginId: "",
        section: "S101",
        lastActivity: new Date().toISOString().split('T')[0],
        totalActivity: "00:00:00"
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        const updatedUser = await client.updateUser({ ...editingUser, ...formData });
        setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      } else {
        const newUser = await client.createUser(formData);
        await fetchUsers(); 
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Failed to save user. Please try again.");
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await client.deleteUser(userToDelete);
        setUsers(users.filter(u => u._id !== userToDelete));
        setShowDeleteDialog(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  return (
    <div id="wd-people-table">
      {isFaculty && (
        <div className="mb-3">
          <Button 
            variant="danger" 
            onClick={() => handleOpenModal()}
            className="float-end"
          >
            <FaPlus className="me-2" />
            Add User
          </Button>
        </div>
      )}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
            {isFaculty && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName} </span>
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
              {isFaculty && (
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleOpenModal(user)}
                  >
                    <BsPencilSquare />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(user._id)}
                  >
                    <BsTrash />
                  </Button>
                </td>
              )}
            </tr>
        ))}
        </tbody>
      </Table>

      {/* User Form Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!!editingUser}
              />
            </Form.Group>

            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={formData.dob || ""}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role || "STUDENT"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="TA">TA</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Login ID</Form.Label>
              <Form.Control
                type="text"
                value={formData.loginId || ""}
                onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                value={formData.section || ""}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSaveUser}>
            {editingUser ? "Update" : "Create"} User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
