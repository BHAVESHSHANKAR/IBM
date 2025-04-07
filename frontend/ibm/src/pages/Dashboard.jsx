import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const DashboardContainer = styled.div`
  padding-bottom: 2rem;
  
  h1 {
    color: #152935;
    margin-bottom: 1rem;
    font-size: 2.2rem;
    font-weight: 600;
  }
  
  p.intro {
    color: #5a6872;
    margin-bottom: 2.5rem;
    font-size: 1.1rem;
    max-width: 800px;
    line-height: 1.6;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.online ? '#defbe6' : '#fff1f1'};
  color: ${props => props.online ? '#0e6027' : '#a2191f'};
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 1rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.online ? '#24a148' : '#da1e28'};
    margin-right: 6px;
  }
`;

const InfoCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  border-top: 4px solid ${props => props.color || '#0f62fe'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
  
  h2 {
    color: #152935;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.75rem;
      color: ${props => props.color || '#0f62fe'};
    }
  }
  
  p {
    color: #5a6872;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.primary ? '#0f62fe' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#0f62fe'};
  border: 2px solid #0f62fe;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#0353e9' : '#e8f1ff'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(15, 98, 254, 0.15);
  }
  
  svg {
    margin-left: 0.5rem;
    font-size: 1rem;
  }
`;

const AlgorithmTable = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow-x: auto;
  
  h2 {
    color: #152935;
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 1.2rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    th {
      background-color: #f4f7fb;
      color: #152935;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:hover td {
      background-color: #f4f7fb;
    }
    
    td:first-child {
      font-weight: 500;
      color: #0f62fe;
    }
  }
`;

const StatusIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: ${props => props.active ? '#24a148' : '#dfe3e6'};
  border-radius: 50%;
  margin-right: 8px;
`;

const Dashboard = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch algorithms
        const { algorithms } = await api.getAlgorithms();
        setAlgorithms(algorithms);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <DashboardContainer>
      <h1>
        Data Encryption Assessment
      </h1>
      <p className="intro">
        A comprehensive tool for encrypting and decrypting sensitive data. 
        Use our interactive tools to secure your text and files with strong encryption algorithms.
        This tool is completely public and does not require authentication.
      </p>
      
      <InfoCards>
        <Card color="#0f62fe">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            Text Encryption
          </h2>
          <p>Encrypt your sensitive text data using various encryption algorithms with different key sizes and modes for maximum security.</p>
          <StyledLink to="/encrypt" primary>
            Encrypt Text
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </StyledLink>
        </Card>
        
        <Card color="#6929c4">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
            </svg>
            Text Decryption
          </h2>
          <p>Decrypt your previously encrypted text with the correct key and algorithm. Requires the original encryption parameters.</p>
          <StyledLink to="/decrypt" primary>
            Decrypt Text
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </StyledLink>
        </Card>
        
        <Card color="#1192e8">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1-9h-2V3h2v6z"/>
            </svg>
            File Encryption
          </h2>
          <p>Securely encrypt and decrypt files of various formats. Protect sensitive documents, images, and other file types with strong encryption.</p>
          <StyledLink to="/file-encryption" primary>
            Encrypt Files
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </StyledLink>
        </Card>
      </InfoCards>
      
      <AlgorithmTable>
        <h2>Available Encryption Algorithms</h2>
        {loading ? (
          <p>Loading algorithms...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Description</th>
                <th>Key Size</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map(algo => (
                <tr key={algo.id}>
                  <td>{algo.name}</td>
                  <td>
                    {algo.value.includes('aes') ? 'Advanced Encryption Standard' : 'Encryption Algorithm'}
                    {algo.value.includes('gcm') ? ' with Galois/Counter Mode' : ''}
                    {algo.value.includes('cbc') ? ' with Cipher Block Chaining Mode' : ''}
                  </td>
                  <td>{algo.value.includes('256') ? '256 bits' : algo.value.includes('192') ? '192 bits' : '128 bits'}</td>
                  <td>{algo.value.includes('gcm') ? 'GCM (Authenticated)' : 'CBC'}</td>
                  <td>
                    <StatusIndicator active={true} />
                    Available
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AlgorithmTable>
    </DashboardContainer>
  );
};

export default Dashboard; 