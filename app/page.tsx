"use client"; // Marks this as a client-side component in Next.js

// React and AWS Amplify Authentication imports
import { useState, useEffect } from "react";
import { getCurrentUser, signInWithRedirect, signOut, fetchUserAttributes } from 'aws-amplify/auth';

// Styles and configuration imports
import "./../app/app.css"; // Global styles
import { Amplify } from "aws-amplify"; // AWS Amplify core library
import outputs from '@/amplify_outputs.json'; // AWS Amplify configuration outputs
import "@aws-amplify/ui-react/styles.css"; // AWS Amplify UI styles

// AWS Amplify Storage Browser imports
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
} from '@aws-amplify/ui-react-storage/browser';
import "@aws-amplify/ui-react-storage/styles.css";

// Internationalization imports (currently disabled)
// import { IntlProvider, FormattedMessage, useIntl } from "react-intl";

// Initialize Amplify with configuration from amplify_outputs.json
Amplify.configure(outputs);

// Create Storage Browser instance with Auth adapter
const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

/**
 * Main App Component
 * Handles user authentication state and renders either the storage browser or login button
 */
export default function App() {
  // State management
  const [username, setUsername] = useState<string | null>(null);
  const [locale, setLocale] = useState('en'); // Default to English (for future i18n support)
  // const intl = useIntl(); // Internationalization hook (currently disabled)

  /**
   * Handles user sign out
   * Clears the current session and updates the UI state
   */
  const handleSignOut = async () => {
    console.log("Signing out...");
    await signOut();
    setUsername(null);
  };

  /**
   * Checks if a user is currently authenticated
   * Fetches user details and updates the UI state accordingly
   * @returns {Promise<boolean>} True if user is authenticated, false otherwise
   */
  async function checkUserAuthentication() {
    try {
      const currentUser = await getCurrentUser();
      console.log("Current user:", currentUser);
      
      if (currentUser) {
        // Fetch additional user attributes (like email)
        const attributes = await fetchUserAttributes();
        console.log("User attributes:", attributes);
        
        // Set display name prioritizing email > username > userId
        const displayName = attributes.email || currentUser.username || currentUser.userId;
        console.log("User is authenticated:", displayName);
        setUsername(displayName);
        return true;
      }
    } catch (error) {
      console.error("Error getting current user:", error);
      setUsername(null);
      return false;
    }
  }

  // Check authentication status when component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated) {
        console.log("User is authenticated");
      }
    };
    initializeAuth();
  }, []);

  // Render UI based on authentication state
  return (
    <main>
      {username ? (
        // Authenticated user view
        <div>
          <h1>Welcome {username}</h1>
          <StorageBrowser />
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        // Unauthenticated user view
        <button
          onClick={() =>
            signInWithRedirect({
              provider: { custom: 'Auth0' },
            })
          }
        >
          Sign in with Auth0
          {/* <FormattedMessage id="signInWithAuth0" /> */}
        </button>
      )}
    </main>
  );
}
