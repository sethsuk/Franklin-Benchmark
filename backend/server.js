const app = require('./src/app');  // Importing app with all middleware

// Uncomment if we need custom env
// const dotenv = require('dotenv');

// dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});