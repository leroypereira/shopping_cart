import { CognitoUserPool } from 'amazon-cognito-identity-js';

const env = await import.meta.env

const poolData = {
  UserPoolId: env.VITE_REACT_APP_USER_POOL_ID,
  ClientId: env.VITE_REACT_APP_CLIENT_ID,
};
export default new CognitoUserPool(poolData);