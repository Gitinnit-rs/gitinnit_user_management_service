import { getData, insertRow, updateData, deleteData } from "../../utils/db";

type User = {
  name: string | null;
  bio: string | null;
  profile_photo: string | null;
  music: number[] | null;
  followers: number[] | null;
  following: number[] | null;
};

// CREATE A NEW USER
export const createUser = async (user: User) => {
  return await insertRow("user", user);
};

// READ ALL USERS
export const getAllUsers = async () => {
  return await getData("user", "*", "");
};

// READ A SPECIFIC USER
export const getUser = async (id: string) => {
  return await getData("user", "*", id);
};

// UPDATE A SPECIFIC USER
export const updateUser = async (id: string, user: User) => {
  return await updateData("user", id, user);
};

// DELETE A USER
export const deleteUser = async (id: string) => {
  return await deleteData("user", id);
};
