import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [textContent, setTextContent] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('https://ai-threat-intelligence-dashboard.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, text_content: textContent }),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getAiRisk = () => {
    if (!results?.text_analysis || !Array.isArray(results.text_analysis) || results.text_analysis.length === 0) {
      return { level: 'UNKNOWN', score: 0, isNegative: false }
    }
    const topPrediction = results.text_analysis[0]
    if (topPrediction.label === 'ERROR') {
      return { level: 'ERROR', score: 0, isNegative: false }
    }
    const isNegative = topPrediction.label === 'NEGATIVE'
    const scorePercent = Math.round(topPrediction.score * 100)
    return {
      level: isNegative && scorePercent > 60 ? 'HIGH' : isNegative ? 'MEDIUM' : 'LOW',
      score: scorePercent,
      isNegative
    }
  }

  const getVtStats = () => {
    const stats = results?.url_scan?.attributes?.last_analysis_stats || results?.url_scan?.data?.attributes?.last_analysis_stats
    const reputation = results?.url_scan?.attributes?.reputation ?? results?.url_scan?.data?.attributes?.reputation ?? 0
    return {
      malicious: stats?.malicious || 0,
      suspicious: stats?.suspicious || 0,
      harmless: stats?.harmless || 0,
      undetected: stats?.undetected || 0,
      reputation
    }
  }

  const aiRisk = results ? getAiRisk() : null
  const vtStats = results ? getVtStats() : null

  const getOverallStatus = () => {
    if (!results) return null
    if ((aiRisk?.isNegative && aiRisk?.score > 70) || vtStats?.malicious > 0) {
      return { badge: 'CRITICAL THREAT DETECTED', bg: '#fee2e2', color: '#991b1b' }
    }
    if (aiRisk?.isNegative || vtStats?.suspicious > 0 || vtStats?.reputation < 0) {
      return { badge: 'SUSPICIOUS ACTIVITY FLAGGED', bg: '#fef3c7', color: '#92400e' }
    }
    return { badge: 'SAFE / LOW RISK', bg: '#dcfce7', color: '#166534' }
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="container">
      <header className="header">
        <h1>AI Threat Intelligence Center</h1>
        <p>Real-time phishing detection & domain reputation analysis</p>
      </header>

      <form onSubmit={handleAnalyze} className="analyze-form">
        <div className="input-group">
          <label>Target URL</label>
          <input 
            type="text" 
            placeholder="e.g., http://example.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Suspicious Email / Text Content</label>
          <textarea 
            placeholder="Paste the body of the suspicious email or message here..." 
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" className="scan-btn" disabled={loading}>
          {loading ? 'Scanning Intelligence Network...' : 'Analyze Threat'}
        </button>
      </form>

      {results && (
        <div className="dashboard-results">
          <div className="status-banner" style={{ backgroundColor: overallStatus.bg, color: overallStatus.color, borderColor: overallStatus.color }}>
            <h2>{overallStatus.badge}</h2>
          </div>

          <div className="grid-container">
            <div className="card">
              <h3>AI Phishing Analysis</h3>
              <div className="gauge-container">
                <div className="gauge-body">
                  <div 
                    className="gauge-fill" 
                    style={{ 
                      width: `${aiRisk.score}%`,
                      backgroundColor: aiRisk.isNegative ? '#ef4444' : '#22c55e'
                    }}
                  ></div>
                </div>
                <div className="gauge-text">
                  <span>Tone Sensitivity: <strong>{aiRisk.score}%</strong></span>
                  <span className={`tag ${aiRisk.isNegative ? 'tag-danger' : 'tag-success'}`}>
                    {aiRisk.isNegative ? 'Phishing Intent Flagged' : 'Normal / Benign'}
                  </span>
                </div>
              </div>
              <p className="description">
                {aiRisk.isNegative 
                  ? 'The natural language processor detected urgent, manipulative, or coercive language patterns typical of phishing attempts.'
                  : 'No aggressive or high-pressure phishing indicators were found in the text.'}
              </p>
            </div>

            <div className="card">
              <h3>Domain Reputation (VirusTotal)</h3>
              <div className="stats-grid">
                <div className="stat-box stat-danger">
                  <span className="stat-value">{vtStats.malicious}</span>
                  <span className="stat-label">Malicious</span>
                </div>
                <div className="stat-box stat-warning">
                  <span className="stat-value">{vtStats.suspicious}</span>
                  <span className="stat-label">Suspicious</span>
                </div>
                <div className="stat-box stat-success">
                  <span className="stat-value">{vtStats.harmless}</span>
                  <span className="stat-label">Clean</span>
                </div>
              </div>
              <div className="reputation-bar">
                <span>Global Reputation Score: <strong>{vtStats.reputation}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App