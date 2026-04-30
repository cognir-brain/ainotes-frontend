import StyleBahasaSelect from "./StyleBahasaSelect";

export default function HeaderCard({ styleBahasa, setStyleBahasa, isLoading, tabMap, tab, setTab }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
      <div className="flex items-center gap-2">
        {/* tabs */}
        <div className="flex items-center gap-2 head-tab rounded-full p-[.2rem]">
          {tabMap.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                if (isLoading) return;
                setTab(t.key);
                // setFileError(null);
                // setLinkError(null);
              }}
              className={`text-sm px-3 py-1 rounded-full transition ${
                tab === t.key
                  ? "bg-white text-blue-600"
                  : "text-slate-500 hover:bg-white-50"
              }`}
              aria-pressed={tab === t.key}
              disabled={isLoading}
            >
              {t.label === "Link Youtube" ? (
                <span className="flex items-center">
                  <t.icon className="w-4 h-4 mr-1 inline text-red-500" /> {t.label}
                </span>
              ) : (
                <span className="flex items-center">
                  <t.icon className="w-4 h-4 mr-1 inline" /> {t.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* small caption (matches image) */}
        {/* <div className="text-xs text-slate-400 ml-3 hidden sm:block">Teks • PDF • DOC • Link Youtube</div> */}
      </div>

      {/* style bahasa (dropdown) */}
      <div className="flex items-center gap-3">
        {/* <div className="text-sm text-slate-500 hidden sm:block">Style Bahasa</div> */}
        <StyleBahasaSelect styleBahasa={styleBahasa} setStyleBahasa={setStyleBahasa} />
      </div>
    </div>
  );
}