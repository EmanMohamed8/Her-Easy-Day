const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying AWS Cognito infrastructure...');

try {
  // Initialize CDK if not already done
  console.log('📦 Bootstrapping CDK...');
  try {
    execSync('cdk bootstrap', { stdio: 'inherit' });
  } catch (error) {
    console.log('CDK already bootstrapped or bootstrap failed, continuing...');
  }

  // Deploy the stack
  console.log('🏗️  Deploying Cognito stack...');
  const deployOutput = execSync('cdk deploy --require-approval never --outputs-file cdk-outputs.json', { 
    stdio: 'pipe',
    encoding: 'utf8'
  });

  console.log(deployOutput);

  // Read the outputs
  const outputsPath = path.join(process.cwd(), 'cdk-outputs.json');
  if (fs.existsSync(outputsPath)) {
    const outputs = JSON.parse(fs.readFileSync(outputsPath, 'utf8'));
    const stackOutputs = outputs.HerEasyDayStack;

    if (stackOutputs) {
      console.log('\n✅ Deployment successful!');
      console.log('\n📋 Your AWS Cognito configuration:');
      console.log('User Pool ID:', stackOutputs.UserPoolId);
      console.log('User Pool Client ID:', stackOutputs.UserPoolClientId);
      console.log('Identity Pool ID:', stackOutputs.IdentityPoolId);
      console.log('Region:', stackOutputs.Region);

      // Update the aws-exports.ts file
      const configContent = `// AWS Amplify Configuration - Auto-generated
// Generated on: ${new Date().toISOString()}

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: '${stackOutputs.UserPoolId}',
      userPoolClientId: '${stackOutputs.UserPoolClientId}',
      identityPoolId: '${stackOutputs.IdentityPoolId}',
      loginWith: {
        email: true,
      },
    }
  }
};

export default awsconfig;`;

      fs.writeFileSync(path.join(process.cwd(), 'src', 'aws-exports.ts'), configContent);
      console.log('\n✅ Updated src/aws-exports.ts with your configuration!');
      
      console.log('\n🎉 Your Her Easy Day app is now connected to AWS Cognito!');
      console.log('\nNext steps:');
      console.log('1. Run: npm start');
      console.log('2. Test the authentication by signing up with your email');
      console.log('3. Check your email for the confirmation code');
      console.log('4. Sign in and start using your app!');
    }
  } else {
    console.error('❌ Could not find deployment outputs');
  }

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure you have AWS credentials configured');
  console.log('2. Run: aws configure');
  console.log('3. Or set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
  console.log('4. Make sure you have the necessary permissions to create Cognito resources');
}