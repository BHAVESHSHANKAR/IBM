import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import './App.css'

// Components
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import EncryptionTool from './pages/EncryptionTool'
import DecryptionTool from './pages/DecryptionTool'
import FileEncryption from './pages/FileEncryption'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f0f4f8;
  overflow: hidden;
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
  height: calc(100vh - 64px); /* Adjust for header height */
  overflow: hidden;
`

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  margin-left: ${props => props.sidebarOpen ? '250px' : '0'};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-left: 0;
  }
  
  & > div {
    max-width: 1600px;
    margin: 0 auto;
  }
`

const ErrorBanner = styled.div`
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #da1e28;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  z-index: 1100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  max-width: 90%;
  
  button {
    background: none;
    border: none;
    color: white;
    margin-left: 12px;
    cursor: pointer;
    font-size: 18px;
  }
`;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  
  // Set up global error handler
  useEffect(() => {
    const handleGlobalError = (event) => {
      if (event.detail && event.detail.message) {
        setGlobalError(event.detail.message);
        // Auto-clear error after 8 seconds
        setTimeout(() => setGlobalError(null), 8000);
      }
    };
    
    window.addEventListener('api-error', handleGlobalError);
    
    return () => {
      window.removeEventListener('api-error', handleGlobalError);
    };
  }, []);
  
  return (
    <Router>
      <AppContainer>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {globalError && (
          <ErrorBanner>
            {globalError}
            <button onClick={() => setGlobalError(null)}>×</button>
          </ErrorBanner>
        )}
        <ContentContainer>
          <Sidebar isOpen={sidebarOpen} />
          <MainContent sidebarOpen={sidebarOpen}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/encrypt" element={<EncryptionTool />} />
              <Route path="/decrypt" element={<DecryptionTool />} />
              <Route path="/file-encryption" element={<FileEncryption />} />
            </Routes>
          </MainContent>
        </ContentContainer>
      </AppContainer>
    </Router>
  )
}

export default App
