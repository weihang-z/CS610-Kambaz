"use client";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import * as db from "../../../../Database";
import { useParams } from "next/navigation";

export default function PeopleTable() {
  const users = db.users;
  const enrollments = db.enrollments;
  const cid = useParams().cid;
  const enrolledUsers = enrollments.filter((enrollment: any) => enrollment.course === cid);
  const usersInCourse = users.filter((user: any) => enrolledUsers.some((enrollment: any) => enrollment.user === user._id));

  return (
    <div id="wd-people-table">
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {usersInCourse.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
}
