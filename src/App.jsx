import { Routes, Route } from "react-router-dom"
import Page from "./pages/page.jsx"
import About from "./pages/About.jsx"
import Signup from "./pages/Signup.jsx"
import NotFound from "./pages/NotFound.jsx"
import CreateVapiConversation from "./pages/create-vapi-conversation.jsx"
import ViewVapiConversation from "./pages/view-vapi-conversation.jsx"
import Insights from "./pages/insights.jsx"
import "./css/app.css"
import "./css/global.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/about" element={<About />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create" element={<CreateVapiConversation />} />
      <Route path="/view/:id" element={<ViewVapiConversation />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

