import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { useEffect } from 'react';

const requestUrl = process.env['NEXT_PUBLIC_API_HOST'] ?? '';

const Index = (): JSX.Element => {
  useEffect(() => {
    Auth.configure({
      region: process.env['NEXT_PUBLIC_COGNITO_REGION'],
      userPoolId: process.env['NEXT_PUBLIC_COGNITO_USER_POOL_ID'],
      userPoolWebClientId: process.env['NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID'],
      oauth: {
        domain: process.env['NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN'],
        redirectSignIn: process.env['NEXT_PUBLIC_COGNITO_OAUTH_REDIRECT_URL'],
        scope: ['openid'],
        responseType: 'token',
      },
      storage: sessionStorage,
    });
  }, []);

  const signIn = () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  };

  const getUser = () => {
    Auth.currentSession().then(console.log);
  };

  const request = () => {
    Auth.currentSession().then((session) => {
      const token = session.getIdToken().getJwtToken();
      return fetch(requestUrl, { headers: { Authorization: token } })
        .then((response) => response.status === 200);
    })
      .then(console.log);
  };

  return (
    <div>
      <button onClick={signIn}>signIn</button>
      <button onClick={getUser}>getUser</button>
      <button onClick={request}>request</button>
    </div>
  );
};

export default Index;
