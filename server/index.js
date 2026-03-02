import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 8787

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)
app.use(express.json())

const apiKey = process.env.GEMINI_API_KEY

app.post('/api/gemini/analysis', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경 변수가 설정되어 있지 않습니다.' })
  }

  const { totalScore, grade, categories, nonCompliantPreview } = req.body || {}

  try {
    const prompt = `
당신은 노무 전문가입니다. 아래 근로감독 자가진단 결과를 바탕으로 한국어로 간결한 리포트를 작성하세요.

[종합 점수]
- 점수: ${totalScore}점
- 등급: ${grade}

[카테고리별 점수]
${(categories || [])
  .map((c) => `- ${c.name}: ${c.score}점`)
  .join('\n')}

[개선이 필요한 항목(일부 예시)]
${(nonCompliantPreview || [])
  .map((item, idx) => `${idx + 1}. (${item.categoryName}) ${item.text} / 응답: ${item.answer}`)
  .join('\n')}

작성 형식:
1. 한 문장으로 요약 (한 줄)
2. 종합 평가 (2~3문장)
3. 우선 개선이 필요한 영역 3가지 정도를 번호로 제시
4. 근로감독 대비를 위한 한 줄 조언
불필요한 꾸밈말은 줄이고, 사업장 담당자가 바로 이해할 수 있는 실무적인 톤으로 작성하세요.
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Gemini 분석 HTTP 오류:', response.status, errorBody)
      return res.status(500).json({ error: 'Gemini 분석 요청 중 오류가 발생했습니다.' })
    }

    const data = await response.json()
    const candidates = data.candidates || []
    const text =
      candidates[0]?.content?.parts?.map((p) => p.text).join(' ') ||
      candidates[0]?.content?.parts?.[0]?.text ||
      ''

    return res.json({ summary: text })
  } catch (err) {
    console.error('Gemini API 호출 오류:', err)
    return res.status(500).json({ error: 'Gemini 분석 요청 중 오류가 발생했습니다.' })
  }
})

app.post('/api/gemini/chat', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경 변수가 설정되어 있지 않습니다.' })
  }

  const { totalScore, grade, categories, nonCompliantPreview, question, history } = req.body || {}

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'question 필드는 필수입니다.' })
  }

  try {
    const historyText = (history || [])
      .map((m) => `${m.role === 'assistant' ? '상담사' : '사용자'}: ${m.content}`)
      .join('\n')

    const prompt = `
당신은 한국의 근로기준법과 노동법 전반에 익숙한 노무 상담가입니다.
아래 자가진단 결과와 이전 대화를 참고해, 사용자의 추가 질문에 대해 실무적인 관점에서 답변하세요.

[종합 점수]
- 점수: ${totalScore}점
- 등급: ${grade}

[카테고리별 점수]
${(categories || [])
  .map((c) => `- ${c.name}: ${c.score}점`)
  .join('\n')}

[개선이 필요한 항목(일부 예시)]
${(nonCompliantPreview || [])
  .map((item, idx) => `${idx + 1}. (${item.categoryName}) ${item.text} / 응답: ${item.answer}`)
  .join('\n')}

[이전 상담 대화]
${historyText || '(이전 대화 없음)'}

[사용자 질문]
${question}

작성 가이드:
- 한국어로만 답변합니다.
- 법령 조항을 언급할 때는 "근로기준법 제00조"처럼 간단히 표기합니다.
- 최대한 구체적인 실행 조치(예: 취업규칙 조항 정비, 근로계약서에 추가할 내용, 서류 보관 방식 등)를 제시합니다.
- 단, 실제 법률 자문이 아니라는 점을 간단히 한 줄로 덧붙입니다.
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Gemini 상세 상담 HTTP 오류:', response.status, errorBody)
      return res.status(500).json({ error: 'Gemini 상세 상담 요청 중 오류가 발생했습니다.' })
    }

    const data = await response.json()
    const candidates = data.candidates || []
    const text =
      candidates[0]?.content?.parts?.map((p) => p.text).join(' ') ||
      candidates[0]?.content?.parts?.[0]?.text ||
      ''

    return res.json({ answer: text })
  } catch (err) {
    console.error('Gemini chat API 호출 오류:', err)
    return res.status(500).json({ error: 'Gemini 상세 상담 요청 중 오류가 발생했습니다.' })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Gemini helper server listening on http://localhost:${port}`)
})

