import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
};

AWS.config.update(awsConfig);

export default AWS;
