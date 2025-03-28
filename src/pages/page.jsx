"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MessageSquare, ArrowRight, PlusCircle, ListChecks, BarChart3, ChevronRight, Sparkles } from "lucide-react"
import "../css/page.css"

export default function Page() {
  const [activeSection, setActiveSection] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [insights, setInsights] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch interviews from the backend
  const fetchInterviews = async () => {
    setIsLoading(true)
    try {
      // Simulating API call with mock data
      setTimeout(() => {
        setInterviews([
          { id: 1, title: "Frontend Developer Interview", date: "2023-05-15", role: "Frontend" },
          { id: 2, title: "React Developer Interview", date: "2023-06-20", role: "React" },
          { id: 3, title: "Full Stack Developer Interview", date: "2023-07-10", role: "Full Stack" },
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to fetch interviews:", error)
      setIsLoading(false)
    }
  }

  // Fetch insights from the backend
  const fetchInsights = async () => {
    setIsLoading(true)
    try {
      // Simulating API call with mock data
      setTimeout(() => {
        setInsights([
          {
            id: 1,
            title: "Frontend Interview Performance",
            date: "2023-05-15",
            strengths: "Strong knowledge of React hooks and state management. Good communication skills.",
            improvements: "Could improve on CSS Grid and system design explanations.",
            score: 8.5,
          },
          {
            id: 2,
            title: "React Developer Assessment",
            date: "2023-06-20",
            strengths: "Excellent understanding of React component lifecycle and optimization.",
            improvements: "Work on explaining complex concepts more clearly.",
            score: 7.8,
          },
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to fetch insights:", error)
      setIsLoading(false)
    }
  }

  // Handle section changes
  const handleSectionChange = (section) => {
    if (section === activeSection) {
      setActiveSection(null)
      return
    }

    setActiveSection(section)

    if (section === "interviews") {
      fetchInterviews()
    } else if (section === "insights") {
      fetchInsights()
    }
  }

  // Handle interview selection
  const handleInterviewSelect = (interviewId) => {
    navigate(`/view/${interviewId}`)
  }

  // Handle create new interview
  const handleCreateInterview = () => {
    navigate("/create")
  }

  return (
    <div className="app-container">
      <nav className="container app-nav">
        <div className="app-logo">
          <MessageSquare className="app-logo-icon" size={24} />
          <h1 className="app-logo-text">InterviewPro</h1>
        </div>
        <div className="app-nav-links">
          <Link to="/about" className="app-nav-link">
            About
          </Link>
          <Link to="#features" className="app-nav-link">
            Features
          </Link>
          <Link to="#contact" className="app-nav-link">
            Contact
          </Link>
          <Link to="/signup" className="app-nav-button">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="container app-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background"></div>
          <div className="hero-content">
            <h1 className="hero-title">Ace Your Next Interview with AI</h1>
            <p className="hero-subtitle">
              Practice with personalized mock interviews, receive real-time feedback, and track your progress to land
              your dream job.
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="action-cards">
            {/* Create Interview Card */}
            <div className="action-card">
              <div className="action-card-decoration"></div>
              <div className="action-card-content">
                <div className="action-card-header">
                  <div className="action-card-icon-container">
                    <PlusCircle className="action-card-icon" size={24} />
                  </div>
                  <h3 className="action-card-title">Create Interview</h3>
                </div>
                <p className="action-card-description">
                  Start a new mock interview session tailored to your job role and experience level.
                </p>
                <button onClick={handleCreateInterview} className="action-card-button">
                  Start New Interview <ChevronRight className="action-card-button-icon" size={16} />
                </button>
              </div>
            </div>

            {/* View Interviews Card */}
            <div className="action-card">
              <div className="action-card-decoration"></div>
              <div className="action-card-content">
                <div className="action-card-header">
                  <div className="action-card-icon-container">
                    <ListChecks className="action-card-icon" size={24} />
                  </div>
                  <h3 className="action-card-title">View Interviews</h3>
                </div>
                <p className="action-card-description">
                  Access your previously created interviews and continue where you left off.
                </p>
                <button onClick={() => handleSectionChange("interviews")} className="action-card-button">
                  Browse Interviews <ChevronRight className="action-card-button-icon" size={16} />
                </button>
              </div>
            </div>

            {/* Insights Card */}
            <div className="action-card">
              <div className="action-card-decoration"></div>
              <div className="action-card-content">
                <div className="action-card-header">
                  <div className="action-card-icon-container">
                    <BarChart3 className="action-card-icon" size={24} />
                  </div>
                  <h3 className="action-card-title">Performance Insights</h3>
                </div>
                <p className="action-card-description">
                  View detailed analytics and AI-generated feedback on your interview performance.
                </p>
                <button onClick={() => handleSectionChange("insights")} className="action-card-button">
                  View Insights <ChevronRight className="action-card-button-icon" size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Active Section Content */}
        {activeSection && (
          <section className="active-section">
            {activeSection === "interviews" && (
              <div className="space-y-6">
                <div className="active-section-header">
                  <h2 className="active-section-title">Your Interviews</h2>
                  <button onClick={() => setActiveSection(null)} className="active-section-close">
                    Close
                  </button>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                  </div>
                ) : interviews.length > 0 ? (
                  <div className="interview-list">
                    {interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="interview-item"
                        onClick={() => handleInterviewSelect(interview.id)}
                      >
                        <h3 className="interview-title">{interview.title || `Interview #${interview.id}`}</h3>
                        <p className="interview-date">{interview.date || "No date available"}</p>
                        <div className="interview-footer">
                          <span className="interview-role">{interview.role || "No role specified"}</span>
                          <button
                            className="interview-continue"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleInterviewSelect(interview.id)
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Sparkles className="empty-state-icon" size={48} />
                    <h3 className="empty-state-title">No interviews yet</h3>
                    <p className="empty-state-description">Create your first interview to get started</p>
                    <button onClick={handleCreateInterview} className="empty-state-button">
                      Create Interview
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === "insights" && (
              <div className="space-y-6">
                <div className="active-section-header">
                  <h2 className="active-section-title">Performance Insights</h2>
                  <button onClick={() => setActiveSection(null)} className="active-section-close">
                    Close
                  </button>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                  </div>
                ) : insights.length > 0 ? (
                  <div className="space-y-6">
                    {insights.map((insight) => (
                      <div key={insight.id} className="insight-item">
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

                          <div style={{ marginTop: "1rem" }}>
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
                    <BarChart3 className="empty-state-icon" size={48} />
                    <h3 className="empty-state-title">No insights available</h3>
                    <p className="empty-state-description">Complete an interview to generate insights</p>
                    <button onClick={handleCreateInterview} className="empty-state-button">
                      Start Interview
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Features Section */}
        <section className="features-section" id="features">
          <div className="features-header">
            <h2 className="features-title">Why Choose InterviewPro?</h2>
            <p className="features-description">
              Our AI-powered platform offers everything you need to prepare for your next job interview
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <MessageSquare className="feature-icon" size={24} />
              </div>
              <h3 className="feature-title">AI-Powered Questions</h3>
              <p className="feature-description">
                Get personalized questions based on your job role, experience level, and tech stack
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <Sparkles className="feature-icon" size={24} />
              </div>
              <h3 className="feature-title">Real-time Feedback</h3>
              <p className="feature-description">
                Receive instant analysis of your responses with actionable suggestions for improvement
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <BarChart3 className="feature-icon" size={24} />
              </div>
              <h3 className="feature-title">Performance Tracking</h3>
              <p className="feature-description">
                Monitor your progress over time with detailed analytics and performance metrics
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" id="contact">
          <h2 className="cta-title">Ready to ace your next interview?</h2>
          <p className="cta-description">
            Join thousands of job seekers who have improved their interview skills with InterviewPro
          </p>
          <button className="cta-button">
            Get Started <ArrowRight className="cta-button-icon" size={16} />
          </button>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <MessageSquare className="footer-logo-icon" size={20} />
              <h2 className="footer-logo-text">InterviewPro</h2>
            </div>
            <div className="footer-links">
              <Link to="/about" className="footer-link">
                About
              </Link>
              <Link to="#features" className="footer-link">
                Features
              </Link>
              <Link to="#contact" className="footer-link">
                Contact
              </Link>
              <Link to="/privacy" className="footer-link">
                Privacy
              </Link>
            </div>
          </div>
          <div className="footer-copyright">&copy; {new Date().getFullYear()} InterviewPro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

