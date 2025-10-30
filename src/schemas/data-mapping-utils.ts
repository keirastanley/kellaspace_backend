import { MediaType } from "./data";
import {
  isMovieOrTvSearchResult,
  isMusicResult,
  isPodcastResult,
  isVideoResult,
  SearchResult,
  UnknownSearchResult,
} from "./search";

const formatTitle = (titleName: string, titleYear?: string) =>
  `${titleName} ${titleYear ? `(${titleYear.slice(0, 4)})` : ""}`;

const getTitleName = (selectedResult: UnknownSearchResult) => {
  if (isMovieOrTvSearchResult(selectedResult)) {
    return selectedResult.title ?? selectedResult.name ?? "";
  }
  if (isPodcastResult(selectedResult)) {
    return selectedResult.title_original ?? "";
  }
  if (isVideoResult(selectedResult)) {
    return selectedResult.snippet.title;
  }
  if (isMusicResult(selectedResult)) {
    return selectedResult.title;
  }
  return (
    selectedResult.volumeInfo.title +
    (selectedResult.volumeInfo.authors
      ? ` by ${selectedResult.volumeInfo.authors.join(", ")}`
      : undefined)
  );
};

const getTitleDate = (selectedResult: UnknownSearchResult) => {
  if (isMovieOrTvSearchResult(selectedResult)) {
    return (selectedResult.release_date || selectedResult.first_air_date) ?? "";
  }
  if (isPodcastResult(selectedResult)) {
    return new Date(selectedResult.earliest_pub_date_ms).toISOString();
  }
  // if (isVideoResult(selectedResult)) {
  //   return selectedResult.snippet.publishedAt;
  // }
  // Book years are unreliable
  // Music years are not available
  // Video years are not needed
  return "";
};

const getTitle = (selectedResult: UnknownSearchResult) => {
  const titleName = getTitleName(selectedResult);
  const titleYear = getTitleDate(selectedResult);
  return formatTitle(titleName, titleYear);
};

const getImageSrc = (selectedResult: UnknownSearchResult) => {
  if (isMovieOrTvSearchResult(selectedResult)) {
    return `https://image.tmdb.org/t/p/w342${selectedResult.poster_path}`;
  }
  if (isPodcastResult(selectedResult)) {
    return selectedResult.image;
  }
  if (isVideoResult(selectedResult)) {
    return selectedResult.snippet.thumbnails.high.url;
  }
  if (isMusicResult(selectedResult)) {
    return selectedResult.album.cover_big;
  }
  return selectedResult.volumeInfo.imageLinks
    ? selectedResult.volumeInfo.imageLinks.thumbnail
    : "";
};

const getImage = (selectedResult: UnknownSearchResult) => {
  return {
    src: getImageSrc(selectedResult),
    alt: getTitleName(selectedResult),
  };
};

const getDescription = (selectedResult: UnknownSearchResult) => {
  if (isMovieOrTvSearchResult(selectedResult)) {
    return selectedResult.overview;
  }
  if (isPodcastResult(selectedResult)) {
    return selectedResult.description_original;
  }
  if (isVideoResult(selectedResult)) {
    return selectedResult.snippet.description;
  }
  if (isMusicResult(selectedResult)) {
    return "";
  }
  return selectedResult.volumeInfo.description;
};

const getDataSource = (mediaType: MediaType) => {
  switch (mediaType) {
    case MediaType.Book:
      return { is_google_books: true };
    case MediaType.Movie:
    case MediaType.TVShow:
      return { is_tmdb: true };
    case MediaType.Music:
      return { is_deezer: true };
    case MediaType.Podcast:
      return { is_listen_notes: true };
    case MediaType.Video:
    default:
      return { is_youtube: true };
  }
};

export const mapDataToSearchResult = (
  data: UnknownSearchResult,
  mediaType: MediaType
): SearchResult => ({
  title: getTitle(data),
  mediaType,
  description: getDescription(data),
  image: getImage(data),
  search_id: data.id,
  ...getDataSource(mediaType),
});
