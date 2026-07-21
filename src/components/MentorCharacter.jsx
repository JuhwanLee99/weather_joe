// 조 매니저 — 옆자리 만년 사수. 데드팬 표정은 눈썹 각도로만.
// props: eyebrow(각도), mouthOpen, kneePulse, umbrella, cozy

const SKIN = "#E8B98F"
const SKIN_SH = "#d9a678"
const HAIR = "#2c2c30"
const SHIRT = "#8FC0EA"
const SHIRT_SH = "#6fa8db"

export default function MentorCharacter({
  eyebrow = 6,
  mouthOpen = false,
  kneePulse = false,
  umbrella = false,
  cozy = false,
}) {
  return (
    <svg viewBox="0 0 200 300" className="h-full w-full drop-shadow-xl" role="img" aria-label="조 매니저">
      {/* ===== 의자 (뒤) ===== */}
      <g>
        {/* 등받이 */}
        <rect x="58" y="96" width="84" height="96" rx="26" fill="#3a4658" />
        <rect x="66" y="104" width="68" height="80" rx="20" fill="#4a586c" />
        {/* 가스 실린더 */}
        <rect x="94" y="214" width="12" height="34" rx="4" fill="#2b3340" />
        {/* 5구 다리 */}
        <g stroke="#20262f" strokeWidth="7" strokeLinecap="round">
          <line x1="100" y1="248" x2="58" y2="272" />
          <line x1="100" y1="248" x2="100" y2="278" />
          <line x1="100" y1="248" x2="142" y2="272" />
          <line x1="100" y1="248" x2="74" y2="264" />
          <line x1="100" y1="248" x2="126" y2="264" />
        </g>
        <g fill="#11151b">
          <circle cx="56" cy="274" r="7" />
          <circle cx="100" cy="280" r="7" />
          <circle cx="144" cy="274" r="7" />
        </g>
      </g>

      {/* ===== 앉은 하체 ===== */}
      <g>
        {/* 좌석 */}
        <rect x="62" y="196" width="76" height="20" rx="10" fill="#39404d" />
        {/* 허벅지(바지) */}
        <rect x="66" y="188" width="70" height="26" rx="13" fill="#37455c" />
        {/* 무릎 예보 센서 */}
        <g className={kneePulse ? "knee-pulse" : ""} style={{ transformOrigin: "126px 196px" }}>
          <circle cx="126" cy="196" r="9" fill={kneePulse ? "#E5484D" : "#7c8aa0"} />
          <circle cx="126" cy="196" r="3.5" fill="#fff" opacity="0.85" />
        </g>
      </g>

      {/* ===== 몸통 (반팔 와이셔츠) ===== */}
      <g>
        <path
          d="M70 118 Q100 108 130 118 L138 184 Q100 196 62 184 Z"
          fill={SHIRT}
        />
        <path d="M70 118 Q100 108 130 118 L128 130 Q100 122 72 130 Z" fill={SHIRT_SH} opacity="0.6" />
        {/* 반팔 소매 */}
        <path d="M70 118 q-16 6 -18 34 q14 6 24 2 z" fill={SHIRT} />
        <path d="M130 118 q16 6 18 34 q-14 6 -24 2 z" fill={SHIRT} />
        {/* 옷깃 V */}
        <path d="M92 116 L100 138 L108 116 Z" fill="#eef4fb" />
        <path d="M92 116 L100 138 L108 116" fill="none" stroke={SHIRT_SH} strokeWidth="1.5" />
        {/* 목 */}
        <rect x="90" y="100" width="20" height="20" rx="6" fill={SKIN_SH} />
        {/* 사원증 목걸이 */}
        <path d="M96 112 L84 158" stroke="#c0392b" strokeWidth="2.5" fill="none" />
        <path d="M104 112 L84 158" stroke="#c0392b" strokeWidth="2.5" fill="none" />
        <g>
          <rect x="70" y="156" width="28" height="20" rx="3" fill="#f5f7fa" stroke="#b9c2cc" />
          <rect x="73" y="159" width="9" height="14" rx="1.5" fill="#cdd6df" />
          <text x="86" y="165" fontSize="6.5" fontWeight="700" fill="#334">조무릎</text>
          <text x="86" y="172" fontSize="4.5" fill="#6a7480">기상운영부</text>
        </g>
      </g>

      {/* ===== 머리 ===== */}
      <g>
        {/* 얼굴 */}
        <ellipse cx="100" cy="72" rx="30" ry="33" fill={SKIN} />
        <ellipse cx="100" cy="72" rx="30" ry="33" fill="none" stroke={SKIN_SH} strokeWidth="1" />
        {/* 귀 */}
        <circle cx="70" cy="74" r="6" fill={SKIN} />
        <circle cx="130" cy="74" r="6" fill={SKIN} />
        {/* M자 헤어라인 (옆·뒷머리만) */}
        <path
          d="M68 78 C64 44 82 30 100 30 C118 30 136 44 132 78
             L132 78 C130 70 124 66 118 66
             C110 66 104 58 100 54
             C96 58 90 66 82 66
             C76 66 70 70 68 78 Z"
          fill={HAIR}
        />
        {/* 눈썹 (데드팬 감정) */}
        <line
          x1="80" y1="61" x2="94" y2="61"
          stroke={HAIR} strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${eyebrow} 87 61)`}
        />
        <line
          x1="106" y1="61" x2="120" y2="61"
          stroke={HAIR} strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${-eyebrow} 113 61)`}
        />
        {/* 반무테 안경 */}
        <g fill="none" stroke="#3a3f47" strokeWidth="2">
          <path d="M78 72 q9 8 18 0" />
          <path d="M104 72 q9 8 18 0" />
          <ellipse cx="87" cy="70" rx="10" ry="8" opacity="0.25" />
          <ellipse cx="113" cy="70" rx="10" ry="8" opacity="0.25" />
          <line x1="97" y1="70" x2="103" y2="70" />
        </g>
        {/* 반쯤 감긴 눈 (가로 실선) */}
        <line x1="82" y1="70" x2="92" y2="70" stroke="#2b2b30" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="108" y1="70" x2="118" y2="70" stroke="#2b2b30" strokeWidth="2.4" strokeLinecap="round" />
        {/* 코 */}
        <path d="M100 74 l-3 10 l5 0" fill="none" stroke={SKIN_SH} strokeWidth="1.6" strokeLinecap="round" />
        {/* 입 */}
        {mouthOpen ? (
          <ellipse cx="100" cy="92" rx="6" ry="4.5" fill="#7a3b3b" />
        ) : (
          <line x1="92" y1="92" x2="108" y2="92" stroke="#7a3b3b" strokeWidth="2.4" strokeLinecap="round" />
        )}
      </g>

      {/* ===== 오른팔 + 소품 ===== */}
      {umbrella ? (
        <g>
          {/* 우산을 내미는 팔 */}
          <path d="M132 150 q28 -6 44 -30" stroke={SHIRT} strokeWidth="13" fill="none" strokeLinecap="round" />
          <circle cx="176" cy="120" r="7" fill={SKIN} />
          {/* 접힌 우산 */}
          <g transform="rotate(28 176 120)">
            <rect x="172" y="70" width="8" height="60" rx="4" fill="#20415f" />
            <path d="M176 66 l-12 12 l24 0 z" fill="#2f6fb0" />
            <path d="M176 130 q0 10 8 8" stroke="#20415f" strokeWidth="3.5" fill="none" />
          </g>
        </g>
      ) : (
        <g>
          {/* 믹스커피 종이컵 든 팔 */}
          <path d="M132 150 q24 2 30 -8" stroke={SHIRT} strokeWidth="13" fill="none" strokeLinecap="round" />
          <circle cx="162" cy="142" r="7" fill={SKIN} />
          {/* 종이컵 */}
          <path d="M156 128 l3 18 l14 0 l3 -18 z" fill="#f3ede2" stroke="#cbb89a" />
          <rect x="155" y="126" width="24" height="5" rx="2" fill="#e7dcc8" stroke="#cbb89a" />
          {/* 김(스팀) */}
          <g stroke={cozy ? "#d9e6f5" : "#b9c6d6"} strokeWidth="1.6" fill="none" opacity="0.8">
            <path className="steam s1" d="M162 124 q-3 -6 0 -12 q3 -6 0 -12" />
            <path className="steam s2" d="M170 124 q-3 -6 0 -12 q3 -6 0 -12" />
          </g>
        </g>
      )}
    </svg>
  )
}
