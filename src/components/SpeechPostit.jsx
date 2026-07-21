// 노란 포스트잇 말풍선 — 조 매니저가 던지는 한마디
export default function SpeechPostit({ text, tone = "dry" }) {
  if (!text) return null
  const rot = tone === "warn" ? "-rotate-2" : "rotate-1"
  return (
    <div
      key={text}
      className={`postit-pop relative w-fit max-w-full ${rot} select-none rounded-[3px] bg-[#FFE27A] px-3 py-2 text-[13px] font-semibold leading-snug text-[#3a2f10] shadow-[3px_5px_10px_rgba(0,0,0,0.25)] sm:px-4 sm:py-3 sm:text-[15px]`}
    >
      <span className="absolute -left-1 top-1 h-5 w-5 -rotate-12 rounded-sm bg-[#f4d75f]/70" />
      <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-[#8a6d1a] sm:text-[10px]">
        조 매니저
      </span>
      "{text}"
      {/* 말풍선 꼬리 */}
      <span className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 bg-[#FFE27A] sm:left-8" />
    </div>
  )
}
