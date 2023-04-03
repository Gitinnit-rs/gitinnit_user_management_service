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

import { Album, Music, MusicMapping, AlbumMapping } from "./types";

// CREATE A MUSIC ROW
export const addMusicFile = async (
  musicFile: any,
  meta: string,
  artists_raw: string,
) => {
  let music_details = JSON.parse(meta);
  music_details.release_date = new Date();
  const artists = artists_raw.split(",");
  const fileId: string = uuid();

  const fileOptions = {
    contentType: musicFile.mimetype,
  };
  const music_file = await addToStorage(
    `music/${artists[0]}`,
    fileId,
    musicFile.buffer,
    fileOptions,
  );

  if (music_file.status !== 200) {
    return { status: 400, data: "Error while adding music file" };
  }
  const publicUrl = await getPublicUrl(
    `music/${artists[0]}`,
    music_file.data.path,
  );
  if ("status" in publicUrl && publicUrl.status !== 200) {
    return { status: 400, data: "Error while getting music file url" };
  }
  const newMusicObj = { ...music_details, file: publicUrl.data.publicUrl };
  const music_obj = await insertRow("music", newMusicObj);
  if (music_obj.status !== 200) {
    return { status: 400, data: "Error while adding music meta data" };
  }
  var obj: boolean[] = await Promise.all(
    artists.map(async (artist): Promise<boolean> => {
      const music_mapping: MusicMapping = {
        music_id: music_obj.data[0].id,
        artist_id: artist,
      };
      const obj = await addMusicArtistMapping(music_mapping);
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

// Add artist-music mapping
export const addMusicArtistMapping = async (music_mapping: MusicMapping) => {
  return await insertRow("music_mapping", music_mapping);
};

// GET MUSIC BY ID
export const getMusic = async (id: string) => {
  let query = {
    tableName: "music",
    matchQuery: { id: id },
  };
  return await getData(query);
};

// GET MUSIC BY ARTIST
export const getMusicByUser = async (id: string) => {
  let query = {
    tableName: "music_mapping",
    matchQuery: { artist_id: id },
  };
  return await getData(query);
};

// GET MUSIC BY NAME
export const getMusicByName = async (name: string) => {
  let query = {
    tableName: "music",
    likeQuery: "%" + name + "%",
  };
  return await getSimilarData(query);
};

// LIKE MUSIC
export const likeMusic = async (id: string) => {
  let query = {
    tableName: "music",
    matchQuery: { id: id },
  };
  let music_obj = await getData(query);
  let updateDataQuery = {
    tableName: "music",
    matchQuery: { id: id },
    updateQuery: { like_count: music_obj.data.like_count + 1 },
  };
  return updateData(updateDataQuery);
};

// DISLIKE MUSIC

export const dislikeMusic = async (id: string) => {
  let query = {
    tableName: "music",
    matchQuery: { id: id },
  };
  let music_obj = await getData(query);
  let updateDataQuery = {
    tableName: "music",
    matchQuery: { id: id },
    updateQuery: { like_count: music_obj.data.like_count - 1 },
  };
  return updateData(updateDataQuery);
};

// CREATE A NEW ALBUM
export const createAlbum = async (coverImage: any, album: Album) => {
  const fileOptions = {
    contentType: coverImage.mimetype,
  };
  const fileId: string = uuid();
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

// GET AN ALBUM
export const getAlbum = async (id: string) => {
  const query = {
    tableName: "album",
    matchQuery: { id: id },
  };
  return await getData(query);
};

// GET ALBUMS BY ARTIST
export const getAlbumByArtist = async (id: string) => {
  let query = {
    tableName: "albums",
    matchQuery: { owner_artist: id },
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
  album_id: string,
  musics: string[],
) => {
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
  album_id: string,
  musics: string[],
) => {
  var obj: boolean[] = await Promise.all(
    musics.map(async (music): Promise<boolean> => {
      const album_mapping: AlbumMapping = {
        album_id: album_id,
        music_id: music,
      };
      const obj = await deleteData("album_mapping", album_mapping);
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
