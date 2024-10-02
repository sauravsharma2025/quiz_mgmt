import Options from "./Options";

function Question({ question, dispatch, answer, clickedOption }) {
  return (
    <div className="question_container">
      <h4>{question.questionText}</h4>{" "}
      {/* Ensure the correct field is accessed */}
      <Options
        question={question} // Passing the full question object, including options
        dispatch={dispatch}
        answer={answer}
        clickedOption={clickedOption}
      />
    </div>
  );
}

export default Question;
