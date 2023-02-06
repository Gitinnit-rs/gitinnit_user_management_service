import { getData, insertRow } from "../../utils/db";

type User = {
  name: string;
  bio: string;
  profile_photo: string;
  music: number[] | null;
  followers: number[] | null;
  following: number[] | null;
};

// CREATE A NEW USER
const createUser = async (user: User) => {
  return await insertRow("user", user);
};

// READ ALL USERS
const getUsers = async () => {
  return await getData("user", "*");
};

// READ A SPECIFIC USER

// UPDATE A SPECIFIC USER

// DELETE A USER
