import { Request, Response } from "express";
import * as tmdbService from "../services/tmdb.service";
import { getErrResponse, getSuccessResponse } from "../utils/api";

export const searchForMovie = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  try {
    const items = await tmdbService.getMovieSearchResults(query);
    res.status(200).json(getSuccessResponse(items));
  } catch (error) {
    res
      .status(500)
      .json(getErrResponse(error, `Error fetching getting search results`));
  }
};

export const searchForTV = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  try {
    const items = await tmdbService.getTVSearchResults(query);
    res.status(200).json(getSuccessResponse(items));
  } catch (error) {
    res
      .status(500)
      .json(getErrResponse(error, `Error fetching getting search results`));
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const items = await tmdbService.getGenreArr();
    console.log(items);
    res.status(200).json(getSuccessResponse(items));
  } catch (error) {
    res
      .status(500)
      .json(getErrResponse(error, `Error fetching getting genres`));
  }
};
