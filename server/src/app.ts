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

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
