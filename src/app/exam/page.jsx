"use client";
import React, { useState, useEffect } from "react";

const App = () => {
  const [userData, setUserData] = useState({ name: "", age: "" });
  const [showSequence, setShowSequence] = useState(false);
  const [loopLength, setLoopLength] = useState(3)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSequence(true);
  };

  const handleLength = () =>{
    if(loopLength<3){
      setLoopLength(3)
    }
    setLoopLength(loopLength+1)
  }
  const handleLengthDe = () =>{
    if(loopLength<=3){
      setLoopLength(3)
    }else{
      setLoopLength(loopLength-1)
    }
    
  }

  return (
    <div>
      
      <div className="flex flex-col items-center justify-center min-h-screen">
        {!showSequence ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className=" flex-col">
              <p>Name </p>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="border p-2"
                required
              />
            </div>
            <div>
              <p>Age </p>
              <input
                type="number"
                name="age"
                value={userData.age}
                onChange={handleInputChange}
                className="border p-2"
                required
              />
            </div>
            
            <button type="submit" className="py-2 px-5 bg-blue-500 text-white rounded-md">
              Start Exam 2
            </button>
          </form>
        ) : (
          <Sequence userData={userData} loopLength={loopLength}/>
        )}
      </div>
      <div className=" flex justify-center gap-2 mb-2">
        <p className=" font-bold text-xl">{loopLength}</p>
        <button className="py-2 px-5 bg-gray-200 rounded-md" onClick={handleLength}>increment </button>
        <button className="py-2 px-5 bg-gray-200 rounded-md" onClick={handleLengthDe}>decrement </button>
      </div>
    </div>
  );
};

