import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";
import "./index.css";
import UploadQuiz from "./components/uploadQuiz";
import { Score } from "./components/Backend/Score";

// React v18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
