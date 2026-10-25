import { lifePathDetails, lifePathFromDate, nameNumbers } from '../utils/numerology'

export function calculateLifePath(dateString) {
  return lifePathFromDate(dateString)
}

export function calculateNameNumbers(fullName) {
  return nameNumbers(fullName)
}

export function calculateNumerologyProfile(dateOfBirth, fullName) {
  const lifePath = calculateLifePath(dateOfBirth)
  const numbers = typeof fullName === 'string' && fullName.trim() ? calculateNameNumbers(fullName) : {}
  return {
    lifePath,
    ...numbers,
    details: lifePath ? lifePathDetails(lifePath) : null,
  }
}

export function lifePathSummary(number) {
  return lifePathDetails(number)
}
