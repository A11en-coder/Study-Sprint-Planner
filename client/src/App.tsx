import { useState } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";
import "./App.css";

function App() {
  const { getToken } = useAuth();
  const [message, setMessage] = useState("");

  async function checkApi() {
    try {
      const token = await getToken();

      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setMessage(`Your user ID is ${data.userId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    }
  }

  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
          <button onClick={checkApi}>Check API</button>
        </Show>
      </header>
      <p>{message}</p>
    </>
  );
}

export default App;
