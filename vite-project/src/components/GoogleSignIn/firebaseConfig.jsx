

  // firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const apiUrl = import.meta.env.VITE_API_KEY;

const firebaseConfig = {
    apiKey: apiUrl,
    authDomain: "quiz-mgmt.firebaseapp.com",
    databaseURL: "https://quiz-mgmt-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quiz-mgmt",
    storageBucket: "quiz-mgmt.appspot.com",
    messagingSenderId: "417527427130",
    appId: "1:417527427130:web:df14190550fd530d308503",
    measurementId: "G-C0JYJ1K665"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };
