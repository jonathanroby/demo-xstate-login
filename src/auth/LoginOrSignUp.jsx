import { useState } from "react";

const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+$/;
  return re.test(email);
};

export default function LoginOrSignUp({ onSubmit, email }) {
  const [emailStr, setEmailStr] = useState(email);
  const [validEmail, setValidEmail] = useState(true);

  return (
    <form>
      <h1>Login or sign up</h1>

      <span>Email</span>

      <input
        className={!validEmail ? "input-error" : "none"}
        value={emailStr}
        onChange={e => {
          e.preventDefault();
          setEmailStr(e.target.value);
          setValidEmail(validateEmail(e.target.value));
        }}
      />
      
      {!validEmail ? (
        <div className="error">Please enter a valid email address.</div>
      ) : null}

      <button disabled={!validEmail} onClick={() => {
        onSubmit(emailStr);
      }}>Continue</button>
    </form>
  );
}
