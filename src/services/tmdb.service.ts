import dotenv from "dotenv";

dotenv.config();

const api_key = process.env.TMDB_API_KEY;

const getSearchResults = async ({
  query,
  mediaType,
}: {
  query: string;
  mediaType: "movie" | "tv";
}) => {
  const url = `https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${api_key}`;
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
  getSearchResults({ query, mediaType: "movie" });

export const getTVSearchResults = (query: string) =>
  getSearchResults({ query, mediaType: "tv" });

export const getGenreArr = async () => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${api_key}`;
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
