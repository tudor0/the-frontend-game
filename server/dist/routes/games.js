"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// ==========================================
// 1. REGISTRUL DE SOLUȚII (15 NIVELE)
// ==========================================
const SOLUTIONS = {
    // DOM & HTML
    "level-1": "INVISIBLE_INK",
    "level-2": "DEV_COMMENTS_ARE_PUBLIC",
    "level-3": "META_DATA_KING",
    "level-4": "ATTR_REMOVER",
    "level-5": "DISPLAY_NONE_MASTER",
    // NETWORK
    "level-6": "HEADER_MASTER",
    "level-7": "BAD_REQUEST_SPY",
    "level-8": "PATIENCE_IS_A_VIRTUE",
    "level-9": "FOUR_OH_FOUR_FOUND",
    "level-10": "PARAMS_DETECTIVE",
    // STORAGE & JS
    "level-11": "COOKIE_DOUGH",
    "level-12": "LOCAL_STORAGE_HERO",
    "level-13": "SESSION_STORAGE_SAVER",
    "level-14": "CONSOLE_LOG_CHAMP",
    "level-15": "BASE64_DECODER"
};
// ==========================================
// 2. LOGICA DE JOC (Start, Hint, Validate)
// ==========================================
// START LEVEL (Pornim cronometrul)
router.post("/start", auth_1.authenticateToken, async (req, res) => {
    const { gameId } = req.body;
    const userId = req.user.id;
    if (!SOLUTIONS[gameId]) {
        return res.status(404).json({ error: "Game ID not found" });
    }
    // 1. Verificăm dacă e deja finalizat
    const existingScore = await prisma.score.findUnique({
        where: { userId_gameId: { userId, gameId } }
    });
    if (existingScore)
        return res.json({ status: "completed" });
    // 2. Căutăm sesiunea activă
    let attempt = await prisma.levelAttempt.findUnique({
        where: { userId_gameId: { userId, gameId } }
    });
    // 3. Dacă nu există, o creăm (Timer Start)
    if (!attempt) {
        attempt = await prisma.levelAttempt.create({
            data: { userId, gameId }
        });
    }
    // Returnăm datele sesiunii (când a început, dacă a folosit hint-uri)
    res.json({
        status: "active",
        startTime: attempt.startedAt,
        hintsUsed: attempt.hintsUsed,
        wrongAttempts: attempt.wrongAttempts
    });
});
// USE HINT (NOU: Trackuim dacă userul a cerut ajutor)
router.post("/hint", auth_1.authenticateToken, async (req, res) => {
    const { gameId } = req.body;
    const userId = req.user.id;
    const attempt = await prisma.levelAttempt.findUnique({
        where: { userId_gameId: { userId, gameId } }
    });
    if (!attempt)
        return res.status(400).json({ error: "Level not started" });
    // Marcăm în DB că s-a folosit hint
    await prisma.levelAttempt.update({
        where: { id: attempt.id },
        data: { hintsUsed: true }
    });
    res.json({ message: "Hint tracked", hintsUsed: true });
});
// RESET LEVEL (Opțional: Dacă userul vrea să reseteze timerul)
router.post("/reset", auth_1.authenticateToken, async (req, res) => {
    const { gameId } = req.body;
    const userId = req.user.id;
    // Ștergem încercarea curentă
    await prisma.levelAttempt.deleteMany({
        where: { userId, gameId }
    });
    // Creăm una nouă imediat
    const newAttempt = await prisma.levelAttempt.create({
        data: { userId, gameId }
    });
    res.json({ message: "Timer reset", startTime: newAttempt.startedAt });
});
// VALIDATE FLAG (Stop timer & Save Score)
router.post("/validate", auth_1.authenticateToken, async (req, res) => {
    const { gameId, userFlag } = req.body;
    const userId = req.user.id;
    const attempt = await prisma.levelAttempt.findUnique({
        where: { userId_gameId: { userId, gameId } }
    });
    if (!attempt)
        return res.status(400).json({ error: "Start the level first!" });
    const cleanInput = (userFlag || "").trim().toUpperCase();
    const correctAnswer = SOLUTIONS[gameId];
    if (cleanInput === correctAnswer) {
        // Calculăm durata
        const durationSeconds = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
        try {
            // Salvăm scorul final cu TOATE metricile
            await prisma.score.create({
                data: {
                    userId,
                    gameId,
                    value: 100,
                    durationSeconds,
                    wrongAttempts: attempt.wrongAttempts,
                    hintsUsed: attempt.hintsUsed // Aici salvăm daca a folosit hint
                }
            });
            // Curățăm sesiunea temporară
            await prisma.levelAttempt.delete({ where: { id: attempt.id } });
            return res.json({ success: true, duration: durationSeconds });
        }
        catch (e) {
            return res.status(500).json({ error: "Could not save score" });
        }
    }
    else {
        // Incrementăm greșelile
        await prisma.levelAttempt.update({
            where: { id: attempt.id },
            data: { wrongAttempts: { increment: 1 } }
        });
        return res.json({ success: false, message: "Wrong Flag!" });
    }
});
// GET DASHBOARD STATS
router.get("/my-stats", auth_1.authenticateToken, async (req, res) => {
    const stats = await prisma.score.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" }
    });
    res.json(stats);
});
// LEADERBOARD: top users by total score
router.get("/leaderboard", auth_1.authenticateToken, async (_req, res) => {
    try {
        const top = await prisma.score.groupBy({
            by: ["userId"],
            _sum: { value: true, wrongAttempts: true },
            _avg: { durationSeconds: true },
            _count: { gameId: true },
            orderBy: { _sum: { value: "desc" } },
            take: 10
        });
        const hintsAgg = await prisma.score.groupBy({
            by: ["userId"],
            where: { hintsUsed: true },
            _count: { _all: true }
        });
        const hintsMap = Object.fromEntries(hintsAgg.map((h) => [h.userId, h._count?._all ?? 0]));
        const userIds = top.map((t) => t.userId);
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true, avatarUrl: true }
        });
        const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
        const result = top.map((entry) => {
            const user = userMap[entry.userId];
            return {
                userId: entry.userId,
                name: user?.name || "Unknown",
                email: user?.email || "",
                avatarUrl: user?.avatarUrl || null,
                totalScore: entry._sum?.value ?? 0,
                solved: entry._count?.gameId ?? 0,
                avgDurationSeconds: entry._avg?.durationSeconds ?? null,
                totalHintsUsed: hintsMap[entry.userId] ?? 0,
                totalWrongAttempts: entry._sum?.wrongAttempts ?? 0
            };
        });
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: "Could not load leaderboard" });
    }
});
// LEADERBOARD PER LEVEL: fastest times with hint/attempt stats
router.get("/leaderboard/level/:gameId", auth_1.authenticateToken, async (req, res) => {
    const { gameId } = req.params;
    try {
        const scores = await prisma.score.findMany({
            where: { gameId },
            orderBy: { durationSeconds: "asc" },
            take: 10,
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatarUrl: true }
                }
            }
        });
        const result = scores.map((s) => ({
            userId: s.userId,
            name: s.user?.name ?? "Unknown",
            email: s.user?.email ?? "",
            avatarUrl: s.user?.avatarUrl ?? null,
            durationSeconds: s.durationSeconds,
            value: s.value,
            hintsUsed: s.hintsUsed,
            wrongAttempts: s.wrongAttempts,
            createdAt: s.createdAt
        }));
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: "Could not load level leaderboard" });
    }
});
// ==========================================
// 3. RUTELE SPECIALE (CTF TRICKS)
// ==========================================
// Level 6: Headers
router.get("/clue/headers", (req, res) => {
    res.setHeader("X-Secret-Flag", "HEADER_MASTER");
    res.setHeader("Access-Control-Expose-Headers", "X-Secret-Flag");
    res.json({ message: "Check response headers!" });
});
// Level 7: Bad Request
router.get("/clue/bad-request", (req, res) => {
    res
        .status(400)
        .json({ error: "BAD_REQUEST", details: "Flag: BAD_REQUEST_SPY" });
});
// Level 8: Slow Request
router.get("/clue/slow", (req, res) => {
    setTimeout(() => {
        res.json({ flag: "PATIENCE_IS_A_VIRTUE" });
    }, 4000);
});
// Level 9: 404
router.get("/clue/missing-resource", (req, res) => {
    res.status(404).json({ error: "Not Found", flag: "FOUR_OH_FOUR_FOUND" });
});
// Level 10: Params
router.get("/clue/params", (req, res) => {
    res.json({ message: "Check URL params in Network Tab." });
});
// Level 11: Cookies
router.get("/clue/cookie", (req, res) => {
    res.cookie("flag_lvl11", "COOKIE_DOUGH", { maxAge: 900000, httpOnly: false });
    res.json({ message: "Check Cookies in Application Tab." });
});
exports.default = router;
