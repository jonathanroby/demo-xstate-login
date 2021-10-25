import { useState } from "react";

const validatePassword = password => {
  return password.length >= 5;
};

export default function Password({ onSubmit, onBack, email, password }) {
  const [passwordStr, setPasswordStr] = useState(password);
  const [validPassword, setValidPassword] = useState(false);
  
  return (
    <form>
      <h1>Create a password</h1>

      <span>Create a password for <b>{email}</b></span>
      <span>Passwords must be 5 characters or longer.</span>

      <input
        className={!validPassword && passwordStr.length !== 0 ? "input-error" : "none"}
        value={passwordStr}
        onChange={e => {
          e.preventDefault();
          setPasswordStr(e.target.value);
          setValidPassword(validatePassword(e.target.value));
        }}
      />
      {!validPassword && passwordStr.length !== 0  ? (
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
