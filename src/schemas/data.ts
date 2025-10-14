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
  Game = "Game",
  Article = "Article",
}

export const recommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedBy: z.string(),
  mediaType: z.nativeEnum(MediaType),
  dateAdded: z.string(),
  link: z.string(),
  description: z.string(),
  completed: z.boolean(),
  favourite: z.boolean(),
  message: z.string(),
  tags: z.array(z.string()),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
  tmdb_id: z.number(),
});

export type ObjectId = ObjectIdMongoDb;
export type WithId<T> = WithIdMongoDb<T>;
export type WithoutId<T> = WithoutIdMongoDb<T>;
