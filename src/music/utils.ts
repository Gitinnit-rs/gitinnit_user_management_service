import {
  getData,
  insertRow,
  updateData,
  deleteData,
  addToStorage,
  getPublicUrl,
  getSimilarData,
} from "../../utils/db";
import { v4 as uuid } from "uuid";

import {
  Album,
  Music,
  MusicMetaData,
  MusicMapping,
  AlbumMapping,
} from "./types";

const addFileToStorage = async (
  type: string,
  fileId: string,
  file: any,
  owner_id: string,
) => {
  if (type !== "music" && type !== "images") {
    return { status: 400, data: "Error while adding music file" };
  }
  const fileOptions = {
    contentType: file.mimetype,
  };
  const file_obj = await addToStorage(
    `${type}/${owner_id}`,
    fileId,
    file.buffer,
    fileOptions,
  );
  if (file_obj.status !== 200) {
    return { status: 400, data: `Error while adding ${type} file` };
  }
  const publicUrl = await getPublicUrl(
    `${type}/${owner_id}`,
    file_obj.data.path,
  );
  if ("status" in publicUrl && publicUrl.status !== 200) {
    return { status: 400, data: `Error while getting ${type} file url` };
  }
  return { status: 200, data: publicUrl.data.publicUrl };
};

// CREATE A MUSIC ROW
export const addMusicFile = async (
  musicFile: any,
  coverImage: any,
  name: string,
  owner_id: string,
  tags: string[],
  genre: string[],
  artists: string,
) => {
  let release_date = new Date();
  const fileId: string = uuid();
  console.log("ADDING MUSIC FILE");
  const music_url = await addFileToStorage(
    "music",
    fileId,
    musicFile,
    owner_id,
  );

  if (music_url.status == 400) {
    return music_url;
  }

  console.log("ADDING IMAGE FILE");
  const cover_url = await addFileToStorage(
    "images",
    fileId,
    coverImage,
    owner_id,
  );
  if (cover_url.status == 400) {
    return cover_url;
  }

  const newMusicObj: Music = {
    name,
    owner_id,
    release_date,
    tags: JSON.parse(tags),
    genre: JSON.parse(genre),
    music_url: music_url.data,
    cover_url: cover_url.data,
  };

  console.log("ADDING MUSIC OBJ", newMusicObj);

  const music_obj = await insertRow("music", newMusicObj);
  if (music_obj.status !== 200) {
    return { status: 400, data: "Error while adding music meta data" };
  }

  var obj: boolean[] = await Promise.all(
    JSON.parse(artists).map(async (artist): Promise<boolean> => {
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
  let musics = await getData(query);
  await Promise.all(
    musics.data.map(async (music: any) => {
      const newQuery = {
        tableName: "music_mapping",
        selectQuery: "artist_id",
        matchQuery: { music_id: music.id },
      };
      let artists = await getData(newQuery);
      music.artists = await Promise.all(
        artists.data.map(async (artist: any) => {
          const anotherQuery = {
            tableName: "user",
            selectQuery: "name, id",
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
export const createAlbum = async (coverImage: any, album: Album) => {
  const fileOptions = {
    contentType: coverImage.mimetype,
  };
  const fileId: string = uuid();
  album.release_date = new Date();
  const cover_image = await addToStorage(
    `images/${album.owner_artist}`,
    fileId,
    coverImage.buffer,
    fileOptions,
  );

  if (cover_image.status !== 200) {
    return {
      status: 400,
      data: "Error while adding cover image file" + cover_image.data,
    };
  }
  const publicUrl = await getPublicUrl(
    `images/${album.owner_artist}`,
    cover_image.data.path,
  );
  if ("status" in publicUrl && publicUrl.status !== 200) {
    return { status: 400, data: "Error while getting music file url" };
  }
  album.cover = publicUrl.data.publicUrl;
  return await insertRow("album", album);
};

// GET Album
export const getAlbum = async (searchQuery: object) => {
  let query = {
    tableName: "album",
    matchQuery: searchQuery,
  };
  return await getData(query);
};

// GET ALBUM BY NAME
export const getAlbumByName = async (name: string) => {
  let query = {
    tableName: "album",
    likeQuery: "%" + name + "%",
  };
  return await getSimilarData(query);
};

// ADD MUSIC TO ALBUM
export const addMusicAlbumMapping = async (
  user_id: string,
  album_id: string,
  musics: string[],
) => {
  const getQuery = {
    tableName: "album",
    matchQuery: { album_id: album_id },
  };
  const album = await getData(getQuery);
  if (album.data.owner_artist !== user_id) {
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
    return { status: 200, data: "SUCCESS" };
  } else {
    return { status: 400, data: "Error while adding mapping" };
  }
};

export const removeMusicAlbumMapping = async (
  user_id: string,
  album_id: string,
  musics: string[],
) => {
  const getQuery = {
    tableName: "album",
    matchQuery: { album_id: album_id },
  };
  const album = await getData(getQuery);
  if (album.data.owner_artist !== user_id) {
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
