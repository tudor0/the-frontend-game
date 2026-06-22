import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import gameRoutes from "./routes/games";
import authRoutes from "./routes/auth";

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://the-frontend-game.vercel.app"],
    credentials: true,
    exposedHeaders: ["X-Secret-Flag"]
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 SERVER RUNNING ON: http://localhost:${PORT}`);
  console.log(`🔒 Auth System: ACTIVE (Access + Refresh Tokens)`);
});
