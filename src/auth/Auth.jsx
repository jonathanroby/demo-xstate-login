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
          actions: assign({ one: (_, e) => e.value })
        }
      }
    },
    password: {
      on: {
        NEXT: {
          target: "success",
          actions: assign({ two: (_, e) => e.value })
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
          onSubmit={value => send("NEXT", { value })}
        />
      ) : current.matches("password") ? (
        <Password
          onSubmit={value => send("NEXT", { value })}
        />
      ) : current.matches("success") ? (
        <div>Congratulations. You're logged in.</div>
      ): null}
    </div>
  );
}

export default Auth;
