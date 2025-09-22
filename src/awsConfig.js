import { Amplify } from 'aws-amplify';
import { COGNITO_CONFIG } from './config/cognito';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: COGNITO_CONFIG.region,
    userPoolId: COGNITO_CONFIG.userPoolId,
    userPoolWebClientId: COGNITO_CONFIG.userPoolWebClientId,
    oauth: {
      domain: COGNITO_CONFIG.domain,
      scope: ['openid', 'email', 'profile'],
      responseType: 'code',
    },
  },
});
