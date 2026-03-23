import { EXPERT_PROFILE } from '../../data/expert.js'

export default function SiteFooter() {
  const { contact } = EXPERT_PROFILE
  return (
    <footer className="mt-12 border-t-2 border-zinc-200 pt-8 text-center text-[11px] text-zinc-800 space-y-2">
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
      <p className="text-[10px] text-zinc-600">© {new Date().getFullYear()} 조대진 노무사. All rights reserved.</p>
      <p className="max-w-3xl mx-auto text-[10px] text-zinc-700">
        본 서비스는 노동관계 법령과 공개 자료를 바탕으로 한 일반적인 리스크 점검 도구이며, 개별 사건에 대한 법률
        자문이나 행정해석을 대체하지 않습니다.
      </p>
    </footer>
  )
}
