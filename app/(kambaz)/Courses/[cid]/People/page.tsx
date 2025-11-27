"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./Table/page";
import * as client from "./client";
import { User } from "./client";

export default function People() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid;
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    if (!cid) return;
    const enrolledUsers = await client.findUsersForCourse(cid);
    setUsers(enrolledUsers);
  }, [cid]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h3>People</h3>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}

