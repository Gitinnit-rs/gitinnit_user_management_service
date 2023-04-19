export type Music = {
  name: string;
  release_date: string | null;
  like_count: number | null;
};

export type MusicMetaData = {
  name: string;
  owner_artist: string;
  release_date: Date;
};

export type MusicMapping = {
  artist_id: string;
  music_id: string;
};

export type Album = {
  name: string;
  desc: string | null;
  cover?: string;
  owner_artist: string;
  release_date: Date | null;
};

export type AlbumMapping = {
  music_id: string;
  album_id: string;
};
