import z from "zod";
import { searchResultSchema } from "./data";

export enum MediaType {
  Movie = "Movie",
  TVShow = "TV show",
  Music = "Music",
  Book = "Book",
  Video = "Video",
  Podcast = "Podcast",
  // Game = "Game",
  // Article = "Article",
}

export type SearchResult = z.infer<typeof searchResultSchema>;

export interface MovieOrTvSearchResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  release_date?: string;
  title?: string;
  name?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
}

export interface PodcastSearchResult {
  rss: string;
  description_highlighted: string;
  description_original: string;
  title_highlighted: string;
  title_original: string;
  publisher_highlighted: string;
  publisher_original: string;
  image: string;
  thumbnail: string;
  itunes_id: number;
  latest_episode_id: string;
  latest_pub_date_ms: number;
  earliest_pub_date_ms: number;
  id: string;
  genre_ids: number[];
  listennotes_url: string;
  total_episodes: number;
  audio_length_sec: number;
  update_frequency_hours: number;
  email: string;
  explicit_content: boolean;
  website: string;
  listen_score: string;
  listen_score_global_rank: string;
  has_sponsors: boolean;
  has_guest_interviews: false;
}

export interface VideoSearchResult {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
      standard: {
        url: string;
        width: number;
        height: number;
      };
      maxres: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string;
    };
    defaultAudioLanguage: string;
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: true;
    contentRating: {};
    projection: string;
  };
}

export interface BookSearchResult {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: {
      type: string;
      identifier: string;
    }[];
    readingModes: {
      text: boolean;
      image: boolean;
    };
    pageCount: number;
    printType: string;
    categories: string[];
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    panelizationSummary: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
    listPrice: {
      amount: number;
      currencyCode: string;
    };
    retailPrice: {
      amount: number;
      currencyCode: string;
    };
    buyLink: string;
    offers: {
      finskyOfferType: number;
      listPrice: {
        amountInMicros: number;
        currencyCode: string;
      };
      retailPrice: {
        amountInMicros: number;
        currencyCode: string;
      };
      giftable: true;
    }[];
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: {
      isAvailable: boolean;
      acsTokenLink: string;
    };
    pdf: {
      isAvailable: boolean;
      acsTokenLink: string;
    };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
  searchInfo: {
    textSnippet: string;
  };
}

type DeezerArtist = {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: "artist";
};

type DeezerAlbum = {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: "album";
};

export interface MusicSearchResult {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: DeezerArtist;
  album: DeezerAlbum;
  type: "track";
}

export type UnknownSearchResult =
  | MovieOrTvSearchResult
  | PodcastSearchResult
  | VideoSearchResult
  | BookSearchResult
  | MusicSearchResult;

export const isMovieOrTvSearchResult = (
  searchResult: UnknownSearchResult,
  mediaType: MediaType
): searchResult is MovieOrTvSearchResult =>
  mediaType === MediaType.Movie || mediaType === MediaType.TVShow;

export const isPodcastResult = (
  searchResult: UnknownSearchResult,
  mediaType: MediaType
): searchResult is PodcastSearchResult => mediaType === MediaType.Podcast;

export const isVideoResult = (
  searchResult: UnknownSearchResult,
  mediaType: MediaType
): searchResult is VideoSearchResult => mediaType === MediaType.Video;

export const isMusicResult = (
  searchResult: UnknownSearchResult,
  mediaType: MediaType
): searchResult is MusicSearchResult => mediaType === MediaType.Music;
