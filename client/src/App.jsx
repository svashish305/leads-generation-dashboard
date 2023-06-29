import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LeadPage from './pages/LeadPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/leads/:userId' element={<LeadPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
