import { z } from "zod";
import {
  ObjectId as ObjectIdMongoDb,
  WithId as WithIdMongoDb,
  WithoutId as WithoutIdMongoDb,
} from "mongodb";

export enum MediaType {
  Book = "Book",
  Podcast = "Podcast",
  Video = "Video",
  Movie = "Movie",
  TVShow = "TV show",
  Music = "Music",
}

export const searchResultSchema = z.object({
  title: z.string(),
  mediaType: z.nativeEnum(MediaType),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
  search_id: z.union([z.string(), z.number()]),
  is_listen_notes: z.boolean().optional(),
  is_tmdb: z.boolean().optional(),
  is_youtube: z.boolean().optional(),
  is_deezer: z.boolean().optional(),
  is_google_books: z.boolean().optional(),
});

export const recommendationSchema = searchResultSchema.extend({
  id: z.string(),
  addedBy: z.string(),
  dateAdded: z.string(),
  link: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean(),
  favourite: z.boolean(),
  message: z.string().optional(),
});

export const listSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdBy: z.string(),
  dateCreated: z.string(),
  description: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
  contents: z.array(z.string()).optional(),
});

export const userSchema = z.object({
  sub: z.string(),
  display_name: z.string().optional(),
  recommendations: z.array(recommendationSchema).optional(),
  lists: z.array(listSchema).optional(),
});

export type UserData = z.infer<typeof userSchema>;
export type ObjectId = ObjectIdMongoDb;
export type WithId<T> = WithIdMongoDb<T>;
export type WithoutId<T> = WithoutIdMongoDb<T>;
