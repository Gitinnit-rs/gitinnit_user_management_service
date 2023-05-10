import {
  getData,
  insertRow,
  deleteData,
  addToStorage,
  getPublicUrl,
  getSimilarData,
} from "../../utils/db";
import { v4 as uuid } from "uuid";

import { Album, Music, MusicMapping, AlbumMapping } from "./types";

const addFileToStorage = async (
  type: string,
  fileId: string,
  file: any,
  artist_id: string,
) => {
  if (type !== "music" && type !== "images") {
    return { status: 400, data: "Error while adding music file" };
  }
  const fileOptions = {
    contentType: file.mimetype,
  };
  const file_obj = await addToStorage(
    `${type}/${artist_id}`,
    fileId,
    file.buffer,
    fileOptions,
  );
  if (file_obj.status !== 200) {
    return { status: 400, data: `Error while adding ${type} file` };
  }
  const publicUrl = await getPublicUrl(
    `${type}/${artist_id}`,
    file_obj.data.path,
  );
  if ("status" in publicUrl && publicUrl.status !== 200) {
    return { status: 400, data: `Error while getting ${type} file url` };
  }
  return {
    status: 200,
    data: (publicUrl.data as { publicUrl: string }).publicUrl,
  };
};

// CREATE A MUSIC ROW
export const addMusicFile = async (
  musicFile: any,
  coverImage: any,
  name: string,
  artist_id: string,
  tags: string[],
  genre: string[],
  artists: string[],
) => {
  let release_date = new Date();
  const fileId: string = uuid();
  const music_url = await addFileToStorage(
    "music",
    fileId,
    musicFile,
    artist_id,
  );
  if (music_url.status == 400) {
    return music_url;
  }

  const cover_url = await addFileToStorage(
    "images",
    fileId,
    coverImage,
    artist_id,
  );
  if (cover_url.status == 400) {
    return cover_url;
  }

  const newMusicObj: Music = {
    name,
    artist_id,
    release_date,
    tags,
    genre,
    music_url: music_url.data,
    cover_url: cover_url.data,
  };

  const music_obj = await insertRow("music", newMusicObj);
  if (music_obj.status !== 200) {
    return { status: 400, data: "Error while adding music meta data" };
  }
  const music_mapping: MusicMapping = {
    music_id: music_obj.data[0].id,
    artist_id: artist_id,
  };
  const new_obj = await insertRow("music_mapping", music_mapping);
  if (new_obj.status !== 200) {
    return { status: 400, data: "Error while adding mapping" };
  }
  if (artists.length === 0) {
    return music_obj;
  }

  var obj: boolean[] = await Promise.all(
    artists.map(async (artist): Promise<boolean> => {
      if (typeof artist === "string" && artist.trim() === "") {
        return true;
      }
      const music_mapping: MusicMapping = {
        music_id: music_obj.data[0].id,
        artist_id: artist,
      };
      const obj = await insertRow("music_mapping", music_mapping);
      return obj.status === 200;
    }),
  );
  if (
    obj.every(e => {
      return e === true;
    })
  ) {
    return { status: 200, data: { id: music_obj.data[0].id } };
  } else {
    return { status: 400, data: "Error while adding mapping" };
  }
};

// GET MUSIC BY ID
export const getMusic = async (searchQuery: object) => {
  const query = {
    tableName: "music",
    matchQuery: searchQuery,
  };
  if ("sort" in searchQuery) {
    //@ts-ignore
    query.sortQuery.column = searchQuery.sort;
    if ("ascending" in searchQuery) {
      //@ts-ignore
      query.sortQuery.ascending = searchQuery.ascending === "true";
      delete searchQuery.ascending;
    }
    delete searchQuery.sort;
  }
  if ("limit" in searchQuery) {
    //@ts-ignore
    query.limitQuery = +searchQuery.limit;
    delete searchQuery.limit;
  }
  if ("select" in searchQuery) {
    //@ts-ignore
    query.selectQuery = searchQuery.select;
    delete searchQuery.select;
  }
  query.matchQuery = searchQuery;
  let musics = await getData(query);
  if (musics.status !== 200) {
    return musics;
  }
  await Promise.all(
    musics.data.map(async (music: any) => {
      const newQuery = {
        tableName: "music_mapping",
        selectQuery: "artist_id",
        matchQuery: { music_id: music.id },
      };
      let artists = await getData(newQuery);
      if (artists.status !== 200) {
        return artists;
      }
      music.artists = await Promise.all(
        artists.data.map(async (artist: any) => {
          const anotherQuery = {
            tableName: "user",
            selectQuery: "name, username, id",
            matchQuery: { id: artist.artist_id },
          };
          let name = await getData(anotherQuery);
          if (name.data.length > 0) {
            return name.data[0];
          }
          return name;
        }),
      );
    }),
  );
  return musics;
};

