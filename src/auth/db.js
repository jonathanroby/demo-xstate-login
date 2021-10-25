import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

export function checkEmailExists(email) {
  return new Promise((resolve, reject) => {
    fetchSignInMethodsForEmail(auth, email)
      .then(function(results) {
        const emailExists = results.length > 0;
        resolve(emailExists);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

export function createUser(values) {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(userCredential => {
        resolve(true);
      })
      .catch(error => {
        resolve(false);
      });
  });
}

export function verifyPassword(values) {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(userCredential => {
        resolve(true);
      })
      .catch(error => {
        reject(false);
      });
  });
}
