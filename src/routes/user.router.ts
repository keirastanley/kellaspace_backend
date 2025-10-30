import { Router, Request, Response } from "express";
import { Db } from "mongodb";
import {
  addNewRecommendation,
  deleteUser,
  getUser,
  getUserBySub,
} from "../controllers/user.controller";
import { Collection } from "../schemas";

export const getUserRouter = (db: Db) => {
  const router = Router();

  router.get("/users/:id", async (req: Request, res: Response) => {
    await getUser(db, req, res);
  });

  router.get("/users/sub/:sub", async (req: Request, res: Response) => {
    await getUserBySub(db, req, res);
  });

  router.post(
    "/users/:id/recommendation",
    async (req: Request, res: Response) => {
      await addNewRecommendation(db, req, res);
    }
  );

  router.post("/users/:id/list", async (req: Request, res: Response) => {
    await addNewRecommendation(db, req, res);
  });

  router.patch(
    "/users/:id/recommendations/:recommendation_id",
    async (req: Request, res: Response) => {
      await addNewRecommendation(db, req, res);
    }
  );

  router.delete("/users/:id", async (req: Request, res: Response) => {
    await deleteUser(db, req, res);
  });

  router.delete(
    "/users/:id/recommendation/:recommendation_id",
    async (req: Request, res: Response) => {
      await deleteUser(db, req, res);
    }
  );

  return router;
};
