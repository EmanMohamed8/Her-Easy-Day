// AWS Amplify Configuration
// You'll need to replace these values with your actual Cognito User Pool details

const awsconfig = {
  Auth: {
    region: 'us-east-1', // Replace with your region
    userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your User Pool ID
    userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your App Client ID
    mandatorySignIn: true,
    authenticationFlowType: 'USER_SRP_AUTH'
  }
};

export default awsconfig;