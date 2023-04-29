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
const { PORT } = process.env
const pdfParse = require('pdf-parse');
const { v4: uuidv4 } = require("uuid");
const morgan = require('morgan');
const sns = new AWS.SNS();


// Configure AWS SDK and initialize S3 instance
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// Initialize DynamoDb client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Function to support extracting text from PDFs
async function readAndExtractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

// Configure OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable detailed logging using morgan middleware
app.use(morgan('combined'));

// Add the new CORS settings here
const allowedOrigins = [
  'https://www.prestanda.io',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-amz-date', 'authorization', 'x-api-key', 'x-amz-security-token', 'x-amz-user-agent'],
};

app.use(cors(corsOptions));

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
        const mimeType = data.ContentType;

        if (mimeType === 'application/pdf') {
          resolve(readAndExtractTextFromPdf(buffer));
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          textract.fromBufferWithMime(mimeType, buffer, (error, text) => {
            if (error) {
              reject(error);
            } else {
              resolve(text);
            }
          });
        } else if (mimeType === 'text/plain') {
          resolve(buffer.toString('utf-8'));
        } else {
          reject(new Error('Unsupported file type'));
        }
      }
    });
  });
}

// Function for ChatGPT to generate interview questions based on resume and job description uploads
async function generateQuestions(text, role, numberOfQuestions) {
  const prompt = `Please generate ${numberOfQuestions} first call phone screening interview questions that focus on evaluating career experience, job fit, and specific examples for the ${role} position. Take time to study and reference the following job description and candidate resume details while creating the questions:\n\n${text}\n`;
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: "system",
        content: "You are a helpful recruiting assistant that generates interview questions based on inputs from a user's resume and job description. Before generating the questions, study the provided candidate resume, and the job description for the role they are applying to, and base your questions off of these documents. Each question should have a maximum length of 25 words per question that focus on evaluating career experience, job fit, and specific examples for the position. Ensure that at least one of these questions are behavioral, such as tell me about a time when you faced a challenge and how you overcame it etc. You are allowed to refer to common first call screening interview questions and use them to model your questions around (if and where it makes sense to do so)."
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

// API endpoint for sending SES emails to candidate for interview
app.post('/send-email', async (req, res) => {
  const { candidateName, candidateEmail, companyName, candidatePhoneNumber, jobTitle } = req.body;

  async function sendEmail(from, to, subject, body) {
    const ses = new AWS.SES({
      apiVersion: '2010-12-01',
      region: process.env.AWS_REGION,
    });
  
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: {
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from,
    };
  
    return new Promise((resolve, reject) => {
      ses.sendEmail(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  const emailSubject = `Phone Screening Interview w/ ${companyName}`;
  const emailBody = `Hello ${candidateName},

The hiring manager at ${companyName} has requested a phone interview screening for the position of ${jobTitle} that  you recently applied for. Please call the following number at your earliest convenience to complete your screening:

Phone number: +1-123-456-7890

We have your number on record as ${candidatePhoneNumber}. Please be sure to call in to take your interview using only this number.

If you have received this email in error, please feel free to disregard, no further action is necessary. If you are no longer interested in this opportunity at ${companyName}, please email the hiring manager to let them know.

Best regards,
The Prestanda team`;

  try {
    await sendEmail('interview@prestanda.io', candidateEmail, emailSubject, emailBody);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

//code that handles psychometric assessment scheduling email via SES and writing data to DynamoDB
app.post("/schedule-assessment", async (req, res) => {
  const {
    managerAccountId,
    assessmentId,
    candidateEmail,
    jobTitle,
    candidateName,
    companyName,
  } = req.body;  

  // Code to save the assessment scheduling details to DynamoDB
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: "CandidateAssessmentResults",
      Item: {
        ManagerAccountId: managerAccountId,
        AssessmentId: assessmentId,
        CandidateName: req.body.candidateName,
        CandidateEmail: candidateEmail,
        CompanyName: req.body.companyName,
        JobTitle: jobTitle,
        CandidatePhoneNumber: req.body.candidatePhoneNumber,
        AssessmentStatus: "pending",
        AssessmentResults: null,
        Timestamp: null,
      },
    };    

    await docClient.put(params).promise();
  } catch (error) {
    console.error("Error saving scheduling details to DynamoDB:", error);
    res.status(500).send({ success: false, error: error.message });
  }

  // Code to send email using SES to the candidate
  try {
    const ses = new AWS.SES({
      apiVersion: "2010-12-01",
      region: process.env.AWS_REGION,
    });

    const emailSubject = "Interview Assessment Scheduled";
    const emailBody = `Dear ${candidateName},\n\nWe have scheduled your psychometric assessment. Please complete the assessment using the following link: https://prestanda.io/assessment/${assessmentId}\n\nBest Regards,\nInterview Bot`;

    const params = {
      Destination: {
        ToAddresses: [candidateEmail],
      },
      Message: {
        Body: {
          Text: {
            Data: emailBody,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: emailSubject,
        },
      },
      Source: "interview@prestanda.io",
    };

    await ses.sendEmail(params).promise();
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ success: false, error: error.message });
  }

  res.status(200).send({ success: true });
});

// 1. Get assessment status
app.get('/get-assessment-status/:id', async (req, res) => {
  const id = req.params.id;

  console.log(`Fetching assessment status for ID: ${id}`);

  // Query the status from the CandidateAssessmentResults table using the GSI
  const params = {
    TableName: 'CandidateAssessmentResults',
    IndexName: 'AssessmentId-index',
    KeyConditionExpression: 'AssessmentId = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();

    if (result.Items && result.Items.length > 0) {
      console.log(`Fetched assessment status: ${result.Items[0].AssessmentStatus}`);
      res.status(200).send({ status: result.Items[0].AssessmentStatus }); // Send only the AssessmentStatus field
    } else {
      console.error("Error fetching assessment status: No item found for the given ID");
      res.status(404).send({ error: 'No assessment found for the given ID' });
    }
  } catch (error) {
    console.error("Error fetching assessment status:", error);
    res.status(500).send({ error: 'Error fetching assessment status' });
  }
});

// 2. Get psychometric questions
app.get('/get-psychometric-questions', async (req, res) => {
  console.log("Fetching psychometric questions");
  
  const params = {
    TableName: 'PsychometricQuestions',
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    console.log(`Fetched ${result.Items.length} psychometric questions`);
    res.status(200).send(result.Items);
  } catch (error) {
    console.error("Error fetching psychometric questions:", error);
    res.status(500).send({ error: 'Error fetching psychometric questions' });
  }
});

// 3. Get situational questions
app.get('/get-situational-questions', async (req, res) => {
  console.log("Fetching situational questions");
  
  const params = {
    TableName: 'SituationalQuestions',
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    console.log(`Fetched ${result.Items.length} situational questions`);
    res.status(200).send(result.Items);
  } catch (error) {
    console.error("Error fetching situational questions:", error);
    res.status(500).send({ error: 'Error fetching situational questions' });
  }
});

// 4. Submit assessment - writes candidate answers to dynamoDb CandidateAssessmentResults table based on AssessmentID, and triggers SNS topic to initiate grading lambda
app.post('/submit-assessment', async (req, res) => {
  const { assessmentId, answers } = req.body;

  // First, query the CandidateAssessmentResults table using the GSI to get the primary key
  const queryParams = {
    TableName: 'CandidateAssessmentResults',
    IndexName: 'AssessmentId-index',
    KeyConditionExpression: 'AssessmentId = :id',
    ExpressionAttributeValues: {
      ':id': assessmentId,
    },
  };

  try {
    const queryResult = await dynamoDb.query(queryParams).promise();

    if (queryResult.Items && queryResult.Items.length > 0) {
      // Get the primary key (e.g., CandidateId or UserId) from the fetched document
      const primaryKey = queryResult.Items[0].ManagerAccountId;

      // Now, update the document using the primary key
      const updateParams = {
        TableName: 'CandidateAssessmentResults',
        Key: {
          ManagerAccountId: primaryKey,
        },
        UpdateExpression: 'set AssessmentResults = :answers, AssessmentStatus = :status',
        ExpressionAttributeValues: {
          ':answers': answers,
          ':status': 'Completed',
        },
      };

      await dynamoDb.update(updateParams).promise();

      // Publish the SNS message with the assessmentId
      const snsParams = {
        Message: JSON.stringify({ assessmentId }),
        TopicArn: process.env.SNS_GRADING_TOPIC_ARN, // SNS topic ARN to trigger grading lambda
      };

      await sns.publish(snsParams).promise();

      res.status(200).send({ message: 'Assessment submitted successfully' });
    } else {
      res.status(404).send({ error: 'No assessment found for the given ID' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error submitting assessment' });
  }
});

console.log('PORT', PORT)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});