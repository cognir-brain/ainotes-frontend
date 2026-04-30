"use client";

// import { useEffect, useState } from "react";
import NoteItem from "./NoteItem";
// import { fetchNotesHistory } from "app/lib/api";

/**
 * NoteList - simple flat list of notes (no grouping)
 */
export default function NoteList({history}) {
  // const [notes, setNotes] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   let mounted = true;
  //   setLoading(true);
  //   setError(null);

  //   (async () => {
  //     try {
  //       // const data = await fetchNotesHistory();
  //       // const data = null;
  //       if (!mounted) return;
  //       setNotes(history);
  //     } catch (err) {
  //       console.error("fetchNotesHistory error:", err);
  //       if (!mounted) return;
  //       setError("Gagal memuat notes");
  //       setNotes([]);
  //     } finally {
  //       // eslint-disable-next-line no-unsafe-finally
  //       if (!mounted) return;
  //       setLoading(false);
  //     }
  //   })();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [history]);

  if (history.loading) {
    return (
      <div className="px-2 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (history.error) {
    return <div className="text-xs text-red-500 px-2">{history.error}</div>;
  }

  if (!history?.history?.length) {
    return <div className="text-xs text-slate-400 px-2">No notes</div>;
  }

  return (
    <div className="text-sm px-1 space-y-1">
      {history.history.map((n) => (
        <NoteItem key={n.id} note={n} />
      ))}
    </div>
  );
}
