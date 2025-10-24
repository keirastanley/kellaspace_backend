import { Request, Response } from "express";
import * as searchService from "../services/search.service";
import { getErrResponse, getSuccessResponse } from "../utils/api";
import z from "zod";

export const searchForMovie = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const { error, success, data } = z.string().safeParse(query);

  if (error || !success || !data) {
    res
      .status(400)
      .json(
        getErrResponse(
          new Error("query cannot be undefined"),
          "query cannot be undefined"
        )
      );
  }
  try {
    const items = await searchService.getMovieSearchResults(query);
    res.status(200).json(getSuccessResponse(items));
  } catch (error) {
    res
      .status(500)
      .json(getErrResponse(error, `Error fetching search results`));
  }
};

export const searchForTV = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const { error, success, data } = z.string().safeParse(query);

  if (error || !success || !data) {
    res
      .status(400)
      .json(
        getErrResponse(
          new Error("query cannot be undefined"),
          "query cannot be undefined"
        )
      );
  } else {
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
  const query = req.query.query as string;
  const { error, success, data } = z.string().safeParse(query);

  if (error || !success || !data) {
    res
      .status(400)
      .json(
        getErrResponse(
          new Error("query cannot be undefined"),
          "query cannot be undefined"
        )
      );
  } else {
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
  const videoId = req.query.video_id as string;
  const { error, success, data } = z.string().safeParse(videoId);

  if (error || !success || !data) {
    res
      .status(400)
      .json(
        getErrResponse(
          new Error("video_id cannot be undefined"),
          "Query cannot be undefined"
        )
      );
  } else {
    try {
      const items = await searchService.getVideoSearchResults({ videoId });
      console.log(items);
      res.status(200).json(getSuccessResponse(items));
    } catch (error) {
      res
        .status(500)
        .json(getErrResponse(error, `Error fetching search results`));
    }
  }
};

export const searchForBook = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const { error, success, data } = z.string().safeParse(query);

  if (error || !success || !data) {
    res
      .status(400)
      .json(
        getErrResponse(
          new Error("video_id cannot be undefined"),
          "Query cannot be undefined"
        )
      );
  } else {
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
  const query = req.query.query as string;
  console.log(query);
  const { error, success, data } = z.string().safeParse(query);

  if (error || !success || !data) {
    res
      .status(400)
      .json(
        getErrResponse(
          new Error("video_id cannot be undefined"),
          "Query cannot be undefined"
        )
      );
  } else {
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

export const getGenres = async (req: Request, res: Response) => {
  try {
    const items = await searchService.getMovieGenresArr();
    res.status(200).json(getSuccessResponse(items));
  } catch (error) {
    res.status(500).json(getErrResponse(error, `Error fetching genres`));
  }
};
