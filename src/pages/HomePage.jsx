import React from "react";
import EditorCard from "../components/EditorCard";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center">
      <Sidebar />
      <main className="flex-1 p-8 m-auto">
        <div className="max-w-6xl mx-auto">
          <div className="m-auto">
            <EditorCard />
          </div>
        </div>
      </main>
    </div>
  )
}
