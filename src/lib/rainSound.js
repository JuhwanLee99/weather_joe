// WebAudio로 합성한 빗소리 (외부 파일 없음, 자체 완결)
let ctx = null
let nodes = null

function makeNoiseBuffer(context, seconds = 2) {
  const rate = context.sampleRate
  const buffer = context.createBuffer(1, rate * seconds, rate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    // 브라운 노이즈 계열 (부드러운 빗소리)
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.2
  }
  return buffer
}

export function startRain(intensity = 0.5) {
  if (nodes) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  try {
    ctx = ctx || new AC()
  } catch (e) {
    return
  }
  if (ctx.state === "suspended") ctx.resume()

  const src = ctx.createBufferSource()
  src.buffer = makeNoiseBuffer(ctx)
  src.loop = true

  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 1100 + intensity * 1400

  const hp = ctx.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 380

  const gain = ctx.createGain()
  gain.gain.value = 0
  gain.gain.linearRampToValueAtTime(0.16 + intensity * 0.14, ctx.currentTime + 1.2)

  src.connect(hp).connect(lp).connect(gain).connect(ctx.destination)
  src.start()
  nodes = { src, gain, lp }
}

export function setRainIntensity(intensity = 0.5) {
  if (!nodes || !ctx) return
  nodes.lp.frequency.setTargetAtTime(1100 + intensity * 1400, ctx.currentTime, 0.5)
  nodes.gain.gain.setTargetAtTime(0.16 + intensity * 0.14, ctx.currentTime, 0.5)
}

export function stopRain() {
  if (!nodes || !ctx) return
  const { src, gain } = nodes
  gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
  setTimeout(() => {
    try {
      src.stop()
    } catch (e) {
      /* noop */
    }
  }, 900)
  nodes = null
}
