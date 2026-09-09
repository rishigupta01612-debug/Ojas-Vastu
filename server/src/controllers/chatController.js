import { askAnthropic } from '../services/anthropicService.js'

export async function chatController(request, response, next) {
  try {
    const { messages, system } = request.validatedBody
    const reply = await askAnthropic(messages, system)
    return response.json({ success: true, data: { reply } })
  } catch (error) { return next(error) }
}