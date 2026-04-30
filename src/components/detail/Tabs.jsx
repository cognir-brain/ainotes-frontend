import React from "react";

export default function Tabs({ tab, setTab }) {
  const tabs = [
    { key: "notes", label: "Notes" },
    { key: "flashcard", label: "Flashcard" },
    { key: "quiz", label: "Quiz" },
    { key: "original", label: "Original Content" },
  ];

  return (
    <div className="flex gap-2 bg-slate-100 rounded-full p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`px-3 py-1 rounded-full text-sm ${
            tab === t.key ? "bg-white shadow" : "text-slate-500"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}