import { Router } from "express";
import {
  getGenres,
  searchForMovie,
  searchForTV,
} from "../controllers/tmdb.controller";

const tmdbRouter = Router();

tmdbRouter.get("/search/movies", searchForMovie);

tmdbRouter.get("/search/tv", searchForTV);

tmdbRouter.get("/genres", getGenres);

export { tmdbRouter };
