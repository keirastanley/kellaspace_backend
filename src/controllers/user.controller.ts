import { Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import { getErrResponse, getSchema, getSuccessResponse } from "../utils/api";
import {
  listSchema,
  recommendationSchema,
  UserData,
  userSchema,
} from "../schemas";
import z from "zod";

const isValidString = (val: unknown) => z.string().safeParse(val).success;

const handleInvalidUserIdentifier = (res: Response) =>
  res
    .status(400)
    .json(getErrResponse(null, "User identifier must be a string"));

const handleItemNotFound = (res: Response) =>
  res.status(404).json(getErrResponse(null, "Item not found"));

export const getUser = async (db: Db, req: Request, res: Response) => {
  const itemId = req.params.id;
  try {
    if (!ObjectId.isValid(itemId)) {
      return handleInvalidUserIdentifier(res);
    }

    const item = await db
      .collection("users")
      .findOne({ _id: new ObjectId(itemId) });
    if (!item) {
      return handleItemNotFound(res);
    }
    return res.status(200).json(getSuccessResponse(item));
  } catch (error) {
    return res.status(500).json(getErrResponse(error, "Error retrieving item"));
  }
};

export const getUserBySub = async (db: Db, req: Request, res: Response) => {
  const sub = req.params.sub;
  if (!sub || !isValidString(sub)) {
    return handleInvalidUserIdentifier(res);
  }
  try {
    const item = await db.collection("users").findOne({ sub });
    if (!item) {
      return handleItemNotFound(res);
    }
    return res.status(200).json(getSuccessResponse(item));
  } catch (error) {
    return res.status(500).json(getErrResponse(error, "Error retrieving user"));
  }
};

export const addNewUser = async (db: Db, req: Request, res: Response) => {
  try {
    const { error, success, data } = userSchema.safeParse(req.body);
    if (error || !success || !data) {
      return res.status(400).json(getErrResponse(error, "Invalid user data"));
    }

    const result = await db.collection("users").insertOne(data);

    if (!result.acknowledged) {
      return res
        .status(500)
        .json(getErrResponse(null, "Error adding new user"));
    }

    const newUser = await db
      .collection("users")
      .findOne({ _id: result.insertedId });

    return res.status(201).json(getSuccessResponse(newUser));
  } catch (error) {
    return res.status(500).json(getErrResponse(error, "Error adding new user"));
  }
};

export const addNewRecommendation = async (
  db: Db,
  req: Request,
  res: Response
) => {
  const item_id = req.params.id;

  try {
    if (!ObjectId.isValid(item_id)) {
      return handleInvalidUserIdentifier(res);
    }

    const schema = recommendationSchema;
    const { error, success, data } = schema.safeParse(req.body);

    if (error || !success || !data) {
      return res.status(400).json(getErrResponse(error, "Invalid data"));
    }

    const result = await db
      .collection<UserData>("users")
      .updateOne(
        { _id: new ObjectId(item_id) },
        { $push: { recommendations: data } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json(getErrResponse(null, "Item not found"));
    }

    const item = await db
      .collection("users")
      .findOne({ _id: new ObjectId(item_id) });
    return res.status(201).json(getSuccessResponse(item));
  } catch (error) {
    return res.status(500).json(getErrResponse(error, "Error updating item"));
  }
};

export const editRecommendation = async (
  db: Db,
  req: Request,
  res: Response
) => {
  const user_id = req.params.id;
  const recommendation_id = req.params.recommendation_id;

  try {
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json(getErrResponse(null, "Invalid user id"));
    }
    if (
      !recommendation_id ||
      !z.string().safeParse(recommendation_id).success
    ) {
      return res
        .status(400)
        .json(getErrResponse(null, "recommendation_id must be a string"));
    }

    const { success, data, error } = recommendationSchema
      .partial()
      .safeParse(req.body);

    if (error || !success || !data) {
      return res.status(400).json(getErrResponse(error, "Invalid data"));
    }

    const result = await db.collection("users").updateOne(
      {
        _id: new ObjectId(user_id),
        "recommendations._id": new ObjectId(recommendation_id),
      },
      {
        $set: Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            `recommendations.$.${key}`,
            value,
          ])
        ),
      }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json(getErrResponse(null, "Recommendation not found"));
    }

    const updatedItem = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user_id) });

    return res.status(200).json(getSuccessResponse(updatedItem));
  } catch (error) {
    return res
      .status(500)
      .json(getErrResponse(error, "Error updating recommendation"));
  }
};

export const deleteRecommendation = async (
  db: Db,
  req: Request,
  res: Response
) => {
  const user_id = req.params.id;
  const recommendation_id = req.params.recommendation_id;

  try {
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json(getErrResponse(null, "Invalid user id"));
    }
    if (!recommendation_id || !isValidString(recommendation_id)) {
      return res
        .status(400)
        .json(getErrResponse(null, "recommendation_id must be a string"));
    }

    const result = await db
      .collection<UserData>("users")
      .updateOne(
        { _id: new ObjectId(user_id) },
        { $pull: { recommendations: { id: recommendation_id } } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json(getErrResponse(null, "User not found"));
    }

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json(getErrResponse(null, "Recommendation not found"));
    }
  } catch (error) {
    return res
      .status(500)
      .json(getErrResponse(error, "Error updating recommendation"));
  }
};

export const addNewList = async (db: Db, req: Request, res: Response) => {
  const item_id = req.params.id;

  try {
    if (!ObjectId.isValid(item_id)) {
      return handleInvalidUserIdentifier(res);
    }
    const { error, success, data } = listSchema.safeParse(req.body);

    if (error || !success || !data) {
      return res.status(400).json(getErrResponse(error, "Invalid data"));
    }

    const result = await db
      .collection<UserData>("users")
      .updateOne({ _id: new ObjectId(item_id) }, { $push: { lists: data } });

    if (result.matchedCount === 0) {
      return res.status(404).json(getErrResponse(null, "Item not found"));
    }

    const item = await db
      .collection("users")
      .findOne({ _id: new ObjectId(item_id) });
    return res.status(201).json(getSuccessResponse(item));
  } catch (error) {
    return res.status(500).json(getErrResponse(error, "Error updating item"));
  }
};

export const deleteUser = async (db: Db, req: Request, res: Response) => {
  const item_id = req.params.id;

  try {
    if (!ObjectId.isValid(item_id)) {
      return handleInvalidUserIdentifier(res);
    }

    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(item_id) });

    if (result.deletedCount === 0) {
      return res.status(404).json(getErrResponse(null, "Item not found"));
    }

    return res
      .status(200)
      .json(getSuccessResponse("Item deleted successfully"));
  } catch (error) {
    res.status(500).json(getErrResponse(error, "Error deleting item"));
  }
};
