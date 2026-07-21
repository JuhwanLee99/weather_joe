import { weatherState } from "../data/radar"

function Gauge({ level, max = 10 }) {
  const pct = Math.min(100, (level / max) * 100)
  const hot = pct >= 70
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-center justify-between text-[10px] font-semibold sm:text-[11px]">
        <span className="truncate text-slate-300">🗯️ 조 매니저 참견 게이지</span>
        <span className={hot ? "shrink-0 text-red-400" : "shrink-0 text-slate-400"}>
          {level}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-700 sm:h-2.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            hot ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-sky-500 to-emerald-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-0.5 hidden truncate text-[10px] text-slate-500 sm:block">
        {level >= 8 ? "만렙 — 우산 건네주기 발동!" : level >= 5 ? "그만 좀 봐라…" : level >= 3 ? "슬슬 참견 시작" : "지켜보는 중"}
      </div>
    </div>
  )
}

export default function ControlDock({
  intensity,
  setIntensity,
  gaugeLevel,
  onKnee,
  umbrellaOn,
  onToggleUmbrella,
  onPanic,
  cozy,
  onToggleCozy,
}) {
  const w = weatherState(intensity)
  const buttons = [
    { on: false, onClick: onKnee, icon: "🦵", label: "무릎 예보", cls: "bg-slate-700/70 text-white hover:bg-red-500/80" },
    {
      on: umbrellaOn,
      onClick: onToggleUmbrella,
      icon: umbrellaOn ? "☂️" : "🌂",
      label: `우산 ${umbrellaOn ? "챙김" : "안챙김"}`,
      cls: umbrellaOn ? "bg-emerald-500 text-white" : "bg-slate-700/70 text-white hover:bg-slate-600",
    },
    { on: false, onClick: onPanic, icon: "🚨", label: "부장님!", cls: "bg-red-600 text-white hover:bg-red-500" },
    {
      on: cozy,
      onClick: onToggleCozy,
      icon: "🌧️",
      label: "코지 모드",
      cls: cozy ? "bg-indigo-500 text-white" : "bg-slate-700/70 text-white hover:bg-slate-600",
    },
  ]

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/70 p-2 shadow-xl backdrop-blur sm:p-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
        {/* 게이지 + 강수 강도 */}
        <div className="flex flex-1 items-center gap-3">
          <Gauge level={gaugeLevel} />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-slate-300 sm:text-[11px]">
              <span className="truncate">🎚️ 강수 강도</span>
              <span className="shrink-0" style={{ color: w.color }}>{w.label}·{intensity}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="intensity-range w-full"
            />
            <div className="mt-0.5 hidden justify-between text-[9px] text-slate-500 sm:flex">
              <span>맑음</span><span>약한 비</span><span>비</span><span>호우</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-4 gap-1.5 lg:flex lg:shrink-0">
          {buttons.map((b) => (
            <button
              key={b.label}
              onClick={b.onClick}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-bold transition active:scale-95 sm:px-3 sm:text-xs ${b.cls}`}
            >
              <span className="text-base sm:text-lg">{b.icon}</span>
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-1.5 hidden text-center text-[10px] text-slate-500 sm:block">
        💡 <kbd className="rounded bg-slate-700 px-1">Space</kbd> 부장님 경보 · 새로고침 연타하면 조 매니저가 폭주 · 레이더 클릭 시 구름 콕 찌르기
      </div>
    </div>
  )
}
