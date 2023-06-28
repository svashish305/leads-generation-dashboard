import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import LeadPage from './pages/LeadPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/leads/:userId' element={<LeadPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
