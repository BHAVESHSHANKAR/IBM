const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Middleware
app.use(cors({
  origin:"*",
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]
}));
app.use(express.json());

// Constants for encryption (fixed values instead of random generation)
const FIXED_SALT = Buffer.from('fixed-salt-value-for-all-encryptions', 'utf8').slice(0, 16);
const FIXED_IV = Buffer.from('fixed-iv-for-enc', 'utf8').slice(0, 16);

// Encryption algorithms available for assessment
const ENCRYPTION_ALGORITHMS = {
  AES_256_CBC: 'aes-256-cbc',
  AES_192_CBC: 'aes-192-cbc',
  AES_128_CBC: 'aes-128-cbc'
};

// Helper function to generate encryption key from password
const getKeyFromPassword = (password, salt, keyLength = 32) => {
  return crypto.scryptSync(password, salt, keyLength);
};

// Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/algorithms', (req, res) => {
  res.json({
    algorithms: Object.keys(ENCRYPTION_ALGORITHMS).map(key => ({
      id: key,
      name: key.replace(/_/g, ' '),
      value: ENCRYPTION_ALGORITHMS[key]
    }))
  });
});

// Encrypt data
app.post('/api/encrypt', (req, res) => {
  try {
    const { data, algorithm, password } = req.body;
    
    if (!data || !algorithm || !password) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    if (!Object.values(ENCRYPTION_ALGORITHMS).includes(algorithm)) {
      return res.status(400).json({ error: 'Invalid algorithm' });
    }
    
    // Generate a random salt
    const salt = crypto.randomBytes(16);
    
    // Generate key from password
    const key = getKeyFromPassword(password, salt);
    
    // Generate initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher and encrypt
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    
    return res.json({
      encryptedData: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      salt: salt.toString('base64'),
      algorithm
    });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Encryption failed', details: error.message });
  }
});

// Decrypt data
app.post('/api/decrypt', (req, res) => {
  try {
    const { encryptedData, iv, salt, algorithm, password } = req.body;
    
    if (!encryptedData || !iv || !salt || !algorithm || !password) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Convert base64 strings back to buffers
    const encBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const saltBuffer = Buffer.from(salt, 'base64');
    
    // Generate key from password
    const key = getKeyFromPassword(password, saltBuffer);
    
    // Create decipher and decrypt
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
    const decrypted = Buffer.concat([
      decipher.update(encBuffer),
      decipher.final()
    ]);
    
    res.json({
      decryptedData: decrypted.toString('utf8')
    });
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Decryption failed', details: error.message });
  }
});

// Benchmark encryption performance
app.post('/api/benchmark', (req, res) => {
  try {
    const { algorithm, dataSize } = req.body;
    const iterations = 100;
    
    if (!algorithm || !dataSize) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Generate random data of specified size
    const data = crypto.randomBytes(parseInt(dataSize)).toString('hex');
    
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    const startTime = process.hrtime();
    
    for (let i = 0; i < iterations; i++) {
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    }
    
    const endTime = process.hrtime(startTime);
    const duration = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to ms
    
    res.json({
      algorithm,
      dataSize: `${dataSize} bytes`,
      iterations,
      totalTime: `${duration.toFixed(2)} ms`,
      avgTimePerOperation: `${(duration / iterations).toFixed(2)} ms`
    });
  } catch (error) {
    console.error('Benchmark error:', error);
    res.status(500).json({ error: 'Benchmarking failed', details: error.message });
  }
});

// Security assessment endpoint
app.post('/api/assess', (req, res) => {
  const { algorithm, keySize, purpose } = req.body;
  
  // This is a simplified assessment
  const assessment = {
    algorithm,
    keySize,
    purpose,
    score: 0,
    recommendations: [],
    strengths: [],
    weaknesses: []
  };
  
  // Assess based on algorithm
  if (algorithm.includes('aes')) {
    assessment.strengths.push('AES is a widely accepted strong encryption standard');
    
    if (algorithm.includes('gcm')) {
      assessment.strengths.push('GCM mode provides both authentication and encryption');
      assessment.score += 2;
    } else if (algorithm.includes('cbc')) {
      assessment.weaknesses.push('CBC mode does not provide authentication by itself');
      assessment.recommendations.push('Consider using GCM mode for authenticated encryption');
      assessment.score += 1;
    }
  }
  
  // Assess based on key size
  if (algorithm.includes('256')) {
    assessment.strengths.push('256-bit key size provides strong security');
    assessment.score += 3;
  } else if (algorithm.includes('192')) {
    assessment.strengths.push('192-bit key size provides good security');
    assessment.score += 2;
  } else if (algorithm.includes('128')) {
    assessment.strengths.push('128-bit key size provides adequate security for most purposes');
    assessment.recommendations.push('Consider using 256-bit encryption for highly sensitive data');
    assessment.score += 1;
  }
  
  // Normalize score to 0-10 range
  assessment.score = Math.min(10, assessment.score);
  
  res.json(assessment);
});

// Encrypt file endpoint
app.post('/api/encrypt-file', upload.single('file'), async (req, res) => {
  try {
    console.log('Encryption request received');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { algorithm, password } = req.body;
    
    if (!algorithm || !password) {
      return res.status(400).json({ error: 'Algorithm and password are required' });
    }
    
    // Use fixed salt instead of random generation
    const salt = FIXED_SALT;
    
    // Generate key from password
    const key = getKeyFromPassword(password, salt);
    
    // Use fixed IV instead of random generation
    const iv = FIXED_IV;
    
    // Read the file
    const fileData = fs.readFileSync(req.file.path);
    
    // Create cipher and encrypt
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(fileData),
      cipher.final()
    ]);
    
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    
    // Return the encrypted file
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=encrypted-${req.file.originalname}`);
    res.setHeader('X-Encryption-Params', JSON.stringify({
      algorithm
    }));
    res.send(encrypted);
  } catch (error) {
    console.error('Error encrypting file:', error);
    // Clean up the uploaded file in case of error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to encrypt file: ' + error.message });
  }
});

// Decrypt file endpoint
app.post('/api/decrypt-file', upload.single('file'), async (req, res) => {
  try {
    console.log('Decryption request received');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { password, algorithm } = req.body;
    
    if (!password || !algorithm) {
      return res.status(400).json({ error: 'Password and algorithm are required' });
    }

    // Get proper key length based on algorithm
    let keyLength = 32; // default for aes-256
    if (algorithm === 'aes-192-cbc') keyLength = 24;
    if (algorithm === 'aes-128-cbc') keyLength = 16;

    // Use fixed salt and IV
    const iv = FIXED_IV;
    const salt = FIXED_SALT;
    const key = getKeyFromPassword(password, salt, keyLength);

    console.log(`Using algorithm: ${algorithm} with key length: ${keyLength}`);

    const fileData = fs.readFileSync(req.file.path);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([
      decipher.update(fileData),
      decipher.final()
    ]);

    fs.unlinkSync(req.file.path);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=decrypted-${req.file.originalname}`);
    res.send(decrypted);

  } catch (error) {
    console.error('Error decrypting file:', error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to decrypt file: ' + error.message });
  }
});
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 