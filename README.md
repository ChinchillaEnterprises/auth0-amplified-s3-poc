# AWS Amplify Auth0 Integration with S3 Storage

This project demonstrates how to integrate Auth0 with AWS Amplify/Cognito for authentication and implement secure file management using Amplify's S3 storage component. Users can authenticate via Auth0 and manage files (view, upload, delete files, and create/delete folders) in an S3 bucket.

## Overview

This proof-of-concept showcases:
- Federated authentication using Auth0 as an OpenID Connect provider with AWS Cognito
- Secure file management using Amplify's S3 storage component
- Next.js frontend with responsive UI based on authentication state

## Prerequisites

- AWS Account with appropriate permissions
- Auth0 Account with a configured Regular Web Application
- Node.js (v18.18 or later) and npm
- Git
- Basic familiarity with Next.js

## Project Structure

```
amplify/
  ├── backend.ts           # Combines auth and storage configurations
  ├── auth/
  │   └── resource.ts     # Auth0 and Cognito integration setup
  └── storage/
      └── resource.ts     # S3 bucket configuration and access rules
app/
  └── page.tsx            # Frontend implementation with auth flow and file management
```

## Key Components

### Backend (Amplify)

1. **amplify/backend.ts**
   - Combines authentication and storage configurations
   - Sets up environment variables for deployment

2. **amplify/auth/resource.ts**
   - Configures Auth0 as OIDC provider
   - Sets up Cognito user pool integration
   - Manages authentication flow and callbacks

3. **amplify/storage/resource.ts**
   - Configures S3 bucket with name 'myProjectFiles'
   - Defines access policies for different user roles
   - Sets up public, protected, and private access paths

### Frontend (Next.js)

**app/page.tsx**
- Handles authentication state
- Provides Auth0 sign-in and sign-out functionality
- Renders the S3 storage browser for file management
- Manages user session and displays appropriate UI

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Auth0:
   - Create a Regular Web Application in Auth0 Dashboard
   - Note the Client ID, Client Secret, and Domain

4. Set up environment variables:
   ```bash
   npx ampx sandbox secret set AUTH0_CLIENT_ID
   npx ampx sandbox secret set AUTH0_CLIENT_SECRET
   ```

5. Create a .env file:
   ```
   ISSUER_URL=[Your Auth0 Domain URL]
   CALLBACK_URL=http://localhost:3000
   LOGOUT_URL=http://localhost:3000
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

1. Configure environment variables in Amplify Hosting:
   - Add CALLBACK_URL and LOGOUT_URL with the Amplify app domain
   - Add ISSUER_URL with your Auth0 domain
   - Set AUTH0_CLIENT_ID and AUTH0_CLIENT_SECRET in Secrets management

2. Update Auth0 application settings:
   - Add Cognito domain to Allowed Callback URLs
   - Format: https://[COGNITO_DOMAIN]/oauth2/idpresponse

## Usage

1. Access the application through your browser
2. Click "Sign in with Auth0" to authenticate
3. Once authenticated, you can:
   - View files and folders
   - Upload new files
   - Delete existing files
   - Create new folders
   - Delete folders

## Troubleshooting

Common issues:
- Auth0 callback errors: Verify callback URLs are correctly configured
- Authentication failures: Check Auth0 credentials and Cognito setup
- File access issues: Verify S3 bucket permissions and user roles

## Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws)
- [Auth0 Documentation](https://auth0.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
