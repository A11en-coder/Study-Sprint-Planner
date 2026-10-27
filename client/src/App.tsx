import { useState } from "react";
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

function App() {
  const { getToken } = useAuth();
  // define the study sessions as a state variable that is an array of objects
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // create a function that sends a request to the /api/sessions that returns an array of sessions for the current user.
  async function getSessions() {
    setLoading(true);
    setHasLoaded(false);
    setError(null);
    try {
      const token = await getToken();

      const response = await fetch("/api/sessions", {
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
      setError(error instanceof Error ? error.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
      </header>

      <main>
        <Show when="signed-in">
          <UserButton />
          <button onClick={getSessions} disabled={loading}>
            {loading ? "Loading..." : "Get Sessions"}
          </button>
          {error && <p role="alert">{error}</p>}
          {hasLoaded && !loading &&
            (studySessions.length === 0 ? (
              <p>No sessions yet.</p>
            ) : (
              <ul>
                {studySessions.map((session) => (
                  <li key={session.id}>
                    {session.subject} - {session.durationMinutes} minutes -{" "}
                    {new Date(session.scheduledAt).toLocaleString()} -{" "}
                    {session.completedAt
                      ? `Completed at ${new Date(
                          session.completedAt,
                        ).toLocaleString()}`
                      : "Not completed"}
                  </li>
                ))}
              </ul>
            ))}
        </Show>
      </main>
    </>
  );
}

export default App;
