import { Router, Request, Response } from "express";
import { Db } from "mongodb";
import {
  addNewItem,
  deleteItemById,
  editItemById,
  getAllItems,
  getItemById,
} from "../controllers/user.controller";

export const getUserRouter = (db: Db) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    await getAllItems(db, "user", res);
  });

  router.post("/", async (req: Request, res: Response) => {
    await addNewItem(db, "user", req, res);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    await getItemById(db, "user", req, res);
  });

  router.patch("/:id", async (req: Request, res: Response) => {
    await editItemById(db, "user", req, res);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    await deleteItemById(db, "user", req, res);
  });

  return router;
};
