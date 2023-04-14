//Exports a function named getInterviewHistory that fetches interview history from a DynamoDB table using a GSI with ManagerAccountId as the partition key
//These are hosted as Lambda's in AWS under the interviewBotLoginAndFetchProfile function, and are NOT to be directly used by the frontend or backends

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACTS_APP_AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getInterviewHistory(managerAccountId) {
  const params = {
    TableName: 'InterviewRequests',
    IndexName: 'ManagerAccountId-index', // Assuming you've created a GSI with ManagerAccountId as partition key
    KeyConditionExpression: 'ManagerAccountId = :managerAccountId',
    ExpressionAttributeValues: {
      ':managerAccountId': managerAccountId,
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Error fetching interview history:', error.message);
    throw error;
  }
}

module.exports = {
  getInterviewHistory,
};
