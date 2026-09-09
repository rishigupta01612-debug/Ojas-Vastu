import { useState } from 'react'
import { lifePathDetails, lifePathFromDate, nameNumbers } from '../utils/numerology'

export default function useNumerology() {
	const [dateOfBirth, setDateOfBirth] = useState('')
	const [fullName, setFullName] = useState('')
	const [result, setResult] = useState(null)
	const [error, setError] = useState('')

	function calculate() {
		if (!dateOfBirth) {
			setError('Please enter your date of birth.')
			return null
		}
		const lifePath = lifePathFromDate(dateOfBirth)
		const numbers = fullName.trim() ? nameNumbers(fullName.trim()) : {}
		const nextResult = { lifePath, ...numbers, details: lifePathDetails(lifePath) }
		setResult(nextResult)
		setError('')
		return nextResult
	}

	function reset() {
		setDateOfBirth('')
		setFullName('')
		setResult(null)
		setError('')
	}

	return { dateOfBirth, setDateOfBirth, fullName, setFullName, result, error, calculate, reset }
}
