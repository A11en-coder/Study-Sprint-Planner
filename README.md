# Study Sprint Planner

A small, local full-stack app for planning study sessions and tracking which ones are done. A signed-in student can add sessions, see the current week's plan, and mark a session complete. Each student sees only their own sessions.

## Link
https://study-sprint-planner.onrender.com

## Goal

Build a working app in at most three calendar days, with about two to three hours of work per day. The main learning goal is to connect sign-in to private data safely. A secondary goal is to show clear loading, empty, and error states and add one useful automated check.

## Main workflows

1. Sign in.
2. Add a study session with a subject, date and time, and planned duration in minutes.
3. See sessions for the current Monday-to-Sunday week in time order.
4. Mark a session complete. Completed sessions remain visible and look different from planned ones.
5. Refresh the page and see the same saved sessions.
6. Sign in as a different user and see only that user's sessions.


## Planned stack

- Frontend: React, TypeScript, and Vite.
- Backend: Express and TypeScript.
- Database: PostgreSQL with Prisma.
- Sign-in: Clerk.


## Data model

A study session needs an ID, an owner ID, a subject, a scheduled date and time, a planned duration in minutes, a completion time that can be empty, and a creation time.

Decisions to make while designing the model:
- Store scheduled times consistently, then display them in the user's local time.
- Keep duration as a whole number of minutes.
- Treat an empty completion time as planned and a filled completion time as complete.
- Get the owner ID from the verified sign-in session in the API. Do not accept an owner ID supplied by the browser.

## API end points

- List the signed-in user's sessions for the current week.
- Create a session for the signed-in user.
- Mark one of the signed-in user's sessions complete.
- Reject invalid input with a useful response.
- Return an appropriate error when a session is missing or belongs to another user.

