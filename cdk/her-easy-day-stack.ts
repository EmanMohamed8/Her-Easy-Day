import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class HerEasyDayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Cognito User Pool
    const userPool = new cognito.UserPool(this, 'HerEasyDayUserPool', {
      userPoolName: 'her-easy-day-users',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        givenName: {
          required: false,
          mutable: true,
        },
        familyName: {
          required: false,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - change for production
    });

    // Create User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'HerEasyDayUserPoolClient', {
      userPool,
      userPoolClientName: 'her-easy-day-client',
      generateSecret: false, // Important: must be false for web apps
      authFlows: {
        userSrp: true,
        userPassword: false, // Disable for security
        adminUserPassword: false,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [
          'http://localhost:3000', // Development
          'https://your-domain.com', // Production - update with your actual domain
        ],
        logoutUrls: [
          'http://localhost:3000', // Development
          'https://your-domain.com', // Production - update with your actual domain
        ],
      },
      preventUserExistenceErrors: true,
    });

    // Create Identity Pool for authenticated users
    const identityPool = new cognito.CfnIdentityPool(this, 'HerEasyDayIdentityPool', {
      identityPoolName: 'her-easy-day-identity-pool',
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    // Create IAM role for authenticated users
    const authenticatedRole = new iam.Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    // Attach basic policies to authenticated role
    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'cognito-sync:*',
          'cognito-identity:*',
        ],
        resources: ['*'],
      })
    );

    // Attach the role to the identity pool
    new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
      },
    });

    // Output the configuration values
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: identityPool.ref,
      description: 'Cognito Identity Pool ID',
    });

    new cdk.CfnOutput(this, 'Region', {
      value: this.region,
      description: 'AWS Region',
    });

    // Output the configuration for easy copy-paste
    new cdk.CfnOutput(this, 'AmplifyConfig', {
      value: JSON.stringify({
        Auth: {
          Cognito: {
            userPoolId: userPool.userPoolId,
            userPoolClientId: userPoolClient.userPoolClientId,
            identityPoolId: identityPool.ref,
            loginWith: {
              email: true,
            },
          }
        }
      }, null, 2),
      description: 'Complete Amplify configuration object',
    });
  }
}