import { useEffect, useMemo, useRef } from "react"
import {
  INTENSITY_SCALE,
  KOREA_OUTLINE,
  JEJU,
  COMPANY,
  TIME_STEPS,
  NOW_INDEX,
} from "../data/radar"

// 간단한 시드 난수 (프레임마다 고정된 강수 셀 배치를 위해)
function seeded(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${a})`
}

const DRIFT = 4.6 // 프레임당 강수 셀 서→동 이동량 (world units)
const WRAP_MIN = -25
const WRAP_MAX = 130

export default function RadarCanvas({
  intensity,
  frameIndex,
  isPlaying,
  umbrellaOn,
  cozy,
  onFrame,
  onPoke,
}) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const animPhaseRef = useRef(NOW_INDEX)
  const lastReportedRef = useRef(frameIndex)
  const propsRef = useRef({})
  const rafRef = useRef(0)

  propsRef.current = { intensity, isPlaying, umbrellaOn, cozy, onFrame }

  // 강수 셀 생성 (장마 전선 밴드 + 산발 셀), 고정 시드
  const cells = useMemo(() => {
    const rnd = seeded(20260721)
    const out = []
    // 전선 밴드: SW→NE 대각 라인 위에 밀집
    for (let i = 0; i < 26; i++) {
      const t = i / 25
      const x = -10 + t * 120 + (rnd() - 0.5) * 8
      const y = 66 - t * 46 + (rnd() - 0.5) * 9 // 남서(아래) → 북동(위)
      out.push({
        x,
        y,
        size: 8 + rnd() * 7,
        base: 0.55 + rnd() * 0.55,
        speed: 0.9 + rnd() * 0.25,
      })
    }
    // 산발 셀
    for (let i = 0; i < 16; i++) {
      out.push({
        x: WRAP_MIN + rnd() * (WRAP_MAX - WRAP_MIN),
        y: 8 + rnd() * 70,
        size: 5 + rnd() * 6,
        base: 0.3 + rnd() * 0.6,
        speed: 0.8 + rnd() * 0.4,
      })
    }
    return out
  }, [])

  // 스크럽(정지 상태에서 프레임 변경) → animPhase 동기화
  useEffect(() => {
    if (!isPlaying) animPhaseRef.current = frameIndex
  }, [frameIndex, isPlaying])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas.getContext("2d")
    let W = 0
    let H = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      W = Math.max(280, r.width)
      H = Math.max(220, r.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + "px"
      canvas.style.height = H + "px"
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // world(0~100) → canvas 좌표 (종횡비 유지, 중앙 정렬)
    const pad = 10
    const project = () => {
      const scale = Math.min((W - pad * 2) / 100, (H - pad * 2) / 100)
      const ox = (W - scale * 100) / 2
      const oy = (H - scale * 100) / 2
      return { scale, ox, oy }
    }

    const bump = (x) => Math.exp(-Math.pow((x - COMPANY.x) / 13, 2))

    let last = performance.now()

    const drawEcho = (ctx, px, py, R, ci) => {
      if (ci <= 0.04) return
      const maxIdx = Math.min(
        INTENSITY_SCALE.length - 1,
        Math.max(0, Math.floor(ci * (INTENSITY_SCALE.length - 1)))
      )
      const grad = ctx.createRadialGradient(px, py, 0, px, py, R)
      const steps = maxIdx + 1
      for (let k = 0; k <= maxIdx; k++) {
        const band = maxIdx - k
        const pos = k / steps
        const alpha = band >= 6 ? 0.82 : band >= 3 ? 0.62 : 0.42
        grad.addColorStop(pos, hexA(INTENSITY_SCALE[band].color, alpha))
      }
      grad.addColorStop(1, hexA(INTENSITY_SCALE[0].color, 0))
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, R, 0, Math.PI * 2)
      ctx.fill()
    }

    const render = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const p = propsRef.current

      if (p.isPlaying) {
        animPhaseRef.current += dt * 2.4 // 초당 약 2.4 프레임
        if (animPhaseRef.current >= TIME_STEPS.length) {
          animPhaseRef.current -= TIME_STEPS.length
        }
        const fi = Math.floor(animPhaseRef.current) % TIME_STEPS.length
        if (fi !== lastReportedRef.current) {
          lastReportedRef.current = fi
          p.onFrame && p.onFrame(fi)
        }
      }

      const phase = animPhaseRef.current
      const { scale, ox, oy } = project()
      const mx = (x) => ox + x * scale
      const my = (y) => oy + y * scale

      // 배경(바다)
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)
      const sea = ctx.createLinearGradient(0, 0, 0, H)
      if (p.cozy) {
        sea.addColorStop(0, "#0a1626")
        sea.addColorStop(1, "#0d1a2e")
      } else {
        sea.addColorStop(0, "#0B1F3A")
        sea.addColorStop(1, "#0e284a")
      }
      ctx.fillStyle = sea
      ctx.fillRect(0, 0, W, H)

      // 위경도 격자
      ctx.strokeStyle = "rgba(255,255,255,0.05)"
      ctx.lineWidth = 1
      for (let g = 10; g < 100; g += 12) {
        ctx.beginPath()
        ctx.moveTo(mx(g), my(0))
        ctx.lineTo(mx(g), my(100))
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(mx(0), my(g))
        ctx.lineTo(mx(100), my(g))
        ctx.stroke()
      }

      // 육지(한반도)
      ctx.beginPath()
      KOREA_OUTLINE.forEach(([x, y], i) => {
        const X = mx(x)
        const Y = my(y)
        if (i === 0) ctx.moveTo(X, Y)
        else ctx.lineTo(X, Y)
      })
      ctx.closePath()
      const land = ctx.createLinearGradient(0, my(0), 0, my(100))
      land.addColorStop(0, "#16324f")
      land.addColorStop(1, "#123f4a")
      ctx.fillStyle = land
      ctx.fill()
      ctx.strokeStyle = "rgba(150,200,255,0.35)"
      ctx.lineWidth = 1.2
      ctx.stroke()

      // 제주
      ctx.beginPath()
      ctx.ellipse(mx(JEJU.x), my(JEJU.y), JEJU.rx * scale, JEJU.ry * scale, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#143a4a"
      ctx.fill()
      ctx.stroke()

      // 강수 에코 (육지 클립 없이 전역, 반투명 합성)
      ctx.globalCompositeOperation = "screen"
      const intens = p.intensity / 100
      for (const c of cells) {
        let x = c.x + phase * DRIFT * c.speed
        // wrap
        const span = WRAP_MAX - WRAP_MIN
        x = ((((x - WRAP_MIN) % span) + span) % span) + WRAP_MIN
        let y = c.y
        if (p.umbrellaOn) y = c.y + 12 * bump(x) // 회사 피해 남쪽으로 우회
        const ci = Math.min(1, intens * c.base * 1.15)
        drawEcho(ctx, mx(x), my(y), c.size * scale, ci)
      }
      ctx.globalCompositeOperation = "source-over"

      // 회사 핀
      const cpx = mx(COMPANY.x)
      const cpy = my(COMPANY.y)
      ctx.fillStyle = "#FFE27A"
      ctx.strokeStyle = "#1b2b45"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cpx, cpy - 7, 5.5, Math.PI, 0)
      ctx.lineTo(cpx, cpy + 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cpx, cpy - 7, 2, 0, Math.PI * 2)
      ctx.fillStyle = "#1b2b45"
      ctx.fill()
      ctx.font = "600 11px system-ui, sans-serif"
      ctx.fillStyle = "rgba(255,255,255,0.9)"
      ctx.textAlign = "center"
      ctx.fillText("우리 회사", cpx, cpy + 15)

      ctx.restore()
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [cells])

  const handleClick = (e) => {
    if (!onPoke) return
    onPoke()
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 cursor-crosshair" onClick={handleClick}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
