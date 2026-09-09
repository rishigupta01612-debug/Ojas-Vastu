import { LIFE_PATH_DATA } from './constants'

export function reduceNumber(number) {
	let value = Number(number)
	while (value > 9 && value !== 11 && value !== 22 && value !== 33) {
		value = String(value).split('').reduce((sum, digit) => sum + Number(digit), 0)
	}
	return value
}

export function lifePathFromDate(dateString) {
	const parts = dateString.split('-').map(Number)
	const [year, month, day] = parts
	const total = reduceNumber(month) + reduceNumber(day) + reduceNumber(year)
	return reduceNumber(total)
}

export function nameNumbers(fullName) {
	const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('')
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
		expression: letters.length ? reduceNumber(total) : null,
		soulUrge: letters.length ? reduceNumber(vowelSum) : null,
		personality: letters.length ? reduceNumber(consonantSum) : null,
	}
}

export function lifePathDetails(number) {
	return LIFE_PATH_DATA[number] || LIFE_PATH_DATA[reduceNumber(number)]
}

export function universalDayNumber(date) {
	const digits = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`.split('').map(Number)
	return reduceNumber(digits.reduce((sum, digit) => sum + digit, 0))
}
