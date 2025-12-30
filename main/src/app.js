"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
require("reflect-metadata");
var app_data_source_1 = require("../app-data-source");
var product_1 = require("./entity/product");
var amqp = require("amqplib/callback_api");
var axios_1 = require("axios");
var dotenv = require("dotenv");
dotenv.config();
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var productRepository, db, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, app_data_source_1.myDataSource.initialize()];
                case 1:
                    db = _a.sent();
                    console.log("Data Source has been initialized!");
                    productRepository = db.getRepository(product_1.Product);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error during Data Source initialization:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3:
                    // Connect to RabbitMQ
                    amqp.connect(process.env.RABBIMQ_URL, function (error, connection) {
                        if (error) {
                            console.error("Error connecting to RabbitMQ:", error);
                            return;
                        }
                        connection.createChannel(function (error, channel) {
                            if (error) {
                                console.error("Error creating RabbitMQ channel:", error);
                                throw error;
                            }
                            console.log("Connected to RabbitMQ");
                            var app = express();
                            app.use(cors({ origin: "http://localhost:3000" }));
                            app.use(express.json());
                            // Get products route
                            app.get("/api/products", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                                var products;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, productRepository.find()];
                                        case 1:
                                            products = _a.sent();
                                            res.json(products);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            // Like product route
                            // liking product through API request to admin and manually liking in main app db
                            app.post("/api/products/:id/like", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                                var product;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, productRepository.findOneBy(req.params.id)];
                                        case 1:
                                            product = _a.sent();
                                            if (!product) return [3 /*break*/, 4];
                                            return [4 /*yield*/, axios_1.default.post("http://localhost:8000/api/products/" + product.admin_id + "/like", {})];
                                        case 2:
                                            _a.sent();
                                            product.likes += 1;
                                            return [4 /*yield*/, productRepository.save(product)];
                                        case 3:
                                            _a.sent();
                                            res.json(product);
                                            return [3 /*break*/, 5];
                                        case 4:
                                            res.status(404).json({ message: "Product not found" });
                                            _a.label = 5;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); });
                            // Create product queues
                            channel.assertQueue("product_created", { durable: false });
                            channel.assertQueue("product_updated", { durable: false });
                            channel.assertQueue("product_deleted", { durable: false });
                            // Handle product created events
                            channel.consume("product_created", function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                var eventProduct, product;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            eventProduct = JSON.parse((msg === null || msg === void 0 ? void 0 : msg.content.toString()) || "{}");
                                            product = new product_1.Product();
                                            product.admin_id = eventProduct.id;
                                            product.title = eventProduct.title;
                                            product.image = eventProduct.image;
                                            product.likes = eventProduct.likes;
                                            return [4 /*yield*/, productRepository.save(product)];
                                        case 1:
                                            _a.sent();
                                            console.log("Product created");
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, { noAck: true });
                            // Handle product updated events
                            channel.consume("product_updated", function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                var eventProduct, product;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            eventProduct = JSON.parse((msg === null || msg === void 0 ? void 0 : msg.content.toString()) || "{}");
                                            return [4 /*yield*/, productRepository.findOneBy({
                                                    admin_id: parseInt(eventProduct.id),
                                                })];
                                        case 1:
                                            product = _a.sent();
                                            if (!product) return [3 /*break*/, 3];
                                            product.title = eventProduct.title;
                                            product.image = eventProduct.image;
                                            product.likes = eventProduct.likes;
                                            return [4 /*yield*/, productRepository.save(product)];
                                        case 2:
                                            _a.sent();
                                            console.log("Product updated");
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, { noAck: true });
                            // Handle product deleted events
                            channel.consume("product_deleted", function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                var eventProductID;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            eventProductID = JSON.parse((msg === null || msg === void 0 ? void 0 : msg.content.toString()) || "{}");
                                            return [4 /*yield*/, productRepository.delete({
                                                    admin_id: parseInt(eventProductID),
                                                })];
                                        case 1:
                                            _a.sent();
                                            console.log("Product deleted");
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, { noAck: true });
                            // Start the Express server
                            app.listen(8002, function () {
                                console.log("Server is running on port 8002");
                            });
                            // Close connections
                            process.on("SIGINT", function () {
                                console.log("Closing RabbitMQ connection...");
                                connection.close();
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
start();
