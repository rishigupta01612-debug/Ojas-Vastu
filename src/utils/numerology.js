import { LIFE_PATH_DATA } from './constants'

export function reduceNumber(number) {
	const value = Number(number)
	if (!Number.isFinite(value)) return null
	let nextValue = value
	while (nextValue > 9 && nextValue !== 11 && nextValue !== 22 && nextValue !== 33) {
		nextValue = String(nextValue).split('').reduce((sum, digit) => sum + Number(digit), 0)
	}
	return nextValue
}

export function lifePathFromDate(dateString) {
	if (typeof dateString !== 'string') return null
	const trimmed = dateString.trim()
	if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null
	const [year, month, day] = trimmed.split('-').map(Number)
	if (![year, month, day].every(Number.isFinite)) return null
	const total = (reduceNumber(month) ?? 0) + (reduceNumber(day) ?? 0) + (reduceNumber(year) ?? 0)
	return reduceNumber(total)
}

export function nameNumbers(fullName) {
	if (typeof fullName !== 'string') {
		return { expression: null, soulUrge: null, personality: null }
	}
	const letters = fullName.trim().toUpperCase().replace(/[^A-Z]/g, '').split('')
	if (!letters.length || letters[0] === '') {
		return { expression: null, soulUrge: null, personality: null }
	}
	let total = 0
	let vowelSum = 0
	let consonantSum = 0
	letters.forEach((letter) => {
		const value = (letter.charCodeAt(0) - 65) % 9 + 1
		total += value
		if ('AEIOU'.includes(letter)) vowelSum += value
		else consonantSum += value
	})
	return {
		expression: reduceNumber(total),
		soulUrge: reduceNumber(vowelSum),
		personality: reduceNumber(consonantSum),
	}
}

export function lifePathDetails(number) {
	if (!Number.isFinite(Number(number))) return null
	const reduced = reduceNumber(number)
	return LIFE_PATH_DATA[reduced] || LIFE_PATH_DATA[reduced ?? 0] || null
}

export function universalDayNumber(date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null
	const digits = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`.split('').map(Number)
	return reduceNumber(digits.reduce((sum, digit) => sum + digit, 0))
}
