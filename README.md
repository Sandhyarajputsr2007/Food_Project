# Chai Nashta Corner

The storefront keeps the existing React design and ordering flow, with a MERN backend:

- **MongoDB** stores customer orders.
- **Express and Node.js** validate and save orders through `/api/orders`.
- **React and Vite** render the storefront and build the browser app.

## Run locally

1. Install Node.js 20.19 or newer, or Node.js 22.12 or newer, and MongoDB; alternatively, create a MongoDB Atlas database.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your database connection string. Keep `.env` private; never commit database credentials.
4. Start the app:

   ```sh
   npm run dev
   ```

5. Open `http://localhost:3000`.

The storefront can load without MongoDB, but placing orders requires a working `MONGODB_URI`. The server reports database connection problems in its logs and the order API returns an error instead of pretending an order was saved.

## Build and run in production

```sh
npm run build
npm start
```

The Express server serves the built React app and API from one Node.js service. For a host such as Render, create a Node web service, use `npm run build` as the build command and `npm start` as the start command, and add `MONGODB_URI` as a private environment variable. Do not enter credentials in source files or chat.

Keep the current Lovable website online until the new deployment and its order flow are tested. Existing Cloudflare D1 order records are not automatically copied to MongoDB.

UPI payments are not automatically verified; payment status remains pending until manually confirmed. Cash on Delivery is also available.
