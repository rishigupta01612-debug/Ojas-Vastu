export function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value) {
	return /^[+\d][\d\s()-]{7,}$/.test(value.trim())
}

export function validateBooking(values) {
	const errors = {}
	if (!values.name.trim()) errors.name = 'Please enter your full name.'
	if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address.'
	if (values.phone && !isValidPhone(values.phone)) errors.phone = 'Please enter a valid phone number.'
	if (!values.date) errors.date = 'Please choose a date.'
	if (!values.slot) errors.slot = 'Please choose a time.'
	return errors
}
