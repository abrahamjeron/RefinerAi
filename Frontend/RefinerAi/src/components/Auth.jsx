import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext.jsx';
import { useNavigate } from 'react-router-dom';

const client_id = import.meta.env.VITE_CLIENT_ID;

function Auth() {
  const { user, setUser } = useUser();
  const [authError, setAuthError] = useState(null);
  const backend_url = import.meta.env.VITE_BACKEND_LINK;
  const navigate = useNavigate();

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

      // Process the auth code
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
            // Clean URL after getting token
            window.history.pushState({}, document.title, "/auth");
            // Fetch user data immediately after setting token
            await getUserData(data.access_token);
            // Navigate to home page after successful authentication
            navigate('/');
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
          setAuthError("Failed to get access token. Please try again.");
        }
      }
      getAccessToken();
    } else {
      // Check if we already have a token and user data
      const token = localStorage.getItem("accessToken");
      if (token) {
        getUserData(token);
      }
    }
  }, []);

  // Function to fetch user data
  async function getUserData(token) {
    try {
      const response = await fetch(`${backend_url}/getUserData`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      const data = await response.json();
      
      if (data.error) {
        console.error("Error in user data:", data.error);
        setAuthError(data.error);
        // Token might be invalid, clear it
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
        }
      } else {
        setUser(data);  // Store user data in context
        console.log("User Data:", data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthError("Failed to fetch user profile data");
    }
  }

  // GitHub login function
  function loginWithGithub() {
    // Generate a random state parameter for CSRF protection
    const state = generateRandomString(16);
    sessionStorage.setItem("githubOAuthState", state);
    
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=user&state=${state}&redirect_uri=http://localhost:5173/auth`
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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gradient-to-b from-[#000000] to-[#350957] p-8 rounded-lg">
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Login to Refiner AI
        </h2>
        {authError && <div className="text-red-500 mb-4 text-center">{authError}</div>}
        <div className="flex justify-center">
          <button 
            className="bg-white text-black py-2 px-4 rounded-3xl hover:bg-gray-200 transition"
            onClick={loginWithGithub}
          >
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;