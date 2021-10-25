import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+$/;
  return re.test(email);
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
          cond: ctx => validateEmail(ctx.value)
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

export default function LoginOrSignUp({ onSubmit }) {
  const [current, send] = useMachine(machine);

  const { value } = current.context;

  const editing = current.matches("editing");
  const invalid = current.matches({ editing: "invalid" });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        send("SUBMIT");
      }}
    >
      <h1>Login or sign up</h1>

      <span>Email</span>

      <input
        className={invalid ? "input-error" : "none"}
        value={value}
        onChange={e => send({ type: "CHANGE", value: e.target.value })}
      />
      {invalid ? (
        <div className="error">Please enter a valid email address.</div>
      ) : null}

      <button>Continue</button>
    </form>
  );
}
