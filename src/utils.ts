import { getSimilarData } from "../utils/db";
import { Album, Music } from "./music/types";
import { User } from "./user/types";

type DataWithType<T> = Partial<T> & { type: string };

export const searchByName = async (name: string) => {
  const obj = {
    status: 200,
    data: [],
  };
  let query = {
    tableName: "user",
    selectQuery: "name, id, profile_photo, username",
    likeQuery: "%" + name + "%",
  };

  let users = await getSimilarData(query);
  if (users.data.length > 0) {
    users.data.forEach((user: DataWithType<User>) => (user.type = "user"));
    obj.data = obj.data.concat(users.data);
  }

  query = {
    tableName: "music",
    selectQuery: "name, id, cover_url",
    likeQuery: "%" + name + "%",
  };
  let musics = await getSimilarData(query);
  if (musics.data.length > 0) {
    musics.data.forEach((music: DataWithType<Music>) => (music.type = "music"));
    obj.data = obj.data.concat(musics.data);
  }

  query = {
    tableName: "album",
    selectQuery: "name, id, cover_url",
    likeQuery: "%" + name + "%",
  };
  let albums = await getSimilarData(query);
  if (albums.data.length > 0) {
    albums.data.forEach((album: DataWithType<Album>) => (album.type = "album"));
    obj.data = obj.data.concat(albums.data);
  }

  return obj;
};
