import dotenv from "dotenv";

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
}) => {
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
  if (!data.success) {
    throw new Error(data.status_message);
  }
  return data.results;
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
  if (!data.success) {
    throw new Error(data.status_message);
  }
  return data.genres;
};

export const getPodcastResults = async ({
  query,
  mediaType,
}: {
  query: string;
  mediaType: "podcast" | "episode";
}) => {
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
  return data.results;
};

export const getVideoSearchResults = async ({
  videoId,
}: {
  videoId: string;
}) => {
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
  return data.items[0];
};

export const getBookSearchResults = async ({ query }: { query: string }) => {
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
  return data.items;
};

export const getMusicSearchResults = async ({
  query,
  mediaType,
}: {
  query: string;
  mediaType: "album" | "track";
}) => {
  const url = `https://api.deezer.com/search?q=${mediaType}:"${encodeURIComponent(
    query
  )}"`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data.data as { rank: number }[]).sort((a, b) => b.rank - a.rank);
  } catch (err) {
    return err;
  }
};
