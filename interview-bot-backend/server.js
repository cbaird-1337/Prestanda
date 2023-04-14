//sets up an Express.js server that handles HTTP requests, defines API endpoints for handling account profiles, 
//uploading resumes and job descriptions, and refining interview questions. The server also uses AWS S3 for file storage, 
//textract to extract text from uploaded documents, OpenAI to generate interview questions, and an accountProfileController 
//module to manage account mappings. The code also defines functions to remove stop words and extra whitespace, 
//upload files to S3, and generate interview questions.

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const textract = require('textract');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');

// Configure AWS SDK and initialize S3 instance
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// Configure OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//defining stopwords to be removed
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Function to remove stop words and extra whitespace
function removeStopWordsAndExtraWhitespace(text) {
  const words = tokenizer.tokenize(text);
  const filteredWords = words.filter(word => !natural.stopwords.includes(word.toLowerCase()));
  return filteredWords.join(' ').replace(/\s\s+/g, ' ');
}

// Upload files to S3 function
function uploadToS3(file, s3Bucket, s3Key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

//API endpoint for call to/from account profile controller to handle account mapping
app.get('/account-profile/:managerAccountId', async (req, res) => {
  try {
    const managerAccountId = req.params.managerAccountId;
    const response = await axios.get(`${process.env.ACCOUNT_PROFILE_CONTROLLER_API_ENDPOINT}/interviewbotprofileactions/${managerAccountId}`);
    res.json({ message: 'Account profile fetched successfully', accountProfile: response.data.accountProfile });
  } catch (err) {
    console.error('Error fetching account profile:', err.message);
    res.status(500).json({ message: 'Error fetching account profile' });
  }
});


// Read and extract text from documents with textract
async function readAndExtractTextFromS3(s3Bucket, s3Key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: s3Bucket,
      Key: s3Key,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const buffer = data.Body;
        textract.fromBufferWithMime('application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer, (error, text) => {
          if (error) {
            reject(error);
          } else {
            resolve(text);
          }
        });
      }
    });
  });
}

// Function for ChatGPT to generate interview questions based on resume and job description uploads
async function generateQuestions(text, role, numberOfQuestions) {
  const prompt = `Please generate ${numberOfQuestions} first call phone screening interview questions that focus on evaluating career experience, job fit, and specific examples for the ${role} position. Consider the following job description and resume details while creating the questions:\n\n${text}\n`;
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: "system",
        content: "You are a helpful recruiting assistant that generates interview questions based on input from a user's resume and job description. Each question should have a maximum length of 20 words per question that focus on evaluating career experience, job fit, and specific examples for the position. Ensure that at least one of these questions are behavioral, such as tell me about a time when you faced a challenge and how you overcame it"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 2096,
    n: 1,
    stop: null,
    temperature: 0.8,
  });

  const generatedText = completion.data.choices[0].message.content;
  const rawQuestions = generatedText.split('\n').filter((line) => line.trim() !== '');
  const questions = rawQuestions.map((question) => {
    return question.replace(/^\d+\.\s*/, '');
  });

  return questions.slice(0, numberOfQuestions);
}


// Placeholder endpoint for testing server
app.get('/', (req, res) => {
  res.send('Interview Bot Backend');
});

// API endpoint for uploading resume and job description
app.post('/upload', upload.fields([{ name: 'resume' }, { name: 'jobDescription' }]), async (req, res) => {
  // Access the files from the request
  const resumeFile = req.files.resume[0];
  const jobDescriptionFile = req.files.jobDescription[0];

  try {
    // Upload the files to the S3 bucket
    const resumeS3Key = `resumes/${resumeFile.originalname}`;
    const jobDescriptionS3Key = `job_descriptions/${jobDescriptionFile.originalname}`;
    await uploadToS3(resumeFile, process.env.S3_BUCKET_NAME, resumeS3Key);
    await uploadToS3(jobDescriptionFile, process.env.S3_BUCKET_NAME, jobDescriptionS3Key);

    // Read and extract text from the uploaded files
    const resumeText = removeStopWordsAndExtraWhitespace(await readAndExtractTextFromS3(process.env.S3_BUCKET_NAME, resumeS3Key));
    const jobDescriptionText = removeStopWordsAndExtraWhitespace(await readAndExtractTextFromS3(process.env.S3_BUCKET_NAME, jobDescriptionS3Key));

    // Get the number of questions from the request
    const numberOfQuestions = req.body.numberOfQuestions || 5; // Use the provided number or default to 5

    // Combine both sets of texts
    const combinedText = `Resume:\n${resumeText}\n\nJob Description:\n${jobDescriptionText}`;

    // Generate interview questions using OpenAI for the combined text
    const combinedQuestions = await generateQuestions(combinedText, "combined", numberOfQuestions);

    // Send a response with the combined questions
    res.json({ message: 'Interview questions generated successfully', questions: combinedQuestions });
  } catch (err) {
    console.error('Error processing files:', err.message);
    console.error('Error details:', err.response?.data || err);
    res.status(500).json({ message: 'Error processing files' });
  }
});

// API endpoint for refining interview questions - delete if needed down to line 187
app.post('/refine', async (req, res) => {
  const { prompt, questions, numberOfQuestions } = req.body;

  try {
    // Combine the refine prompt with the original questions
    const combinedPrompt = `${prompt}\n\nOriginal questions:\n${questions.join('\n')}\n`;

    // Generate interview questions using OpenAI for the combined prompt
    const refinedQuestions = await generateQuestions(combinedPrompt, numberOfQuestions);

    // Send a response with the refined questions
    res.json({ message: 'Interview questions refined successfully', questions: refinedQuestions });
  } catch (err) {
    console.error('Error refining questions:', err.message);
    console.error('Error details:', err.response?.data || err);
    res.status(500).json({ message: 'Error refining questions' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});