const Sequence = ({ userData,loopLength }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [questions, setQuestions] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({ firstLetter: "", secondColor: "", secondLetter: "" });
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [options, setOptions] = useState({});
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [resultDetails, setResultDetails] = useState([]);

  const digits = ["2", "3", "4", "5", "6", "7", "8", "9"];
  const letters = ["A", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const colors = ["green", "red", "orange", "blue", "pink", "yellow", "purple", "cyan"];

  const [sequenceData, setSequenceData] = useState({});

  useEffect(() => {
    startNewSequence();
  }, []);

  const startNewSequence = () => {
    let sequence = [];
    sequence.push({ type: "plus" });
    for (let i = 0; i < 6; i++) {
      sequence.push({ type: "digit", value: randomElement(digits) });
    }
    const firstLetter = randomElement(letters);
    sequence.push({ type: "letter", value: firstLetter, color: "white" });

    for (let i = 0; i < loopLength; i++) { // Adjust loop length based on user input
      sequence.push({ type: "digit", value: randomElement(digits) });
    }

    const secondLetter = randomElement(letters);
    const secondColor = 'black';
    sequence.push({ type: "letter", value: secondLetter, color: secondColor });

    for (let i = 0; i < 6; i++) {
      sequence.push({ type: "digit", value: randomElement(digits) });
    }

    setSequenceData({ firstLetter, secondLetter, secondColor });
    setGeneratedQuestions(generateQuestions(firstLetter, secondLetter, secondColor)); // Generate questions once
    runSequence(sequence);
  };

  const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const runSequence = (sequence) => {
    let index = 0;
    const displayItem = () => {
      if (index < sequence.length) {
        setCurrentItem(sequence[index]);
        setTimeout(() => {
          index++;
          displayItem();
        }, sequence[index].type === "plus" ? 200 : 100);
      } else {
        setSequenceComplete(true);
        setOptions(generateOptions());
      }
    };
    displayItem();
  };

  const generateQuestions = (firstLetter, secondLetter, secondColor) => {
    return [
      
      {
        question: "Select target 2",
        options: generateUniqueOptions(secondLetter, letters),
        answerKey: "secondLetter",
      },
      {
        question: "Which was the colour of target 2?",
        options: generateUniqueOptions(secondColor, colors),
        answerKey: "secondColor",
      },
      {
        question: "Select target 1",
        options: generateUniqueOptions(firstLetter, letters),
        answerKey: "firstLetter",
      },
      
    ];
  };

  const generateOptions = () => {
    return {
      firstLetter: generateUniqueOptions(sequenceData.firstLetter, letters),
      secondColor: generateUniqueOptions(sequenceData.secondColor, colors),
      secondLetter: generateUniqueOptions(sequenceData.secondLetter, letters),
    };
  };

  const generateUniqueOptions = (correctOption, array) => {
    let uniqueOptions = new Set();
    uniqueOptions.add(correctOption); // Ensure the correct option is included
    while (uniqueOptions.size < 4) {
      uniqueOptions.add(randomElement(array));
    }
    return Array.from(uniqueOptions); // No shuffle now
  };

  const handleAnswerChange = (e) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: value });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setFeedback(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let results = [];

    // Compare answers and record details for feedback
    generatedQuestions.forEach((question, index) => {
      const userAnswer = answers[question.answerKey];
      const correctAnswer = sequenceData[question.answerKey];
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) correct++;

      results.push({
        question: question.question,
        userAnswer,
        correctAnswer,
        isCorrect
      });
    });

    setCorrectAnswers(correct);
    setResultDetails(results);
  };

  const handleRestart = () => {
    setFeedback(false);
    setQuestions(false);
    setSequenceComplete(false);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnswers({ firstLetter: "", secondColor: "", secondLetter: "" });
    startNewSequence();
  };

  const handleQuestions = () => {
    setQuestions(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[3.8cm] h-[3.8cm] bg-gray-400 flex items-center justify-center text-4xl">
        {currentItem ? (
          currentItem.type === "plus" ? (
            "+"
          ) : currentItem.type === "digit" ? (
            <span className="text-black" style={{fontSize:'33px',letterSpacing:'16px'}}>{currentItem.value}</span>
          ) : (
            <span style={{ color: currentItem?.color,fontSize:'36px',letterSpacing:'20px'}}>{currentItem.value}</span>
          )
        ) : null}
      </div>

      {sequenceComplete && !questions && !feedback && (
        <>
          <button
            onClick={handleQuestions}
            className="mt-4 p-2 bg-green-500 text-white px-4 rounded-md"
          >
            Answer Questions
          </button>
        </>
      )}

      {questions && !feedback && (
        <div className="mt-4 space-y-4">
          <div>
            <p>{generatedQuestions[currentQuestionIndex].question}</p>
            {generatedQuestions[currentQuestionIndex].options.map((option, idx) => (
              <div key={idx} className="space-x-2">
                <input
                  type="radio"
                  name={generatedQuestions[currentQuestionIndex].answerKey}
                  value={option}
                  onChange={handleAnswerChange}
                  checked={
                    answers[generatedQuestions[currentQuestionIndex].answerKey] === option
                  }
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
          <button
            onClick={handleNextQuestion}
            className="mt-4 p-2 bg-blue-500 text-white px-4 rounded-md"
            disabled={!answers[generatedQuestions[currentQuestionIndex].answerKey]}
          >
            Next
          </button>
        </div>
      )}

      {feedback && (
        <div className="mt-4">
          <p>Quiz Report:</p>
          <p>Name: {userData.name}</p>
          <p>Age: {userData.age}</p>
          <p>You got {correctAnswers} out of 3 correct!</p>
          <div>
            {resultDetails.map((result, index) => (
              <div key={index} className="mt-2">
                <p>Q{index + 1}: {result.question}</p>
                <p>Your answer: {result.userAnswer}</p>
                {!result.isCorrect && (
                  <p className="text-red-500">Correct answer: {result.correctAnswer}</p>
                )}
                <hr />
              </div>
            ))}
          </div>
          <button
            onClick={handleRestart}
            className="mt-2 p-2 bg-blue-500 text-white px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
