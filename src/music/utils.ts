import { getData, insertRow, updateData, deleteData } from "../../utils/db";
import { Album, Music, MusicMapping, AlbumMapping } from "./types";

// CREATE A MUSIC ROW
export const addMusicFile = async (music: Music, artists: string[]) => {
  const music_obj = await insertRow("music", music);
  artists.forEach(async (artist: string) => {
    const music_mapping: MusicMapping = {
      music_id: music_obj.data.id,
      artist_id: artist,
    };
    const obj = await addMusicArtistMapping(music_mapping);
  });
  return music_obj;
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
export const createAlbum = async (album: Album) => {
  return await insertRow("album", album);
};

// ADD MUSIC TO ALBUM
export const addMusicAlbumMapping = async (
  album_id: string,
  musics: string[],
) => {
  let obj = {};
  musics.forEach(async (music: string) => {
    const album_mapping: AlbumMapping = {
      album_id: album_id,
      music_id: music,
    };
    obj = await insertRow("album_mapping", album_mapping);
  });
  return obj;
};

// TODO: convert to procedures
/*

1. increment procedure to increment the value of a field by a given number
2. Like / Dislike music will add an entry to like table and increment/decrement the like_count entry on music table

*/
