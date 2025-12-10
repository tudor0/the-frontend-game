"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // Tokenul vine în format: "Bearer eyJhbGci..."
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.sendStatus(401); // Unauthorized (Nu ai token)
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403); // Forbidden (Token expirat sau invalid)
            return;
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
