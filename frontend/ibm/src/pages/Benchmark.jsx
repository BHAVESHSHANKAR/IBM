import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BenchmarkContainer = styled.div`
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
  
  select, input {
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
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  > div {
    flex: 1;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
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

const ResultsContainer = styled.div`
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

const ChartContainer = styled.div`
  margin-top: 2rem;
  height: 400px;
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    background-color: #f4f7fb;
    color: #152935;
    font-weight: 600;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover td {
    background-color: #f4f7fb;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  background-color: ${props => props.type === 'error' ? '#ffd7d9' : '#d0e2ff'};
  color: ${props => props.type === 'error' ? '#da1e28' : '#0043ce'};
`;

const Benchmark = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [dataSize, setDataSize] = useState(1024); // Default 1KB
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await api.getAlgorithms();
        setAlgorithms(response.algorithms);
      } catch (error) {
        setError('Failed to fetch encryption algorithms');
        console.error(error);
      }
    };
    
    fetchAlgorithms();
  }, []);
  
  const handleAlgorithmChange = (e) => {
    const options = e.target.options;
    const selected = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    
    setSelectedAlgorithms(selected);
  };
  
  const handleDataSizeChange = (e) => {
    setDataSize(parseInt(e.target.value));
  };
  
  const runBenchmark = async (e) => {
    e.preventDefault();
    
    if (selectedAlgorithms.length === 0) {
      setError('Please select at least one algorithm');
      return;
    }
    
    setLoading(true);
    setError('');
    const benchmarkResults = [];
    
    try {
      for (const algorithm of selectedAlgorithms) {
        const result = await api.benchmarkAlgorithm(algorithm, dataSize);
        benchmarkResults.push(result);
      }
      
      setResults(benchmarkResults);
    } catch (error) {
      setError('Benchmark failed: ' + (error.message || 'Unknown error'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: results.map(result => {
      const [cipher, keySize, mode] = result.algorithm.split('-');
      return `${cipher.toUpperCase()}-${keySize}-${mode.toUpperCase()}`;
    }),
    datasets: [
      {
        label: 'Average Time per Operation (ms)',
        data: results.map(result => parseFloat(result.avgTimePerOperation.replace(' ms', ''))),
        backgroundColor: '#0f62fe',
        borderColor: '#0353e9',
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Encryption Algorithm Performance Comparison'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (ms)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Algorithms'
        }
      }
    }
  };
  
  return (
    <BenchmarkContainer>
      <h1>Encryption Performance Benchmark</h1>
      
      <Form onSubmit={runBenchmark}>
        {error && <Alert type="error">{error}</Alert>}
        
        <FlexContainer>
          <FormGroup>
            <label htmlFor="algorithms">Select Algorithms (hold Ctrl/Cmd to select multiple)</label>
            <select
              id="algorithms"
              multiple
              size={6}
              onChange={handleAlgorithmChange}
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
            <label htmlFor="dataSize">Data Size (bytes)</label>
            <select
              id="dataSize"
              value={dataSize}
              onChange={handleDataSizeChange}
              required
            >
              <option value="512">512 Bytes</option>
              <option value="1024">1 KB</option>
              <option value="10240">10 KB</option>
              <option value="102400">100 KB</option>
              <option value="1048576">1 MB</option>
            </select>
          </FormGroup>
        </FlexContainer>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Running Benchmark...' : 'Run Benchmark'}
        </Button>
      </Form>
      
      {results.length > 0 && (
        <ResultsContainer>
          <h2>Benchmark Results</h2>
          
          <ChartContainer>
            <Bar data={chartData} options={chartOptions} />
          </ChartContainer>
          
          <ResultsTable>
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Data Size</th>
                <th>Iterations</th>
                <th>Total Time</th>
                <th>Avg Time per Operation</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const [cipher, keySize, mode] = result.algorithm.split('-');
                return (
                  <tr key={index}>
                    <td>{`${cipher.toUpperCase()}-${keySize}-${mode.toUpperCase()}`}</td>
                    <td>{result.dataSize}</td>
                    <td>{result.iterations}</td>
                    <td>{result.totalTime}</td>
                    <td>{result.avgTimePerOperation}</td>
                  </tr>
                );
              })}
            </tbody>
          </ResultsTable>
          
          <div style={{ marginTop: '2rem' }}>
            <h3>Interpretation</h3>
            <p>
              Lower values indicate faster encryption performance. GCM modes typically perform slower than CBC modes
              because they provide additional authentication, but offer better security.
            </p>
            <p>
              Larger key sizes (256-bit vs 128-bit) generally result in slightly slower performance but provide
              stronger security. The performance impact of key size is usually minimal compared to the algorithm mode.
            </p>
          </div>
        </ResultsContainer>
      )}
    </BenchmarkContainer>
  );
};

export default Benchmark; 