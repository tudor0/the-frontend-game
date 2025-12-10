import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie
} from "../utils/tokens";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. REGISTER (Email/Pass)
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashed, name }
    });
    res.json({ message: "User created" });
  } catch (e) {
    res.status(400).json({ error: "Email exists" });
  }
});

// 2. LOGIN (Email/Pass)
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  // Verificăm dacă userul există și DACĂ are parolă (cei cu Google nu au)
  if (!user || !user.password) {
    return res
      .status(401)
      .json({ error: "Invalid credentials or use Google Login" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  // Tokeni
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  sendRefreshTokenCookie(res, refreshToken);
  res.json({
    accessToken,
    user: { name: user.name, email: user.email, avatar: user.avatarUrl }
  });
});

// 3. GOOGLE LOGIN (NOU)
router.post("/google", async (req: Request, res: Response): Promise<any> => {
  const { token } = req.body; // Primim token-ul de la Frontend

  try {
    // Verificăm token-ul cu serverele Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email)
      return res.status(400).json({ error: "Invalid Google Token" });

    const { email, name, picture } = payload;

    // Căutăm userul sau îl creăm (Upsert)
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Dacă nu există, îl creăm acum
      user = await prisma.user.create({
        data: {
          email,
          name: name || "Google User",
          avatarUrl: picture,
          password: null // Nu are parolă locală
        }
      });
    } else {
      // Daca exista, facem update la avatar (optional)
      // Daca userul avea cont cu parola inainte, acum va putea intra si cu Google
    }

    // Emitem Tokenii noștri interni (ca la login normal)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    sendRefreshTokenCookie(res, refreshToken);
    res.json({
      accessToken,
      user: { name: user.name, email: user.email, avatar: user.avatarUrl }
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Google authentication failed" });
  }
});

// 4. REFRESH & LOGOUT (Rămân la fel, doar le includ pentru completitudine)
router.post("/refresh", async (req, res): Promise<any> => {
  const token = req.cookies.jid;
  if (!token) return res.json({ ok: false, accessToken: "" });

  try {
    const payload: any = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    // Verify token exists in DB and not expired
    const stored = await prisma.refreshToken.findUnique({
      where: { token }
    });
    if (!stored || stored.expiresAt < new Date())
      return res.json({ ok: false, accessToken: "" });

    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });
    if (!user) return res.json({ ok: false, accessToken: "" });

    // rotate refresh token
    await prisma.refreshToken.delete({ where: { token } }).catch(() => {});
    const newRefresh = generateRefreshToken(user);
    await prisma.refreshToken.create({
      data: {
        token: newRefresh,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    sendRefreshTokenCookie(res, newRefresh);
    const accessToken = generateAccessToken(user);
    return res.json({ ok: true, accessToken });
  } catch (e) {
    return res.json({ ok: false, accessToken: "" });
  }
});

router.post("/logout", async (req, res) => {
  const token = req.cookies.jid;
  if (token)
    await prisma.refreshToken.delete({ where: { token } }).catch(() => {});
  res.clearCookie("jid", { path: "/api/auth/refresh" });
  res.json({ message: "Logged out" });
});

export default router;
