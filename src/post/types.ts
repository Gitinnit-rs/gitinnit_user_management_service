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
  user_id: string;
};

export type Comment = {
  user_id: string;
  post_id: string;
  content: string;
  likes_count: number | null;
};

export type Like = {
  user_id: string;
  post_id: string;
  like: boolean;
};
