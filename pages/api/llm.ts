import type { NextApiRequest, NextApiResponse } from 'next'

interface TogetherResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

interface ApiResponse {
  response?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' })
  }

  const { message } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: '消息内容不能为空' })
  }

  const apiKey = process.env.TOGETHER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: '服务器配置错误：缺少 API Key' })
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-2-7b-chat-hf',
        messages: [
          {
            role: 'system',
            content: '你是一个有用的AI助手，请用中文回答用户的问题。回答要简洁明了，友好礼貌。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['<|endoftext|>', '</s>'],
        stream: false
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Together AI API Error:', response.status, errorText)
      return res.status(500).json({ error: 'AI 服务暂时不可用，请稍后重试' })
    }

    const data: TogetherResponse = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: 'AI 响应格式错误' })
    }

    const aiResponse = data.choices[0].message.content.trim()
    
    return res.status(200).json({ response: aiResponse })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: '服务器内部错误，请稍后重试' })
  }
}