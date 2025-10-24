import { Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import { getErrResponse, getSchema, getSuccessResponse } from "../utils/api";
import { Collection, recommendationSchema, UserData } from "../schemas";

export const getAllItems = async (
  db: Db,
  collection: Collection,
  res: Response
) => {
  try {
    const items = await db.collection(collection).find().toArray();
    res.status(200).json(getSuccessResponse(items));
  } catch (error) {
    res.status(500).json(getErrResponse(error, `Error fetching ${collection}`));
  }
};

export const addNewItem = async (
  db: Db,
  collection: Collection,
  req: Request,
  res: Response
) => {
  try {
    const schema = getSchema(collection);
    const { error, success, data } = schema.safeParse(req.body);

    if (error || !success || !data) {
      res.status(400).json(getErrResponse(error, "Invalid data"));
    } else {
      const { insertedId } = await db.collection(collection).insertOne(data);
      const item = await db
        .collection(collection)
        .findOne({ _id: new ObjectId(insertedId) });

      res.status(201).json(getSuccessResponse(item));
    }
  } catch (error) {
    res.status(400).json(getErrResponse(error, "Invalid data"));
  }
};

export const getItemById = async (
  db: Db,
  collection: Collection,
  req: Request,
  res: Response
) => {
  const itemId = req.params.id;

  try {
    if (!ObjectId.isValid(itemId)) {
      res.status(400).json(getErrResponse(null, `Invalid ${collection} ID`));
    } else {
      const item = await db
        .collection("users")
        .findOne({ _id: new ObjectId(itemId) });
      if (!item) {
        res.status(404).json(getErrResponse(null, "Item not found"));
      } else {
        res.status(200).json(getSuccessResponse(item));
      }
    }
  } catch (error) {
    res
      .status(500)
      .json(getErrResponse(error, `Error retrieving ${collection}`));
  }
};

export const getItemBySub = async (
  db: Db,
  collection: Collection,
  req: Request,
  res: Response
) => {
  const itemSub = req.params.sub;

  try {
    const item = await db.collection("users").findOne({ sub: itemSub });
    if (!item) {
      res.status(404).json(getErrResponse(null, "Item not found"));
    } else {
      res.status(200).json(getSuccessResponse(item));
    }
  } catch (error) {
    res
      .status(500)
      .json(getErrResponse(error, `Error retrieving ${collection}`));
  }
};

export const addNewRecommendation = async (
  db: Db,
  collection: Collection,
  req: Request,
  res: Response
) => {
  const itemID = req.params.id;

  try {
    if (!ObjectId.isValid(itemID)) {
      res.status(400).json(getErrResponse(null, `Invalid ${collection} ID`));
    } else {
      const schema = recommendationSchema;
      const { error, success, data } = schema.safeParse(req.body);

      if (error || !success || !data) {
        res.status(400).json(getErrResponse(error, "Invalid data"));
      } else {
        const result = await db
          .collection<UserData>(collection)
          .updateOne(
            { _id: new ObjectId(itemID) },
            { $push: { recommendations: data } }
          );

        if (result.matchedCount === 0) {
          res.status(404).json(getErrResponse(null, "Item not found"));
        } else {
          const item = await db
            .collection(collection)
            .findOne({ _id: new ObjectId(itemID) });
          res.status(201).json(getSuccessResponse(item));
        }
      }
    }
  } catch (error) {
    res.status(500).json(getErrResponse(error, "Error updating item"));
  }
};

export const deleteItemById = async (
  db: Db,
  collection: Collection,
  req: Request,
  res: Response
) => {
  const itemId = req.params.id;

  try {
    if (!ObjectId.isValid(itemId)) {
      res.status(400).json(getErrResponse(null, "Invalid item ID"));
    } else {
      const result = await db
        .collection(collection)
        .deleteOne({ _id: new ObjectId(itemId) });

      if (result.deletedCount === 0) {
        res.status(404).json(getErrResponse(null, "Item not found"));
      } else {
        res.status(200).json(getSuccessResponse("Item deleted successfully"));
      }
    }
  } catch (error) {
    res.status(500).json(getErrResponse(error, "Error deleting item"));
  }
};
