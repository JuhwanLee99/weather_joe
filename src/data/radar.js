// 기상청 초단기 강수예측(레이더) 모사용 데이터
// 실제 기상청 강수강도 컬러바를 참고한 근사값 (사칭 아님, 패러디 목적)

export const INTENSITY_SCALE = [
  { label: "매우 약한 비", color: "#C1E9FF", mmh: "0.1~1" },
  { label: "약한 비", color: "#7DB8FF", mmh: "1~2" },
  { label: "약간의 비", color: "#2E7BFF", mmh: "2~4" },
  { label: "보통 비", color: "#17C13E", mmh: "4~8" },
  { label: "다소 강한 비", color: "#FFE600", mmh: "8~16" },
  { label: "강한 비", color: "#FF9200", mmh: "16~32" },
  { label: "매우 강한 비", color: "#FF0000", mmh: "32~64" },
  { label: "극심한 비", color: "#C300B7", mmh: "64~110" },
  { label: "위험 폭우", color: "#7A2FA6", mmh: "110↑" },
]

export const REGIONS = [
  "전국", "수도권", "강원", "충청", "전라", "경상", "제주",
]

// 초단기예측 타임 스텝 (관측 -60분 ~ 예측 +6시간)
// off = "현재" 기준 분 오프셋
export const TIME_STEPS = [
  { label: "-60분", kind: "obs", off: -60 },
  { label: "-50분", kind: "obs", off: -50 },
  { label: "-40분", kind: "obs", off: -40 },
  { label: "-30분", kind: "obs", off: -30 },
  { label: "-20분", kind: "obs", off: -20 },
  { label: "-10분", kind: "obs", off: -10 },
  { label: "현재", kind: "now", off: 0 },
  { label: "+10분", kind: "fcst", off: 10 },
  { label: "+20분", kind: "fcst", off: 20 },
  { label: "+30분", kind: "fcst", off: 30 },
  { label: "+40분", kind: "fcst", off: 40 },
  { label: "+50분", kind: "fcst", off: 50 },
  { label: "+1시간", kind: "fcst", off: 60 },
  { label: "+2시간", kind: "fcst", off: 120 },
  { label: "+3시간", kind: "fcst", off: 180 },
  { label: "+4시간", kind: "fcst", off: 240 },
  { label: "+5시간", kind: "fcst", off: 300 },
  { label: "+6시간", kind: "fcst", off: 360 },
]

export const NOW_INDEX = 6 // "현재" 프레임 인덱스

// 발표 기준시각(14:30)에 분 오프셋을 더해 HH:MM 문자열 반환
export function frameClock(off) {
  const total = 14 * 60 + 30 + off
  const hh = Math.floor(((total % 1440) + 1440) % 1440 / 60)
  const mm = ((total % 60) + 60) % 60
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
}

// 남한 외곽선 근사 폴리곤 (0~100 좌표계, x=동쪽, y=남쪽)
export const KOREA_OUTLINE = [
  [44, 6], [56, 7], [66, 9], [72, 13], [74, 20], [78, 28],
  [76, 36], [79, 44], [77, 52], [73, 59], [66, 64], [58, 65],
  [52, 66], [45, 70], [40, 72], [37, 66], [33, 60], [31, 53],
  [28, 46], [30, 40], [25, 34], [30, 28], [27, 22], [31, 16],
  [30, 10], [36, 7],
]

// 제주도 (타원)
export const JEJU = { x: 40, y: 84, rx: 6, ry: 3 }

// "우리 회사" 핀 (서울/수도권 근처)
export const COMPANY = { x: 37, y: 17 }

// 강수 상태 판정
export function weatherState(intensity) {
  if (intensity < 8) return { key: "clear", label: "맑음", tag: "강수 없음", color: "#9fb4c9" }
  if (intensity < 32) return { key: "light", label: "약한 비", tag: "약한 강수", color: "#4C8DFF" }
  if (intensity < 65) return { key: "rain", label: "비", tag: "강수 진행", color: "#17C13E" }
  return { key: "heavy", label: "호우", tag: "호우주의보", color: "#FF3B30" }
}
