import React from 'react';
import Repos from '../components/repos'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext.jsx';  

function Home({userData}) {
  const navigate = useNavigate();
  const { setUser } = useUser(); 

  return (
    <div>
      <h1>Home</h1>
      <h1>Welcome, {userData.login}!</h1>
          {userData.avatar_url && <img src={userData.avatar_url} alt="Avatar" width="100" style={{ borderRadius: '50%' }} />}
          <p>Name: {userData.login || 'Not provided'}</p>
          <p>URL: <a href={userData.html_url} target="_blank" rel="noopener noreferrer">{userData.html_url}</a></p>

      <button onClick={() => { 
            localStorage.removeItem("accessToken"); 
            setUser(null);  // Clear user data in context
          }}>
            Logout
      </button>
          <Repos/>
    </div>
  );
}

export default Home;
