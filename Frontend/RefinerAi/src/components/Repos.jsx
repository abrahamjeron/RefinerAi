import { useState } from 'react';
import { useUser } from '../context/userContext.jsx';  

function Repos() {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser(); 
  const username = user?.login;  // Added optional chaining

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepos(data);
    } catch (error) {
      setError(error.message);
      setRepos([]);
    }
    console.log(username); // This should now log the username
    setLoading(false);
  };

  return (
    <div>
      <h2>Fetch GitHub Repositories</h2>

      <button onClick={fetchRepos} disabled={!username || loading}>
        {loading ? 'Loading...' : 'Fetch Repos'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Repos;
