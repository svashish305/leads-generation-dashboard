import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LeadPage from './pages/LeadPage';

function App() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <Route
            path="/"
            element={<Navigate to={`/leads/${userId}`} />}
          />
        ) : (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/leads/:userId" element={<LeadPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
