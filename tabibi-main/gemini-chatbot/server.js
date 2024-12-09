const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Send index.html for the root route
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent([message]);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
