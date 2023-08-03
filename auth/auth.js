const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const port = 3000
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'survey',
  password: '123456',
  port: 5432,
})



app.use(bodyParser.json());
///----> user registration middleware
function validateUserData(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Add more validation rules as per your requirements
  // For example, checking email format, password complexity, etc.

  next();
}




app.post('/register', validateUserData, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    const values = [username, email, hashedPassword];

    await pool.query(query, values);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error while registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Get user from the database
      const query = 'SELECT * FROM users WHERE username = $1';
      const result = await pool.query(query, [username]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
  
      // Create a JWT token with the user ID and a secret key
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while logging in.' });
    }
  });
  
  // Protected route
  app.get('/protected', (req, res) => {
    // Extract the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
  
    try {
      // Verify the token using the secret key
      const decodedToken = jwt.verify(token, 'your-secret-key');
      const userId = decodedToken.userId;
  
      // You can now use the userId to fetch user-specific data from the database
      // and respond with the appropriate information.
  
      res.status(200).json({ message: 'This is a protected route.' });
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized. Invalid token.' });
    }
  });