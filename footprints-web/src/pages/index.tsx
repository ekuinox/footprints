import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

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
});

const Index = (): JSX.Element => {
  const signIn = () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  };

  const getUser = () => {
    Auth.currentSession().then(console.log);
  };

  return (
    <div>
      <button onClick={signIn}>signIn</button>
      <button onClick={getUser}>getUser</button>
    </div>
  );
};

export default Index;
