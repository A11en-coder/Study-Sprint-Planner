import { useCallback, useEffect, useState } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";
import "./App.css";

type StudySession = {
  id: number;
  subject: string;
  durationMinutes: number;
  scheduledAt: string;
  completedAt: string | null;
};

function getCurrentWeekRange() {
  const start = new Date();
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start: start.toISOString(), end: end.toISOString() };
}

function Planner() {
  const { getToken } = useAuth();
  // define the study sessions as a state variable that is an array of objects
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  // create a function that sends a request to the /api/sessions that returns an array of sessions for the current user.
  const getSessions = useCallback(async () => {
    setLoading(true);
    setHasLoaded(false);
    setError(null);
    try {
      const token = await getToken();
      const query = new URLSearchParams(getCurrentWeekRange());

      const response = await fetch(`/api/sessions?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      setStudySessions(data);
      setHasLoaded(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load sessions",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void getSessions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [getSessions]);

  // create a function that sends a request to /api/sessions that creates a new study session for the current user. The function should take in the subject, durationMinutes, and scheduledAt as parameters.
  async function createSession(
    subject: string,
    durationMinutes: number,
    scheduledAt: string,
  ) {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const scheduledAtIso = new Date(scheduledAt).toISOString();

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          durationMinutes,
          scheduledAt: scheduledAtIso,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setSubject("");
      setDurationMinutes("");
      setScheduledAt("");
      await getSessions();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create session",
      );
    } finally {
      setLoading(false);
    }
  }

  // create an api endpoint that sends a patch api request to /api/sessions/:id that marks a study session as completed for the current user. The function should take in the id of the session as a parameter.
  async function completeSession(id: number) {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

      const response = await fetch(`/api/sessions/${id}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      await getSessions();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to complete session",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
          <UserButton />
          <button onClick={getSessions} disabled={loading}>
            {loading ? "Loading..." : "Get Sessions"}
          </button>
          {error && <p role="alert">{error}</p>}
          {hasLoaded &&
            !loading &&
            (studySessions.length === 0 ? (
              <p>No sessions yet.</p>
            ) : (
              <ul>
                {studySessions.map((session) => (
                  <li key={session.id}>
                    {session.subject} - {session.durationMinutes} minutes -{" "}
                    {new Date(session.scheduledAt).toLocaleString()} - Completed
                    at:{" "}
                    {session.completedAt ? (
                      new Date(session.completedAt).toLocaleString()
                    ) : (
                      <button
                        type="button"
                        onClick={() => void completeSession(session.id)}
                        disabled={loading}
                      >
                        Mark as complete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void createSession(subject, Number(durationMinutes), scheduledAt);
            }}
          >
            <label>
              Subject:
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </label>
            <label>
              Duration (minutes):
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                required
                min="1"
                step="1"
              />
            </label>
            <label>
              Scheduled At:
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Working..." : "Create Session"}
            </button>
          </form>
    </main>
  );
}

function App() {
  const { userId } = useAuth();

  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
      </header>
      <Show when="signed-in">
        <Planner key={userId ?? "signed-in"} />
      </Show>
    </>
  );
}

export default App;
