import { useMachine } from "@xstate/react";

import LoginOrSignUp from "./LoginOrSignUp";
import AddPassword from "./Password";
import EnterPassword from "./EnterPassword";
import EnterName from "./EnterName";
import authMachine from "./authMachine.js"

function Auth() {
  const [current, send] = useMachine(authMachine);
  

  return (
    <div className="App">
      {current.matches("loginOrSignUp") ? (
        <LoginOrSignUp
          email={current.context.email}
          onSubmit={value => send("NEXT", { value })}
        />
      ) : current.matches("addPassword") ? (
        <AddPassword
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
