import { Router, Request, Response } from "express";
import { Db } from "mongodb";
import {
  addNewItem,
  deleteItemById,
  editItemById,
  getAllItems,
  getItemById,
} from "../controllers/user.controller";
import { Collection } from "../schemas";

export const getUserRouter = (db: Db) => {
  const router = Router();

  router.get("/users", async (req: Request, res: Response) => {
    await getAllItems(db, Collection.Users, res);
  });

  router.post("/users", async (req: Request, res: Response) => {
    await addNewItem(db, Collection.Users, req, res);
  });

  router.get("/users/:id", async (req: Request, res: Response) => {
    await getItemById(db, Collection.Users, req, res);
  });

  router.patch("/users/:id", async (req: Request, res: Response) => {
    await editItemById(db, Collection.Users, req, res);
  });

  router.delete("/users/:id", async (req: Request, res: Response) => {
    await deleteItemById(db, Collection.Users, req, res);
  });

  return router;
};
