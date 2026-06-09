import './App.css'
import { useLocalStorage } from './useLocalStorage'

function App() {
  // Use the custom hook to persist the form values in localStorage.
  const [name, setName] = useLocalStorage('name', '')
  const [serviceNumber, setServiceNumber] = useLocalStorage('serviceNumber', '')

  return (
    <main className="app-shell">
      <section className="panel hero-card">
        <p className="eyebrow">Local storage form</p>
        <h1>Keep your details saved across refreshes.</h1>
        <p className="lede">
          This form stores the name and service number in local storage so the values
          remain available after a page refresh.
        </p>
      </section>

      <section className="panel form-card">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
        />

        <label htmlFor="serviceNumber">Service Number</label>
        <input
          id="serviceNumber"
          type="text"
          value={serviceNumber}
          onChange={(event) => setServiceNumber(event.target.value)}
          placeholder="Enter service number"
        />

        <p className="helper-text">Values are saved automatically in local storage.</p>
      </section>
    </main>
  )
}

export default App
