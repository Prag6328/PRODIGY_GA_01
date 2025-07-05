const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// Serve favicon if exists
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, 'static', 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    res.status(404).send('Favicon not found');
  }
});

// Serve index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('<h1>Text Generator Backend</h1><p>index.html not found.</p>');
  }
});

// POST /generate route using Hugging Face GPT-2 API
app.post('/generate', async (req, res) => {
  const { prompt = "", temperature = 0.7, maxLength = 100 } = req.body;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      { inputs: prompt, parameters: { temperature, max_new_tokens: maxLength } },
      {
        headers: {
          Authorization: `Bearer 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`,
        },
      }
    );

    const generatedText = response.data[0]?.generated_text || 'No output';
    res.json({ output: generatedText });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
