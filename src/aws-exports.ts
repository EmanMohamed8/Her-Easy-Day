// AWS Amplify Configuration based on AWS documentation
// Replace these values with your actual Cognito User Pool details from AWS Console

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_iobNhdsOp', // Your User Pool ID from AWS example
      userPoolClientId: '6ldbib0plt1475cddccq49lgqi', // Your App Client ID from AWS example
      loginWith: {
        email: true,
        username: false,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    }
  }
};

export default awsconfig;