import { DataSource } from "typeorm";
import { Product } from "./src/entity/product";

export const myDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  database: "yt_inventory_main",
  entities: [Product],
  synchronize: true,
  logging: false,
});
