import { useState } from "react";
import "./uploadQuiz.css";
import * as XLSX from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./GoogleSignIn/firebaseConfig";

function UploadQuiz() {
  const [quizName, SetQuizName] = useState("");
  const [file, setfile] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const selectFile = e.target.files[0];
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (selectFile && allowedTypes.includes(selectFile.type)) {
      setfile(selectFile);
    }
  }

  const parseDoc = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workBook = XLSX.read(data, { type: "array" });
        const sheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(workSheet);
        console.log("reader", jsonData);
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const transformQuestion = (quizData, quizId) => {
      return quizData.map((item) => {
        const correctAnsIndex = parseInt(item["Correct Answer"], 10);

        return {
          quizId, // Add quizId to each question
          questionText: item["Question"],
          type: "multiple-choice", // Assuming all are multiple-choice, can be dynamic if needed
          imageURL: item["Question Image (URL)"] || "", // Default to empty if no image URL

          options: [
            {
              optionText: item["Option 1"],
              optionImage: item["Option 1 Image (URL)"] || "",
              isCorrect: correctAnsIndex === 1,
            },
            {
              optionText: item["Option 2"],
              optionImage: item["Option 2 Image (URL)"] || "",
              isCorrect: correctAnsIndex === 2,
            },
            {
              optionText: item["Option 3"],
              optionImage: item["Option 3 Image (URL)"] || "",
              isCorrect: correctAnsIndex === 3,
            },
            {
              optionText: item["Option 4"],
              optionImage: item["Option 4 Image (URL)"] || "",
              isCorrect: correctAnsIndex === 4,
            },
          ],
        };
      });
    };

    try {
      const quizData = await parseDoc(file);
      const quizObject = {
        title: quizName,
        TotalQuestion: quizData.length,
      };

      //Upload to Firestore
      const recordId = await addDoc(collection(db, "quizzes"), quizObject);
      console.log("rec", quizData[0]["Option 1"]);
      const questionSet = await transformQuestion(quizData, recordId.id);
      console.log("wwq1200", questionSet);

      for (let question of questionSet) {
        await addDoc(collection(db, "questions"), question);
      }
      alert("Successfully uploaded");
      console.log("rec.id", questionId.id);
      setfile(null);
      SetQuizName("");
      setError("");
    } catch {}
    console.log("ee");
    setError("Error occured while uploading");
  }

  return (
    <>
      <div className="upload-quiz-container">
        <h1>Create a New Quiz</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Enter Quiz Title">Quiz title</label>
            <input
              type="text"
              placeholder="Enter the Quiz Names"
              onChange={(e) => SetQuizName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Upload Question Set">Upload Question Sheet</label>
            <input
              type="file"
              id="fileInput"
              placeholder="Upload Questions"
              onChange={handleFileChange}
            />
          </div>
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default UploadQuiz;
