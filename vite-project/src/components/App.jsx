import { useEffect, useReducer, useState } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import "../index.css";
import { fetchQuizById } from "./GoogleSignIn/DataFromDb";

const SECS_PER_QUESTION = 5;
// We need to define the intialState in order to use useReduce Hook.
const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  clickedOption: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        clickedOption: action.payload, // Set clicked option here
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        clickedOption: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        highscore:
          state.secondsRemaining === 0
            ? state.points > state.highscore
              ? state.points
              : state.highscore
            : state.highscore,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unkonwn");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      clickedOption,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [quizData, setQuizData] = useState("");
  const numQuestions = quizData.noOfQuestions;
  // const maxPossiblePoints = questions.reduce(
  //   (prev, cur) => prev + cur.points,
  //   0
  // );
  const maxPossiblePoints = 10;

  useEffect(function () {
    // Fetch fallback quiz data (optional, for fallback purposes)
    fetch("https://vinayak9669.github.io/React_quiz_api/questions.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("fallback");
      })
      .catch((err) => dispatch({ type: "dataFailed" }));

    // Retrieve quiz data from the database
    const id = "crvasfHdjFOdSuhKmdvD"; // Example quiz ID
    const fetchQuizData = async () => {
      try {
        const result = await fetchQuizById(id); // Fetch quiz data from the database
        console.log("Fetched quiz data:", result);

        // Set quiz data to state
        setQuizData(result);

        // Directly dispatch the received questions after fetching data
        dispatch({
          type: "dataReceived",
          payload: result.questions, // Dispatch the correct questions immediately
        });
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        dispatch({ type: "dataFailed" }); // Handle errors by dispatching the error action
      }
    };

    // Call fetchQuizData to load the quiz data when the component mounts
    fetchQuizData();
  }, []);

  return (
    <div className="wrapper">
      <div className="app">
        <div className="headerWrapper">
          <Header title={quizData.quizTitle} />

          <Main>
            {status === "loading" && <Loader />}
            {status === "error" && <Error />}
            {status === "ready" && (
              <StartScreen
                numQuestions={numQuestions}
                dispatch={dispatch}
                title={quizData.quizTitle}
              />
            )}{" "}
            {status === "active" && (
              <>
                <Progress
                  index={index}
                  numQuestions={numQuestions}
                  points={points}
                  maxPossiblePoints={maxPossiblePoints}
                  answer={answer}
                />
                <Question
                  question={questions[index]}
                  dispatch={dispatch}
                  answer={answer}
                  clickedOption={clickedOption}
                />

                <Footer>
                  <Timer
                    dispatch={dispatch}
                    secondsRemaining={secondsRemaining}
                  />
                  <NextButton
                    dispatch={dispatch}
                    answer={answer}
                    numQuestions={numQuestions}
                    index={index}
                  />
                </Footer>
              </>
            )}
            {status === "finished" && (
              <FinishScreen
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                highscore={highscore}
                dispatch={dispatch}
              />
            )}
          </Main>
        </div>
      </div>
    </div>
  );
}
