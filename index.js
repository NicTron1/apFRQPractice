const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Import the sample data
const sampleDataFilePath = path.join(__dirname, 'sampleData.json');
const sampleDataFileContent = fs.readFileSync(sampleDataFilePath, 'utf8');
const sampleData = JSON.parse(sampleDataFileContent);

// Add the /questions endpoint
app.get('/questions', (req, res) => {
  // Send the questions without the correctAnswer field
  const questionsWithoutAnswers = sampleData.map(({ id, question, simplifiedChoices, explanation }) => ({ id, question, simplifiedChoices, explanation }));
  res.json(questionsWithoutAnswers);
});

// Add the /checkAnswer endpoint
app.post('/checkAnswer', (req, res) => {
  const { questionId, answer } = req.body;
  const question = sampleData.find(q => q.id === questionId);
  
  if (!question) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  
  const correct = question.correctAnswer === answer;
  res.json({ correct });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
