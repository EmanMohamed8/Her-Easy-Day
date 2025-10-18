const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 AWS Cognito Setup for Her Easy Day');
console.log('=====================================\n');

console.log('Please provide your AWS Cognito User Pool details:');
console.log('(You can find these in your AWS Console > Cognito > User Pools)\n');

const questions = [
  {
    key: 'userPoolId',
    question: 'Enter your User Pool ID (e.g., us-east-1_XXXXXXXXX): ',
    current: 'us-east-1_iobNhdsOp'
  },
  {
    key: 'userPoolClientId', 
    question: 'Enter your User Pool Client ID: ',
    current: '6ldbib0plt1475cddccq49lgqi'
  },
  {
    key: 'region',
    question: 'Enter your AWS Region (e.g., us-east-1): ',
    current: 'us-east-1'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    updateConfig();
    return;
  }

  const q = questions[index];
  console.log(`Current: ${q.current}`);
  
  rl.question(q.question, (answer) => {
    answers[q.key] = answer.trim() || q.current;
    console.log('');
    askQuestion(index + 1);
  });
}

function updateConfig() {
  const configContent = `// AWS Amplify Configuration - Auto-generated
// Generated on: ${new Date().toISOString()}
// Based on AWS Cognito User Pool settings

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: '${answers.userPoolId}',
      userPoolClientId: '${answers.userPoolClientId}',
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

export default awsconfig;`;

  const configPath = path.join(process.cwd(), 'src', 'aws-exports.ts');
  fs.writeFileSync(configPath, configContent);

  console.log('✅ Configuration updated successfully!');
  console.log(`📁 Updated: ${configPath}`);
  console.log('\n🚀 Your configuration:');
  console.log(`   User Pool ID: ${answers.userPoolId}`);
  console.log(`   Client ID: ${answers.userPoolClientId}`);
  console.log(`   Region: ${answers.region}`);
  
  console.log('\n🎉 Setup complete! You can now:');
  console.log('1. Run: npm start');
  console.log('2. Test authentication by signing up');
  console.log('3. Check your email for verification');
  console.log('4. Sign in and use your app!');
  
  rl.close();
}

// Start the setup
askQuestion(0);