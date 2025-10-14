import { Router, Request, Response } from "express";
import { Db } from "mongodb";
import {
  addNewItem,
  deleteItemById,
  editItemById,
  getAllItems,
  getItemById,
} from "../controllers/recommendations.controller";

export const getRecommendationsRouter = (db: Db) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    await getAllItems(db, "recommendations", res);
  });

  router.post("/", async (req: Request, res: Response) => {
    await addNewItem(db, "recommendations", req, res);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    await getItemById(db, "recommendations", req, res);
  });

  router.patch("/:id", async (req: Request, res: Response) => {
    await editItemById(db, "recommendations", req, res);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    await deleteItemById(db, "recommendations", req, res);
  });

  return router;
};
