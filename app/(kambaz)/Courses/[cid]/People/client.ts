import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
const COURSES_API = `${HTTP_SERVER}/api/courses`;

export interface User {
  _id?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  role?: string;
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
}

export const findUsersForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};

export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await axiosWithCredentials.post(USERS_API, user);
  return response.data;
};

export const updateUser = async (user: User) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return response.data;
};

