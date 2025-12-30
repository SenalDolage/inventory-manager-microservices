import { DataSource } from "typeorm";
import { Product } from "./src/entity/product";

export const myDataSource = new DataSource({
  type: "mongodb",
  url: "mongodb+srv://.......",
  database: "yt_inventory_main",
  entities: [Product],
  synchronize: true,
  logging: false,
});
