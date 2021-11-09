import { Stack, App, Aspects, Duration, Tag } from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import {
  OAuthScope,
  ProviderAttribute,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolDomain, UserPoolIdentityProviderGoogle
} from '@aws-cdk/aws-cognito';

const { CDK_LOCAL } = process.env;

// とりあえず
const callbackUrl = 'http://localhost:3000'; // とりあえずローカルで
const clientId = process.env['COGNITO_PROVIDER_GOOGLE_CLIENT_ID'] ?? '';
const clientSecret = process.env['COGNITO_PROVIDER_GOOGLE_CLIENT_SECRET'] ?? '';
const domainPrefix = 'footprints-20211103'; // 適当

interface Props {
  // ...
};

export class Footprints extends Stack {
  constructor(scope: App, id: string, props: Props) {
    super(scope, id);

    this.createFunctions();
    this.createAuthentications();
  }

  createFunctions = () => {

    const bootstrapLocation = `${__dirname}/../../sample-lambda-func/target/cdk/release/bootstrap.zip`;

    const entryId = "main";
    const entryFnName = `${this.stackId}-${entryId}`;
    const entry = new lambda.Function(this, entryId, {
      functionName: entryFnName,
      description: "Rust + Lambda + CDK",
      runtime: lambda.Runtime.PROVIDED_AL2,
      handler: `${this.stackId}`, 
      code:
        CDK_LOCAL !== "true"
          ? lambda.Code.fromAsset(bootstrapLocation)
          : lambda.Code.fromBucket(s3.Bucket.fromBucketName(this, `LocalBucket`, "__local__"), bootstrapLocation),
      memorySize: 256,
      timeout: Duration.seconds(10),
      tracing: lambda.Tracing.ACTIVE,
    });

    entry.addEnvironment("AWS_NODEJS_CONNECTION_REUSE_ENABLED", "1");

    Aspects.of(entry).add(new Tag("service-type", "API"));
    Aspects.of(entry).add(new Tag("billing", `lambda-${entryFnName}`));
  };

  createAuthentications = () => {
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
  };
};
