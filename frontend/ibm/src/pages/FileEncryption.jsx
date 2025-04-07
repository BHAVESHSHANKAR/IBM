import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import PasswordField from '../components/PasswordField';

const FileEncryptionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
  
  h1 {
    color: #152935;
    margin-bottom: 1rem;
    font-size: 2.2rem;
    font-weight: 600;
  }
  
  p.intro {
    color: #5a6872;
    margin-bottom: 2rem;
    font-size: 1.05rem;
    max-width: 800px;
    line-height: 1.6;
  }
  
  .tabs {
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 1px solid #dfe3e6;
  }
  
  .tab {
    padding: 1rem 1.5rem;
    cursor: pointer;
    font-weight: 500;
    color: #525252;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;
    
    &:hover {
      color: #0f62fe;
    }
    
    &.active {
      color: #0f62fe;
      border-bottom-color: #0f62fe;
    }
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
    background: linear-gradient(90deg, 
      ${props => props.isEncrypt ? '#0f62fe 0%, #0043ce 100%' : '#6929c4 0%, #491d8b 100%'}
    );
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
  
  select, input {
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

const FileInputWrapper = styled.div`
  border: 2px dashed #dfe3e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: #0f62fe;
    background-color: #f1f7ff;
  }
  
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }
  
  .file-icon {
    font-size: 2.5rem;
    color: #0f62fe;
    margin-bottom: 1rem;
  }
  
  p {
    margin: 0;
    color: #152935;
    font-weight: 500;
  }
  
  .file-hint {
    margin-top: 0.5rem;
    color: #6f6f6f;
    font-size: 0.9rem;
  }
  
  .file-selected {
    margin-top: 1rem;
    font-weight: 500;
    color: #24a148;
  }
`;

const Button = styled.button`
  background-color: ${props => props.isEncrypt ? '#0f62fe' : '#6929c4'};
  background-image: linear-gradient(90deg, 
    ${props => props.isEncrypt ? '#0f62fe 0%, #0043ce 100%' : '#6929c4 0%, #491d8b 100%'}
  );
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
    background-color: ${props => props.isEncrypt ? '#0353e9' : '#5821a7'};
    background-image: linear-gradient(90deg, 
      ${props => props.isEncrypt ? '#0353e9 0%, #0035b5 100%' : '#5821a7 0%, #40197b 100%'}
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(${props => props.isEncrypt ? '15, 98, 254' : '105, 41, 196'}, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(${props => props.isEncrypt ? '15, 98, 254' : '105, 41, 196'}, 0.2);
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
  
  .result-info {
    background-color: #f4f7fb;
    padding: 1.2rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #e0e0e0;
    
    .info-item {
      margin-bottom: 1rem;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        font-weight: 500;
        margin-bottom: 0.3rem;
        color: #152935;
      }
      
      .value {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.9rem;
        word-break: break-all;
      }
    }
  }
  
  .download-btn {
    background-color: #0f62fe;
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
    
    svg {
      margin-right: 0.75rem;
    }
    
    &:hover {
      background-color: #0353e9;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(15, 98, 254, 0.3);
    }
  }
`;

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #dfe3e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  resize: vertical;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #0f62fe;
    box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: #b3bac5;
  }
`;

const FileEncryption = () => {
  const [activeTab, setActiveTab] = useState('encrypt');
  const [algorithms, setAlgorithms] = useState([]);
  const [fileType, setFileType] = useState('document');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    algorithm: '',
    password: '',
    encryptionParams: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [result, setResult] = useState(null);
  
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await api.getAlgorithms();
        setAlgorithms(response.algorithms);
        
        // Set default algorithm to AES-256-CBC if available
        const defaultAlgo = response.algorithms.find(a => a.value === 'aes-256-cbc') || response.algorithms[0];
        if (defaultAlgo) {
          setFormData(prev => ({
            ...prev,
            algorithm: defaultAlgo.value
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
  
  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
    setFile(null);
    
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type based on selected category
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      
      if (fileType === 'document') {
        const validDocumentTypes = ['pdf', 'doc', 'docx', 'txt'];
        if (!validDocumentTypes.includes(fileExtension)) {
          setError('Invalid file type');
          setErrorDetails('Please select a document file (PDF, DOC, DOCX, or TXT)');
          return;
        }
      } else if (fileType === 'image') {
        const validImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (!validImageTypes.includes(fileExtension)) {
          setError('Invalid file type');
          setErrorDetails('Please select an image file (JPG, PNG, or GIF)');
          return;
        }
      }
      
      setFile(selectedFile);
      setError('');
      setErrorDetails('');
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFile(null);
    
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Preserve the encryption parameters when switching tabs
    setFormData({
      algorithm: formData.algorithm,
      password: '',
      encryptionParams: formData.encryptionParams // Keep the encryption parameters
    });
    setError('');
    setErrorDetails('');
    setResult(null);
  };
  
  const handleEncryptionParamsChange = (e) => {
    try {
      // Store the raw string value instead of trying to parse it
      setFormData(prev => ({
        ...prev,
        encryptionParams: e.target.value
      }));
      setError('');
      setErrorDetails('');
    } catch (error) {
      setError('Invalid JSON format');
      setErrorDetails('Please ensure you provide valid JSON for the encryption parameters');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!file) {
        throw new Error('Please select a file');
      }
      
      if (activeTab === 'encrypt' && !formData.algorithm) {
        throw new Error('Please select an encryption algorithm');
      }
      
      if (!formData.password) {
        throw new Error('Please enter a password');
      }

      if (activeTab === 'encrypt') {
        const response = await api.encryptFile(file, formData.algorithm, formData.password);
        
        // Check if the response contains an error
        if (response.data instanceof Blob && response.data.size < 1000) {
          // This might be an error response
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              throw new Error(errorData.error || 'Encryption failed');
            } catch (e) {
              // If it's not JSON, it's probably a real file
              // Continue with the download
              downloadFile(response.data, `encrypted-${file.name}`);
            }
          };
          reader.readAsText(response.data);
          return;
        }
        
        // Get encryption parameters from response headers
        let encryptionParams = null;
        try {
          const paramsHeader = response.headers['x-encryption-params'];
          if (paramsHeader) {
            encryptionParams = JSON.parse(paramsHeader);
          } else {
            // If no encryption params in headers, create a default one
            encryptionParams = {
              algorithm: formData.algorithm,
              iv: "Generated during encryption",
              salt: "Generated during encryption"
            };
          }
        } catch (e) {
          console.error('Error parsing encryption parameters:', e);
          // Create a default encryption params object
          encryptionParams = {
            algorithm: formData.algorithm,
            iv: "Generated during encryption",
            salt: "Generated during encryption"
          };
        }
        
        // Download the file
        downloadFile(response.data, `encrypted-${file.name}`);
        
        setResult({
          message: 'File encrypted successfully',
          encryptionParams
        });
      } else {
        // For decryption, just pass the algorithm and password
        const response = await api.decryptFile(file, formData.password, formData.algorithm);
        
        // Check if the response contains an error
        if (response.data instanceof Blob && response.data.size < 1000) {
          // This might be an error response
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              throw new Error(errorData.error || 'Decryption failed');
            } catch (e) {
              // If it's not JSON, it's probably a real file
              // Continue with the download
              downloadFile(response.data, `decrypted-${file.name}`);
            }
          };
          reader.readAsText(response.data);
          return;
        }
        
        // Download the file
        downloadFile(response.data, `decrypted-${file.name}`);
        
        setResult({
          message: 'File decrypted successfully'
        });
      }
    } catch (error) {
      console.error('File operation error:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <FileEncryptionContainer>
      <h1>File Encryption</h1>
      <p className="intro">
        Securely encrypt and decrypt files using strong encryption algorithms. 
        Protect your sensitive documents, images, and other files with password-based encryption.
      </p>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'encrypt' ? 'active' : ''}`}
          onClick={() => handleTabChange('encrypt')}
        >
          Encrypt File
        </div>
        <div 
          className={`tab ${activeTab === 'decrypt' ? 'active' : ''}`}
          onClick={() => handleTabChange('decrypt')}
        >
          Decrypt File
        </div>
      </div>
      
      {error && (
        <Alert type="error">
          <ErrorIcon />
          <div className="alert-content">
            <div className="alert-title">{error}</div>
            {errorDetails && <p className="alert-message">{errorDetails}</p>}
          </div>
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit} isEncrypt={activeTab === 'encrypt'}>
        <FormGroup className="required">
          <label htmlFor="fileType">File Type</label>
          <select
            id="fileType"
            name="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
            required
          >
            <option value="document">Document (PDF, DOC, DOCX, TXT)</option>
            <option value="image">Image (JPG, PNG, GIF)</option>
          </select>
          <div className="hint">
            Select the type of file you want to {activeTab}
          </div>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="file">Select File</label>
          <FileInputWrapper>
            <input 
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={fileType === 'document' ? '.pdf,.doc,.docx,.txt' : '.jpg,.jpeg,.png,.gif'}
              required
            />
            <div className="file-icon">📁</div>
            <p>Click to select a file or drag and drop</p>
            <div className="file-hint">
              {activeTab === 'encrypt' 
                ? `Select a ${fileType} file to encrypt` 
                : `Select an encrypted ${fileType} file to decrypt`}
            </div>
            {file && (
              <div className="file-selected">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </FileInputWrapper>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="algorithm">Encryption Algorithm</label>
          <select
            id="algorithm"
            name="algorithm"
            value={formData.algorithm}
            onChange={handleChange}
            required
            disabled={activeTab === 'decrypt'}
          >
            <option value="">Select algorithm</option>
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.value}>
                {algo.name}
              </option>
            ))}
          </select>
          <div className="hint">
            {activeTab === 'encrypt'
              ? 'AES-256-CBC is recommended for best security'
              : 'Algorithm will be determined automatically'}
          </div>
        </FormGroup>
        
        <FormGroup className="required">
          <label htmlFor="password">Password</label>
          <PasswordField
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={activeTab === 'encrypt' ? "Enter a strong password" : "Enter the decryption password"}
            required
          />
          <div className="hint">
            {activeTab === 'encrypt'
              ? 'Use a strong password with mixed characters, numbers, and symbols'
              : 'Enter the same password used during encryption'}
          </div>
        </FormGroup>
        
        {activeTab === 'decrypt' && (
          <FormGroup className="required">
            <label htmlFor="algorithm">Decryption Algorithm</label>
            <select
              id="algorithm"
              name="algorithm"
              value={formData.algorithm}
              onChange={handleChange}
              required
            >
              <option value="">Select algorithm</option>
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.value}>
                  {algo.name}
                </option>
              ))}
            </select>
            <div className="hint">
              Select the same algorithm used during encryption
            </div>
          </FormGroup>
        )}
        
        <Button type="submit" disabled={loading} isEncrypt={activeTab === 'encrypt'}>
          {loading ? 'Processing...' : activeTab === 'encrypt' ? 'Encrypt File' : 'Decrypt File'}
        </Button>
      </Form>
      
      {result && (
        <ResultBox>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            {result.message}
          </h2>
          
          {result.encryptionParams && (
            <div className="result-info">
              <div className="info-item">
                <div className="label">Encryption Algorithm:</div>
                <div className="value">
                  <strong>{result.encryptionParams.algorithm}</strong>
                </div>
                <div className="note">
                  When decrypting this file, select the same algorithm and use the same password.
                </div>
              </div>
            </div>
          )}
        </ResultBox>
      )}
    </FileEncryptionContainer>
  );
};

export default FileEncryption; 