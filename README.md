## inventory-manager-microservices

A microservices-style inventory example with two Node/TypeORM services:
- "admin" — a MySQL-backed service that provides full CRUD for products.
- "main" — a MongoDB-backed read-only service that serves products to clients.


## Services

### Admin service
- Entry: [admin/src/app.ts](admin/src/app.ts)  
- DB config / DataSource: [`admin.myDataSource`](admin/app-data-source.ts) — [admin/app-data-source.ts](admin/app-data-source.ts)  
- Entity: [`admin.Product`](admin/src/entity/product.ts) — [admin/src/entity/product.ts](admin/src/entity/product.ts)  
- Package: [admin/package.json](admin/package.json)  
- TS config: [admin/tsconfig.json](admin/tsconfig.json)

API (see [admin/src/app.ts](admin/src/app.ts)):
- GET  /api/products — list products
- POST /api/products — create product
- GET  /api/products/:id — get product
- PUT  /api/products/:id — update product
- DELETE /api/products/:id — delete product
- POST /api/products/:id/like — increment likes

Notes:
- Uses MySQL (mysql2 driver). Connection configured in [`admin/app-data-source.ts`](admin/app-data-source.ts).
- Entities are loaded from compiled JS at runtime via `entities: ["src/entity/*.js"]`.

### Main service
- Entry: [main/src/app.ts](main/src/app.ts)  
- DB config / DataSource: [`main.myDataSource`](main/app-data-source.ts) — [main/app-data-source.ts](main/app-data-source.ts)  
- Entity: [`main.Product`](main/src/entity/product.ts) — [main/src/entity/product.ts](main/src/entity/product.ts)  
- Package: [main/package.json](main/package.json)  
- TS config: [main/tsconfig.json](main/tsconfig.json)

API (see [main/src/app.ts](main/src/app.ts)):
- GET /api/products — list products (reads from MongoDB)

Notes:
- Uses MongoDB Atlas connection configured in [`main/app-data-source.ts`](main/app-data-source.ts).

## Requirements
- Node.js (16+ recommended)
- npm
- Local MySQL instance for admin service (or update credentials in [admin/app-data-source.ts](admin/app-data-source.ts))
- MongoDB Atlas credentials are already present in [main/app-data-source.ts](main/app-data-source.ts) (update if needed)

## Quick start

Run each service in its folder:

Admin:
```sh
cd admin
npm install
npm start
# server listens on port 8000 (see [admin/src/app.ts](admin/src/app.ts))
```

Main:
```sh
cd main
npm install
npm start
# server listens on port 8001 (see [main/src/app.ts](main/src/app.ts))
```

## Where to change DB settings
- Admin (MySQL): [admin/app-data-source.ts](admin/app-data-source.ts) — [`admin.myDataSource`](admin/app-data-source.ts)  
- Main (MongoDB): [main/app-data-source.ts](main/app-data-source.ts) — [`main.myDataSource`](main/app-data-source.ts)

## Important files
- Admin app: [admin/src/app.ts](admin/src/app.ts)  
- Main app: [main/src/app.ts](main/src/app.ts)  
- Admin entity: [admin/src/entity/product.ts](admin/src/entity/product.ts) (`admin.Product`)  
- Main entity: [main/src/entity/product.ts](main/src/entity/product.ts) (`main.Product`)  
- Admin DataSource: [admin/app-data-source.ts](admin/app-data-source.ts) (`admin.myDataSource`)  
- Main DataSource: [main/app-data-source.ts](main/app-data-source.ts) (`main.myDataSource`)  
- Admin package.json: [admin/package.json](admin/package.json)  
- Main package.json: [main/package.json](main/package.json)

## Notes & tips
- The admin service expects compiled JS in `src/` (it runs `src/app.js` via nodemon). If modifying TypeScript source, ensure you compile or use a dev flow that compiles TS to JS.
- The main service uses TypeORM's Mongo repository API (`getMongoRepository`) — see [main/src/app.ts](main/src/app.ts).
- Keep credentials out of source for production; currently the MongoDB connection string is in [main/app-data-source.ts](main/app-data-source.ts)