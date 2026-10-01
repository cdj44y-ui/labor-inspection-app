import { EXPERT_LABOR } from '../../data/expertLabor.js'
import { KAKAO_CHANNEL_URL } from '../../constants/contact.js'

export default function SiteFooter() {
  const { contact } = EXPERT_LABOR
  return (
    <footer className="mt-12 border-t-2 border-zinc-200 pt-8 text-center text-sm text-zinc-800 space-y-2">
      <p className="font-semibold text-ink">RISK119 근로감독 자가진단</p>
      <p>
        조대진 노무사 · 안전공학 박사
        <br />
        전화:{' '}
        <a href={`tel:${contact.phone.replace(/-/g, '')}`} className="font-medium text-toss underline">
          {contact.phone}
        </a>{' '}
        | 이메일:{' '}
        <a href={`mailto:${contact.email}`} className="font-medium text-toss underline">
          {contact.email}
        </a>
      </p>
      <p className="text-zinc-600">{contact.address}</p>
      <p>
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE500] px-4 py-1.5 text-xs font-bold text-[#391B1B] transition hover:bg-[#F5D800]"
        >
          💬 카카오톡 채널 추가하고 법 개정 소식 받기
        </a>
      </p>
      <p className="text-xs text-zinc-600">© {new Date().getFullYear()} 조대진 노무사. All rights reserved.</p>
      <p className="max-w-3xl mx-auto text-sm text-zinc-700">
        본 서비스는 노동관계 법령과 공개 자료를 바탕으로 한 일반적인 리스크 점검 도구이며, 개별 사건에 대한 법률
        자문이나 행정해석을 대체하지 않습니다.
      </p>
    </footer>
  )
}
