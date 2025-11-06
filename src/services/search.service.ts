import dotenv from "dotenv";
import {
  BookSearchResult,
  MovieOrTvSearchResult,
  MusicSearchResult,
  PodcastSearchResult,
  SearchResult,
  VideoSearchResult,
} from "../schemas/search";
import { MediaType } from "../schemas";
import { mapDataToSearchResult } from "../schemas/data-mapping-utils";

dotenv.config();

const tmdb_api_key = process.env.TMDB_API_KEY;
const listen_notes_api_key = process.env.LISTEN_NOTES_API_KEY!;
const youtube_api_key = process.env.YOUTUBE_API_KEY;
const books_api_key = process.env.BOOKS_API_KEY;

const getTmdbSearchResults = async ({
  query,
  mediaType,
}: {
  query: string;
  mediaType: "movie" | "tv";
}): Promise<SearchResult[]> => {
  const url = `https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${tmdb_api_key}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const res = await fetch(url, options);
  const data = await res.json();
  if (!data) {
    throw new Error(data.status_message);
  }
  const results = data.results as MovieOrTvSearchResult[];
  const searchResults = [];
  for (const result of results) {
    const searchResult = mapDataToSearchResult(
      result,
      mediaType === "movie" ? MediaType.Movie : MediaType.TVShow
    );
    if (result.genre_ids && result.genre_ids.length > 0) {
      const genresArr = await getMovieGenresArr();
      searchResults.push({
        ...searchResult,
        tags: genresArr
          .filter(({ id }) => result.genre_ids.includes(id))
          .map(({ name }) => name),
      });
    } else {
      searchResults.push(searchResult);
    }
  }
  return searchResults;
};

export const getMovieSearchResults = (query: string) =>
  getTmdbSearchResults({ query, mediaType: "movie" });

export const getTVSearchResults = (query: string) =>
  getTmdbSearchResults({ query, mediaType: "tv" });

export const getMovieGenresArr = async () => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${tmdb_api_key}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const res = await fetch(url, options);
  const data = await res.json();
  if (!data) {
    throw new Error(data.status_message);
  }
  return data.genres as { id: number; name: string }[];
};

export const getPodcastResults = async ({
  query,
  mediaType,
}: {
  query: string;
  mediaType: "podcast" | "episode";
}): Promise<SearchResult[]> => {
  const url = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(
    query
  )}&type=${mediaType}&offset=0`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-ListenAPI-Key": listen_notes_api_key,
    },
  };

  const res = await fetch(url, options);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.status_message);
  }
  const results = data.results as PodcastSearchResult[];
  return results.map((result) =>
    mapDataToSearchResult(result, MediaType.Podcast)
  );
};

export const getVideoSearchResults = async ({
  videoId,
}: {
  videoId: string;
}): Promise<SearchResult[]> => {
  const url = `https://www.googleapis.com/youtube/v3/videos?key=${youtube_api_key}&id=${videoId}&part=snippet,contentDetails`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const res = await fetch(url, options);
  const data = await res.json();

  if (!data.items || data.items.length < 1) {
    throw new Error("No videos with that id exist");
  }
  const results = data.items[0] as VideoSearchResult[];
  return results.map((result) =>
    mapDataToSearchResult(result, MediaType.Video)
  );
};

export const getBookSearchResults = async ({
  query,
}: {
  query: string;
}): Promise<SearchResult[]> => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&key=${books_api_key}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const res = await fetch(url, options);
  const data = await res.json();
  if (!data) throw new Error(data.status_message);
  const results = data.items as BookSearchResult[];
  return results.map((result) => mapDataToSearchResult(result, MediaType.Book));
};

export const getMusicSearchResults = async ({
  query,
  mediaType,
}: {
  query: string;
  mediaType: "album" | "track";
}): Promise<SearchResult[]> => {
  const url = `https://api.deezer.com/search?q=${mediaType}:"${encodeURIComponent(
    query
  )}"`;

  const res = await fetch(url);
  const data = await res.json();
  const results = data.data as MusicSearchResult[];

  return results
    .sort((a, b) => b.rank - a.rank)
    .map((result) => mapDataToSearchResult(result, MediaType.Book));
};
