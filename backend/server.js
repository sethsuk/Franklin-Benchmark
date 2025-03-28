const app = require('./src/app');
const initializeDatabase = require('./src/config/initDB');

// Initialize tables in DB
initializeDatabase();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to Franklin Benchmark!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});