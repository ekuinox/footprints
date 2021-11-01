import { CognitoAccessToken, CognitoIdToken, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/router'

const Callback = () => {
  const router = useRouter();
  const { access_token, id_token, token_type, expires_in } = router.query;

  console.log([access_token, id_token, token_type, expires_in]);

  if (typeof id_token != 'string' || typeof access_token != 'string') {
    return (
      <>
      </>
    );
  }

  const session = new CognitoUserSession({
    IdToken: new CognitoIdToken({ IdToken: id_token }),
    AccessToken: new CognitoAccessToken({ AccessToken: access_token }),
  });

  console.log(session);

  console.log(session.getIdToken().decodePayload());

  return (
    <>
      {JSON.stringify(session.getIdToken().decodePayload())}
    </>
  );
};

export default Callback;
