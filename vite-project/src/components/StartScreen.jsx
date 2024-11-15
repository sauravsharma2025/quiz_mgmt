import React, { useRef, useState } from "react";
import { signInWithGoogle } from "./GoogleSignIn/googleSign.js";
import "./StartScreen.css"; // Import your CSS file
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./GoogleSignIn/firebaseConfig.jsx";

function StartScreen({ numQuestions, dispatch, title }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function login() {
    let result = "";
    if (name && email) {
      // result = await signInWithGoogle();
      const userInfo = {
        name,
        emailName: "result.user.displayName",
        email: email,
      };
      try {
        //Check if email is already exist or not
        const userRef = collection(db, "users");

        const emailQuery = query(userRef, where("email", "==", email));
        const querySnapShot = await getDocs(emailQuery);
        if (!querySnapShot.empty) {
          return alert("Already attempted this quiz");
        }
        const docRef = await addDoc(collection(db, "users"), userInfo);
        dispatch({
          type: "user",
          payload: docRef.id,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      console.log("result", userInfo);

      dispatch({ type: "start" });
    } else {
      alert("pls enter name and email address");
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
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Enter your Email Address"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="btn btn-ui" onClick={login}>
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
