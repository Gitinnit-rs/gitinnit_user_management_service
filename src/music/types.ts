export type Music = {
  name: string;
  artist_id: string;
  release_date: Date;
  music_url: string;
  cover_url: string;
  tags: string[] | null;
  genre: string[] | null;
};

export type MusicMetaData = {
  name: string;
  artist_id: string;
  release_date: Date;
};

export type MusicMapping = {
  artist_id: string;
  music_id: string;
};

export type Album = {
  name: string;
  desc: string | null;
  cover_url?: string;
  artist_id: string;
  release_date: Date | null;
};

export type AlbumMapping = {
  music_id: string;
  album_id: string;
};
