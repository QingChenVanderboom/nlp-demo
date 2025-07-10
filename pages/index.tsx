import { useState } from 'react'
import { Analytics } from "@vercel/analytics/next"
import Head from 'next/head'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('请求失败')
      }

      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { role: 'assistant', content: '抱歉，发生了错误，请稍后重试。' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <Head>
        <title>AI Chat Demo</title>
        <meta name="description" content="基于 Together AI 的智能对话演示" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <div className="chat-container">
          <div className="header">
            <h1>AI Chat Demo</h1>
            <p>基于 Together AI 的智能对话体验</p>
          </div>

          <div className="messages">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-icon">💬</div>
                <h2>开始对话</h2>
                <p>输入您的问题，AI 将为您提供帮助</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-content">
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message assistant">
                <div className="message-content loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                disabled={loading}
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="send-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Analytics />

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        }

        .chat-container {
          width: 100%;
          max-width: 800px;
          height: 80vh;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .header {
          padding: 32px 32px 24px;
          text-align: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .header h1 {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .header p {
          margin: 0;
          color: #666;
          font-size: 16px;
          font-weight: 400;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .welcome-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .welcome h2 {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .welcome p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .message {
          display: flex;
          margin-bottom: 8px;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 16px 20px;
          border-radius: 20px;
          font-size: 15px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 8px;
        }

        .message.assistant .message-content {
          background: #f8f9fa;
          color: #1a1a1a;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-bottom-left-radius: 8px;
        }

        .message-content.loading {
          padding: 20px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #999;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .input-container {
          padding: 24px 32px 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: #f8f9fa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .input-wrapper textarea {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          resize: none;
          font-size: 15px;
          line-height: 1.5;
          color: #1a1a1a;
          font-family: inherit;
          min-height: 20px;
          max-height: 120px;
        }

        .input-wrapper textarea::placeholder {
          color: #999;
        }

        .send-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }

          .chat-container {
            height: 90vh;
            border-radius: 16px;
          }

          .header {
            padding: 24px 20px 16px;
          }

          .header h1 {
            font-size: 24px;
          }

          .messages {
            padding: 16px 20px;
          }

          .message-content {
            max-width: 85%;
            padding: 12px 16px;
          }

          .input-container {
            padding: 16px 20px 24px;
          }
        }
      `}</style>
    </>
  )
}