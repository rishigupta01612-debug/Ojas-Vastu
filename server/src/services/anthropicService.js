import { env } from '../config/env.js'

const DEFAULT_SYSTEM = 'You are the friendly AI guide for Ojas Numerology & Vastu. Explain numerology and Vastu warmly and concisely. Treat them as reflective, symbolic tools rather than certainties, never promise supernatural outcomes, and avoid medical, legal, or financial advice.'

export async function askAnthropic(messages, system = DEFAULT_SYSTEM) {
  if (!env.anthropicApiKey) {
    const error = new Error('AI chat is not configured')
    error.statusCode = 503
    throw error
  }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': env.anthropicApiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: env.anthropicModel, max_tokens: 600, system, messages }),
    })
    if (!response.ok) {
      const error = new Error('AI provider request failed')
      error.statusCode = response.status === 429 ? 429 : 502
      throw error
    }
    const data = await response.json()
    return data.content?.map((block) => block.text || '').join('').trim() || 'I could not find an answer. Please try rephrasing your question.'
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('AI provider timed out')
      timeoutError.statusCode = 504
      throw timeoutError
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}