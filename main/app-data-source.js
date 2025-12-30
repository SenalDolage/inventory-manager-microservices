"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = void 0;
var typeorm_1 = require("typeorm");
var product_1 = require("./src/entity/product");
exports.myDataSource = new typeorm_1.DataSource({
    type: "mongodb",
    url: "mongodb+srv://.......",
    database: "yt_inventory_main",
    entities: [product_1.Product],
    synchronize: true,
    logging: false,
});
