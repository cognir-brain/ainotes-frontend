import NoteDetailView from "../components/detail/NoteDetailView";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNoteById } from "../store/notes/action";
import { fetchFlashcardAndQuizById } from "../store/flashcard/action";
import Sidebar from "../components/Sidebar";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { note, loading, error } = useSelector((state) => state.notes);
  const { flashcards, quizs, loadingFlashcardAndQuiz, errorFlashcardAndQuiz } = useSelector((state) => state.flashcardAndQuiz);
  // console.log("DetailPage:", flashcards, quizs);
  
  useEffect(() => {
    dispatch(fetchNoteById(id));
    dispatch(fetchFlashcardAndQuizById(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!note) return null;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 pl-8 pr-8 m-auto">
        <div className="max-w-6xl mx-auto">
          <div className="m-auto">
            <NoteDetailView initial={note} flashcardsAPi={flashcards} quizsApi={quizs} loadingFlashcardAndQuiz={loadingFlashcardAndQuiz} errorFlashcardAndQuiz={errorFlashcardAndQuiz}/>
          </div>
        </div>
      </main>
    </div>
  );
}