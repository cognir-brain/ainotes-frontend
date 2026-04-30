import React from "react";
import { Check, X } from "lucide-react";

export default function QuizView({
  quiz,
  qIndex,
  selectedOption,
  showAnswerFeedback,
  quizFinished,
  score,
  selectOption,
  submitAnswer,
  nextQuestion,
  restartQuiz,
}) {
  if (quizFinished) {
    return (
      <div className="bg-slate-50 border rounded-2xl p-8 text-center">
        <div className="text-3xl font-bold">
          {score} / {quiz.length}
        </div>
        <button
          onClick={restartQuiz}
          className="mt-6 px-5 py-3 rounded-full bg-blue-600 text-white"
        >
          Restart
        </button>
      </div>
    );
  }

  const current = quiz[qIndex];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-medium text-center">
        {current?.question}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {current?.options.map((opt, i) => {
          const isCorrect = current.answerIndex === i;
          const isSelected = selectedOption === i;

          return (
            <button
              key={i}
              onClick={() => selectOption(i)}
              disabled={showAnswerFeedback}
              className="p-6 border rounded-2xl text-left"
            >
              {opt}

              {showAnswerFeedback && (isCorrect || isSelected) && (
                <span className="ml-3">
                  {isCorrect ? (
                    <Check className="inline w-4 h-4 text-green-600" />
                  ) : (
                    <X className="inline w-4 h-4 text-red-600" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end gap-3">
        {!showAnswerFeedback ? (
          <button
            onClick={submitAnswer}
            disabled={selectedOption === null}
            className="px-5 py-3 bg-blue-600 text-white rounded-full"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-5 py-3 bg-blue-600 text-white rounded-full"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}