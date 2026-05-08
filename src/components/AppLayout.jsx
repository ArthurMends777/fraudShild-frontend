import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Chatbot from './Chatbot'
import './AppLayout.css'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  )
}
