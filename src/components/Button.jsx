import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../store/theme/themeSlice"

export default function Button() {
  const dark = useSelector((state) => state.theme.dark)
  const dispatch = useDispatch()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center">
      <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-6 shadow-lg text-center space-y-4">
        <h1 className="text-2xl font-bold">Redux Dark Mode</h1>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition"
        >
          Toggle Dark Mode
        </button>
      </div>
    </div>
  )
}
