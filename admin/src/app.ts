import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import "reflect-metadata";
import { myDataSource } from "../app-data-source";
import { Product } from "./entity/product";
import * as amqp from "amqplib/callback_api";
import * as dotenv from "dotenv";

dotenv.config();

// establish database connection
async function start() {
  try {
    await myDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }

  // Connect to RabbitMQ
  amqp.connect(process.env.RABBIMQ_URL, (error, connection) => {
    if (error) {
      console.error("Error connecting to RabbitMQ:", error);
      return;
    }

    connection.createChannel((error, channel) => {
      if (error) {
        console.error("Error creating RabbitMQ channel:", error);
        throw error;
      }
      console.log("Connected to RabbitMQ");

      const app = express();
      // Enable CORS
      app.use(cors({ origin: "http://localhost:3000" }));
      app.use(express.json());

      // Get all products
      app.get("/api/products", async function (req: Request, res: Response) {
        const products = await myDataSource.getRepository(Product).find();
        res.json(products);
      });

      // Create a product
      app.post("/api/products", async function (req: Request, res: Response) {
        const product = myDataSource.getRepository(Product).create(req.body);
        console.log("Creating product:", product);
        const result = await myDataSource.getRepository(Product).save(product);

        console.log("Product created:", result);

        // Send product to RabbitMQ
        channel.sendToQueue(
          "product_created",
          Buffer.from(JSON.stringify(result))
        );

        res.status(201).send(result);
      });

      // Get a single product
      app.get(
        "/api/products/:id",
        async function (req: Request, res: Response) {
          const product = await myDataSource.getRepository(Product).findOneBy({
            id: Number(req.params.id),
          });
          res.json(product);
        }
      );

      // Update a product
      app.put(
        "/api/products/:id",
        async function (req: Request, res: Response) {
          const product = await myDataSource.getRepository(Product).findOneBy({
            id: Number(req.params.id),
          });
          if (!product) {
            return res.status(404).send("Product not found");
          }
          // Merge the existing product with the new data
          myDataSource.getRepository(Product).merge(product, req.body);
          const result = await myDataSource
            .getRepository(Product)
            .save(product);

          // Send product to RabbitMQ
          channel.sendToQueue(
            "product_updated",
            Buffer.from(JSON.stringify(result))
          );

          res.json(result);
        }
      );

      // Delete a product
      app.delete(
        "/api/products/:id",
        async function (req: Request, res: Response) {
          const result = await myDataSource.getRepository(Product).delete({
            id: Number(req.params.id),
          });
          if (result.affected === 0) {
            return res.status(404).send("Product not found");
          }

          // Send product to RabbitMQ
          channel.sendToQueue(
            "product_deleted",
            Buffer.from(JSON.stringify(req.params.id))
          );

          res.status(204).send();
        }
      );

      // like a product
      app.post(
        "/api/products/:id/like",
        async function (req: Request, res: Response) {
          const product = await myDataSource.getRepository(Product).findOneBy({
            id: Number(req.params.id),
          });
          if (!product) {
            return res.status(404).send("Product not found");
          }
          product.likes++;
          const result = await myDataSource
            .getRepository(Product)
            .save(product);
          res.json(result);
        }
      );

      // Start the Express server
      app.listen(8000, () => {
        console.log("Server is running on port 8000");
      });

      // close connection
      process.on("SIGINT", () => {
        console.log("Closing RabbitMQ connection");
        connection.close();
      });
    });
  });
}

start();
