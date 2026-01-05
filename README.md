## inventory-manager-microservices

Event-driven microservices demo using RabbitMQ, Node.js and TypeORM.  
Two backend services with different databases and two React frontends:

- Admin service (MySQL) —  CRUD for products and publishes events to RabbitMQ. See [admin/src/app.ts](admin/src/app.ts). Uses [`admin.myDataSource`](admin/app-data-source.ts) and the entity [`admin.Product`](admin/src/entity/product.ts).
- Main service (MongoDB) — read-only view built from events consumed from RabbitMQ. See [main/src/app.ts](main/src/app.ts). Uses [`main.myDataSource`](main/app-data-source.ts) and the entity [`main.Product`](main/src/entity/product.ts).
- Admin frontend — React app for managing products: [admin-client/package.json](admin-client/package.json).
- Main frontend — React client for customers: [main-client/package.json](main-client/package.json).

## Architecture overview
- Event-driven architecture using RabbitMQ as the message broker. The Admin service writes to MySQL and sends events (product_created, product_updated, product_deleted). The Main service consumes those events and stores a read model in MongoDB for fast reads. Both services expose REST endpoints. Two separate React frontends consume the services:
  - Admin frontend communicates with Admin service
  - Main frontend communicates with Main service

[![Image-Jan-5-2026-03-18-18-PM.png](https://i.postimg.cc/4yTRTBSf/Image-Jan-5-2026-03-18-18-PM.png)](https://postimg.cc/ZBjM8Fm2)

## Screenshots

[![React-App.png](https://i.postimg.cc/Twy0dxWB/React-App.png)](https://postimg.cc/9RhZbvbB)

[![React-App-and-New-tab.png](https://i.postimg.cc/6qJrBvKY/React-App-and-New-tab.png)](https://postimg.cc/ygjgPWkZ)

## Environment variables
- Admin service (set in admin/.env or environment):
  - RABBIMQ_URL — RabbitMQ connection string
  - (MySQL credentials are configured in [admin/app-data-source.ts](admin/app-data-source.ts).)
- Main service (set in main/.env or environment):
  - RABBIMQ_URL — RabbitMQ connection string
  - DB_URL — MongoDB connection string (used by [main/app-data-source.ts](main/app-data-source.ts))

## Requirements
- Node.js (16+ recommended)
- npm
- RabbitMQ (accessible via environment URL)
- MySQL for Admin service (or update admin/app-data-source.ts)
- MongoDB (Atlas or local) for Main service
