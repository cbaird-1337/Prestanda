import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_4C4cAcJkr",
    ClientId: "1c3gc7vqks282m85jnnp5vufi4"
}

export default new CognitoUserPool(poolData);