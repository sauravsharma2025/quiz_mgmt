import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
const apiUrl = import.meta.env.VITE_API_KEY;

// Initialize Firebase
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
const db = getFirestore(app); // Make sure Firestore is initialized

// Function to fetch data by ID from Firestore
export const fetchDataById = async (id) => {
  try {
    const docRef = doc(db, "quizzes", id); // Reference to the document
    const docSnap = await getDoc(docRef); // Fetch the document

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data(); // Return document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};
