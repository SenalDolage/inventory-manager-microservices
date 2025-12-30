import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import "reflect-metadata";
import { myDataSource } from "../app-data-source";
import { Product } from "./entity/product";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// Initialize the data source
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.get("/api/products", async (req: Request, res: Response) => {
      try {
        const products = await myDataSource.getMongoRepository(Product).find();
        res.json(products);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
      }
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
