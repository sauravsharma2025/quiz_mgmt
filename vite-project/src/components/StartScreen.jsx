import React, { useState } from 'react';
import { signInWithGoogle } from "./GoogleSignIn/googleSign.js";
import './StartScreen.css'; // Import your CSS file
import { collection, addDoc } from "firebase/firestore";
import { db } from './GoogleSignIn/firebaseConfig.jsx';

function StartScreen({ numQuestions, dispatch }) {
  const [name,setName]=useState('')

  async function login() {
    console.log('www',name);
let result=''
    if(name){
       result = await signInWithGoogle();

       const userInfo={
        name,
        emailName:result.user.displayName,
        email:result.user.email
      }
      try {
        const docRef = await addDoc(collection(db, "users"), userInfo);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      console.log('result', userInfo  );

      if (result) dispatch({ type: "start" });

    }else{
      alert("pls enter name")
    }
    
   
  }

  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <input type="text" placeholder="Enter Your Name" onChange={(e)=>setName(e.target.value)} required/>
      <button
        className="btn btn-ui"
        onClick={login}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
