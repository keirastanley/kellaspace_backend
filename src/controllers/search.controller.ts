import { Request, Response } from "express";
import * as searchService from "../services/search.service";
import { getErrResponse, getSuccessResponse } from "../utils/api";
import z from "zod";

const parseQuery = (query: unknown) => z.string().safeParse(query);

const handleInvalidQuery = (
  query: unknown,
  res: Response,
  message?: string
) => {
  const { error, success, data } = parseQuery(query);
  if (error || !success || !data) {
    res
      .status(400)
      .json(
        getErrResponse(
          new Error(message ?? "query cannot be undefined"),
          message ?? "query cannot be undefined"
        )
      );
  } else {
    return query as string;
  }
};

export const searchForMovie = async (req: Request, res: Response) => {
  const query = handleInvalidQuery(req.query.query, res);

  if (query) {
    try {
      const items = await searchService.getMovieSearchResults(query);
      res.status(200).json(getSuccessResponse(items));
    } catch (error) {
      res
        .status(500)
        .json(getErrResponse(error, `Error fetching search results`));
    }
  }
};

export const searchForTV = async (req: Request, res: Response) => {
  const query = handleInvalidQuery(req.query.query, res);

  if (query) {
    try {
      const items = await searchService.getTVSearchResults(query);
      res.status(200).json(getSuccessResponse(items));
    } catch (error) {
      res
        .status(500)
        .json(getErrResponse(error, `Error fetching search results`));
    }
  }
};

export const searchForPodcast = async (req: Request, res: Response) => {
  const query = handleInvalidQuery(req.query.query, res);

  if (query) {
    try {
      const items = await searchService.getPodcastResults({
        query,
        mediaType: "podcast",
      });
      res.status(200).json(getSuccessResponse(items));
    } catch (error) {
      res
        .status(500)
        .json(getErrResponse(error, `Error fetching search results`));
    }
  }
};

export const searchForVideo = async (req: Request, res: Response) => {
  const videoId = handleInvalidQuery(
    req.query.video_id,
    res,
    "video_id cannot be undefined"
  );

  if (videoId) {
    try {
      const items = await searchService.getVideoSearchResults({ videoId });
      res.status(200).json(getSuccessResponse(items));
    } catch (error) {
      res
        .status(500)
        .json(getErrResponse(error, `Error fetching search results`));
    }
  }
};

export const searchForBook = async (req: Request, res: Response) => {
  const query = handleInvalidQuery(req.query.query, res);

  if (query) {
    try {
      const items = await searchService.getBookSearchResults({ query });
      console.log(items);
      res.status(200).json(getSuccessResponse(items));
    } catch (error) {
      res
        .status(500)
        .json(getErrResponse(error, `Error fetching search results`));
    }
  }
};

export const searchForMusic = async (req: Request, res: Response) => {
  const query = handleInvalidQuery(req.query.query, res);

  if (query) {
    try {
      const items = await searchService.getMusicSearchResults({
        query,
        mediaType: "track",
      });
      // console.log(items);
      res.status(200).json(getSuccessResponse(items));
    } catch (error) {
      res
        .status(500)
        .json(getErrResponse(error, `Error fetching search results`));
    }
  }
};
