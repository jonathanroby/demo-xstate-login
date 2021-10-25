import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

const validatePassword = password => {
  return password.length >= 8;
};

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
        SUBMIT: "validating"
      },
      initial: "idle",
      states: {
        idle: {},
        invalid: {}
      }
    },
    validating: {
      always: [
        {
          target: "validated",
          cond: ctx => validatePassword(ctx.value)
        },
        {
          target: "editing.invalid"
        }
      ]
    },
    validated: {
      type: "final"
    }
  }
});

export default function Password({ onSubmit }) {
  const [current, send] = useMachine(machine);

  const { value } = current.context;

  // const editing = current.matches("editing");
  const invalid = current.matches({ editing: "invalid" });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        send("SUBMIT");
      }}
    >
      <h1>Create a password</h1>

      <span>Create a password for <b>email</b></span>
      <span>Passwords must be 5 characters or longer.</span>

      <input
        className={invalid ? "input-error" : "none"}
        value={value}
        onChange={e => send({ type: "CHANGE", value: e.target.value })}
      />
      {invalid ? (
        <div className="error">Passwords must be 5 characters or longer.</div>
      ) : null}

      <button>Continue</button>
    </form>
  );
}
