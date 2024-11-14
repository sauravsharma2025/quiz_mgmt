import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./GoogleSignIn/firebaseConfig.jsx";

function FinishScreen({
  points,
  maxPossiblePoints,
  highscore,
  dispatch,
  userId,
}) {
  const percentage = (points / maxPossiblePoints) * 100;
  const [hasSaved, setHasSaved] = useState(false);

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  useEffect(() => {
    const saveQuizResult = async () => {
      try {
        if (!hasSaved) {
          console.log("@@PS", userId);
          const quizObject = {
            userId: userId,
            quizId: "12233",
            score: points,
          };
          // Upload to Firestore
          const recordId = await addDoc(
            collection(db, "userResponses"),
            quizObject
          );
          console.log("Document written with ID: ", recordId.id);
          setHasSaved(true); // Set flag to true after saving
        }
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    };

    // Only call saveQuizResult if userId and points are available
    if (userId && points != null) {
      saveQuizResult();
    }
  }, []);

  return (
    <div className="result_container">
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      {/* <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button> */}
    </div>
  );
}

export default FinishScreen;
