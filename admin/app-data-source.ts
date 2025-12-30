import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "yt_inventory_admin",
    entities: ["src/entity/*.js"],
    logging: false,
    synchronize: true,
    driver: require("mysql2"),
})