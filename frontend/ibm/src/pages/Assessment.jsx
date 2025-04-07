import { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const AssessmentContainer = styled.div`
  h1 {
    color: #152935;
    margin-bottom: 2rem;
  }
`;

const Form = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #152935;
  }
  
  select, input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dfe3e6;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #0f62fe;
      box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.2);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const Button = styled.button`
  background-color: #0f62fe;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0353e9;
  }
  
  &:disabled {
    background-color: #8d8d8d;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h2 {
    color: #152935;
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
`;

const ScoreBar = styled.div`
  margin: 2rem 0;
  
  .score-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    span {
      font-weight: 600;
    }
  }
  
  .bar-container {
    height: 1.5rem;
    background-color: #f4f7fb;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    background-color: ${props => {
      if (props.score >= 8) return '#24a148';
      if (props.score >= 5) return '#f1c21b';
      return '#da1e28';
    }};
    width: ${props => (props.score / 10) * 100}%;
    transition: width 0.5s ease;
  }
`;

const ListSection = styled.div`
  margin-top: 1.5rem;
  
  h3 {
    color: #152935;
    margin-bottom: 1rem;
  }
  
  ul {
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: #5a6872;
    }
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  background-color: ${props => props.type === 'error' ? '#ffd7d9' : '#d0e2ff'};
  color: ${props => props.type === 'error' ? '#da1e28' : '#0043ce'};
`;

const Assessment = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [formData, setFormData] = useState({
    algorithm: '',
    keySize: '256',
    purpose: ''
  });
  
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
      if (!formData.algorithm) {
        throw new Error('Please select an encryption algorithm');
      }
      
      if (!formData.purpose) {
        throw new Error('Please describe your encryption purpose');
      }
      
      const result = await api.assessSecurity(
        formData.algorithm,
        formData.keySize,
        formData.purpose
      );
      
      setResult(result);
    } catch (error) {
      setError(error.message || 'Assessment failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const getScoreLabel = (score) => {
    if (score >= 8) return 'Strong';
    if (score >= 5) return 'Moderate';
    return 'Weak';
  };
  
  return (
    <AssessmentContainer>
      <h1>Encryption Security Assessment</h1>
      
      <Form onSubmit={handleSubmit}>
        {error && <Alert type="error">{error}</Alert>}
        
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
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="keySize">Key Size (bits)</label>
          <select
            id="keySize"
            name="keySize"
            value={formData.keySize}
            onChange={handleChange}
            required
          >
            <option value="128">128 bits</option>
            <option value="192">192 bits</option>
            <option value="256">256 bits</option>
          </select>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="purpose">What are you using encryption for?</label>
          <textarea
            id="purpose"
            name="purpose"
            placeholder="Describe your use case (e.g., storing sensitive user data, secure communications, etc.)"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Assessing...' : 'Assess Security'}
        </Button>
      </Form>
      
      {result && (
        <ResultBox>
          <h2>Security Assessment</h2>
          
          <ScoreBar score={result.score}>
            <div className="score-label">
              <span>Security Score</span>
              <span>{result.score}/10 ({getScoreLabel(result.score)})</span>
            </div>
            <div className="bar-container">
              <div className="bar-fill" />
            </div>
          </ScoreBar>
          
          <ListSection>
            <h3>Strengths</h3>
            {result.strengths.length > 0 ? (
              <ul>
                {result.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            ) : (
              <p>No specific strengths identified.</p>
            )}
          </ListSection>
          
          <ListSection>
            <h3>Weaknesses</h3>
            {result.weaknesses.length > 0 ? (
              <ul>
                {result.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            ) : (
              <p>No significant weaknesses identified.</p>
            )}
          </ListSection>
          
          <ListSection>
            <h3>Recommendations</h3>
            {result.recommendations.length > 0 ? (
              <ul>
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p>No specific recommendations at this time.</p>
            )}
          </ListSection>
          
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f4f7fb', borderRadius: '4px' }}>
            <h3>Summary</h3>
            <p>
              {result.score >= 8 ? (
                'This encryption method provides strong security for your use case.'
              ) : result.score >= 5 ? (
                'This encryption method provides moderate security. Consider the recommendations to improve security.'
              ) : (
                'This encryption method may not provide adequate security for your use case. Review the recommendations.'
              )}
            </p>
          </div>
        </ResultBox>
      )}
    </AssessmentContainer>
  );
};

export default Assessment; 