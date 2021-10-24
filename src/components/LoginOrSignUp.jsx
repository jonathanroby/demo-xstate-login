import { useMachine } from "@xstate/react";
import { createMachine, assign } from 'xstate';

export const machine = createMachine({
  initial: "editing",
  context: {
    value: ""
  },
  states: {
    editing: {
      on: {
        CHANGE: {
          actions: assign({
            value: (ctx, e) => e.value
          })
        },
      },
    },
  }
});

export default function LoginOrSignUp({ onSubmit }) {
  const [current, send] = useMachine(machine);
  
  const { value } = current.context;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <h1>Login or sign up</h1>

      <span>Email</span>
      <input
        value={value}
        onChange={e => send({ type: "CHANGE", value: e.target.value })}
      />
      <button>
        Continue
      </button>
    </form>
  );
}
