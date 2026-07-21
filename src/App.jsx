import { useCallback, useEffect, useRef, useState } from "react"
import RadarPanel from "./components/RadarPanel"
import OfficePanel from "./components/OfficePanel"
import ControlDock from "./components/ControlDock"
import { weatherState, NOW_INDEX } from "./data/radar"
import {
  SAY,
  REFRESH_ESCALATION,
  KNEE_LINES,
  UMBRELLA_ON,
  UMBRELLA_OFF,
  PRAISE_ONCE,
  pick,
} from "./data/dialogue"
import { startRain, stopRain, setRainIntensity } from "./lib/rainSound"

const rank = { clear: 0, light: 1, rain: 2, heavy: 3 }

export default function App() {
  const [intensity, setIntensity] = useState(46)
  const [frameIndex, setFrameIndex] = useState(NOW_INDEX)
  const [isPlaying, setIsPlaying] = useState(true)
  const [region, setRegion] = useState("수도권")
  const [refreshCount, setRefreshCount] = useState(0)
  const [kneeForecast, setKneeForecast] = useState(false)
  const [umbrellaOn, setUmbrellaOn] = useState(false)
  const [praiseGiven, setPraiseGiven] = useState(false)
  const [disguiseMode, setDisguiseMode] = useState(false)
  const [disguiseSeconds, setDisguiseSeconds] = useState(0)
  const [cozy, setCozy] = useState(false)
  const [speech, setSpeech] = useState(null)
  const [mentor, setMentor] = useState({
    eyebrow: 6,
    mouthOpen: false,
    kneePulse: false,
    umbrella: false,
    leaning: false,
  })

  const weather = weatherState(intensity)

  const speakTimer = useRef(null)
  const mouthTimer = useRef(null)
  const settleTimer = useRef(null)
  const kneeTimer = useRef(null)
  const idleTimer = useRef(null)
  const caughtTimer = useRef(null)
  const disguiseTimer = useRef(null)
  const lastLine = useRef("")
  const prevWeather = useRef(null)
  const suppressWeather = useRef(0)
  const mentorRef = useRef(mentor)
  mentorRef.current = mentor

  // ---- 핵심: 박 과장이 한마디 던진다 ----
  const speak = useCallback((text, opts = {}) => {
    if (!text) return
    const tone = opts.tone || "dry"
    const eyebrow = opts.eyebrow ?? (tone === "warn" ? 15 : tone === "relaxed" ? -3 : 7)
    lastLine.current = text

    clearTimeout(speakTimer.current)
    clearTimeout(mouthTimer.current)
    clearTimeout(settleTimer.current)

    setSpeech({ text, tone })
    setMentor((m) => ({
      ...m,
      leaning: true,
      mouthOpen: true,
      eyebrow,
      umbrella: opts.umbrella ?? m.umbrella,
    }))

    // 입 뻐끔 종료
    mouthTimer.current = setTimeout(() => {
      setMentor((m) => ({ ...m, mouthOpen: false }))
    }, 700)

    // 말풍선 유지 시간
    const dur = Math.max(3200, text.length * 95)
    speakTimer.current = setTimeout(() => {
      setSpeech(null)
    }, dur)
    settleTimer.current = setTimeout(() => {
      setMentor((m) => ({ ...m, leaning: false }))
    }, dur + 400)
  }, [])

  const sayFrom = useCallback(
    (category, opts = {}) => {
      speak(pick(SAY[category], lastLine.current), opts)
    },
    [speak]
  )

  // ---- 새로고침 연타 → 참견 폭주 + 우산 건네기 클라이맥스 ----
  const refreshCountRef = useRef(0)
  const handleRefresh = useCallback(() => {
    const n = refreshCountRef.current + 1
    refreshCountRef.current = n
    setRefreshCount(n)
    const esc = REFRESH_ESCALATION.find((e) => e.at === n)
    const eyebrow = Math.min(20, 7 + n * 1.6)
    if (esc) {
      speak(esc.line, { tone: esc.umbrella ? "relaxed" : "dry", eyebrow, umbrella: !!esc.umbrella })
    } else {
      sayFrom("onRefresh", { eyebrow })
    }
  }, [speak, sayFrom])

  // ---- 시그니처: 무릎 예보 ----
  const handleKnee = useCallback(() => {
    setKneeForecast(true)
    suppressWeather.current = 1 // 무릎이 강수 올릴 때 자동 대사 1회 억제
    setIntensity((i) => Math.max(i, 60))
    setMentor((m) => ({ ...m, kneePulse: true }))
    clearTimeout(kneeTimer.current)
    kneeTimer.current = setTimeout(() => {
      setMentor((m) => ({ ...m, kneePulse: false }))
    }, 1600)
    speak(pick(KNEE_LINES, lastLine.current), { tone: "warn", eyebrow: 4 })
  }, [speak])

  // ---- 우산 챙겼어요? ----
  const handleUmbrella = useCallback(() => {
    setUmbrellaOn((prev) => {
      const next = !prev
      if (next) {
        if (!praiseGiven) {
          setPraiseGiven(true)
          speak(PRAISE_ONCE, { tone: "relaxed", eyebrow: -4 })
        } else {
          speak(UMBRELLA_ON, { tone: "dry", eyebrow: 5 })
        }
      } else {
        speak(UMBRELLA_OFF, { tone: "dry", eyebrow: 16 })
      }
      return next
    })
  }, [praiseGiven, speak])

  // ---- 부장님 온다! (Space) ----
  const handlePanic = useCallback(() => {
    if (disguiseTimer.current) return
    setDisguiseMode(true)
    setDisguiseSeconds(3)
    speak(pick(SAY.bossPanic, lastLine.current), { tone: "warn", eyebrow: 17 })
    let left = 3
    disguiseTimer.current = setInterval(() => {
      left -= 1
      setDisguiseSeconds(left)
      if (left <= 0) {
        clearInterval(disguiseTimer.current)
        disguiseTimer.current = null
        setDisguiseMode(false)
      }
    }, 1000)
  }, [speak])

  // ---- 코지 빗소리 모드 ----
  const handleCozy = useCallback(() => {
    setCozy((prev) => !prev)
  }, [])

  // 코지 모드 → 빗소리 on/off
  useEffect(() => {
    if (cozy) startRain(intensity / 100)
    else stopRain()
    return () => stopRain()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cozy])
  useEffect(() => {
    if (cozy) setRainIntensity(intensity / 100)
  }, [intensity, cozy])

  // 강수 상태 변화 → 자동 코멘트
  useEffect(() => {
    const cur = weather.key
    if (prevWeather.current === null) {
      prevWeather.current = cur
      return
    }
    if (prevWeather.current === cur) return
    const prev = prevWeather.current
    prevWeather.current = cur
    if (suppressWeather.current > 0) {
      suppressWeather.current -= 1
      return
    }
    if (cur === "clear") sayFrom("clear", { tone: "relaxed", eyebrow: -2 })
    else if (cur === "heavy") sayFrom("heavyRain", { tone: "warn", eyebrow: 14 })
    else if (rank[cur] > rank[prev]) sayFrom("rainStart", { tone: "dry", eyebrow: 8 })
  }, [weather.key, sayFrom])

  // 아이들(가만히 응시) 감지 → 참견
  useEffect(() => {
    const reset = () => {
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        if (!disguiseTimer.current) sayFrom("idle", { eyebrow: 9 })
      }, 8500)
    }
    reset()
    window.addEventListener("pointermove", reset)
    window.addEventListener("keydown", reset)
    return () => {
      clearTimeout(idleTimer.current)
      window.removeEventListener("pointermove", reset)
      window.removeEventListener("keydown", reset)
    }
  }, [sayFrom])

  // 가끔 "딱 걸렸다"
  useEffect(() => {
    const schedule = () => {
      const wait = 20000 + Math.random() * 14000
      caughtTimer.current = setTimeout(() => {
        if (!disguiseTimer.current) sayFrom("caught", { tone: "dry", eyebrow: 12 })
        schedule()
      }, wait)
    }
    schedule()
    return () => clearTimeout(caughtTimer.current)
  }, [sayFrom])

  // Space → 부장님 경보
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        e.preventDefault()
        handlePanic()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handlePanic])

  // 인트로 인사
  useEffect(() => {
    const t = setTimeout(() => {
      speak("어이, 또 기상청이냐? 오늘도 레이더랑 눈싸움 시작이네.", { tone: "dry", eyebrow: 8 })
    }, 1200)
    return () => clearTimeout(t)
  }, [speak])

  // 언마운트 정리
  useEffect(() => {
    return () => {
      clearTimeout(speakTimer.current)
      clearTimeout(mouthTimer.current)
      clearTimeout(settleTimer.current)
      clearTimeout(kneeTimer.current)
      if (disguiseTimer.current) clearInterval(disguiseTimer.current)
    }
  }, [])

  const gaugeLevel = Math.min(10, refreshCount)

  return (
    <div
      className={`flex h-[100dvh] w-full flex-col overflow-hidden transition-colors duration-700 ${
        cozy
          ? "bg-gradient-to-b from-[#0d1526] to-[#111a2e]"
          : "bg-gradient-to-b from-slate-100 to-slate-300"
      }`}
    >
      {/* 코지 빗줄기 오버레이 */}
      {cozy && <div className="cozy-rain pointer-events-none fixed inset-0 z-50" />}

      {/* 헤더 (compact) */}
      <header className="flex shrink-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 px-3 pt-2 pb-1 sm:px-5 sm:pt-3">
        <h1
          className={`text-lg font-black tracking-tight sm:text-2xl ${
            cozy ? "text-slate-100" : "text-slate-800"
          }`}
        >
          🌧️ 초단기 <span className="text-sky-500">참견</span>예보
        </h1>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
            cozy ? "border-slate-600 text-slate-300" : "border-slate-400 text-slate-500"
          }`}
        >
          패러디 · 실제 기상청 아님
        </span>
        <p
          className={`hidden text-[13px] lg:block ${
            cozy ? "text-slate-400" : "text-slate-500"
          }`}
        >
          장마철 레이더 보는 인턴 옆에서 훈수 두는 4년차 사수 시뮬레이터 — 무릎이 슈퍼컴을 이긴다
        </p>
      </header>

      {/* 스테이지: 모바일=세로(레이더 위 / 사수 아래), 데스크톱=가로. 한 화면에 모두 표시 */}
      <main className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-2 sm:px-5 lg:flex-row lg:gap-3">
        {/* 인턴의 모니터 */}
        <div className="flex min-h-0 flex-[1.7] flex-col rounded-2xl bg-slate-950 p-1.5 shadow-2xl ring-1 ring-black/40 sm:p-2.5">
          <div className="mb-1 hidden items-center gap-2 px-1 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-600">
              intern's monitor
            </span>
          </div>
          <div className="min-h-0 flex-1">
            <RadarPanel
              intensity={intensity}
              frameIndex={frameIndex}
              setFrameIndex={setFrameIndex}
              isPlaying={isPlaying}
              togglePlay={() => setIsPlaying((p) => !p)}
              region={region}
              setRegion={setRegion}
              weather={weather}
              refreshCount={refreshCount}
              onRefresh={handleRefresh}
              umbrellaOn={umbrellaOn}
              cozy={cozy}
              disguiseMode={disguiseMode}
              disguiseSeconds={disguiseSeconds}
              kneeForecast={kneeForecast}
              onCloseKnee={() => setKneeForecast(false)}
              onPoke={() => sayFrom("easterEgg", { eyebrow: 6 })}
            />
          </div>
        </div>

        {/* 옆자리 사수 */}
        <div className="min-h-0 flex-1 lg:max-w-[380px]">
          <OfficePanel speech={speech} mentor={mentor} cozy={cozy} />
        </div>
      </main>

      {/* 조작 패널 */}
      <div className="shrink-0 px-3 pb-2 sm:px-5 sm:pb-3">
        <ControlDock
          intensity={intensity}
          setIntensity={setIntensity}
          gaugeLevel={gaugeLevel}
          onKnee={handleKnee}
          umbrellaOn={umbrellaOn}
          onToggleUmbrella={handleUmbrella}
          onPanic={handlePanic}
          cozy={cozy}
          onToggleCozy={handleCozy}
        />
      </div>
    </div>
  )
}
