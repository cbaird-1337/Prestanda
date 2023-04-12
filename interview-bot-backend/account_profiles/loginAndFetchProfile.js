//AWS Lambda function that fetches a user's account profile and interview history based on a provided managerAccountId, returning the results as a JSON object with appropriate HTTP response headers.

const AWS = require('aws-sdk');
const accountProfileController = require('./accountProfileController');
const interviewHistoryController = require('./interviewHistoryController');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } 

  const body = JSON.parse(event.body);
  const { managerAccountId } = body;

  try {
    const userProfile = await accountProfileController.getAccountProfile(managerAccountId);
    const interviewHistory = await interviewHistoryController.getInterviewHistory(managerAccountId); 

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ userProfile, interviewHistory }),
    };
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not fetch user data' }),
    };
  }
};
