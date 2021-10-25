import { initializeApp } from "firebase/app";

import {
  getAuth,
  // createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc4HPnP_Q6ac9TCNff1-xhTDZphZXOzgY",
  authDomain: "fir-xstate-login.firebaseapp.com",
  projectId: "fir-xstate-login",
  storageBucket: "fir-xstate-login.appspot.com",
  messagingSenderId: "1068737568218",
  appId: "1:1068737568218:web:b1c2193a4012f78f7ab4e3"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();

export function checkIfUserExists(values) {
  return new Promise((resolve, reject) => {
    fetchSignInMethodsForEmail(auth, values.email)
      .then(function(results) {
        const userExists = results.length > 0;
        resolve(userExists);
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
        reject(error);
      });
  });
}

export function verifyPassword(values) {
  return new Promise((resolve, reject) => {
    resolve("password not correct");
  });
}
