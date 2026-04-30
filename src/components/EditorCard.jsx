import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import HeaderCard from "./HeaderCard";
import MainCard from "./MainCard";
import tabMap from "./tabMap";
import { saveNote } from "../utils/api";

export default function EditorCard(){
  const [isLoading, setIsLoading] = useState(false);

  const Tab = "text" | "pdf" | "docx" | "youtube";
  const [tab, setTab] = useState("text");

  const [content, setContent] = useState("");
  const [chars, setChars] = useState("".length);

  // file state (for pdf/doc)
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  // youtube link state
  const [youtubeLink, setYoutubeLink] = useState("");
  const [linkError, setLinkError] = useState(null);

  // bahasa / language state
  const [bahasa, setBahasa] = useState("id");
  const [styleBahasa, setStyleBahasa] = useState("santai");

  useEffect(() => {
    setChars(content.length);
  }, [content]);

  function validateYouTube(url) {
    if (!url) return false;
    // basic contains youtube domain check
    try {
      const u = new URL(url);
      return u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be");
    } catch {
      return false;
    }
  }

  function onFileChange(e){
    setFileError(null);
    const f = e.target.files[0];
    if (!f) {
      setFile(null);
      return;
    }

    const accept = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!accept.includes(f.type)) {
      setFileError("Tipe file tidak didukung. Gunakan PDF atau DOC/DOCX.");
      setFile(null);
      return;
    }
    setFile(f);
  }

  async function save() {
    try {
      if (isLoading) return; // prevent double submit
      setIsLoading(true);

      if (tab === "youtube" && !validateYouTube(youtubeLink)) {
        setLinkError("Masukkan link YouTube yang valid.");
        setIsLoading(false);
        return;
      }

      if ((tab === "pdf" || tab === "doc") && !file) {
        setFileError("Pilih file terlebih dahulu.");
        setIsLoading(false);
        return;
      }

      const payload = {
        id: '1',
        type: tab,
      };

      if (tab === "text") {
        payload.content = content;
      }

      if (tab === "youtube") {
        payload.youtubeLink = youtubeLink;
      }

      if (tab === "pdf" || tab === "doc") {
        // we send the File object directly; your saveNote should handle FormData on client-side
        payload.file = file;
        payload.content = content || "";
      }
      payload.bahasa = bahasa;
      payload.styleBahasa = styleBahasa;

      payload.tab = tab;

      // console.log(JSON.parse(JSON.stringify(payload)));
      const data = await saveNote(payload);
      // console.log("saveNote response:", data);

      // Expected server response shape:
      // { status: "success", message: "...", data: { noteId: "note-..." } }
      const returnedId =
        data?.data?.noteId ?? // preferred
        data?.noteId ??       // fallback
        data?.id ??           // other possible shapes
        null;

      if (data?.status === "success") {
        // show toast / alert
        // optionally prefer redirectOnSave prop if provided
        // if (redirectOnSave && typeof redirectOnSave === "function" && returnedId) {
        //   redirectOnSave(returnedId);
        // } else if (returnedId) {
          // default client-side navigation to /notes/{noteId}
          window.location.href = `/notes/${returnedId}`;
        // } else {
        //   // no id returned — still notify user
        //   alert("Saved (no id returned)");
        // }
      } else {
        // handle non-success server response
        alert(data?.message || "Gagal menyimpan");
      }
    } catch (err) {
      console.error(err);
      alert(err?.message || "Gagal menyimpan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative custom-width mx-auto bg-white shadow rounded-[20px] overflow-hidden m-auto">
      {isLoading && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm"
          aria-live="assertive"
          aria-busy="true"
        >
          <LoadingSpinner label="Menyimpan ... Harap tunggu" />
        </div>
      )}
      <HeaderCard styleBahasa={styleBahasa} setStyleBahasa={setStyleBahasa} isLoading={isLoading} tab={tab} setTab={setTab} tabMap={tabMap}/>
      <MainCard tab={tab} content={content} setContent={setContent} setChars={setChars} isLoading={isLoading} file={file} fileInputRef={fileInputRef} onFileChange={onFileChange} fileError={fileError} youtubeLink={youtubeLink} setYoutubeLink={setYoutubeLink} linkError={linkError} setLinkError={setLinkError} validateYouTube={validateYouTube} bahasa={bahasa} setBahasa={setBahasa} chars={chars} save={save} />
    </div>
  )
}