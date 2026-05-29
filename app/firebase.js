// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO_QovsV2JWGQUTirr9FiX23ERhUbJ1Zs",
  authDomain: "budget-app-83406.firebaseapp.com",
  projectId: "budget-app-83406",
  storageBucket: "budget-app-83406.firebasestorage.app",
  messagingSenderId: "599096644330",
  appId: "1:599096644330:web:d3c95e301eb057edc5bd93"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);