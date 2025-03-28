"use client"

import { useState, useEffect } from "react"
import styles from "../css/CreateVapiConversation.module.css"
import { Mic, MicOff, Loader, Volume2, VolumeX } from "lucide-react"
import { vapi } from "../lib/vapi.sdk" 

const CreateVapiConversation = () => {
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
      await vapi.start("a6b80a87-0844-478c-97d8-37af0ad6c784", {
        variableValues: {
          username: "User",
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
          <button onClick={startCall} className={styles.startButton}>
            <Mic className={styles.icon} />
            Start Interview
          </button>
        )

      case "CONNECTING":
        return (
          <button className={`${styles.startButton} ${styles.connecting}`} disabled>
            <Loader className={`${styles.icon} ${styles.spinner}`} />
            Connecting...
          </button>
        )

      case "ACTIVE":
        return (
          <button onClick={endCall} className={styles.endButton}>
            <MicOff className={styles.icon} />
            End Interview
          </button>
        )

      case "FINISHED":
        return (
          <button onClick={resetConversation} className={styles.resetButton}>
            Start New Interview
          </button>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Interview Practice Assistant</h2>

      {/* Interview Status */}
      <div className={styles.statusContainer}>
        <div className={`${styles.statusIndicator} ${styles[callStatus.toLowerCase()]}`}>
          {callStatus === "ACTIVE" &&
            (isSpeaking ? <Volume2 className={styles.statusIcon} /> : <Mic className={styles.statusIcon} />)}
          {callStatus === "INACTIVE" && <Mic className={styles.statusIcon} />}
          {callStatus === "CONNECTING" && <Loader className={`${styles.statusIcon} ${styles.spinner}`} />}
          {callStatus === "FINISHED" && <VolumeX className={styles.statusIcon} />}
        </div>
        <span className={styles.statusText}>
          {callStatus === "INACTIVE" && "Ready to start"}
          {callStatus === "CONNECTING" && "Connecting..."}
          {callStatus === "ACTIVE" && (isSpeaking ? "AI is speaking" : "Your turn to speak")}
          {callStatus === "FINISHED" && "Interview completed"}
        </span>
      </div>

      {/* Conversation Display */}
      <div className={styles.conversationContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            {callStatus === "INACTIVE" && <p>Click "Start Interview" to begin your practice session</p>}
            {callStatus === "CONNECTING" && <p>Connecting to your AI interviewer...</p>}
            {callStatus === "FINISHED" && <p>Your interview has ended. Start a new one to practice more.</p>}
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${message.role === "assistant" ? styles.assistantMessage : styles.userMessage}`}
              >
                <div className={styles.messageContent}>
                  <span className={styles.messageRole}>{message.role === "assistant" ? "Interviewer" : "You"}</span>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError(null)} className={styles.dismissButton}>
            Dismiss
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.controls}>
        {renderActionButton()}
        {callStatus === "ACTIVE" && (
          <div className={styles.speakingIndicator}>
            {isSpeaking ? "Interviewer is speaking..." : "Your turn to speak"}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        <h3>How to use:</h3>
        <ol>
          <li>Click "Start Interview" to begin your practice session</li>
          <li>The AI interviewer will ask you questions</li>
          <li>Respond naturally as you would in a real interview</li>
          <li>The conversation will be transcribed automatically</li>
          <li>Click "End Interview" when you're done</li>
        </ol>
      </div>
    </div>
  )
}

export default CreateVapiConversation