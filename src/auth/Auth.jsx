import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

import LoginOrSignUp from "./LoginOrSignUp";
import Password from "./Password";

const authMachine = createMachine({
  id: "auth",
  context: {
    email: "",
    password: "",
  },
  initial: "email",
  states: {
    email: {
      on: {
        NEXT: {
          target: "password",
          actions: assign({ email: (_, e) => e.value })
        }
      }
    },
    password: {
      on: {
        NEXT: {
          target: "success",
          actions: assign({ password: (_, e) => e.value })
        },
        BACK: {
          target: "email",
          // How to DRY?
          actions: assign({ password: (_, e) => e.value })
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
      ) : current.matches("success") ? (
        <div>Congratulations. You're logged in.</div>
      ): null}
    </div>
  );
}

export default Auth;
