const apiBaseUrl = import.meta.env.VITE_API_URL || ''

async function postJson(path, body) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || `Request failed with status ${response.status}`)
  return data
}

export function sendChatMessage(messages, system) {
  return postJson('/api/chat', { messages, system })
}

export function createBooking(booking) {
  return postJson('/api/bookings', booking)
}

export function getBookingAvailability(date) {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  return fetch(`${apiBaseUrl}/api/bookings/availability${query}`).then(async (response) => {
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.success === false) throw new Error(data.message || `Request failed with status ${response.status}`)
    return data
  })
}
