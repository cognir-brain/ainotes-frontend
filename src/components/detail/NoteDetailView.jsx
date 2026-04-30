// src/components/NoteDetailView.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import MarkdownRenderer from "./MarkdownRender";
import { chatAssistant } from "../../utils/api";

// AssistantInner (memoized)
const AssistantInner = React.memo(function AssistantInner({
  compact,
  onClose,
  query,
  setQuery,
  chatMessages,
  onSendQuestion,
  isLoading,
}) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div
      className={`bg-white rounded-2xl shadow p-4 w-full h-full flex flex-col ${
        compact ? "px-3 py-3" : "px-4 py-4"
      }`}
    >
      {onClose ? (
        <button
          onClick={onClose}
          aria-label="Close assistant"
          className="p-1 rounded hover:bg-slate-100 self-end"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}

      <div className={`mt-4 text-center overflow-auto ${chatMessages.length === 0 ? "" : "hidden"}`}>
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-lg mx-auto">
          <MessageSquare className="w-1/2 h-1/2 text-slate-500 text-blue-500" />
        </div>
        <h3 className="mt-3 font-semibold">Hey, I’m AI Assistant</h3>
        <p className="text-xs text-slate-400 mt-2">
          Ada yang kurang jelas dari catatan ini? Silakan tanyakan konsep yang menurutmu membingungkan.
        </p>
      </div>

      <div className="mt-4 flex-1 overflow-auto space-y-2">
        {chatMessages.length === 0 ? (
          isLoading ? (
            <div className="text-center text-sm text-slate-400 mt-6">
              <div className="inline-flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-slate-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-slate-500 animate-pulse" />
              </div>
              <div className="mt-2 text-xs text-slate-400">Assistant sedang mengetik…</div>
            </div>
          ) : (
            <div className="text-center text-sm text-slate-400 mt-6">Belum ada percakapan.</div>
          )
        ) : (
          <>
            {chatMessages.map((m) => (
              <div
                key={m.ts}
                className={`p-2 rounded max-w-[90%] ${
                  m.from === "user" ? "bg-blue-50 self-end ml-auto" : "bg-slate-100 self-start"
                }`}
              >
                <div className="text-sm">
                  <MarkdownRenderer content={m.text} />
                </div>
              </div>
            ))}

            {/* typing indicator as last bubble when loading */}
            {isLoading && (
              <div className="p-2 rounded max-w-[60%] bg-slate-100 self-start">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-pulse" />
                  <div className="ml-2 text-xs text-slate-500">Assistant sedang mengetik…</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            className="flex-1 border rounded-full px-3 py-2 text-sm"
            placeholder="Type a question here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSendQuestion();
            }}
            disabled={isLoading}
          />
          <button
            onClick={onSendQuestion}
            className={`p-2 rounded-full ${isLoading ? "bg-slate-300 text-slate-600" : "bg-blue-600 text-white"}`}
            aria-label="Send"
            disabled={isLoading}
            title={isLoading ? "Please wait…" : "Send"}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
AssistantInner.displayName = "AssistantInner";

export default function NoteDetailView({
  initial,
  flashcardsAPi,
  quizsApi,
  loadingFlashcardAndQuiz,
  errorFlashcardAndQuiz,
}) {
  const [tab, setTab] = useState("notes"); // "notes" | "flashcard" | "quiz" | "original"
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);

  // Flashcard grouped state
  const [flashcardState, setFlashcardState] = useState({
    flashcards: [],
    index: 0,
    showAnswer: false,
  });

  // Quiz grouped state
  const [quizState, setQuizState] = useState({
    quiz: [],
    index: 0,
    selectedOption: null,
    score: 0,
    finished: false,
    showFeedback: false,
  });

  // UTIL: Fisher-Yates shuffle
  function shuffle(arr) {
    if (!Array.isArray(arr)) return [];
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Load flashcards & quiz from props
  useEffect(() => {
    if (!initial) return;

    const flashcardsFromApi = Array.isArray(flashcardsAPi) ? flashcardsAPi : [];
    const quizFromApi = Array.isArray(quizsApi) ? quizsApi : [];

    const shuffledFlash = shuffle(flashcardsFromApi);

    const shuffledQuiz = shuffle(quizFromApi).map((q) => {
      const opts = Array.isArray(q.options) ? q.options.map((opt, idx) => ({ opt, idx })) : [];
      const shuffledOpts = shuffle(opts);
      const newAnswerIndex = shuffledOpts.findIndex((o) => o.idx === q.answerIndex);
      return {
        id: q.id,
        question: q.question,
        options: shuffledOpts.map((o) => o.opt),
        answerIndex: newAnswerIndex,
      };
    });

    // set both states with single set each (avoid cascading renders)
    setFlashcardState({
      flashcards: shuffledFlash,
      index: 0,
      showAnswer: false,
    });

    setQuizState({
      quiz: shuffledQuiz,
      index: 0,
      selectedOption: null,
      score: 0,
      finished: false,
      showFeedback: false,
    });
  }, [initial, flashcardsAPi, quizsApi]);

  // shorthand accessors
  const flashcards = flashcardState.flashcards;
  const fcIndex = flashcardState.index;
  const fcShowAnswer = flashcardState.showAnswer;

  const quiz = quizState.quiz;
  const qIndex = quizState.index;
  const selectedOption = quizState.selectedOption;
  const score = quizState.score;
  const quizFinished = quizState.finished;
  const showAnswerFeedback = quizState.showFeedback;

  // On send question to AI
  async function onSendQuestion() {
    if (!query.trim()) return;

    const userText = query.trim();
    const userMsg = { from: "user", text: userText, ts: Date.now() };
    setChatMessages((s) => [...s, userMsg]);
    setQuery("");

    setAssistantLoading(true);
    try {
      const aiText = await chatAssistant(userText, initial?.notes?.id);
      const botMsg = { from: "bot", text: aiText, ts: Date.now() + 1 };
      setChatMessages((s) => [...s, botMsg]);
    } catch (err) {
      console.error("AI assistant error:", err);
      const errMsg = { from: "bot", text: "❌ Gagal mendapatkan jawaban dari AI.", ts: Date.now() + 1 };
      setChatMessages((s) => [...s, errMsg]);
    } finally {
      setAssistantLoading(false);
    }
  }

  // FLASHCARD HANDLERS
  function goPrevFlashcard() {
    setFlashcardState((st) => ({
      ...st,
      showAnswer: false,
      index: st.index > 0 ? st.index - 1 : st.flashcards.length - 1,
    }));
  }
  function goNextFlashcard() {
    setFlashcardState((st) => ({
      ...st,
      showAnswer: false,
      index: st.index < st.flashcards.length - 1 ? st.index + 1 : 0,
    }));
  }
  function toggleFcAnswer() {
    setFlashcardState((st) => ({ ...st, showAnswer: !st.showAnswer }));
  }
  function randomizeFlashcards() {
    setFlashcardState((st) => ({ ...st, flashcards: shuffle(st.flashcards), index: 0, showAnswer: false }));
  }

  // QUIZ HANDLERS
  function selectOption(idx) {
    if (showAnswerFeedback) return;
    setQuizState((st) => ({ ...st, selectedOption: idx }));
  }
  function submitAnswer() {
    if (selectedOption === null) return;
    const current = quiz[qIndex];
    const correct = selectedOption === current.answerIndex;
    setQuizState((st) => ({
      ...st,
      showFeedback: true,
      score: correct ? st.score + 1 : st.score,
      finished: st.index === st.quiz.length - 1 ? true : st.finished,
    }));
  }
  function nextQuestion() {
    setQuizState((st) => {
      const nextIndex = st.index < st.quiz.length - 1 ? st.index + 1 : st.index;
      return {
        ...st,
        index: nextIndex,
        selectedOption: null,
        showFeedback: false,
        finished: nextIndex >= st.quiz.length ? true : st.finished,
      };
    });
  }
  function restartQuiz() {
    const reshuffled = shuffle(quiz).map((q) => {
      const original = q.options.map((opt, idx) => ({ opt, idx }));
      const shuffledOpts = shuffle(original);
      const correctText = q.options[q.answerIndex];
      const newIndex = shuffledOpts.findIndex((o) => o.opt === correctText);
      return { ...q, options: shuffledOpts.map((o) => o.opt), answerIndex: newIndex };
    });

    setQuizState({
      quiz: reshuffled,
      index: 0,
      selectedOption: null,
      score: 0,
      finished: false,
      showFeedback: false,
    });
  }

  const letterFor = (i) => ["A", "B", "C", "D"][i] ?? String.fromCharCode(65 + i);

  return (
    <div className="min-h-screen flex gap-6 items-start">
      {/* CENTER */}
      <main className="flex-1 max-w-4xl main-detail">
        <h1 className="text-xl font-semibold mb-2 text-center">{initial?.notes?.title || "Nggak dulu"}</h1>

        <div className="bg-white rounded-2xl shadow p-6">
          {/* Tabs */}
          <div className="mb-4">
            <div className="flex gap-2 bg-slate-100 rounded-full p-1 tab-detail">
              {[
                { key: "notes", label: "Notes" },
                { key: "flashcard", label: "Flashcard" },
                { key: "quiz", label: "Quiz" },
                { key: "original", label: "Original Content" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    if (t.key === "notes") setIsAssistantOpen(false);
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${tab === t.key ? "bg-white shadow text-slate-800" : "text-slate-500"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 rounded-lg min-h-[72vh] text-slate-700 relative">
            {tab === "notes" && (
              <div className="mt-6 prose max-w-none">
                {initial?.notes ? (
                  initial.notes.content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p className="text-slate-400">Tidak ada konten.</p>
                )}
              </div>
            )}

            {/* FLASHCARD */}
            {tab === "flashcard" && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-sm text-slate-500 mb-6">Ketuk dua kali untuk membuka jawaban</div>

                <div className="w-full max-w-3xl bg-slate-50 border border-slate-100 rounded-2xl p-10 md:p-16 shadow-sm text-slate-700" onDoubleClick={toggleFcAnswer}>
                  <div className="min-h-[160px] flex items-center justify-center">
                    {flashcards.length ? (
                      fcShowAnswer ? (
                        <div className="text-base md:text-lg leading-relaxed text-slate-700">{flashcards[fcIndex].answer}</div>
                      ) : (
                        <h2 className="text-xl md:text-2xl font-semibold">{flashcards[fcIndex].question}</h2>
                      )
                    ) : (
                      <div className="text-slate-400">Tidak ada flashcard.</div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <button onClick={goPrevFlashcard} className="w-12 h-12 rounded-full bg-white border shadow flex items-center justify-center text-blue-600 hover:scale-105 transition-transform" aria-label="Previous">
                    <ChevronLeft size={20} />
                  </button>

                  <button onClick={() => setFlashcardState((s) => ({ ...s, showAnswer: !s.showAnswer }))} className="w-12 h-12 rounded-full bg-blue-600 text-white shadow flex items-center justify-center hover:scale-105 transition-transform" aria-label="Toggle answer">
                    {fcShowAnswer ? <X size={18} /> : <MessageSquare size={18} />}
                  </button>

                  <button onClick={goNextFlashcard} className="w-12 h-12 rounded-full bg-white border shadow flex items-center justify-center text-blue-600 hover:scale-105 transition-transform" aria-label="Next">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* QUIZ */}
            {tab === "quiz" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 text-center px-6">
                    <p className="text-slate-500 mb-3">Pilih jawaban yang paling tepat</p>
                    <h2 className="text-lg md:text-xl font-medium text-slate-700">{quiz[qIndex]?.question}</h2>
                  </div>

                  <div className="text-sm text-slate-500 ml-4">{quiz.length ? `${Math.min(qIndex + 1, quiz.length)}/${quiz.length}` : ""}</div>
                </div>

                {quizFinished ? (
                  <div className="bg-slate-50 border rounded-2xl p-8 text-center">
                    <div className="text-slate-500 mb-2">Quiz selesai</div>
                    <div className="text-3xl font-bold text-slate-800">{score} / {quiz.length}</div>
                    <div className="mt-4 text-sm text-slate-600">Terima kasih — review jawaban diulangi jika ingin memperbaiki skor.</div>
                    <div className="mt-6 flex justify-center gap-3">
                      <button onClick={restartQuiz} className="px-5 py-3 rounded-full bg-blue-600 text-white shadow">Restart</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {quiz[qIndex]?.options.map((opt, i) => {
                          const isSelected = selectedOption === i;
                          const isCorrect = quiz[qIndex].answerIndex === i;
                          const showCorrectClass = showAnswerFeedback && isCorrect;
                          const showWrongSelected = showAnswerFeedback && isSelected && !isCorrect;

                          const base = "relative w-full text-left p-6 rounded-2xl border transition-shadow duration-150 flex items-start gap-4";
                          const dynamic = showCorrectClass ? "bg-green-50 border-green-200 shadow-sm" : showWrongSelected ? "bg-red-50 border-red-200 shadow-sm" : isSelected ? "border-slate-800 bg-white shadow-sm" : "bg-white border-slate-100 hover:shadow";

                          return (
                            <button key={i} onClick={() => selectOption(i)} disabled={showAnswerFeedback} className={`${base} ${dynamic}`}>
                              <div className={`flex items-center justify-center w-9 h-9 rounded-full border ${isSelected ? "border-slate-800" : "border-slate-200"} text-sm font-semibold text-slate-700`}>{letterFor(i)}</div>
                              <div className="flex-1 text-sm text-slate-700"><div className="leading-snug">{opt}</div></div>
                              {showAnswerFeedback && (isCorrect || isSelected) && (
                                <div className="absolute right-3 top-3">
                                  {isCorrect ? (
                                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-green-100 shadow-sm">
                                      <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-red-100 shadow-sm">
                                      <X className="w-4 h-4 text-red-600" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      {!showAnswerFeedback ? (
                        <button onClick={submitAnswer} disabled={selectedOption === null} className="px-5 py-3 rounded-full bg-blue-600 text-white shadow">Submit</button>
                      ) : (
                        <button onClick={nextQuestion} className="px-5 py-3 rounded-full bg-blue-600 text-white shadow">Next</button>
                      )}
                      <button onClick={restartQuiz} className="px-4 py-2 rounded border text-sm">Restart</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "original" && (
              <div className="prose max-w-none">
                <div className="text-slate-500 mb-2">Original Content</div>
                <div className="bg-white border rounded-lg p-4">
                  {initial?.content ? <pre className="whitespace-pre-wrap text-sm">{initial.content}</pre> : <p className="text-slate-400">Tidak ada konten asli.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT: AI Assistant */}
      {tab === "notes" && (
        <aside className="w-80 flex flex-col sticky top-6 self-start" style={{ height: "calc(100vh - 48px)" }}>
          <h1 className="text-xl font-semibold mb-2 text-center">AI Assistant</h1>

          <AssistantInner
            query={query}
            setQuery={setQuery}
            chatMessages={chatMessages}
            onSendQuestion={onSendQuestion}
            isLoading={assistantLoading}
          />
        </aside>
      )}

      {/* Floating chat button */}
      {tab !== "notes" && (
        <>
          <button onClick={() => setIsAssistantOpen(true)} aria-label="Open chat" className="fixed right-6 bottom-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-blue-600 text-white">
            <MessageSquare className="w-6 h-6" />
          </button>

          {isAssistantOpen && (
            <div className="fixed right-6 top-6 z-50 w-80 h-[calc(100vh-96px)] bg-white rounded-2xl shadow-lg overflow-hidden">
              <AssistantInner
                compact
                onClose={() => setIsAssistantOpen(false)}
                query={query}
                setQuery={setQuery}
                chatMessages={chatMessages}
                onSendQuestion={onSendQuestion}
                isLoading={assistantLoading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}