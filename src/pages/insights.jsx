"use client"

import { useState, useEffect } from "react"
import { BarChart3 } from "lucide-react"
import "../css/page.css"

const Insights = () => {
  const [insights, setInsights] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch insights from the FastAPI backend
  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("https://mock-interview-fastapi.onrender.com/insights")
        const data = await response.json()
        setInsights(data)
      } catch (error) {
        console.error("Failed to fetch insights:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [])

  return (
    <div className="container py-12">
      <h1 className="hero-title text-center mb-8">Performance Insights</h1>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div key={index} className="insight-item">
              <h3 className="insight-title">{insight.title || `Insight #${insight.id}`}</h3>
              <p className="insight-date">Based on interview from {insight.date || "unknown date"}</p>

              <div className="insight-section">
                <div>
                  <h4 className="insight-section-title">Strengths</h4>
                  <p>{insight.strengths || "No strengths data available"}</p>
                </div>

                <div>
                  <h4 className="insight-section-title">Areas for Improvement</h4>
                  <p>{insight.improvements || "No improvement data available"}</p>
                </div>

                <div className="pt-2">
                  <div className="insight-score-container">
                    <h4 className="insight-score-label">Overall Score</h4>
                    <span className="insight-score-value">{insight.score || "N/A"}</span>
                  </div>
                  <div className="insight-progress-bg">
                    <div
                      className="insight-progress-bar"
                      style={{ width: `${insight.score ? insight.score * 10 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <button className="insight-report-button">View Full Report</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BarChart3 className="empty-state-icon" />
          <h3 className="empty-state-title">No insights available</h3>
          <p className="empty-state-description">Complete an interview to generate insights</p>
          <button onClick={() => (window.location.href = "/create-interview")} className="empty-state-button">
            Start Interview
          </button>
        </div>
      )}
    </div>
  )
}

export default Insights

