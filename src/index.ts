import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { imagesRouter } from "./images/images.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "5000" as string, 10);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/images", imagesRouter);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});