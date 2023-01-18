import "./styles/global.css"

import logoImage from "./assets/Logo.svg"
export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
          <img src={logoImage} />
          <button
            type="button"
            className="border border-violet-500 font-semibold rounded px-6 py-4"
          >
            Nono Hábito
          </button>
        </div>
      </div>
    </div>
  )
}

