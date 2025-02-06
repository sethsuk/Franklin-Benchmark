const app = require('./src/app');
const initializeDatabase = require('./src/config/initDB');

// Uncomment if we need custom env
// const dotenv = require('dotenv');

// dotenv.config();

// Initialize tables in DB
initializeDatabase();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to Franklin Benchmark!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});