import { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import PasswordField from '../components/PasswordField';

const DecryptionContainer = styled.div`
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
    background: linear-gradient(90deg, #6929c4 0%, #491d8b 100%);
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
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    line-height: 1.5;
  }
  
  .hint {
    font-size: 0.85rem;
    color: #6f6f6f;
    margin-top: 0.5rem;
  }
  
  &.required label::after {
    content: " *";
    color: #da1e28;
  }
`;

const Button = styled.button`
  background-color: #6929c4;
  background-image: linear-gradient(90deg, #6929c4 0%, #491d8b 100%);
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
    background-color: #5821a7;
    background-image: linear-gradient(90deg, #5821a7 0%, #40197b 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(105, 41, 196, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(105, 41, 196, 0.2);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(105, 41, 196, 0.3);
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
  }
`;

const Alert = styled.div`
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.8rem;
  background-color: ${props => {
    switch(props.type) {
      case 'error': return '#fff1f1';
      case 'warning': return '#fff7e6';
      case 'info': return '#edf5ff';
      case 'success': return '#defbe6';
      default: return '#edf5ff';
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.type) {
      case 'error': return '#da1e28';
      case 'warning': return '#ff832b';
      case 'info': return '#0043ce';
      case 'success': return '#24a148';
      default: return '#0043ce';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'error': return '#a2191f';
      case 'warning': return '#c45500';
      case 'info': return '#0043ce';
      case 'success': return '#0e6027';
      default: return '#0043ce';
    }
  }};
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 0.75rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
  
  .alert-content {
    flex: 1;
    
    .alert-title {
      font-weight: 600;
      margin-bottom: 0.3rem;
    }
    
    .alert-message {
      margin: 0;
    }
  }
`;

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const DecryptionTool = () => {
  const [formData, setFormData] = useState({
    encryptedData: '',
    iv: '',
    salt: '',
    algorithm: '',
    password: ''
  });
  
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
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
    
    // Clear errors when user makes changes
    setError('');
    setErrorDetails('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorDetails('');
    setResult(null);
    
    try {
      // Validate required fields
      if (!formData.encryptedData) {
        throw new Error('Please enter the encrypted data');
      }
      
      if (!formData.iv) {
        throw new Error('Please enter the initialization vector (IV)');
      }
      
      if (!formData.salt) {
        throw new Error('Please enter the salt value');
      }
      
      if (!formData.algorithm) {
        throw new Error('Please select a decryption algorithm');
      }
      
      if (!formData.password) {
        throw new Error('Please enter your decryption password');
      }
      
      // Remove base64 validation to avoid false positives
      // The server will validate the format properly
      
      const result = await api.decryptData(
        formData.encryptedData,
        formData.iv,
        formData.salt,
        formData.algorithm,
        formData.password
      );
      
      setResult(result);
    } catch (error) {
      console.error('Decryption error:', error);
      
      // Handle structured error responses with more specific handling
      if (error.message.includes('Padding error')) {
        setError('Decryption Failed - Incorrect Password');
        setErrorDetails('The padding of the decrypted data is invalid. This typically means the password you provided is incorrect.');
      }
      else if (error.message.includes('Invalid IV length')) {
        setError('Invalid Parameters');
        setErrorDetails('The IV has an incorrect length. Make sure you copied the entire string from the encryption result.');
      }
      else if (error.message.includes('Invalid base64')) {
        setError('Invalid Format');
        setErrorDetails('One or more parameters contain invalid base64 encoding. Make sure you copied the entire values without modifications.');
      }
      else {
        setError(error.message || 'Failed to decrypt data');
        if (error.details) {
          setErrorDetails(error.details);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (result && result.decryptedData) {
      navigator.clipboard.writeText(result.decryptedData)
        .then(() => {
          alert('Decrypted data copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  return (
    <DecryptionContainer>
      <h1>Decrypt Your Data</h1>
      <p className="intro">
        Decrypt previously encrypted data using the same algorithm and parameters. 
        You'll need the encrypted data, initialization vector (IV), salt, and password. 
        For GCM mode algorithms, you'll also need the authentication tag.
      </p>
      
      {error && (
        <Alert type="error">
          <ErrorIcon />
          <div className="alert-content">
            <div className="alert-title">{error}</div>
            {errorDetails && <p className="alert-message">{errorDetails}</p>}
          </div>
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup className="required">
          <label htmlFor="encryptedData">Encrypted Data</label>
          <textarea
            id="encryptedData"
            name="encryptedData"
            value={formData.encryptedData}
            onChange={handleChange}
            placeholder="Paste your base64 encoded encrypted data here"
            required
          />
          <div className="hint">Base64 encoded encrypted data from the encryption process</div>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="iv">Initialization Vector (IV)</label>
          <input
            type="text"
            id="iv"
            name="iv"
            value={formData.iv}
            onChange={handleChange}
            placeholder="Enter the base64 encoded IV"
            required
          />
          <div className="hint">Base64 encoded initialization vector from the encryption process</div>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="salt">Salt</label>
          <input
            type="text"
            id="salt"
            name="salt"
            value={formData.salt}
            onChange={handleChange}
            placeholder="Enter the base64 encoded salt"
            required
          />
          <div className="hint">Base64 encoded salt from the encryption process</div>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="algorithm">Decryption Algorithm</label>
          <select
            id="algorithm"
            name="algorithm"
            value={formData.algorithm}
            onChange={handleChange}
            required
          >
            <option value="">Select an algorithm</option>
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.value}>
                {algo.name}
              </option>
            ))}
          </select>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="password">Password</label>
          <PasswordField
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your decryption password"
            required
          />
          <div className="hint">The same password used during encryption</div>
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Decrypting...' : 'Decrypt Data'}
        </Button>
      </Form>
      
      {result && result.decryptedData && (
        <ResultBox>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            Decryption Result
          </h2>
          <pre>{result.decryptedData}</pre>
          <button className="copy-btn" onClick={copyToClipboard}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy to Clipboard
          </button>
        </ResultBox>
      )}
    </DecryptionContainer>
  );
};

export default DecryptionTool; 