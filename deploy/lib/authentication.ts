import { Stack } from "@aws-cdk/core";
import { UserPool, UserPoolIdentityProviderGoogle, ProviderAttribute, UserPoolDomain, UserPoolClient, OAuthScope, UserPoolClientIdentityProvider } from "@aws-cdk/aws-cognito";

export interface AuthenticationProps {
  callbackUrl: string;
  google: {
    clientId: string;
    clientSecret: string;
  },
  domainPrefix: string;
};

export const defaultAuthenticationProps: AuthenticationProps = {
  callbackUrl: 'http://localhost:3000', // とりあえずローカルで
  google: {
    clientId: process.env['COGNITO_PROVIDER_GOOGLE_CLIENT_ID'] ?? '',
    clientSecret: process.env['COGNITO_PROVIDER_GOOGLE_CLIENT_SECRET'] ?? '',
  },
  domainPrefix: 'footprints-20211103', // 適当
};

export const createAuthentications = (
  stack: Stack,
  props?: AuthenticationProps
) => {
  const {
    callbackUrl,
    google,
    domainPrefix,
  } = props ?? defaultAuthenticationProps;
  const { clientId, clientSecret } = google;
  const userPool = new UserPool(stack, 'UserPool', {
    standardAttributes: {
      email: {
        required: false,
      },
    },
  });

  if (clientId.length === 0 || clientSecret.length === 0) {
    console.log(process.env);
    throw new Error('clientId or clientSecret is not set');
  }

  const googleIdentityProvider = new UserPoolIdentityProviderGoogle(stack, 'UserPoolIdentityProviderGoogle', {
    userPool,
    clientId,
    clientSecret,
    scopes: ['profile', 'email', 'openid'],
    attributeMapping: {
      email: ProviderAttribute.GOOGLE_EMAIL,
    },
  });
  userPool.registerIdentityProvider(googleIdentityProvider);

  const userPoolDomain = new UserPoolDomain(stack, 'UserPoolDomain', {
    userPool,
    cognitoDomain: {
      domainPrefix,
    },
  });

  const userPoolClient = new UserPoolClient(stack, 'UserPoolClient', {
    userPool,
    generateSecret: false,
    oAuth: {
      flows: {
        authorizationCodeGrant: false,
        implicitCodeGrant: true,
      },
      callbackUrls: [callbackUrl],
      logoutUrls: [callbackUrl],
      scopes: [
        OAuthScope.OPENID,
        OAuthScope.EMAIL,
        OAuthScope.PROFILE
      ],
    },
    supportedIdentityProviders: [
      UserPoolClientIdentityProvider.GOOGLE,
    ],
  });
  userPoolClient.node.addDependency(googleIdentityProvider);
};
