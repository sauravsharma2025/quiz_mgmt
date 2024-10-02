import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
const apiUrl = import.meta.env.VITE_API_KEY;

// Initialize Firebase
const firebaseConfig = {
  apiKey: apiUrl,
  authDomain: "quiz-mgmt.firebaseapp.com",
  databaseURL:
    "https://quiz-mgmt-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quiz-mgmt",
  storageBucket: "quiz-mgmt.appspot.com",
  messagingSenderId: "417527427130",
  appId: "1:417527427130:web:df14190550fd530d308503",
  measurementId: "G-C0JYJ1K665",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Make sure Firestore is initialized
let questionArr = [];
// Function to fetch data by ID from Firestore
export const fetchQuizById = async (id) => {
  try {
    const docRef = doc(db, "quizzes", id); // Reference to the document
    const quizzesRef = collection(db, "questions");

    const q = query(quizzesRef, where("quizId", "==", id));

    const docSnap = await getDoc(docRef); // Fetch the document
    const querySnapshot = await getDocs(q);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

      querySnapshot.forEach((doc) => {
        questionArr.push(doc.data());
      });

      const quizData = {
        quizTitle: docSnap.data().title,
        noOfQuestions: docSnap.data().TotalQuestion,
        questions:questionArr,
      };
      return quizData; // Return document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};
