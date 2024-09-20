import Options from "./Options";

function Question({ question, dispatch, answer,clickedOption }) {
  return (
    <div className="question_container">
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer}  clickedOption={clickedOption} />
    </div>
  );
}

export default Question;
