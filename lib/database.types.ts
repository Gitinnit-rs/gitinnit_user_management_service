export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      album: {
        Row: {
          artists: Json | null;
          cover: string | null;
          desc: string | null;
          id: string;
          music: string[] | null;
          name: string | null;
          release_date: string | null;
        };
        Insert: {
          artists?: Json | null;
          cover?: string | null;
          desc?: string | null;
          id?: string;
          music?: string[] | null;
          name?: string | null;
          release_date?: string | null;
        };
        Update: {
          artists?: Json | null;
          cover?: string | null;
          desc?: string | null;
          id?: string;
          music?: string[] | null;
          name?: string | null;
          release_date?: string | null;
        };
      };
      comment: {
        Row: {
          content: string | null;
          id: string;
          likes_count: number | null;
          post_id: string | null;
          timestamp: string | null;
          user_id: string | null;
        };
        Insert: {
          content?: string | null;
          id?: string;
          likes_count?: number | null;
          post_id?: string | null;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string | null;
          id?: string;
          likes_count?: number | null;
          post_id?: string | null;
          timestamp?: string | null;
          user_id?: string | null;
        };
      };
      follow: {
        Row: {
          follower_id: string;
          following_id: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
        };
      };
      likes: {
        Row: {
          like: boolean | null;
          post_id: string;
          timestamp: string | null;
          user_id: string;
        };
        Insert: {
          like?: boolean | null;
          post_id: string;
          timestamp?: string | null;
          user_id: string;
        };
        Update: {
          like?: boolean | null;
          post_id?: string;
          timestamp?: string | null;
          user_id?: string;
        };
      };
      music: {
        Row: {
          album_id: string | null;
          artist: string[] | null;
          file: string | null;
          ft: string[] | null;
          id: string;
          like_count: number | null;
          name: string | null;
          release_date: string | null;
        };
        Insert: {
          album_id?: string | null;
          artist?: string[] | null;
          file?: string | null;
          ft?: string[] | null;
          id?: string;
          like_count?: number | null;
          name?: string | null;
          release_date?: string | null;
        };
        Update: {
          album_id?: string | null;
          artist?: string[] | null;
          file?: string | null;
          ft?: string[] | null;
          id?: string;
          like_count?: number | null;
          name?: string | null;
          release_date?: string | null;
        };
      };
      post: {
        Row: {
          comment_count: number | null;
          content: string | null;
          id: string;
          likes_count: number | null;
          tag_id: string | null;
          type: string | null;
        };
        Insert: {
          comment_count?: number | null;
          content?: string | null;
          id?: string;
          likes_count?: number | null;
          tag_id?: string | null;
          type?: string | null;
        };
        Update: {
          comment_count?: number | null;
          content?: string | null;
          id?: string;
          likes_count?: number | null;
          tag_id?: string | null;
          type?: string | null;
        };
      };
      tags: {
        Row: {
          description: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          description?: string | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string | null;
        };
      };
      user: {
        Row: {
          bio: string | null;
          id: string;
          name: string | null;
          profile_photo: string | null;
        };
        Insert: {
          bio?: string | null;
          id?: string;
          name?: string | null;
          profile_photo?: string | null;
        };
        Update: {
          bio?: string | null;
          id?: string;
          name?: string | null;
          profile_photo?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
