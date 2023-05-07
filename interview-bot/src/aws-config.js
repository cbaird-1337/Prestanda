//access keys defined as environment variables in Amplify

import AWS from 'aws-sdk';

const awsConfig = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
};

AWS.config.update(awsConfig);

export default AWS;
