const apiBaseUrl = import.meta.env.VITE_API_URL || ''

const razorpayScriptUrl = 'https://checkout.razorpay.com/v1/checkout.js'

export function loadRazorpay() {
	if (window.Razorpay) return Promise.resolve(true)
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = razorpayScriptUrl
		script.onload = () => resolve(true)
		script.onerror = () => reject(new Error('Razorpay Checkout could not be loaded'))
		document.body.appendChild(script)
	})
}

export async function createPaymentOrder(order) {
	const response = await fetch(`${apiBaseUrl}/api/payment/create-order`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(order),
	})
	const data = await response.json().catch(() => ({}))
	if (!response.ok || data.success === false) throw new Error(data.message || `Payment request failed with status ${response.status}`)
	return data.data
}

export async function verifyPayment(payment) {
	const response = await fetch(`${apiBaseUrl}/api/payment/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payment),
	})
	const data = await response.json().catch(() => ({}))
	if (!response.ok || data.success === false) throw new Error(data.message || `Payment verification failed with status ${response.status}`)
	return data.data
}
