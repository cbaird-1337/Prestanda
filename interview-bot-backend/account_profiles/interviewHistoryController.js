//Exports a function named getInterviewHistory that fetches interview history from a DynamoDB table using a GSI with ManagerAccountId as the partition key

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
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
