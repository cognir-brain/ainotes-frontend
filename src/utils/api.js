import { getStoredToken } from "./helper.js";

export const backendUrl = 'https://backend-ainotes-production.up.railway.app';

export async function saveNote(payload) {
  const token = getStoredToken();

  let body;
  let headers = {};

  // ===============================
  // Gunakan FormData jika perlu
  // ===============================

  if (payload.tab === "text") {
    const fd = new FormData();
    fd.append("type", payload.type);
    fd.append("bahasa", payload.bahasa);
    fd.append("styleBahasa", payload.styleBahasa);
    if (payload.content) fd.append("content", payload.content);
    body = fd;

  } else if (payload.tab === "youtube") {
    const fd = new FormData();
    fd.append("type", payload.type);
    fd.append("bahasa", payload.bahasa);
    fd.append("styleBahasa", payload.styleBahasa);
    if (payload.youtubeLink) fd.append("youtubeLink", payload.youtubeLink);
    body = fd;

  } else if (payload.tab === "pdf" || payload.tab === "doc") {
    const fd = new FormData();
    fd.append("type", payload.type);
    if (payload.file) fd.append("file", payload.file);
    body = fd;

  } else {
    // fallback JSON
    body = JSON.stringify(payload);
    headers["Content-Type"] = "application/json";
  }
  headers["Authorization"] = `Bearer ${token}`;


  // ===============================
  // Optional Authorization
  // ===============================

  const url = `${backendUrl}/api/notes`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body,
    credentials: 'include',
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to save note");
  }

  return res.json();
}

export async function getHistory() {
  const token = getStoredToken();
  let headers = {};
  headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${backendUrl}/api/history`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });
  if (!res.ok) return null; //throw new Error("Failled get history");

  // console.log(res);
  return res.json();
}

export async function getNoteById(id) {
  const res = await fetch(`${backendUrl}/api/notes/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Failled to fetch note ${id}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  const blob = await res.blob();
  return { blob, contentType };
}

export async function getFlashcardAndQuizById(id) {
  const res = await fetch(`${backendUrl}/api/flashcard-and-quiz/${id}`, {
    method: 'GET',
    credentials: 'include',
    cache: "no-cache",
  })

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failled to fetch note ${id}`);
  }
  return res.json();
}

export async function chatAssistant(text, noteId) {
  const token = getStoredToken();
  let headers = {};
  headers['Content-Type'] = "application/json";
  headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${backendUrl}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ 'prompt': text, 'noteId': noteId }),
    credentials: 'include'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failled to get ai response");
  }
  const txt = await res.json();
  console.log("Ai res", txt);

  return txt.text;
}

