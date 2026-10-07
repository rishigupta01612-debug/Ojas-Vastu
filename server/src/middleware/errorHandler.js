export function notFoundHandler(_request, response) {
  response.status(404).json({ success: false, message: 'Route not found' })
}

export function errorHandler(error, _request, response, next) {
  void next
  const status = error.statusCode || 500
  if (error.code === 11000) return response.status(409).json({ success: false, message: 'That appointment slot is already booked.' })
  if (status >= 500) console.error(error.message)
  return response.status(status).json({ success: false, message: error.publicMessage || (status >= 500 ? 'Something went wrong on the server.' : error.message) })
}