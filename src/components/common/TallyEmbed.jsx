import { useEffect } from 'react'

let tallyScriptPromise = null

function loadTallyScript() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Tally) return Promise.resolve()
  if (!tallyScriptPromise) {
    tallyScriptPromise = new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://tally.so/widgets/embed.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => resolve()
      document.body.appendChild(script)
    })
  }
  return tallyScriptPromise
}

/**
 * Tally 폼을 페이지에 인라인으로 삽입하는 공용 컴포넌트.
 * src가 바뀌면(예: 사전입력 값 변경) iframe을 새로 마운트해 다시 로드한다.
 */
export default function TallyEmbed({ src, title = '문의 폼', height = 700 }) {
  useEffect(() => {
    let cancelled = false
    loadTallyScript().then(() => {
      if (!cancelled && window.Tally) window.Tally.loadEmbeds()
    })
    return () => {
      cancelled = true
    }
  }, [src])

  return (
    <iframe
      key={src}
      data-tally-src={src}
      loading="lazy"
      width="100%"
      height={height}
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
      title={title}
      className="w-full rounded-2xl"
    />
  )
}














































