import React from "react";
import { ChevronLeft, ChevronRight, MessageSquare, X } from "lucide-react";

export default function FlashcardView({
  flashcards,
  fcIndex,
  fcShowAnswer,
  goPrevFlashcard,
  goNextFlashcard,
  toggleFcAnswer,
}) {
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="text-sm text-slate-500 mb-6">
        Ketuk dua kali untuk membuka jawaban
      </div>

      <div
        className="w-full max-w-3xl bg-slate-50 border rounded-2xl p-10 shadow-sm"
        onDoubleClick={toggleFcAnswer}
      >
        <div className="min-h-[160px] flex items-center justify-center">
          {flashcards.length ? (
            fcShowAnswer ? (
              <div>{flashcards[fcIndex].answer}</div>
            ) : (
              <h2 className="text-xl font-semibold">
                {flashcards[fcIndex].question}
              </h2>
            )
          ) : (
            <div className="text-slate-400">Tidak ada flashcard.</div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-6">
        <button onClick={goPrevFlashcard}>
          <ChevronLeft size={20} />
        </button>

        <button onClick={toggleFcAnswer}>
          {fcShowAnswer ? <X size={18} /> : <MessageSquare size={18} />}
        </button>

        <button onClick={goNextFlashcard}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}