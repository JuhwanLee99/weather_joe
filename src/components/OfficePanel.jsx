import MentorCharacter from "./MentorCharacter"
import SpeechPostit from "./SpeechPostit"

export default function OfficePanel({ speech, mentor, cozy }) {
  return (
    <div
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-700 ${
        cozy ? "border-indigo-900/60 bg-[#1a2233]" : "border-[#d8cfba] bg-[#EDE6D6]"
      }`}
    >
      {/* 파티션 질감 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: cozy
            ? "repeating-linear-gradient(0deg,#20293b 0px,#20293b 2px,transparent 2px,transparent 6px)"
            : "repeating-linear-gradient(0deg,#e3dac4 0px,#e3dac4 2px,transparent 2px,transparent 7px)",
        }}
      />
      {/* 옆 파티션 명패 (이스터에그) */}
      <div className="absolute right-2 top-2 z-10 rotate-1 rounded border border-black/10 bg-white/80 px-2 py-0.5 text-right shadow-sm sm:px-2 sm:py-1">
        <div className="text-[9px] font-bold text-slate-700">파티션 B-07</div>
        <div className="text-[9px] text-slate-500">옆옆자리: 나기상 대리</div>
      </div>

      {/* 본문: 모바일=가로(말풍선 좌 / 캐릭터 우), 데스크톱=세로 */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-row items-stretch gap-1 p-2 lg:flex-col lg:gap-0 lg:p-0">
        {/* 라벨 + 말풍선 */}
        <div className="flex min-w-0 flex-1 flex-col justify-center lg:flex-none lg:justify-start lg:px-4 lg:pt-4">
          <div
            className={`text-[13px] font-black sm:text-sm ${
              cozy ? "text-indigo-200" : "text-[#5b503a]"
            }`}
          >
            옆자리 · 조 매니저
            <span className="ml-1 hidden text-[11px] font-medium opacity-70 sm:inline">
              (4년차 매니저)
            </span>
          </div>
          <div className="mt-2 flex min-h-[60px] items-start lg:min-h-[92px] lg:justify-center">
            <SpeechPostit text={speech?.text} tone={speech?.tone} />
          </div>
        </div>

        {/* 캐릭터 (참견할 때 의자 굴려 다가옴) */}
        <div className="flex shrink-0 items-end justify-center lg:min-h-0 lg:flex-1">
          <div
            className="h-full w-full max-w-[120px] transition-transform duration-500 ease-out sm:max-w-[150px] lg:w-[62%] lg:max-w-[230px]"
            style={{
              transform: mentor.leaning
                ? "translateX(0) translateY(0)"
                : "translateX(12%) translateY(4%)",
            }}
          >
            <MentorCharacter
              eyebrow={mentor.eyebrow}
              mouthOpen={mentor.mouthOpen}
              kneePulse={mentor.kneePulse}
              umbrella={mentor.umbrella}
              cozy={cozy}
            />
          </div>
        </div>
      </div>

      {/* 바닥 그림자 */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 ${
          cozy ? "bg-gradient-to-t from-black/40" : "bg-gradient-to-t from-black/10"
        } to-transparent`}
      />
    </div>
  )
}
