import { useState } from "react";

const validatePassword = password => {
  return password.length >= 5;
};

export default function Password({ onSubmit, onBack, email, password }) {
  const [passwordStr, setPasswordStr] = useState(password);
  const [validPassword, setValidPassword] = useState(validatePassword(passwordStr));

  // The second condition is just because I don't want to see an error
  // when initially visiting step. Obviously a better solution would be
  // needed here.
  const showError = !validPassword && passwordStr.length !== 0;
  return (
    <form>
      <h1>Create a password</h1>

      <span>Create a password for <b>{email}</b></span>
      <span>Passwords must be 5 characters or longer.</span>

      <input
        className={showError ? "input-error" : "none"}
        value={passwordStr}
        onChange={e => {
          e.preventDefault();
          setPasswordStr(e.target.value);
          setValidPassword(validatePassword(e.target.value));
        }}
      />
      {showError  ? (
        <div className="error">Passwords must be 5 characters or longer.</div>
      ) : null}

      <div className="navigation">
        <button onClick={() => onBack(passwordStr)}>Back</button>
        <button disabled={!validPassword}
                onClick={() => onSubmit(passwordStr)}>Continue</button>
      </div>
      
    </form>
  );
}
