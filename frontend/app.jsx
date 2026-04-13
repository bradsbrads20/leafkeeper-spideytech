import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [totalIntake, setTotalIntake] = useState(0)
  const [goal] = useState(2500)
  const [customAmount, setCustomAmount] = useState('')
  const [lastMessage, setLastMessage] = useState('')
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0])
  const [logHistory, setLogHistory] = useState([])
  const [plantTip, setPlantTip] = useState('')

  // Load data from localStorage on start
  useEffect(() => {
    const savedIntake = localStorage.getItem('totalIntake')
    const savedHistory = localStorage.getItem('logHistory')
    const savedWeekly = localStorage.getItem('weeklyData')
    
    if (savedIntake) setTotalIntake(parseInt(savedIntake))
    if (savedHistory) setLogHistory(JSON.parse(savedHistory))
    if (savedWeekly) setWeeklyData(JSON.parse(savedWeekly))
    
    fetchPlantTip()
  }, [])

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('totalIntake', totalIntake)
    localStorage.setItem('logHistory', JSON.stringify(logHistory))
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData))
  }, [totalIntake, logHistory, weeklyData])

  // Fetch plant care tip from Python backend
  const fetchPlantTip = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/plant-care')
      setPlantTip(${response.data.plant}: ${response.data.recommendation})
    } catch (error) {
      console.log('Python backend not running')
      setPlantTip('🌿 Water your plants weekly!')
    }
  }

  // Fetch watering reminders from Go backend
  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/watering/reminders')
      console.log('Reminders:', response.data)
    } catch (error) {
      console.log('Go backend not running')
    }
  }

  const addWater = (ml) => {
    const newTotal = totalIntake + ml
    setTotalIntake(newTotal)
    setLastMessage(+${ml} ml logged | Total: ${newTotal} ml)
    
    // Add to history
    const newLog = { amount: ml, timestamp: Date.now() }
    setLogHistory([...logHistory, newLog])
    
    // Update weekly data (today's index)
    const today = new Date().getDay()
    const newWeekly = [...weeklyData]
    newWeekly[today] += ml
    setWeeklyData(newWeekly)
    
    // Clear message after 3 seconds
    setTimeout(() => setLastMessage(''), 3000)
    
    fetchReminders()
  }

  const undoLast = () => {
    if (logHistory.length === 0) return
    
    const lastLog = logHistory[logHistory.length - 1]
    const newTotal = totalIntake - lastLog.amount
    setTotalIntake(newTotal)
    
    // Remove from history
    setLogHistory(logHistory.slice(0, -1))
    
    // Update weekly data
    const today = new Date().getDay()
    const newWeekly = [...weeklyData]
    newWeekly[today] -= lastLog.amount
    setWeeklyData(newWeekly)
    
    setLastMessage(↩️ Undid: ${lastLog.amount} ml)
    setTimeout(() => setLastMessage(''), 3000)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const ml = parseInt(customAmount)
    if (ml > 0 && ml <= 5000) {
      addWater(ml)
      setCustomAmount('')
    }
  }

  const progressPercent = Math.min((totalIntake / goal) * 100, 100)

  return (
    <div className="container">
      <h1>🌿 Leaf Keeper</h1>
      
      <div className="progress-section">
        <div className="intake-display">
          <span className="intake-value">{totalIntake}</span>
          <span className="intake-unit">ml</span>
        </div>
        <div className="goal-text">of {goal} ml daily goal</div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: ${progressPercent}% }}></div>
        </div>
      </div>

      {lastMessage && <div className="message">{lastMessage}</div>}

      <div className="buttons-section">
        <h3>💧 Log Water</h3>
        <div className="button-grid">
          <button onClick={() => addWater(200)} className="water-btn">🥛 Small glass<br/>200 ml</button>
          <button onClick={() => addWater(350)} className="water-btn">🍷 Large glass<br/>350 ml</button>
          <button onClick={() => addWater(500)} className="water-btn">🧴 Bottle<br/>500 ml</button>
          <button onClick={() => addWater(750)} className="water-btn">🏺 Large bottle<br/>750 ml</button>
        </div>
        
        <form onSubmit={handleCustomSubmit} className="custom-form">
          <input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="custom-input"
          />
          <button type="submit" className="custom-btn">ml +</button>
        </form>

        {logHistory.length > 0 && (
          <button onClick={undoLast} className="undo-btn">↩️ Undo last entry</button>
        )}
      </div>

      <div className="chart-section">
        <h3>📊 Weekly Overview</h3>
        <div className="bar-chart">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="bar-item">
              <div className="bar" style={{ height: ${(weeklyData[i] / 3000) * 100}px }}></div>
              <span className="bar-label">{day}</span>
              <span className="bar-value">{weeklyData[i]}ml</span>
            </div>
          ))}
        </div>
      </div>

      {plantTip && (
        <div className="plant-tip">
          🌱 Plant Care: {plantTip}
        </div>
      )}
    </div>
  )
}

export default App