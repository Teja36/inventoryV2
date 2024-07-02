import express, { Express } from "express";
import cors from "cors";

import indexRoutes from "./routes/indexRoute.js";
import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import utilRoutes from "./routes/utilRoutes.js";
import uploadRoutes from "./routes/uploadFileRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { validateUserSession } from "./middleware/validateSession.js";
import path from "path";

const app: Express = express();
const port = process.env.PORT;

const corsOptions = {
  origin: process.env.REQUEST_ORIGIN, // Allow only this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  credentials: true, // Enable the inclusion of cookies
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/", indexRoutes);

app.use("/public", express.static("src/public/profile-pics"));

app.use("/auth", authRoutes);

app.use("/medicines", validateUserSession, medicineRoutes);

app.use("/users", validateUserSession, userRoutes);

app.use("/utils", validateUserSession, utilRoutes);

app.use("/upload", validateUserSession, uploadRoutes);

app.all("/*", (req, res) => res.status(404).json({ error: "Page not found!" }));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server in running at http://localhost:${port}}`);
});
