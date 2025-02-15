
import {defineAuth, secret} from "@aws-amplify/backend";


export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailSubject: 'Welcome to the s3 app 👋 Verify your email!'
    },
    externalProviders: {
      oidc: [
        {
          name: 'Auth0',
          clientId: secret('AUTH0_CLIENT_ID'),
          clientSecret: secret('AUTH0_CLIENT_SECRET'),
          issuerUrl: process.env.ISSUER_URL || '',
          scopes: ['openid', 'profile', 'email']
        },
      ],
      callbackUrls: [process.env.CALLBACK_URL || 'http://localhost:3000'],
      logoutUrls: [process.env.LOGOUT_URL || 'http://localhost:3000'],
    },
  },
});