import { Link } from 'react-router-dom'
import { useState } from 'react'

const FEATURES = [
  { title: '5분 만에 자가진단', desc: '간단한 체크리스트로 노동법 준수 여부를 빠르게 점검할 수 있습니다.' },
  { title: '항목별 위험도 분석', desc: '7개 카테고리별로 위험도를 파악하고 개선이 필요한 항목을 확인하세요.' },
  { title: '맞춤형 개선 가이드', desc: '진단 결과에 따른 구체적인 개선 방법과 관련 법령을 안내합니다.' },
]

const STEPS = ['기본정보 입력', '진단 문항 응답', '결과 확인', '개선 가이드 활용']

const FAQ_ITEMS = [
  { q: '진단에 얼마나 걸리나요?', a: '약 5~10분 정도 소요됩니다. 53개 문항에 답하시면 됩니다.' },
  { q: '무료인가요?', a: '네. 무료로 자가진단을 이용하실 수 있습니다.' },
  { q: '진단 결과는 저장되나요?', a: '현재 버전에서는 브라우저에 임시 저장됩니다. 로그인 후 히스토리는 추후 제공 예정입니다.' },
  { q: '어떤 사업장이 이용할 수 있나요?', a: '중소기업, 개인사업자, 스타트업 등 상시 근로자가 있는 사업장이면 이용 가능합니다.' },
]

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <header className="bg-primary text-white py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">근로감독 자가진단 서비스</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            고용노동부 근로감독 전, 노동법 준수 여부를 5분 만에 점검하세요.
          </p>
          <Link
            to="/info"
            className="inline-block bg-white text-primary font-semibold rounded-lg px-8 py-4 hover:bg-blue-50 transition"
          >
            무료 진단 시작하기
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-12">서비스 특징</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-xl shadow-sm border border-gray-100 p-6 bg-white"
              >
                <div className="text-2xl mb-3">{(i === 0 && '⏱') || (i === 1 && '📊') || '📋'}</div>
                <h3 className="font-bold text-lg text-primary mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-10">진단 프로세스</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold">
                  {i + 1}
                </span>
                <span className="ml-2 font-medium text-gray-700">{step}</span>
                {i < STEPS.length - 1 && (
                  <span className="hidden md:inline ml-4 text-gray-300">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-10">자주 묻는 질문</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border-b border-gray-200 py-4 bg-white rounded-lg px-4 border"
              >
                <button
                  className="w-full text-left font-medium flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <span className="text-gray-400">{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && <p className="mt-2 text-gray-600 text-sm">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg mb-6">지금 바로 사업장 노동법 준수 상태를 확인해 보세요.</p>
          <Link
            to="/info"
            className="inline-block bg-white text-primary font-semibold rounded-lg px-8 py-3 hover:bg-blue-50 transition"
          >
            무료 진단 시작하기
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 text-center text-gray-500 text-sm">
        근로감독 자가진단 서비스 · 참고용 자가점검 도구입니다.
      </footer>
    </div>
  )
}
