import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import LeadPage from './pages/LeadPage/LeadPage';
import './App.css';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/leads/:userId" element={<LeadPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
