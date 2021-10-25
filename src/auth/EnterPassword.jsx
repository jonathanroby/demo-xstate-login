import { useState } from "react";

export default function EnterPassword({ onSubmit, onBack, email }) {
  const [password, setPassword] = useState("");

  return (
    <form>
      <h1>Enter your password</h1>

      <span>
        Enter the password associated with <b>{email}</b>.
      </span>

      <input
        value={password}
        onChange={e => {
          e.preventDefault();
          setPassword(e.target.value);
        }}
      />

      <div className="navigation">
        <button onClick={onBack}>Back</button>
      </div>
    </form>
  );
}
