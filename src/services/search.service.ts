import dotenv from "dotenv";

dotenv.config();

const tmdb_api_key = process.env.TMDB_API_KEY;
const listen_notes_api_key = process.env.LISTEN_NOTES_API_KEY!;

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
  if (data.success === false) throw new Error(data.status_message);
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
  if (data.success === false) throw new Error(data.status_message);
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
  if (data.success === false) throw new Error(data.status_message);
  return data.results;
};
