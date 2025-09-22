import { Amplify } from 'aws-amplify';
import { COGNITO_CONFIG } from './config/cognito';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: COGNITO_CONFIG.userPoolId,
      userPoolClientId: COGNITO_CONFIG.userPoolWebClientId,
      loginWith: {
        email: true,
        username: true,
      },
    },
  },
});
