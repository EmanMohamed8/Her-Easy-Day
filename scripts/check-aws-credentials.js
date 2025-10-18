const { execSync } = require('child_process');

console.log('🔍 Checking AWS credentials...');

try {
  // Try to get AWS caller identity
  const identity = execSync('aws sts get-caller-identity', { 
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  const identityData = JSON.parse(identity);
  console.log('✅ AWS credentials are configured!');
  console.log('Account ID:', identityData.Account);
  console.log('User ARN:', identityData.Arn);
  
  // Check if user has necessary permissions by trying to list Cognito user pools
  try {
    execSync('aws cognito-idp list-user-pools --max-items 1', { 
      stdio: 'pipe'
    });
    console.log('✅ Cognito permissions verified!');
    console.log('\n🚀 You\'re ready to deploy! Run: npm run deploy-cognito');
  } catch (error) {
    console.log('⚠️  Warning: Cannot verify Cognito permissions');
    console.log('You may need additional IAM permissions for Cognito');
    console.log('Required permissions: cognito-idp:*, cognito-identity:*, iam:*');
  }
  
} catch (error) {
  console.log('❌ AWS credentials not configured or AWS CLI not installed');
  console.log('\n🔧 To fix this:');
  console.log('1. Install AWS CLI: https://aws.amazon.com/cli/');
  console.log('2. Run: aws configure');
  console.log('3. Enter your AWS Access Key ID and Secret Access Key');
  console.log('4. Set your default region (e.g., us-east-1)');
  console.log('\nOr set environment variables:');
  console.log('- AWS_ACCESS_KEY_ID');
  console.log('- AWS_SECRET_ACCESS_KEY');
  console.log('- AWS_DEFAULT_REGION');
}