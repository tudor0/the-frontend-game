"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const games_1 = __importDefault(require("./routes/games"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient(); // (Optional aici, folosit in rute)
// CONFIGURARE CORS
// Critic: "credentials: true" permite Frontend-ului să primească Cookie-ul
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://the-frontend-game.vercel.app"],
    credentials: true,
    exposedHeaders: ["X-Secret-Flag"]
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)()); // CRITIC: Fără asta req.cookies e undefined
// RUTE
app.use("/api/auth", auth_1.default);
app.use("/api/games", games_1.default);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 SERVER RUNNING ON: http://localhost:${PORT}`);
    console.log(`🔒 Auth System: ACTIVE (Access + Refresh Tokens)`);
});
