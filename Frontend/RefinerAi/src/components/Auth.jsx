import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext.jsx';
import Home from '../pages/Home.jsx';

const client_id = import.meta.env.VITE_CLIENT_ID;

function Auth() {
  const { user, setUser } = useUser();
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [authError, setAuthError] = useState(null);
  const backend_url = import.meta.env.VITE_BACKEND_LINK

  // Check for code in URL and get access token
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    const stateParam = urlParams.get("state");
    const storedState = sessionStorage.getItem("githubOAuthState");
    
    console.log("Code Parameter:", codeParam);
    console.log("State Parameter:", stateParam);
    console.log("Stored State:", storedState);

    // Clear any previous errors
    setAuthError(null);

    if (codeParam) {
      // Verify state parameter to prevent CSRF attacks
      if (!stateParam || stateParam !== storedState) {
        setAuthError("State validation failed. Authentication request may have been tampered with.");
        console.error("State validation failed", { received: stateParam, stored: storedState });
        return;
      }

      // Clean up state from sessionStorage
      sessionStorage.removeItem("githubOAuthState");

      // Only proceed if we don't already have a token
      if (localStorage.getItem("accessToken") === null) {
        async function getAccessToken() {
          try {
            const response = await fetch(`${backend_url}/getAccessToken?code=${codeParam}&state=${stateParam}`, {
              method: "GET"
            });
            const data = await response.json();
            
            console.log("Access Token Data:", data);
            if (data.error) {
              setAuthError(`Authentication error: ${data.error_description || data.error}`);
            } else if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setRerender(prev => !prev);
              window.history.pushState({}, document.title, "/"); // Clean URL after getting token
            }
          } catch (error) {
            console.error("Error fetching access token:", error);
            setAuthError("Failed to get access token. Please try again.");
          }
        }
        getAccessToken();
      }
    }
  }, [rerender]);

  // Fetch user data if access token is present
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(`${backend_url}/getUserData`, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
          }
        });
        const data = await response.json();
        
        if (data.error) {
          console.error("Error in user data:", data.error);
          setAuthError(data.error);
          // Token might be invalid, clear it
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            setRerender(prev => !prev);
          }
        } else {
          setUser(data);  // Store user data in context
          setUserData(data);
          console.log("User Data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthError("Failed to fetch user profile data");
      }
    };

    if (localStorage.getItem("accessToken")) {
      getUserData();
    }
  }, [rerender, setUser]);

  // GitHub login function
  function loginWithGithub() {
    // Generate a random state parameter for CSRF protection
    const state = generateRandomString(16);
    sessionStorage.setItem("githubOAuthState", state);
    
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=user&state=${state}&redirect_uri=http://localhost:5173`
    );
  }

  // Helper function to generate random string for state parameter
  function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // JSX return
  return (
    <>
      {localStorage.getItem("accessToken") ? (
        <>
          <Home userData={userData} />
        
        </>
      ) : (
        <>
          {authError && <div style={{ color: 'red', margin: '10px 0' }}>{authError}</div>}
          <button onClick={loginWithGithub}>
            Login with GitHub
          </button>
        </>
      )}
    </>
  );
}

export default Auth;