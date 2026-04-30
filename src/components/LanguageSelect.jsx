"use client";

export default function LanguageSelect({ bahasa, setBahasa }) {
  return (
    <select
      className="p-2 border rounded-full text-sm"
      value={bahasa}
      onChange={(e) => setBahasa(e.target.value)}
    >
      <option value="id">🇮🇩 Bahasa Indonesia</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}
