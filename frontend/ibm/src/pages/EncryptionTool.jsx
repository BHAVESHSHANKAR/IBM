import { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import PasswordField from '../components/PasswordField';

const EncryptionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
  
  h1 {
    color: #152935;
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: 600;
  }
  
  p.intro {
    color: #5a6872;
    margin-bottom: 2rem;
    font-size: 1.05rem;
    max-width: 800px;
    line-height: 1.6;
  }
`;

const Form = styled.form`
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #0f62fe 0%, #0043ce 100%);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.8rem;
  
  label {
    display: block;
    margin-bottom: 0.7rem;
    font-weight: 500;
    color: #152935;
    font-size: 1.05rem;
  }
  
  select, input, textarea {
    width: 100%;
    padding: 0.9rem 1rem;
    border: 1px solid #dfe3e6;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #0f62fe;
      box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.15);
    }
    
    &:hover:not(:focus) {
      border-color: #b3bac5;
    }
  }
  
  textarea {
    min-height: 150px;
    resize: vertical;
    line-height: 1.5;
  }
  
  .hint {
    font-size: 0.85rem;
    color: #6f6f6f;
    margin-top: 0.5rem;
  }
`;

const Button = styled.button`
  background-color: #0f62fe;
  background-image: linear-gradient(90deg, #0f62fe 0%, #0043ce 100%);
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #0353e9;
    background-image: linear-gradient(90deg, #0353e9 0%, #0035b5 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(15, 98, 254, 0.25);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(15, 98, 254, 0.2);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.3);
  }
  
  &:disabled {
    background-color: #8d8d8d;
    background-image: none;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ResultBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #24a148 0%, #1a9c40 100%);
  }
  
  h2 {
    color: #152935;
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.75rem;
      color: #24a148;
    }
  }
  
  pre {
    background-color: #f4f7fb;
    padding: 1.2rem;
    border-radius: 8px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
    border: 1px solid #e0e0e0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
  }
  
  .copy-btn {
    background-color: transparent;
    color: #0f62fe;
    border: 1px solid #0f62fe;
    padding: 0.7rem 1.2rem;
    border-radius: 8px;
    margin-top: 1.2rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
    
    &:hover {
      background-color: #e8f1ff;
      transform: translateY(-2px);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.2);
    }
  }
  
  .info-text {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #f4f7fb;
    border-left: 4px solid #0f62fe;
    border-radius: 4px;
    color: #5a6872;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const Alert = styled.div`
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.8rem;
  background-color: ${props => props.type === 'error' ? '#fff1f1' : '#e4f3ff'};
  border-left: 4px solid ${props => props.type === 'error' ? '#da1e28' : '#0f62fe'};
  color: ${props => props.type === 'error' ? '#da1e28' : '#0043ce'};
  display: flex;
  align-items: flex-start;
  
  svg {
    min-width: 20px;
    margin-right: 0.75rem;
    margin-top: 0.2rem;
  }
  
  .alert-message {
    flex: 1;
  }
`;

const EncryptionTool = () => {
  const [formData, setFormData] = useState({
    data: '',
    algorithm: '',
    password: ''
  });
  
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await api.getAlgorithms();
        setAlgorithms(response.algorithms);
        
        // Set default algorithm if available
        if (response.algorithms.length > 0) {
          setFormData(prev => ({
            ...prev,
            algorithm: response.algorithms[0].value
          }));
        }
      } catch (error) {
        setError('Failed to fetch encryption algorithms');
        console.error(error);
      }
    };
    
    fetchAlgorithms();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.data) {
        throw new Error('Please enter data to encrypt');
      }
      
      if (!formData.algorithm) {
        throw new Error('Please select an encryption algorithm');
      }
      
      if (!formData.password) {
        throw new Error('Please enter a password for encryption');
      }
      
      const result = await api.encryptData(
        formData.data,
        formData.algorithm,
        formData.password
      );
      
      setResult(result);
    } catch (error) {
      setError(error.message || 'Failed to encrypt data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      .then(() => alert('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  };
  
  return (
    <EncryptionContainer>
      <h1>Encrypt Data</h1>
      <p className="intro">
        Securely encrypt your sensitive information using industry-standard algorithms. 
        The encrypted output can only be decrypted with the correct key and parameters.
      </p>
      
      <Form onSubmit={handleSubmit}>
        {error && (
          <Alert type="error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <span className="alert-message">{error}</span>
          </Alert>
        )}
        
        <FormGroup>
          <label htmlFor="data">Data to Encrypt</label>
          <textarea
            id="data"
            name="data"
            placeholder="Enter the text you want to encrypt"
            value={formData.data}
            onChange={handleChange}
            required
          />
          <div className="hint">The text entered here will be encrypted with your chosen algorithm and password.</div>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="algorithm">Encryption Algorithm</label>
          <select
            id="algorithm"
            name="algorithm"
            value={formData.algorithm}
            onChange={handleChange}
            required
          >
            {algorithms.map(algo => (
              <option key={algo.id} value={algo.value}>
                {algo.name}
              </option>
            ))}
          </select>
          <div className="hint">AES is an industry standard encryption algorithm. GCM mode provides both encryption and authentication.</div>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="password">Password</label>
          <PasswordField
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a strong password"
            required
          />
          <div className="hint">Use a strong password with mixed characters, numbers, and symbols</div>
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
              Encrypting...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              Encrypt Data
            </>
          )}
        </Button>
      </Form>
      
      {result && (
        <ResultBox>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            Encryption Result
          </h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <button className="copy-btn" onClick={copyToClipboard}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy to Clipboard
          </button>
          <div className="info-text">
            <strong>Important:</strong> Save all these details securely. You will need the encrypted data, IV, salt, algorithm and password to decrypt this information. The auth tag is required for GCM mode algorithms.
          </div>
        </ResultBox>
      )}
    </EncryptionContainer>
  );
};

export default EncryptionTool; 