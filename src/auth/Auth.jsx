import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

import LoginOrSignUp from "./LoginOrSignUp";
import Password from "./Password";
import EnterPassword from "./EnterPassword";

const assignPassword = assign({ password: (_, e) => e.value });

export function checkIfUserExists(values) {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}

const authMachine = createMachine({
  id: "auth",
  context: {
    email: "",
    password: ""
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
        src: ctx => checkIfUserExists(ctx.value),
        onDone: [
          {
            target: "enterPassword",
            cond: (ctx, event) => {
              console.log("event ", event);
              return event.data;
            }
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
        BACK: {
          target: "email"
        },
        NEXT: {
          target: "success"
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
          onBack={() => send("BACK")}
        />
      ) : current.matches("success") ? (
        <div>Congratulations. You're logged in.</div>
      ) : null}
    </div>
  );
}

export default Auth;
