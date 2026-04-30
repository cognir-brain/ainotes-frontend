import { Link } from "react-router-dom";

export default function NoteItem({ note }) {
  return (
    <Link to={`/notes/${note.id}`} className="block p-2 rounded hover:bg-slate-50">
      <div className="text-sm">{note.title}</div>
      <div className="text-xs text-slate-400">{new Date(note.created_at).toLocaleDateString()}</div>
    </Link>
  );
}
