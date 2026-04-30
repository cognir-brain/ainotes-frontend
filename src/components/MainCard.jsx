import React from "react";
import LanguageSelect from "./LanguageSelect";
import { ArrowRight } from "lucide-react";

export default function MainCard({ tab, content, setContent, setChars, isLoading, file, fileInputRef, onFileChange, fileError, youtubeLink, setYoutubeLink, linkError, setLinkError, validateYouTube, bahasa, setBahasa, chars, save}) {
  return (
    <div className="">
      {/* conditional content */}
      {tab === "text" && (
        <div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setChars(e.target.value.length);
            }}
            placeholder="Paste your text here for make notes"
            className="w-full min-h-[220px] p-3 border border-slate-200 resize-none bg-white"
            disabled={isLoading}
          />
        </div>
      )}

      {(tab === "pdf" || tab === "doc") && (
        <div>
          <label
            htmlFor="file-upload"
            className="block w-full cursor-pointer rounded-md border-2 border-dashed border-slate-200 p-6 text-center bg-white"
          >
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {file ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-slate-400">{Math.round(file.size / 1024)} KB</div>
                  </div>
                  <div className="text-xs text-slate-500">File siap (simulasi)</div>
                </div>
              ) : (
                <div>
                  <div className="mb-1 font-medium">Tarik & lepas file di sini, atau klik untuk memilih</div>
                  <div className="text-xs text-slate-400">Dukungan: PDF, DOC, DOCX</div>
                </div>
              )}
            </div>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept={tab === "pdf" ? "application/pdf" : ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
              onChange={onFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </label>

          {fileError && <div className="text-sm text-red-500 mt-2">{fileError}</div>}
        </div>
      )}

      {tab === "youtube" && (
        <div className="space-y-2">
          <input
            value={youtubeLink}
            onChange={(e) => {
              setYoutubeLink(e.target.value);
              setLinkError(null);
            }}
            placeholder="Paste YouTube link here (https://...)"
            className="w-full p-3 border border-slate-200 rounded-md bg-white text-slate-900 dark:text-slate-100"
            disabled={isLoading}
          />
          {linkError && <div className="text-sm text-red-500">{linkError}</div>}

          {/* hint / preview */}
          {validateYouTube(youtubeLink) && (
            <div className="mt-2 text-sm text-slate-500">
              Link terdeteksi valid — akan disimpan bersama catatan. (Preview embed bisa ditambahkan)
            </div>
          )}
        </div>
      )}

      {/* footer: language select (mobile) + counter + save */}
      <div className="pl-4 pr-4 pb-1 flex items-center justify-between gap-3">
        {/* mobile language select (redundant with top select) */}
        <div className="flex items-center gap-3">
          <div className="">
            <LanguageSelect bahasa={bahasa} setBahasa={setBahasa} />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          
          {/* only show counter for text */}
          {tab === "text" && <div className="text-xs text-slate-400">{chars}/10000</div>}
          <button
            onClick={save}
            className="px-4 py-2 rounded-full border-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span className="text-sm">Menyimpan...</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}