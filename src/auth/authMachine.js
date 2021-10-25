import { createMachine, assign } from "xstate";

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
            target: "addPassword"
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
    addPassword: {
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
          target: "addPassword",
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

export default authMachine;
