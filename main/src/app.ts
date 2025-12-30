import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import "reflect-metadata";
import { myDataSource } from "../app-data-source";
import { Product } from "./entity/product";
import * as amqp from "amqplib/callback_api";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

async function start() {
  let productRepository;

  try {
    const db = await myDataSource.initialize();
    console.log("Data Source has been initialized!");
    productRepository = db.getRepository(Product);
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }

  // Connect to RabbitMQ
  amqp.connect(
    process.env.RABBIMQ_URL,
    (error, connection) => {
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

        app.use(cors({ origin: "http://localhost:3000" }));
        app.use(express.json());

        // Get products route
        app.get("/api/products", async (req: Request, res: Response) => {
          const products = await productRepository.find();
          res.json(products);
        });

        // Like product route
        // liking product through API request to admin and manually liking in main app db
        app.post("/api/products/:id/like", async (req: Request, res: Response) => {
          const product = await productRepository.findOneBy(req.params.id);
          if (product) {
            await axios.post("http://localhost:8000/api/products/" + product.admin_id + "/like", {});
            product.likes += 1;
            await productRepository.save(product);
            res.json(product);
          } else {
            res.status(404).json({ message: "Product not found" });
          }
        });

        // Create product queues
        channel.assertQueue("product_created", { durable: false });
        channel.assertQueue("product_updated", { durable: false });
        channel.assertQueue("product_deleted", { durable: false });

        // Handle product created events
        channel.consume(
          "product_created",
          async (msg: amqp.Message | null) => {
            const eventProduct = JSON.parse(msg?.content.toString() || "{}");

            const product = new Product();
            product.admin_id = eventProduct.id;
            product.title = eventProduct.title;
            product.image = eventProduct.image;
            product.likes = eventProduct.likes;

            await productRepository.save(product);
            console.log("Product created");
          },
          { noAck: true }
        );

        // Handle product updated events
        channel.consume(
          "product_updated",
          async (msg: amqp.Message | null) => {
            const eventProduct = JSON.parse(msg?.content.toString() || "{}");

            const product = await productRepository.findOneBy({
              admin_id: parseInt(eventProduct.id),
            });
            if (product) {
              product.title = eventProduct.title;
              product.image = eventProduct.image;
              product.likes = eventProduct.likes;

              await productRepository.save(product);
              console.log("Product updated");
            }
          },
          { noAck: true }
        );

        // Handle product deleted events
        channel.consume(
          "product_deleted",
          async (msg: amqp.Message | null) => {
            const eventProductID = JSON.parse(msg?.content.toString() || "{}");
            await productRepository.delete({
              admin_id: parseInt(eventProductID),
            });
            console.log("Product deleted");
          },
          { noAck: true }
        );

        // Start the Express server
        app.listen(8002, () => {
          console.log("Server is running on port 8002");
        });

        // Close connections
        process.on("SIGINT", () => {
          console.log("Closing RabbitMQ connection...");
          connection.close();
        });
      });
    }
  );
}

start();
