import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./GoogleSignIn/firebaseConfig.jsx";
import "./StartScreen.css"; // Import your CSS file

function StartScreen({ numQuestions, dispatch, title }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Regex patterns
  const nameRegex = /^[a-zA-Z\s]{2,50}$/; // Allows letters, spaces, 2-50 characters
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email pattern

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(""); // Clear the error after 3 seconds
    }, 2000); // 3000ms = 3 seconds
  };

  const validateInputs = () => {
    if (!nameRegex.test(name)) {
      showError(
        "Invalid name. Only letters and spaces are allowed (2-50 characters)."
      );
      return false;
    }
    if (!emailRegex.test(email)) {
      showError("Invalid email format. Please enter a valid email.");
      return false;
    }
    setError(""); // Clear errors if valid
    return true;
  };

  async function login() {
    if (validateInputs()) {
      const userInfo = {
        name,
        email,
      };

      try {
        // Add user to Firestore
        const docRef = await addDoc(collection(db, "users"), userInfo);
        dispatch({
          type: "user",
          payload: docRef.id,
        });
        console.log("Document written with ID: ", docRef.id);

        dispatch({ type: "start" });
      } catch (e) {
        console.error("Error adding document: ", e);
        showError("Error saving your data. Please try again.");
      }
    }
  }

  return (
    <div className="start">
      <h2>Welcome to The {title} Quiz!</h2>
      <h3>
        {numQuestions} questions to test your {title} product mastery
      </h3>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Enter your Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button className="btn btn-ui" onClick={login}>
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
