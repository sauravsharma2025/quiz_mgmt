import { useEffect } from "react";

function Options({ question, dispatch, answer, clickedOption }) {
  const hasAnswered = answer !== null;

  const handleOptClick = (index) => {
    dispatch({ type: "newAnswer", payload: index });
  };

  useEffect(() => {
    console.log('clickedOption updated:', clickedOption);
  }, [clickedOption]);

  return (
    <div>
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${clickedOption === index ? "clicked" : ""}`}
          key={index}
         
          onClick={() => handleOptClick(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
