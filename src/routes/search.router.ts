import { Router } from "express";
import {
  getGenres,
  searchForMovie,
  searchForTV,
  searchForPodcast,
  searchForVideo,
  searchForBook,
  searchForMusic,
} from "../controllers/search.controller";

const searchRouter = Router();

searchRouter.get("/movie", searchForMovie);

searchRouter.get("/tv", searchForTV);

searchRouter.get("/podcast", searchForPodcast);

searchRouter.get("/video", searchForVideo);

searchRouter.get("/book", searchForBook);

searchRouter.get("/music", searchForMusic);

searchRouter.get("/genres", getGenres);

export { searchRouter };
