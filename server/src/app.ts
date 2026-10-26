import express from "express";
import { clerkMiddleware, clerkClient, getAuth } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();

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

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});