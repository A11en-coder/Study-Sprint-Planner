# Study Sprint Planner

A small, local full-stack app for planning study sessions and tracking which ones are done. A signed-in student can add sessions, see the current week's plan, and mark a session complete. Each student sees only their own sessions.

## Goal

Build a working app in at most three calendar days, with about two to three hours of work per day. The main learning goal is to connect sign-in to private data safely. A secondary goal is to show clear loading, empty, and error states and add one useful automated check.

## Main workflows

1. Sign in.
2. Add a study session with a subject, date and time, and planned duration in minutes.
3. See sessions for the current Monday-to-Sunday week in time order.
4. Mark a session complete. Completed sessions remain visible and look different from planned ones.
5. Refresh the page and see the same saved sessions.
6. Sign in as a different user and see only that user's sessions.

## Scope for version 1

- One page for the current week.
- A form to add a session.
- A list of planned and completed sessions.
- A completion action for planned sessions.
- Form validation and readable loading, empty, and error messages.
- Authentication and per-user access checks in the API.

Later ideas, outside version 1: a countdown timer, reminders, charts, repeating sessions, editing or deleting sessions, and week navigation.

## Planned stack

- Frontend: React, TypeScript, and Vite.
- Backend: Express and TypeScript.
- Database: PostgreSQL with Prisma.
- Sign-in: Clerk.

React, Express, and Prisma repeat tools from the shared bill splitter so the new work can focus on authentication and ownership. Clerk handles sign-in, while the API still has to verify the signed-in user and limit database queries to that user.

## Data model to design

A study session needs an ID, an owner ID, a subject, a scheduled date and time, a planned duration in minutes, a completion time that can be empty, and a creation time.

Decisions to make while designing the model:
- Store scheduled times consistently, then display them in the user's local time.
- Keep duration as a whole number of minutes.
- Treat an empty completion time as planned and a filled completion time as complete.
- Get the owner ID from the verified sign-in session in the API. Do not accept an owner ID supplied by the browser.

## API behavior to build

- List the signed-in user's sessions for the current week.
- Create a session for the signed-in user.
- Mark one of the signed-in user's sessions complete.
- Reject invalid input with a useful response.
- Return an appropriate error when a session is missing or belongs to another user.

The exact route names and response shapes can be chosen during implementation. Every read and write must include the verified owner ID in its database lookup.

## Three-day roadmap

### Day 1: Foundation and data

Set up the frontend and backend, connect Prisma to PostgreSQL, and create the study-session model. Decide the request and response shapes. Make the database migration run locally.

**Checkpoint 1:** Review the folder structure, Prisma model, and API plan before building the full interface.

### Day 2: Sign-in and private API

Add sign-in, verify identity in the API, and build the list, create, and complete actions. Check that a user cannot list or complete another user's session.

**Checkpoint 2:** Review the authentication flow, ownership checks, validation, and API responses.

### Day 3: Browser workflow and verification

Build the form and weekly list. Add loading, empty, and error states. Run through the full workflow in the browser. Add one focused automated check for the ownership rule or another important API behavior.

**Checkpoint 3:** Review the complete local app and test results.

## Done when

- A user can sign in, add a session, see it in the current week, mark it complete, and refresh without losing it.
- A second user sees their own sessions and cannot access the first user's sessions through the API.
- Bad form input produces a helpful message instead of a broken page.
- The app clearly shows when it is loading, when the week is empty, and when a request fails.
- At least one focused automated check passes.
- The main workflow has been demonstrated locally.

## First coding task

Set up the frontend and backend in this folder, initialize Git, and write the Prisma study-session model. Stop at Checkpoint 1 and ask for a review before continuing.
