import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LeadPage from './pages/LeadPage';
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/leads/:userId' element={<LeadPage />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )
}

export default App
