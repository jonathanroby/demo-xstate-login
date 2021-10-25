import { useState } from "react";

export default function EnterName({ onSubmit }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  return (
    <form>
      <h1>Enter your name</h1>

      <h2>(Not persisted yet.)</h2>

      <span>
        This is how your name will appear on your petition and when you sign
        petitions.
      </span>

      <span>First name</span>
      <input
        value={first}
        onChange={e => {
          e.preventDefault();
          setFirst(e.target.value);
        }}
      />

      <span>Last name</span>
      <input
        value={last}
        onChange={e => {
          e.preventDefault();
          setLast(e.target.value);
        }}
      />

      <button
        disabled={first.length === 0 || last.length === 0}
        onClick={() => {
          onSubmit({ firstName: first, lastName: last });
        }}
      >
        Continue
      </button>
    </form>
  );
}
