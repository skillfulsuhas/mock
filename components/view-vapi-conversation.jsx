"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Loader, Volume2, VolumeX } from "lucide-react"
import { vapi } from "@/lib/vapi.sdk"
import "./view-vapi-conversation.css"

const ViewVapiConversation = ({ interviewId }) => {
  const [callStatus, setCallStatus] = useState("INACTIVE") // INACTIVE, CONNECTING, ACTIVE, FINISHED
  const [messages, setMessages] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState(null)
  const [lastMessage, setLastMessage] = useState("")

  // Set up event listeners for Vapi SDK
  useEffect(() => {
    const onCallStart = () => {
      console.log("Call started")
      setCallStatus("ACTIVE")
    }

    const onCallEnd = () => {
      console.log("Call ended")
      setCallStatus("FINISHED")
    }

    const onMessage = (message) => {
      console.log("Message received:", message)
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        }
        setMessages((prev) => [...prev, newMessage])
      }
    }

    const onSpeechStart = () => {
      console.log("AI started speaking")
      setIsSpeaking(true)
    }

    const onSpeechEnd = () => {
      console.log("AI stopped speaking")
      setIsSpeaking(false)
    }

    const onError = (error) => {
      console.error("Vapi error:", error)
      setError(`Error: ${error.message || "Something went wrong"}`)
      setCallStatus("INACTIVE")
    }

    // Register event listeners
    vapi.on("call-start", onCallStart)
    vapi.on("call-end", onCallEnd)
    vapi.on("message", onMessage)
    vapi.on("speech-start", onSpeechStart)
    vapi.on("speech-end", onSpeechEnd)
    vapi.on("error", onError)

    // Clean up event listeners on component unmount
    return () => {
      vapi.off("call-start", onCallStart)
      vapi.off("call-end", onCallEnd)
      vapi.off("message", onMessage)
      vapi.off("speech-start", onSpeechStart)
      vapi.off("speech-end", onSpeechEnd)
      vapi.off("error", onError)
    }
  }, [])

  // Fetch interview data when interviewId changes
  useEffect(() => {
    if (interviewId) {
      // Here you would fetch the interview data from your API
      console.log(`Fetching interview data for ID: ${interviewId}`)
      // For now, we'll just simulate loading some messages
      setMessages([
        {
          role: "assistant",
          content: "This is a continuation of your previous interview. Let's pick up where we left off.",
        },
      ])
    }
  }, [interviewId])

  // Update last message whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content)
    }
  }, [messages])

  // Start the interview call
  const startCall = async () => {
    try {
      setError(null)
      setCallStatus("CONNECTING")

      // Start the call with the workflow ID
      // You can pass additional variables to the workflow if needed
      await vapi.start("a6b80a87-0844-478c-97d8-37af0ad6c784", {
        variableValues: {
          username: "User",
          interviewId: interviewId,
          // Add any other variables your workflow might need
        },
      })
    } catch (err) {
      console.error("Failed to start call:", err)
      setError(`Failed to start interview: ${err.message}`)
      setCallStatus("INACTIVE")
    }
  }

  // End the interview call
  const endCall = () => {
    vapi.stop()
    setCallStatus("FINISHED")
  }

  // Reset the conversation
  const resetConversation = () => {
    if (callStatus === "ACTIVE") {
      vapi.stop()
    }
    setMessages([])
    setLastMessage("")
    setCallStatus("INACTIVE")
    setError(null)
  }

  // Render different buttons based on call status
  const renderActionButton = () => {
    switch (callStatus) {
      case "INACTIVE":
        return (
          <button onClick={startCall} className="btn btn-primary vapi-continue-button">
            <Mic className="mr-2 h-4 w-4 mic-icon" />
            Continue Interview
          </button>
        )

      case "CONNECTING":
        return (
          <button className="btn btn-primary opacity-70" disabled>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </button>
        )

      case "ACTIVE":
        return (
          <button onClick={endCall} className="btn bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <MicOff className="mr-2 h-4 w-4" />
            End Interview
          </button>
        )

      case "FINISHED":
        return (
          <button onClick={resetConversation} className="btn btn-primary">
            Start New Interview
          </button>
        )

      default:
        return null
    }
  }

  return (
    <div className="vapi-conversation-container">
      <div className="vapi-header">
        <h2 className="vapi-header-title">Continue Interview #{interviewId}</h2>
      </div>

      {/* Interview Status */}
      <div className="vapi-status-bar" data-status={callStatus}>
        <div
          className={`status-indicator ${
            callStatus === "ACTIVE"
              ? "status-active"
              : callStatus === "INACTIVE"
                ? "status-inactive"
                : callStatus === "CONNECTING"
                  ? "status-connecting"
                  : "status-finished"
          }`}
        >
          {callStatus === "ACTIVE" && (isSpeaking ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />)}
          {callStatus === "INACTIVE" && <Mic className="h-4 w-4" />}
          {callStatus === "CONNECTING" && <Loader className="h-4 w-4 animate-spin" />}
          {callStatus === "FINISHED" && <VolumeX className="h-4 w-4" />}
        </div>
        <span className="text-sm font-medium">
          {callStatus === "INACTIVE" && "Ready to continue"}
          {callStatus === "CONNECTING" && "Connecting..."}
          {callStatus === "ACTIVE" && (isSpeaking ? "AI is speaking" : "Your turn to speak")}
          {callStatus === "FINISHED" && "Interview completed"}
        </span>
      </div>

      {/* Conversation Display */}
      <div className="vapi-conversation-area">
        {messages.length === 0 ? (
          <div className="vapi-empty-state">
            {callStatus === "INACTIVE" && (
              <>
                <Mic className="h-12 w-12" />
                <p>Click "Continue Interview" to resume your practice session</p>
              </>
            )}
            {callStatus === "CONNECTING" && (
              <>
                <Loader className="h-12 w-12 animate-spin" />
                <p>Connecting to your AI interviewer...</p>
              </>
            )}
            {callStatus === "FINISHED" && (
              <>
                <VolumeX className="h-12 w-12" />
                <p>Your interview has ended. Start a new one to practice more.</p>
              </>
            )}
          </div>
        ) : (
          <div className="vapi-message-container">
            <div className="previous-conversation-indicator">Continuing previous interview session</div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`vapi-message ${message.role === "assistant" ? "vapi-message-assistant" : "vapi-message-user"}`}
              >
                <div className="vapi-message-bubble">
                  <div className="vapi-message-role">{message.role === "assistant" ? "Interviewer" : "You"}</div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="vapi-error">
          <div className="flex justify-between items-center">
            <p className="text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-sm underline hover:no-underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="vapi-actions">
        {renderActionButton()}

        {callStatus === "ACTIVE" && (
          <div className={`vapi-speaking-indicator ${isSpeaking ? "speaking" : "listening"}`}>
            {isSpeaking ? "Interviewer is speaking..." : "Your turn to speak"}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="vapi-instructions">
        <h3>How to use:</h3>
        <ol>
          <li>Click "Continue Interview" to resume your practice session</li>
          <li>The AI interviewer will pick up where you left off</li>
          <li>Respond naturally as you would in a real interview</li>
          <li>The conversation will be transcribed automatically</li>
          <li>Click "End Interview" when you're done</li>
        </ol>
      </div>
    </div>
  )
}

export default ViewVapiConversation

