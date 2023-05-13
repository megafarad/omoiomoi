import {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';

export function useGetToken() {
  const [token, setToken] = useState(null);
  const { getAccessTokenSilently, getAccessTokenWithPopup, isAuthenticated } = useAuth0();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        setToken(await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: process.env.REACT_APP_AUTH0_SCOPE,
          },
        }));
      } catch (e) {
        setToken(await getAccessTokenWithPopup({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: process.env.REACT_APP_AUTH0_SCOPE,
          }
        }));
      }
    }
    if (isAuthenticated) {
      getAccessToken()
        .catch(console.error);
    }
  }, [getAccessTokenSilently, getAccessTokenWithPopup, isAuthenticated]);

  return token;
}

export default useGetToken;
