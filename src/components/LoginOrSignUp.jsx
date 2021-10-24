import { useState } from "react";

export default function LoginOrSignUp() {
  const [email, setEmail] = useState("")
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <h1>Login or sign up</h1>

      <span>Email</span>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button>
        Continue
      </button>
    </form>
  );
}
