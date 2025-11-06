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

const getTitleName = (
  selectedResult: UnknownSearchResult,
  mediaType: MediaType
) => {
  if (isMovieOrTvSearchResult(selectedResult, mediaType)) {
    return selectedResult.title ?? selectedResult.name ?? "";
  }
  if (isPodcastResult(selectedResult, mediaType)) {
    return selectedResult.title_original ?? "";
  }
  if (isVideoResult(selectedResult, mediaType)) {
    return selectedResult.snippet.title;
  }
  if (isMusicResult(selectedResult, mediaType)) {
    return selectedResult.title;
  }
  return (
    selectedResult.volumeInfo.title +
    (selectedResult.volumeInfo.authors
      ? ` by ${selectedResult.volumeInfo.authors.join(", ")}`
      : undefined)
  );
};

const getTitleDate = (
  selectedResult: UnknownSearchResult,
  mediaType: MediaType
) => {
  if (isMovieOrTvSearchResult(selectedResult, mediaType)) {
    return (selectedResult.release_date || selectedResult.first_air_date) ?? "";
  }
  if (isPodcastResult(selectedResult, mediaType)) {
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

const getTitle = (
  selectedResult: UnknownSearchResult,
  mediaType: MediaType
) => {
  const titleName = getTitleName(selectedResult, mediaType);
  const titleYear = getTitleDate(selectedResult, mediaType);
  return formatTitle(titleName, titleYear);
};

const getImageSrc = (
  selectedResult: UnknownSearchResult,
  mediaType: MediaType
) => {
  if (isMovieOrTvSearchResult(selectedResult, mediaType)) {
    return `https://image.tmdb.org/t/p/w342${selectedResult.poster_path}`;
  }
  if (isPodcastResult(selectedResult, mediaType)) {
    return selectedResult.image;
  }
  if (isVideoResult(selectedResult, mediaType)) {
    return selectedResult.snippet.thumbnails.high.url;
  }
  if (isMusicResult(selectedResult, mediaType)) {
    return selectedResult.album.cover_big;
  }
  return selectedResult.volumeInfo.imageLinks
    ? selectedResult.volumeInfo.imageLinks.thumbnail
    : "";
};

const getImage = (
  selectedResult: UnknownSearchResult,
  mediaType: MediaType
) => {
  return {
    src: getImageSrc(selectedResult, mediaType),
    alt: getTitleName(selectedResult, mediaType),
  };
};

const getDescription = (
  selectedResult: UnknownSearchResult,
  mediaType: MediaType
) => {
  if (isMovieOrTvSearchResult(selectedResult, mediaType)) {
    return selectedResult.overview;
  }
  if (isPodcastResult(selectedResult, mediaType)) {
    return selectedResult.description_original;
  }
  if (isVideoResult(selectedResult, mediaType)) {
    return selectedResult.snippet.description;
  }
  if (isMusicResult(selectedResult, mediaType)) {
    return "";
  }
  return selectedResult.volumeInfo.description;
};

export const mapDataToSearchResult = (
  data: UnknownSearchResult,
  mediaType: MediaType
): SearchResult => {
  return {
    title: getTitle(data, mediaType),
    mediaType,
    description: getDescription(data, mediaType),
    image: getImage(data, mediaType),
    search_id: data.id,
  };
};
