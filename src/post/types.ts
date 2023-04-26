enum PostType {
  Music = "music",
  Album = "album",
}

export type Post = {
  content_id: string;
  type: PostType;
  likes_count: number | null;
  comment_count: number | null;
  tags: string[] | null;
  caption: string | null;
  artist_id: string;
};

export type Comment = {
  artist_id: string;
  post_id: string;
  content: string;
  likes_count: number | null;
};

export type Like = {
  artist_id: string;
  post_id: string;
  like: boolean;
};
