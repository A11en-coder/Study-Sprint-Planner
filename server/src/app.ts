import express from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { prisma } from "./db.ts";

const app = express();
const PORT = 3000;

app.use(clerkMiddleware());

// create a /api/me route that only returns the authenticated user's userId
app.get("/api/me", (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }
  res.json({ userId });
});

// an api route that returns all study sessions for the authenticated user
app.get("/api/sessions", async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const sessions = await prisma.studySession.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// a post api that creates a new study session for the authenticated user
app.post("/api/sessions", express.json(), async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  // check that the request body exists before destructuring it
  if (!req.body) {
    res.status(400).json({ error: "Request body is missing" });
    return;
  }

  const { subject, durationMinutes, scheduledAt } = req.body;

  // validate subject
  if (typeof subject !== "string" || subject.trim() === "") {
    res.status(400).json({ error: "Invalid subject" });
    return;
  }

  // validate durationMinutes
  if (
    typeof durationMinutes !== "number" ||
    !Number.isInteger(durationMinutes) ||
    durationMinutes <= 0 ||
    isNaN(durationMinutes) ||
    !Number.isSafeInteger(durationMinutes)
  ) {
    res.status(400).json({ error: "Invalid durationMinutes" });
    return;
  }

  // validate scheduledAt
  if (
    typeof scheduledAt !== "string" ||
    isNaN(Date.parse(scheduledAt))
  ) {
    res.status(400).json({ error: "Invalid scheduledAt" });
    return;
  }

  // save subject.trim() and a parsed Date for scheduledAt
  const parsedScheduledAt = new Date(scheduledAt);
  const trimmedSubject = subject.trim();

  try {
    const newSession = await prisma.studySession.create({
      data: {
        subject: trimmedSubject,
        durationMinutes,
        scheduledAt: parsedScheduledAt,
        ownerId: userId,
      },
    });
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
