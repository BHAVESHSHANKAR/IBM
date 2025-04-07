import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with error handling
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Helper function to dispatch global errors
const dispatchGlobalError = (message) => {
  window.dispatchEvent(new CustomEvent('api-error', { 
    detail: { message }
  }));
};

// Add error interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.error || 
                         error.response?.data?.details || 
                         error.message || 
                         'Unknown error occurred';
    
    console.error('API Error:', errorMessage, error);
    
    // Dispatch global error event
    dispatchGlobalError(errorMessage);
    
    throw new Error(errorMessage);
  }
);

const api = {
  // Get all available encryption algorithms
  getAlgorithms: async () => {
    try {
      const response = await apiClient.get('/algorithms');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch algorithms:', error);
      throw error;
    }
  },
  
  // Encrypt data
  encryptData: async (data, algorithm, password) => {
    try {
      const response = await apiClient.post('/encrypt', {
        data,
        algorithm,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  },
  
  // Decrypt data
  decryptData: async (encryptedData, iv, salt, algorithm, password) => {
    try {
      const response = await apiClient.post('/decrypt', {
        encryptedData,
        iv,
        salt,
        algorithm,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  },
  
  // Benchmark encryption algorithm
  benchmarkAlgorithm: async (algorithm, dataSize) => {
    try {
      const response = await apiClient.post('/benchmark', {
        algorithm,
        dataSize
      });
      return response.data;
    } catch (error) {
      console.error('Benchmark failed:', error);
      throw error;
    }
  },
  
  // Assess encryption security
  assessSecurity: async (algorithm, keySize, purpose) => {
    try {
      const response = await apiClient.post('/assess', {
        algorithm,
        keySize,
        purpose
      });
      return response.data;
    } catch (error) {
      console.error('Assessment failed:', error);
      throw error;
    }
  },
  
  // Encrypt file
  encryptFile: async (file, algorithm, password) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('algorithm', algorithm);
      formData.append('password', password);
      
      const response = await apiClient.post('/encrypt-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });
      
      return {
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      console.error('File encryption failed:', error);
      throw error;
    }
  },
  
  // Decrypt file
  decryptFile: async (file, password, algorithm) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);
      formData.append('algorithm', algorithm);
      
      const response = await apiClient.post('/decrypt-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });
      
      return response;
    } catch (error) {
      console.error('Error decrypting file:', error);
      throw error;
    }
  }
};

export default api; 