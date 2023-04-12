//Lambda function that updates a user's profile and password in the UserAccounts table, using accountProfileController to update the profile data.

const AWS = require('aws-sdk');
const accountProfileController = require('./accountProfileController');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// This Lambda function updates the user profile and password in the UserAccounts table.
// It interacts with the accountProfileController for updating the profile data.
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
  const { managerAccountId, updatedProfileData } = body;

  // Call the accountProfileController to update the profile data in the UserAccounts table
  try {
    await accountProfileController.updateAccountProfile(managerAccountId, updatedProfileData);

    // Return a success response after updating the profile
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ success: 'Profile updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not update profile' }),
    };
  }
};
