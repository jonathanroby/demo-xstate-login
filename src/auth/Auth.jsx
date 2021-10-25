import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

import LoginOrSignUp from "./LoginOrSignUp";
import Password from "./Password";
import EnterPassword from "./EnterPassword";
import EnterName from "./EnterName";
import { createUser, verifyPassword, checkEmailExists } from "./db";

const assignPassword = assign({
  password: (_, e) => e.value
});

const initialContext = {
  email: "",
  password: "",
  errors: ""
};

const authMachine = createMachine({
  id: "auth",
  context: initialContext,
  initial: "email",
  states: {
    email: {
      on: {
        NEXT: {
          target: "checkEmailExists",
          actions: assign({ email: (_, e) => e.value })
        }
      }
    },
    checkEmailExists: {
      invoke: {
        id: "checkEmailExists",
        src: ctx => checkEmailExists(ctx.email),
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
          target: "email",
          actions: assign({
            errors: "An error occurred."
          })
        }
      }
    },
    password: {
      on: {
        NEXT: {
          target: "createUser",
          actions: assignPassword
        },
        BACK: {
          target: "email",
          actions: assignPassword
        }
      }
    },
    createUser: {
      invoke: {
        id: "createUser",
        src: (ctx, event) => createUser(ctx),
        onDone: "enterName",
        onError: {
          target: "password",
          actions: assign({ errors: "An error occurred." })
        }
      }
    },
    enterPassword: {
      on: {
        BACK: {
          target: "email",
          actions: assign(initialContext)
        },
        NEXT: {
          target: "verifyPassword",
          actions: assignPassword
        }
      }
    },
    verifyPassword: {
      invoke: {
        id: "verifyPassword",
        src: ({ email, password }) => verifyPassword({ email, password }),
        onDone: {
          target: "success",
          cond: (_, event) => event.data,
        },
        onError: {
          target: "enterPassword",
          actions: assign({
            errors: "That password does not match the email provided."
          })
        }
      }
    },
    enterName: {
      on: {
        NEXT: "success"
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
      ) : current.matches("enterName") ? (
        <EnterName onSubmit={value => send("NEXT", { value })}/>
      ) : current.matches("success") ? (
        <div>Congratulations. You're logged in.</div>
      ) : null}
    </div>
  );
}

export default Auth;
