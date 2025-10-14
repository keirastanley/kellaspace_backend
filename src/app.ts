import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import { getRecommendationsRouter } from "./routes/recommendations.router";
import { tmdbRouter } from "./routes/tmdb.router";

dotenv.config();

const app = express();
const port = 4000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://kellaspace-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

MongoClient.connect(process.env.MONGO_URI!)
  .then((client) => {
    const db = client.db();
    app.use("/api/recommendations", getRecommendationsRouter(db));
    app.use("/api/tmdb", tmdbRouter);

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => console.error(err));
