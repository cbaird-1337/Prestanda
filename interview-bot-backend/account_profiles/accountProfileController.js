//These are hosted as Lambda's in AWS under the interviewBotLoginAndFetchProfile function, and are NOT to be directly used by the frontend or backends
//Handles creation and retrieval of user account profiles in DynamoDB

const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACTS_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACTS_APP_AWS_REGION,
  });
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  
  async function createAccountProfile(name, email, hiringManagerCompany, hiringManagerDept) {
    const managerAccountId = uuid.v4().substr(0, 10);
    const timestamp = new Date().toISOString();
  
    const params = {
      TableName: 'UserAccounts',
      Item: {
        ManagerAccountId: managerAccountId,
        timestamp: timestamp,
        Name: name,
        Email: email,
        HiringManagerCompany: hiringManagerCompany,
        HiringManagerDept: hiringManagerDept,
        AccountStatus: 'active',
      },
    };
  
    try {
      await dynamoDB.put(params).promise();
      return managerAccountId;
    } catch (error) {
      console.error('Error creating account profile:', error.message);
      throw error;
    }
  }

  async function getAccountProfile(managerAccountId) {
    const params = {
      TableName: 'UserAccounts',
      Key: {
        ManagerAccountId: managerAccountId,
      },
    };
  
    try {
      const result = await dynamoDB.get(params).promise();
      return result.Item;
    } catch (error) {
      console.error('Error fetching account profile:', error.message);
      throw error;
    }
  }
  
  module.exports = {
    createAccountProfile,
    getAccountProfile,
  };
  