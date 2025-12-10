import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateAccessToken = (user: { id: string; name: string }) => {
  return jwt.sign(
    { id: user.id, name: user.name },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" } // Expiră repede pentru securitate
  );
};

export const generateRefreshToken = (user: { id: string; name: string }) => {
  return jwt.sign(
    { id: user.id, name: user.name },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" } // Ține minte userul 7 zile
  );
};

export const sendRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true, // Frontend-ul NU poate citi acest cookie (Anti-XSS)
    path: "/api/auth/refresh", // Se trimite doar la ruta de refresh
    secure: process.env.NODE_ENV === "production", // HTTPS în producție
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 zile
  });
};
