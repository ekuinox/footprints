import * as core from "@aws-cdk/core";
import { OAuthScope, ProviderAttribute, UserPool, UserPoolClient, UserPoolClientIdentityProvider, UserPoolDomain, UserPoolIdentityProviderGoogle } from '@aws-cdk/aws-cognito';

// とりあえず
const callbackUrl = 'http://localhost:3000'; // とりあえずローカルで
const clientId = process.env['COGNITO_PROVIDER_GOOGLE_CLIENT_ID'] ?? '';
const clientSecret = process.env['COGNITO_PROVIDER_GOOGLE_CLIENT_SECRET'] ?? '';
const domainPrefix = 'footprints-20211103'; // 適当

export class CognitoStack extends core.Stack {
  constructor(
    scope: core.Construct,
    id: string,
    props?: core.StackProps
  ) {
    super(scope, id, props);

    const userPool = new UserPool(this, 'UserPool', {
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

    const googleIdentityProvider = new UserPoolIdentityProviderGoogle(this, 'UserPoolIdentityProviderGoogle', {
      userPool,
      clientId,
      clientSecret,
      scopes: ['profile', 'email', 'openid'],
      attributeMapping: {
        email: ProviderAttribute.GOOGLE_EMAIL,
      },
    });
    userPool.registerIdentityProvider(googleIdentityProvider);

    const userPoolDomain = new UserPoolDomain(this, 'UserPoolDomain', {
      userPool,
      cognitoDomain: {
        domainPrefix,
      },
    });

    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
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
  }
};