// GET MUSIC BY NAME
export const getMusicByName = async (name: string) => {
  let query = {
    tableName: "music",
    selectQuery: "name, id",
    likeQuery: "%" + name + "%",
  };
  return await getSimilarData(query);
};

// CREATE A NEW ALBUM
export const createAlbum = async (
  coverImage: any,
  name: string,
  musics: string[],
  artist_id: string,
) => {
  const fileId: string = uuid();
  const cover_url = await addFileToStorage(
    "images",
    fileId,
    coverImage,
    artist_id,
  );
  if (cover_url.status == 400) {
    return cover_url;
  }

  let release_date = new Date();
  let album = {
    name,
    artist_id,
    release_date,
    cover_url: cover_url.data,
  };
  let album_obj = await insertRow("album", album);
  if (musics && musics?.length > 0) {
    return await addMusicAlbumMapping(
      album.artist_id,
      album_obj.data[0].id,
      musics,
    );
  }
  return album_obj;
};

const getMusicForAlbum = async (album_id: string) => {
  let query = {
    tableName: "album_mapping",
    selectQuery: "music_id",
    matchQuery: { album_id: album_id },
  };
  let musics = await getData(query);
  if (musics.status !== 200) {
    return musics;
  }
  let returnObj = <any>{ status: 200, data: [] };
  await Promise.all(
    musics.data.map(async (music: { music_id: string }) => {
      returnObj.data.push((await getMusic({ id: music.music_id })).data[0]);
    }),
  );
  return returnObj;
};
// GET Album
export const getAlbum = async (searchQuery: object) => {
  let query = {
    tableName: "album",
    matchQuery: searchQuery,
  };
  if ("sort" in searchQuery) {
    //@ts-ignore
    query.sortQuery.column = searchQuery.sort;
    if ("ascending" in searchQuery) {
      //@ts-ignore
      query.sortQuery.ascending = searchQuery.ascending === "true";
      delete searchQuery.ascending;
    }
    delete searchQuery.sort;
  }
  if ("limit" in searchQuery) {
    //@ts-ignore
    query.limitQuery = +searchQuery.limit;
    delete searchQuery.limit;
  }
  if ("select" in searchQuery) {
    //@ts-ignore
    query.selectQuery = searchQuery.select;
    delete searchQuery.select;
  }
  query.matchQuery = searchQuery;
  let albums = await getData(query);
  await Promise.all(
    albums.data.map(async (album: any) => {
      let musics = await getMusicForAlbum(album.id);
      if (musics.status !== 200) {
        return musics;
      }
      album.music = musics.data;
    }),
  );
  return albums;
};

// GET ALBUM BY NAME
export const getAlbumByName = async (name: string) => {
  let query = {
    tableName: "album",
    selectQuery: "name, id",
    likeQuery: "%" + name + "%",
  };
  return await getSimilarData(query);
};

// ADD MUSIC TO ALBUM
export const addMusicAlbumMapping = async (
  artist_id: string,
  album_id: string,
  musics: string[],
) => {
  const getQuery = {
    tableName: "album",
    matchQuery: { id: album_id },
  };
  const album = await getData(getQuery);
  if (album.status !== 200) {
    return {
      data: "Error while fetching album",
      status: 400,
    };
  }
  if (album.data[0].artist_id !== artist_id) {
    return {
      data: "Not the owner of the album",
      status: 400,
    };
  }
  var obj: boolean[] = await Promise.all(
    musics.map(async (music): Promise<boolean> => {
      const album_mapping: AlbumMapping = {
        album_id: album_id,
        music_id: music,
      };
      const obj = await insertRow("album_mapping", album_mapping);
      return obj.status === 200;
    }),
  );
  if (
    obj.every(e => {
      return e === true;
    })
  ) {
    return { status: 200, data: { id: album_id } };
  } else {
    return { status: 400, data: "Error while adding mapping" };
  }
};

export const removeMusicAlbumMapping = async (
  artist_id: string,
  album_id: string,
  musics: string[],
) => {
  const getQuery = {
    tableName: "album",
    matchQuery: { album_id: album_id },
  };
  const album = await getData(getQuery);
  if (album.data.owner_artist !== artist_id) {
    return {
      data: "Not the owner of the album",
      status: 400,
    };
  }
  var obj: boolean[] = await Promise.all(
    musics.map(async (music): Promise<boolean> => {
      const album_mapping: AlbumMapping = {
        album_id: album_id,
        music_id: music,
      };
      const deleteQuery = {
        tableName: "album_mapping",
        matchQuery: album_mapping,
      };
      const obj = await deleteData(deleteQuery);
      return obj.status === 200;
    }),
  );
  if (
    obj.every(e => {
      return e === true;
    })
  ) {
    return { status: 200, data: "SUCCESS" };
  } else {
    return { status: 400, data: "Error while adding mapping" };
  }
};

// TODO: convert to procedures
/*

1. increment procedure to increment the value of a field by a given number
2. Like / Dislike music will add an entry to like table and increment/decrement the like_count entry on music table

*/
