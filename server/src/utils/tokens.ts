import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateAccessToken = (user: { id: string; name: string }) => {
  return jwt.sign(
    { id: user.id, name: user.name },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: { id: string; name: string }) => {
  return jwt.sign(
    { id: user.id, name: user.name },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const sendRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/api/auth/refresh",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
