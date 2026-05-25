import express from 'express';

const app = express();
const PORT = 5001;

app.get('/', (req, res) => {
  res.send('Welcome to the Class Management System API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});