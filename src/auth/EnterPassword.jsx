import { useState } from "react";

export default function EnterPassword({ onSubmit, onBack, email, errors }) {
  const [password, setPassword] = useState("");

  return (
    <form>
      <h1>Enter your password</h1>

      <span>
        Enter the password associated with <b>{email}</b>.
      </span>

      <input
        className={errors ? "input-error" : "none"}
        value={password}
        onChange={e => {
          e.preventDefault();
          setPassword(e.target.value);
        }}
      />

      {errors && <span className="error">{errors}</span>}

      <div className="navigation">
        <button onClick={onBack}>Back</button>
        <button onClick={() => onSubmit(password)}>Continue</button>
      </div>
    </form>
  );
}
