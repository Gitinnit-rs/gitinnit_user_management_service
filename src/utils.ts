import { getSimilarData } from "../utils/db";

export const searchByName = async (name: string) => {
  const obj = {
    status: 200,
    data: [],
  };
  let query = {
    tableName: "user",
    selectQuery: "name, id",
    likeQuery: "%" + name + "%",
  };

  let users = await getSimilarData(query);
  if (users.data.length > 0) {
    users.data.forEach(user => (user.type = "user"));
    obj.data = obj.data.concat(users.data);
  }

  query = {
    tableName: "music",
    selectQuery: "name, id",
    likeQuery: "%" + name + "%",
  };
  let musics = await getSimilarData(query);
  if (musics.data.length > 0) {
    musics.data.forEach(music => (music.type = "music"));
    obj.data = obj.data.concat(musics.data);
  }

  query = {
    tableName: "album",
    selectQuery: "name, id",
    likeQuery: "%" + name + "%",
  };
  let albums = await getSimilarData(query);
  if (albums.data.length > 0) {
    albums.data.forEach(album => (album.type = "album"));
    obj.data = obj.data.concat(albums.data);
  }

  return obj;
};
