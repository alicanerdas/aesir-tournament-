import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLau9-bJyg0ycqRd0qda51NjDEPBFSnT0",
  authDomain: "aesirmc-turnuva.firebaseapp.com",
  projectId: "aesirmc-turnuva",
  storageBucket: "aesirmc-turnuva.firebasestorage.app",
  messagingSenderId: "219405115331",
  appId: "1:219405115331:web:4b80a2f64a78642fe9a776",
  measurementId: "G-X3XB6BVREE"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
