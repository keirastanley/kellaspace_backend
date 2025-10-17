import { Router } from "express";
import {
  getGenres,
  searchForMovie,
  searchForTV,
  searchForPodcast,
} from "../controllers/search.controller";

const searchRouter = Router();

searchRouter.get("/movie", searchForMovie);

searchRouter.get("/tv", searchForTV);

searchRouter.get("/podcast", searchForPodcast);

searchRouter.get("/genres", getGenres);

export { searchRouter };
