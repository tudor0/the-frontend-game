"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshTokenCookie = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" } // Expiră repede pentru securitate
    );
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" } // Ține minte userul 7 zile
    );
};
exports.generateRefreshToken = generateRefreshToken;
const sendRefreshTokenCookie = (res, token) => {
    res.cookie("jid", token, {
        httpOnly: true, // Frontend-ul NU poate citi acest cookie (Anti-XSS)
        path: "/api/auth/refresh", // Se trimite doar la ruta de refresh
        secure: process.env.NODE_ENV === "production", // HTTPS în producție
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 zile
    });
};
exports.sendRefreshTokenCookie = sendRefreshTokenCookie;
