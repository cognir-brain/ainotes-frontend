export default function StyleBahasaSelect({styleBahasa, setStyleBahasa}) {
  return (
    <select className="p-2 border rounded-full text-sm text-center text-slate-500" value={styleBahasa} onChange={(e) => setStyleBahasa(e.target.value)}>
      <option value="anak-anal">anak-anak</option>
      <option value="akademis">akademis</option>
      <option value="santai">santai</option>
      <option value="gen-z">gen z</option>
      <option value="gen-millennial">gen millennial</option>
    </select>
  );
}
