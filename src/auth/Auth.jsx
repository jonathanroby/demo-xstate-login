import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

import LoginOrSignUp from "./LoginOrSignUp";
import Password from "./Password";
import EnterPassword from "./EnterPassword";
import { verifyPassword, checkIfUserExists } from "./db";

const assignPassword = assign({ password: (_, e) => e.value });

const authMachine = createMachine({
  id: "auth",
  context: {
    email: "",
    password: "",
    errors: ""
  },
  initial: "email",
  states: {
    email: {
      on: {
        NEXT: {
          target: "checkEmail",
          actions: assign({ email: (_, e) => e.value })
        }
      }
    },
    checkEmail: {
      invoke: {
        id: "checkingEmail",
        src: ctx => checkIfUserExists(ctx),
        onDone: [
          {
            target: "enterPassword",
            cond: (ctx, event) => event.data
          },
          {
            target: "password"
          }
        ],
        onError: {
          target: ""
        }
      }
    },
    password: {
      on: {
        NEXT: {
          target: "success",
          actions: assignPassword
        },
        BACK: {
          target: "email",
          actions: assignPassword
        }
      }
    },
    enterPassword: {
      on: {
        BACK: "email",
        NEXT: "verifyPassword"
      }
    },
    verifyPassword: {
      invoke: {
        id: "verifyPassword",
        src: ctx => verifyPassword(ctx.password),
        onDone: [
          {
            target: "success",
            cond: (ctx, event) => {
              return event.data === true;
            }
          },
          {
            target: "enterPassword",
            actions: assign({
              errors: (ctx, event) => event.data
            })
          }
        ],
        onError: {
          target: ""
        }
      }
    },
    success: {
      type: "final"
    }
  }
});

function Auth() {
  const [current, send] = useMachine(authMachine);

  return (
    <div className="App">
      {current.matches("email") ? (
        <LoginOrSignUp
          email={current.context.email}
          onSubmit={value => send("NEXT", { value })}
        />
      ) : current.matches("password") ? (
        <Password
          email={current.context.email}
          password={current.context.password}
          onBack={value => send("BACK", { value })}
          onSubmit={value => send("NEXT", { value })}
        />
      ) : current.matches("enterPassword") ? (
        <EnterPassword
          email={current.context.email}
          errors={current.context.errors}
          onBack={() => send("BACK")}
          onSubmit={value => send("NEXT", { value })}
        />
      ) : current.matches("success") ? (
        <div>Congratulations. You're logged in.</div>
      ) : null}
    </div>
  );
}

export default Auth;
