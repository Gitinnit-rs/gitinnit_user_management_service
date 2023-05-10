enum PostType {
  music,
  album,
  text,
}

export type Post = {
  type: PostType;
  caption: string | null;
  artist_id: string;

  content_id?: string;
  likes_count?: number | null;
  comment_count?: number | null;
  tags?: string[] | null;
  image_url?: string | null;
  release_date?: Date | null;
};

export type Comment = {
  artist_id: string;
  post_id: string;
  content: string;
  likes_count?: number | null;
};

export type Like = {
  artist_id: string;
  post_id: string;
  like: boolean;
};
