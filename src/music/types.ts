export type Music = {
  name: string;
  owner_id: string;
  release_date: Date;
  like_count: number;
  music_file: string;
  cover_image: string;
  tags: string[] | null;
  genre: string[] | null;
};

export type MusicMetaData = {
  name: string;
  owner_id: string;
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
  owner_id: string;
  release_date: Date | null;
};

export type AlbumMapping = {
  music_id: string;
  album_id: string;
};
