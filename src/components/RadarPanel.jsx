import RadarCanvas from "./RadarCanvas"
import DisguiseSheet from "./DisguiseSheet"
import { INTENSITY_SCALE, REGIONS, TIME_STEPS, NOW_INDEX, frameClock } from "../data/radar"

const CATEGORY_TABS = ["레이더", "위성", "낙뢰", "초단기예측"]

function FrameBadge({ frame }) {
  const step = TIME_STEPS[frame]
  const styles = {
    obs: "bg-slate-600/80 text-slate-100",
    now: "bg-amber-400 text-slate-900",
    fcst: "bg-blue-500 text-white",
  }
  const kindLabel = step.kind === "obs" ? "관측" : step.kind === "now" ? "관측·현재" : "예측"
  return (
    <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
      <span className={`rounded px-2 py-1 text-xs font-bold shadow ${styles[step.kind]}`}>
        [{kindLabel}] {step.label}
      </span>
      <span className="rounded bg-black/40 px-2 py-1 text-[11px] text-white/80 backdrop-blur">
        영상시각 2026-07-21 {frameClock(step.off)}
      </span>
    </div>
  )
}

function ColorBar() {
  const stops = [...INTENSITY_SCALE].reverse()
  const grad = `linear-gradient(to bottom, ${stops.map((s) => s.color).join(",")})`
  return (
    <div className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
      <div className="rounded-md bg-black/45 p-2 backdrop-blur">
        <div className="mb-1 text-center text-[9px] font-semibold text-white/80">mm/h</div>
        <div className="flex gap-1.5">
          <div className="h-40 w-3.5 rounded" style={{ background: grad }} />
          <div className="flex h-40 flex-col justify-between text-[8px] leading-none text-white/75">
            <span>110↑</span>
            <span>64</span>
            <span>32</span>
            <span>16</span>
            <span>8</span>
            <span>4</span>
            <span>1</span>
            <span>0.1</span>
          </div>
        </div>
        <div className="mt-1 flex justify-between text-[8px] font-semibold text-white/70">
          <span>강함</span>
        </div>
      </div>
    </div>
  )
}

function KneeCard({ onClose }) {
  return (
    <div className="knee-card absolute bottom-4 left-1/2 z-20 w-[19rem] max-w-[90%] -translate-x-1/2 rounded-xl border border-red-400/40 bg-slate-900/95 p-3 shadow-2xl backdrop-blur">
      <div className="flex items-start gap-2">
        <span className="text-2xl">🦵</span>
        <div className="flex-1">
          <div className="text-sm font-bold text-red-300">조 매니저 무릎 예보 (긴급)</div>
          <div className="mt-0.5 text-[15px] font-extrabold text-white">"비 와. 확정이야."</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[11px]">
            <div className="rounded-lg bg-red-500/15 py-1.5">
              <div className="font-bold text-red-300">조 매니저 무릎</div>
              <div className="text-lg font-black text-white">100%</div>
            </div>
            <div className="rounded-lg bg-slate-700/40 py-1.5">
              <div className="font-bold text-slate-300">기상청 슈퍼컴</div>
              <div className="text-lg font-black text-slate-200">87%</div>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="닫기">
          ✕
        </button>
      </div>
    </div>
  )
}

export default function RadarPanel({
  intensity,
  frameIndex,
  setFrameIndex,
  isPlaying,
  togglePlay,
  region,
  setRegion,
  weather,
  refreshCount,
  onRefresh,
  umbrellaOn,
  cozy,
  disguiseMode,
  disguiseSeconds,
  kneeForecast,
  onCloseKnee,
  onPoke,
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl">
      {/* 상단 카테고리 탭 + 발표시각 */}
      <div className="flex items-center gap-1 border-b border-slate-700/70 bg-slate-800/80 px-2 py-1.5 sm:px-3">
        <span className="mr-1 shrink-0 text-sm font-black tracking-tight text-sky-300">☁ 날씨누리</span>
        {CATEGORY_TABS.map((t) => (
          <button
            key={t}
            className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold transition ${
              t === "초단기예측"
                ? "bg-sky-500 text-white"
                : "hidden text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 sm:block"
            }`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto hidden text-right text-[11px] leading-tight text-slate-400 md:block">
          <div>발표시각 <span className="font-semibold text-slate-200">2026-07-21 14:30</span></div>
          <div>10분 간격 갱신 · 초단기 강수예측</div>
        </div>
      </div>

      {/* 서브바: 권역 + 새로고침 + 날씨 배지 */}
      <div className="flex items-center gap-1.5 border-b border-slate-700/50 bg-slate-800/40 px-2 py-1 sm:px-3">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto no-scrollbar">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition ${
                r === region
                  ? "bg-slate-200 text-slate-900"
                  : "bg-slate-700/40 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button
          onClick={onRefresh}
          className="flex shrink-0 items-center gap-1 rounded-md bg-sky-600 px-2 py-1 text-xs font-bold text-white shadow transition active:scale-95 hover:bg-sky-500"
        >
          <span key={refreshCount} className="refresh-spin">⟳</span>
          <span className="hidden sm:inline">새로고침</span>
          {refreshCount > 0 && (
            <span className="rounded-full bg-white/25 px-1.5 text-[10px]">{refreshCount}</span>
          )}
        </button>
        <span
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-white"
          style={{ background: weather.color + "cc" }}
        >
          {weather.key === "clear" ? "☀" : weather.key === "heavy" ? "⛈" : "🌧"} {weather.label}
        </span>
      </div>

      {/* 레이더 본체 */}
      <div className="relative min-h-[240px] flex-1">
        <RadarCanvas
          intensity={intensity}
          frameIndex={frameIndex}
          isPlaying={isPlaying}
          umbrellaOn={umbrellaOn}
          cozy={cozy}
          onFrame={setFrameIndex}
          onPoke={onPoke}
        />
        <FrameBadge frame={frameIndex} />
        <ColorBar />
        {kneeForecast && <KneeCard onClose={onCloseKnee} />}
        {disguiseMode && <DisguiseSheet seconds={disguiseSeconds} />}
      </div>

      {/* 타임라인 + 재생 컨트롤 */}
      <div className="border-t border-slate-700/70 bg-slate-800/80 px-2 py-1.5 sm:px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white shadow transition active:scale-90 hover:bg-sky-400"
            aria-label={isPlaying ? "정지" : "재생"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <div className="relative flex-1">
            {/* 관측/예측 구간 트랙 */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 flex h-2 -translate-y-1/2 overflow-hidden rounded-full">
              <div
                className="h-full bg-slate-500"
                style={{ width: `${((NOW_INDEX + 0.5) / TIME_STEPS.length) * 100}%` }}
              />
              <div className="h-full flex-1 bg-blue-500/70" />
            </div>
            <input
              type="range"
              min={0}
              max={TIME_STEPS.length - 1}
              value={frameIndex}
              onChange={(e) => setFrameIndex(Number(e.target.value))}
              className="timeline-range relative w-full"
            />
          </div>
          <div className="w-24 text-right text-[11px] leading-tight text-slate-300">
            <span className="font-bold text-slate-100">{TIME_STEPS[frameIndex].label}</span>
            <div className="text-[9px] text-slate-500">
              {frameIndex <= NOW_INDEX ? "관측" : "예측 구간"}
            </div>
          </div>
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-slate-500">
          <span>← 관측</span>
          <span className="hidden sm:inline">단위: mm/h · 레이더 기반 최대 6시간 예측</span>
          <span>예측 +6시간 →</span>
        </div>
      </div>
    </div>
  )
}
