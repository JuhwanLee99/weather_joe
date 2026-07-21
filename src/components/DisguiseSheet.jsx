// "부장님 온다!" → 레이더를 순식간에 덮는 가짜 엑셀 시트
const COLS = ["", "A", "B", "C", "D", "E"]
const ROWS = [
  ["1", "3분기 손익계산서", "", "", "", ""],
  ["2", "항목", "7월", "8월", "9월", "합계"],
  ["3", "매출액", "1,204", "1,388", "1,502", "=SUM(C3:E3)"],
  ["4", "매출원가", "812", "905", "978", "2,695"],
  ["5", "매출총이익", "392", "483", "524", "1,399"],
  ["6", "판관비", "210", "228", "241", "679"],
  ["7", "영업이익", "182", "255", "283", "720"],
  ["8", "영업이익률", "15.1%", "18.4%", "18.8%", "17.5%"],
  ["9", "전분기 대비", "▲ 4.2%", "▲ 6.1%", "▲ 2.7%", ""],
  ["10", "비고", "장마 특수 반영", "", "", ""],
]

export default function DisguiseSheet({ seconds }) {
  return (
    <div className="disguise-in absolute inset-0 z-30 flex flex-col bg-[#f7f8fa] text-[#1f2937]">
      {/* 타이틀바 */}
      <div className="flex items-center gap-2 bg-[#1f7245] px-3 py-1.5 text-[13px] font-semibold text-white">
        <span className="text-base">📗</span>
        3분기_손익_최종_진짜최종_v3.xlsx
        <span className="ml-auto text-white/70">자동 저장됨</span>
      </div>
      {/* 리본 */}
      <div className="flex items-center gap-3 border-b border-[#e2e5ea] bg-[#f3f4f6] px-3 py-1 text-[11px] text-[#4b5563]">
        <span className="font-semibold text-[#1f7245]">파일</span>
        <span>홈</span><span>삽입</span><span>수식</span><span>데이터</span><span>검토</span>
        <span className="ml-auto rounded bg-white px-2 py-0.5 shadow-sm">😐 태연한 표정 유지 중</span>
      </div>
      {/* 수식 입력줄 */}
      <div className="flex items-center gap-2 border-b border-[#e2e5ea] bg-white px-3 py-1 text-[12px]">
        <span className="rounded border border-[#d1d5db] px-2 py-0.5 font-mono text-[#374151]">C7</span>
        <span className="text-[#9ca3af]">fx</span>
        <span className="font-mono text-[#374151]">=C5-C6</span>
      </div>
      {/* 시트 */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              {COLS.map((c, i) => (
                <th
                  key={i}
                  className={`sticky top-0 border border-[#d7dbe0] bg-[#eef0f3] px-2 py-1 font-semibold text-[#6b7280] ${
                    i === 0 ? "w-8" : ""
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, ri) => (
              <tr key={ri}>
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border border-[#e5e7eb] px-2 py-1 ${
                      ci === 0
                        ? "bg-[#eef0f3] text-center font-semibold text-[#6b7280]"
                        : ri === 0
                        ? "font-bold text-[#1f2937]"
                        : ri === 1
                        ? "bg-[#f9fafb] font-semibold text-[#374151]"
                        : "text-[#374151]"
                    } ${ci >= 2 && ri >= 2 ? "text-right font-mono" : ""} ${
                      ci === 2 && ri === 6 ? "ring-2 ring-inset ring-[#1f7245]" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 상태바 */}
      <div className="flex items-center gap-3 border-t border-[#e2e5ea] bg-[#f3f4f6] px-3 py-1 text-[11px] text-[#6b7280]">
        <span>준비</span>
        <span className="ml-auto flex items-center gap-1 font-semibold text-[#1f7245]">
          🫥 위장 모드 · {seconds}초 후 복귀
        </span>
      </div>
    </div>
  )
}
