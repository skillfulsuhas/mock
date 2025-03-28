"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { MessageSquare, ArrowRight, PlusCircle, ListChecks, BarChart3, ChevronRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import CreateVapiConversation from "@/components/create-vapi-conversation"
import ViewVapiConversation from "@/components/view-vapi-conversation"
import "./page.css"

export default function Home() {
  const [activeSection, setActiveSection] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [insights, setInsights] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInterviewId, setSelectedInterviewId] = useState(null)

  // Fetch interviews from the FastAPI backend
  const fetchInterviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://mock-interview-fastapi.onrender.com/interviews")
      const data = await response.json()
      setInterviews(data)
    } catch (error) {
      console.error("Failed to fetch interviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch insights from the FastAPI backend
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
    setSelectedInterviewId(interviewId)
    setActiveSection("view-interview")
  }

  return (
    <div className="min-h-screen gradient-bg">
      <nav className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">InterviewPro</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            to="/features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="container py-12">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="hero-title">Ace Your Next Interview with AI</h1>
            <p className="hero-subtitle">
              Practice with personalized mock interviews, receive real-time feedback, and track your progress to land
              your dream job.
            </p>
          </motion.div>

          {/* Main Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="action-cards"
          >
            {/* Create Interview Card */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
              className="action-card"
            >
              <div className="action-card-decoration"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="action-card-icon-container">
                    <PlusCircle className="action-card-icon" />
                  </div>
                  <h3 className="action-card-title">Create Interview</h3>
                </div>
                <p className="action-card-description">
                  Start a new mock interview session tailored to your job role and experience level.
                </p>
                <button onClick={() => handleSectionChange("create")} className="action-card-button">
                  Start New Interview <ChevronRight className="action-card-button-icon" />
                </button>
              </div>
            </motion.div>

            {/* View Interviews Card */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
              className="action-card"
            >
              <div className="action-card-decoration"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="action-card-icon-container">
                    <ListChecks className="action-card-icon" />
                  </div>
                  <h3 className="action-card-title">View Interviews</h3>
                </div>
                <p className="action-card-description">
                  Access your previously created interviews and continue where you left off.
                </p>
                <button onClick={() => handleSectionChange("interviews")} className="action-card-button">
                  Browse Interviews <ChevronRight className="action-card-button-icon" />
                </button>
              </div>
            </motion.div>

            {/* Insights Card */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
              className="action-card"
            >
              <div className="action-card-decoration"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="action-card-icon-container">
                    <BarChart3 className="action-card-icon" />
                  </div>
                  <h3 className="action-card-title">Performance Insights</h3>
                </div>
                <p className="action-card-description">
                  View detailed analytics and AI-generated feedback on your interview performance.
                </p>
                <button onClick={() => handleSectionChange("insights")} className="action-card-button">
                  View Insights <ChevronRight className="action-card-button-icon" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Active Section Content */}
        {activeSection && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
            className="active-section"
          >
            {activeSection === "create" && (
              <div className="space-y-6">
                <div className="active-section-header">
                  <h2 className="active-section-title">Create New Interview</h2>
                  <button onClick={() => setActiveSection(null)} className="active-section-close">
                    Close
                  </button>
                </div>
                <CreateVapiConversation />
              </div>
            )}

            {activeSection === "view-interview" && (
              <div className="space-y-6">
                <div className="active-section-header">
                  <h2 className="active-section-title">Continue Interview</h2>
                  <button onClick={() => setActiveSection("interviews")} className="active-section-close">
                    Back to Interviews
                  </button>
                </div>
                <ViewVapiConversation interviewId={selectedInterviewId} />
              </div>
            )}

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
                    {interviews.map((interview, index) => (
                      <div key={index} className="interview-item" onClick={() => handleInterviewSelect(interview.id)}>
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
                    <Sparkles className="empty-state-icon" />
                    <h3 className="empty-state-title">No interviews yet</h3>
                    <p className="empty-state-description">Create your first interview to get started</p>
                    <button onClick={() => handleSectionChange("create")} className="empty-state-button">
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
                    <button onClick={() => handleSectionChange("create")} className="empty-state-button">
                      Start Interview
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        )}

        {/* Features Section */}
        <section className="features-section">
          <div className="features-header">
            <h2 className="features-title">Why Choose InterviewPro?</h2>
            <p className="features-description">
              Our AI-powered platform offers everything you need to prepare for your next job interview
            </p>
          </div>

          <div className="features-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon-container">
                <MessageSquare className="feature-icon" />
              </div>
              <h3 className="feature-title">AI-Powered Questions</h3>
              <p className="feature-description">
                Get personalized questions based on your job role, experience level, and tech stack
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon-container">
                <Sparkles className="feature-icon" />
              </div>
              <h3 className="feature-title">Real-time Feedback</h3>
              <p className="feature-description">
                Receive instant analysis of your responses with actionable suggestions for improvement
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon-container">
                <BarChart3 className="feature-icon" />
              </div>
              <h3 className="feature-title">Performance Tracking</h3>
              <p className="feature-description">
                Monitor your progress over time with detailed analytics and performance metrics
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="cta-section"
        >
          <h2 className="cta-title">Ready to ace your next interview?</h2>
          <p className="cta-description">
            Join thousands of job seekers who have improved their interview skills with InterviewPro
          </p>
          <button className="cta-button">
            Get Started <ArrowRight className="cta-button-icon" />
          </button>
        </motion.section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <MessageSquare className="footer-logo-icon" />
              <h2 className="footer-logo-text">InterviewPro</h2>
            </div>
            <div className="footer-links">
              <Link to="/about" className="footer-link">
                About
              </Link>
              <Link to="/features" className="footer-link">
                Features
              </Link>
              <Link to="/contact" className="footer-link">
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

