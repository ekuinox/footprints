import { OpenAPI } from 'openapi-types';
import { Function } from "@aws-cdk/aws-lambda";
import { CfnOutput, Stack } from "@aws-cdk/core";
import { ServicePrincipal } from "@aws-cdk/aws-iam";
import { CfnApi, CfnStage } from '@aws-cdk/aws-apigatewayv2';

export type ApiDocument = OpenAPI.Document;
export type HttpMethod = 'get' | 'post' | 'head' | 'put' | 'delete' | 'patch';
export type Handler = readonly [
  name: string,
  path: string,
  method: HttpMethod,
  function: Function
];

export const createApi = (
  stack: Stack,
  schema: ApiDocument,
  handlers: ReadonlyArray<Handler>
): [CfnApi, CfnStage, CfnOutput] => {
  if (schema.paths != null) {
    for (const [, path, method, handler] of handlers) {
      const resource = schema.paths[path];
      if (resource == null) {
        continue;
      }
      const item = resource[method];
      if (item == null) {
        continue;
      }
      Object.assign(item, {
        'x-amazon-apigateway-integration': {
          type: 'AWS_PROXY',
          httpMethod: method.toUpperCase(),
          uri: handler.functionArn,
          payloadFormatVersion: '2.0',
        }
      });
    }
  }

  const api = new CfnApi(stack, 'CfnApi', {
    body: schema,
  });

  const principal = new ServicePrincipal('apigateway.amazonaws.com');

  for (const [name, , , handler] of handlers) {
    handler.addPermission(
      `${name}-permission`,
      {
        principal,
        action: 'lambda:InvokeFunction',
        sourceArn: `arn:aws:execute-api:${stack.region}:${stack.account}:${api.ref}/*/*/*`
      },
    );
  }

  const stage = new CfnStage(stack, 'CfnStage', {
    apiId: api.ref,
    stageName: '$default',
    autoDeploy: true,
  });

  const output = new CfnOutput(stack, 'CfnOutput', {
    value: api.attrApiEndpoint,
  });

  return [api, stage, output];
};
