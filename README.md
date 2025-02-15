# Amplify REST API Example

This project demonstrates how to create and consume a REST API using AWS Amplify with Next.js. It shows how to set up an API Gateway endpoint, implement a Lambda function, and make API calls from a Next.js frontend.

## Project Structure

```
amplify/
  ├── functions/
  │   └── some-api/
  │       ├── handler.ts    # Lambda function implementation
  │       └── resource.ts   # Lambda function configuration
  ├── backend.ts           # API Gateway and backend configuration
app/
  └── page.tsx            # Frontend implementation
```

## Backend Setup

### API Gateway Configuration (backend.ts)

The API Gateway is configured with multiple authorization methods and endpoints:

1. **Environment Configuration**:
```typescript
const env = process.env.AWS_BRANCH ?? "sandbox"
```

2. **Main Configuration**:
```typescript
const myRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "myRestApi",
  deploy: true,
  deployOptions: {
    stageName: env,
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});
```

3. **IAM Authorization Path** (/hello-function):
```typescript
const itemsPath = myRestApi.root.addResource("hello-function", {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.IAM,
  },
});
// Supports GET, POST, DELETE, PUT methods
```

4. **Cognito Authorization Path** (/cognito-auth-path):
```typescript
const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

const booksPath = myRestApi.root.addResource("cognito-auth-path");
booksPath.addMethod("GET", lambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});
```

### Lambda Function Configuration

The Lambda function is defined in two parts:

1. **Function Definition** (resource.ts):
```typescript
import { defineFunction } from "@aws-amplify/backend";

export const myApiFunction = defineFunction({
  name: "some-api",
});
```

2. **Function Implementation** (handler.ts):
```typescript
export const handler: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Credentials": "true"
    },
    body: JSON.stringify("Hello from myFunction!"),
  };
};
```

## Frontend Implementation (page.tsx)

The frontend uses the AWS Amplify API client to make requests to the API:

```typescript
import { get } from '@aws-amplify/api-rest';

export default function App() {
  const [apiResponse, setApiResponse] = useState<string>("");

  async function callSomeApi() {
    try {
      const { response } = await get({ 
        apiName: 'myRestApi',
        path: 'hello-function'
      });
      const result = await (await response).body.json();
      setApiResponse(JSON.stringify(result));
      console.log('API Response:', result);
    } catch (error) {
      console.error('Error calling API:', error);
      setApiResponse('Error calling API');
    }
  }

  return (
    <main>
      <h1>API Test</h1>
      <button onClick={callSomeApi}>Call API</button>
      {apiResponse && <div>API Response: {apiResponse}</div>}
    </main>
  );
}
```

### Handling API Responses

When working with AWS Amplify REST API responses:

1. The response comes as a ReadableStream in the response.body
2. To get the JSON data, you need to:
   ```typescript
   const result = await (await response).body.json();
   ```
3. The result will contain your API's response data that you can then use in your application

## Key Points

1. **Multiple Authorization Methods**: 
   - IAM authorization for `/hello-function` endpoint
   - Cognito User Pools authorization for `/cognito-auth-path`
   - Proper policy attachments for both authenticated and unauthenticated roles

2. **Environment-Aware Deployment**:
   - Uses AWS_BRANCH environment variable for stage name
   - Falls back to "sandbox" if branch name not available
   - Environment variable used consistently in policy resources

3. **CORS Configuration**: 
   - Set up in both API Gateway and Lambda function
   - Ensures frontend can access the API

4. **Response Handling**:
   - API responses come as ReadableStreams
   - Must be properly awaited and parsed for JSON data

## Getting Started

1. Configure Amplify in your frontend:
   ```typescript
   import { Amplify } from 'aws-amplify';
   import { get } from '@aws-amplify/api-rest';
   import outputs from '@/amplify_outputs.json';
   
   // Configure Amplify with outputs from backend
   Amplify.configure(outputs);
   const existingConfig = Amplify.getConfig();
   Amplify.configure({
     ...existingConfig,
     API: {
       ...existingConfig.API,
       REST: outputs.custom.API,
     }
   });
   ```

2. Make API calls:
   ```typescript
   const { response } = await get({ 
     apiName: 'myRestApi',
     path: 'hello-function'
   });
   const result = await (await response).body.json();
   ```

3. Handle responses:
   - All responses come as ReadableStreams
   - Always await both the response and the body.json()
   - Use try/catch for error handling

Note: Make sure to have the amplify_outputs.json file in your project root, which is generated after deploying your backend. This file contains the API endpoint and other configuration details needed to connect your frontend to the API.
