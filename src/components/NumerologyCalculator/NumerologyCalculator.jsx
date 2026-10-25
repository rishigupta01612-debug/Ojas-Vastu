import useNumerology from '../../hooks/useNumerology'

function NumerologyCalculator() {
  const { dateOfBirth, setDateOfBirth, fullName, setFullName, result, error, calculate, reset } = useNumerology()

  const handleSubmit = (event) => {
    event.preventDefault()
    calculate()
  }

  return (
    <section className="numerology-calculator" aria-label="Numerology calculator">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="numerology-date">Date of birth</label>
          <input
            id="numerology-date"
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="numerology-name">Full name</label>
          <input
            id="numerology-name"
            type="text"
            value={fullName}
            placeholder="As it appears on legal documents"
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>

        <div>
          <button type="submit">Reveal my number</button>
          {result && (
            <button type="button" onClick={reset} className="secondary-button">
              Reset
            </button>
          )}
        </div>
      </form>

      {error && <p className="form-error">{error}</p>}

      {result && (
        <div className="numerology-result">
          <div className="life-path-number">{result.lifePath}</div>
          <div>
            <h3>{result.details?.[0]}</h3>
            <p>{result.details?.[1]}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default NumerologyCalculator