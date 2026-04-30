"use client";

import React, { useEffect, useRef } from "react";
import { MessageSquare, Send, X } from "lucide-react";

const AssistantInner = React.memo(function AssistantInner({
  compact,
  onClose,
  query,
  setQuery,
  chatMessages,
  onSendQuestion,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div
      className={`bg-white rounded-2xl shadow w-full h-full flex flex-col ${
        compact ? "px-3 py-3" : "px-4 py-4"
      }`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 self-end"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="mt-4 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-lg mx-auto">
          <MessageSquare className="w-1/2 h-1/2 text-blue-500" />
        </div>
        <h3 className="mt-3 font-semibold">Hey, I’m AI Assistant</h3>
        <p className="text-xs text-slate-400 mt-2">
          Ada yang kurang jelas dari catatan ini?
        </p>
      </div>

      <div className="mt-4 flex-1 overflow-auto space-y-2">
        {chatMessages.length === 0 ? (
          <div className="text-center text-sm text-slate-400 mt-6">
            Belum ada percakapan.
          </div>
        ) : (
          chatMessages.map((m) => (
            <div
              key={m.ts}
              className={`p-2 rounded max-w-[90%] ${
                m.from === "user"
                  ? "bg-blue-50 self-end ml-auto"
                  : "bg-slate-100 self-start"
              }`}
            >
              <div className="text-sm">{m.text}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 border rounded-full px-3 py-2 text-sm"
          placeholder="Type a question here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSendQuestion()}
        />
        <button
          onClick={onSendQuestion}
          className="p-2 rounded-full bg-blue-600 text-white"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default AssistantInner;