import { useState } from 'react';
import Patreon from 'patreon';

const CLIENT_ID = import.meta.env.VITE_PATREON_CLIENT_ID;
// const CLIENT_SECRET = import.meta.env.VITE_PATREON_CLIENT_SECRET;

const usePatreonAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    // Implement Patreon authentication logic here
    // Redirect the user to Patreon for authentication
    // After successful authentication, set the state to mark the user as authenticated

    // This is a simplified example. You need to implement Patreon OAuth authentication.
    const patreonOAuthClient = Patreon.OAuth(
      CLIENT_ID,
      'https://swmap.xyz', // Replace with your redirect URL
    );

    // Redirect the user to Patreon for authentication
    window.location.href = patreonOAuthClient.getAuthorizationUrl(['identity.memberships']);
  };

  const logout = () => {
    // Implement logout logic (clear token, reset state, etc.)
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

export default usePatreonAuth;
