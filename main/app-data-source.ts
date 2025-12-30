import { DataSource } from "typeorm";
import { Product } from "./src/entity/product";

export const myDataSource = new DataSource({
  type: "mongodb",
  url: "mongodb+srv://root:root@yt-inventory-main.kvrpeyx.mongodb.net/yt_inventory_main?retryWrites=true&w=majority",
  database: "yt_inventory_main",
  entities: [Product],
  synchronize: true,
  logging: false,
});
