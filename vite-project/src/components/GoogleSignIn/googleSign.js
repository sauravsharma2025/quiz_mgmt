import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyPTY23Vr0aHE5VlMZCceNQoR9pSwjGX8",
    authDomain: "quiz-mgmt.firebaseapp.com",
    databaseURL: "https://quiz-mgmt-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quiz-mgmt",
    storageBucket: "quiz-mgmt.appspot.com",
    messagingSenderId: "417527427130",
    appId: "1:417527427130:web:df14190550fd530d308503",
    measurementId: "G-C0JYJ1K665"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('User Info:', user);
    return result
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

