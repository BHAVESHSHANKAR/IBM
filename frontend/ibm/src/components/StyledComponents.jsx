import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Page Containers
export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;
  
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

// Card components
export const Card = styled.div`
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

// Forms
export const Form = styled.form`
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.5s ease;
  
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

export const FormGroup = styled.div`
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

// Buttons
export const Button = styled.button`
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

export const OutlineButton = styled(Button)`
  background: transparent;
  background-image: none;
  color: #0f62fe;
  border: 2px solid #0f62fe;
  
  &:hover {
    background-color: #e8f1ff;
    background-image: none;
  }
`;

export const StyledLink = styled(Link)`
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

// Results and content boxes
export const ResultBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  animation: slideIn 0.5s ease;
  
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
`;

export const ContentTable = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  
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

// Alerts
export const Alert = styled.div`
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.8rem;
  background-color: ${props => {
    switch(props.type) {
      case 'error': return '#fff1f1';
      case 'warning': return '#fff8e1';
      case 'success': return '#f1f8f4';
      default: return '#e4f3ff';
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.type) {
      case 'error': return '#da1e28';
      case 'warning': return '#f1c21b';
      case 'success': return '#24a148';
      default: return '#0f62fe';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'error': return '#da1e28';
      case 'warning': return '#a56c00';
      case 'success': return '#24a148';
      default: return '#0043ce';
    }
  }};
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

// Layout helpers
export const FlexContainer = styled.div`
  display: flex;
  gap: ${props => props.gap || '1rem'};
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  > * {
    flex: ${props => props.equalWidth ? '1' : 'auto'};
  }
  
  @media (max-width: 768px) {
    flex-direction: ${props => props.mobileDirection || 'column'};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.minWidth || '320px'}, 1fr));
  gap: ${props => props.gap || '2rem'};
  margin-bottom: ${props => props.marginBottom || '2rem'};
`;

export const InfoText = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f4f7fb;
  border-left: 4px solid ${props => props.color || '#0f62fe'};
  border-radius: 4px;
  color: #5a6872;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const Spinner = () => (
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
); 