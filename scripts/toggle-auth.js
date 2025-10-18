const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

const isAuthEnabled = appContent.includes('export default withAuthenticator');

if (isAuthEnabled) {
  // Disable authentication
  const newContent = appContent
    .replace('Amplify.configure(awsconfig);', '// Amplify.configure(awsconfig);')
    .replace('export default withAuthenticator(App,', '// export default withAuthenticator(App,')
    .replace(/^\/\/ Temporarily export without authentication[\s\S]*?export default App;/m, 
      'export default App;')
    .replace(/^\/\/ Export with AWS Cognito authentication wrapper \(commented out for testing\)[\s\S]*?\*\//m, 
      `// Export with AWS Cognito authentication wrapper (commented out for testing)
/*
export default withAuthenticator(App, {
  // Customize the authentication UI
  components: {
    Header() {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ 
            color: '#8B5A83', 
            fontSize: '2rem', 
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Her Easy Day 💖
          </h1>
          <p style={{ color: '#A78295' }}>
            Your personal wellness companion
          </p>
        </div>
      );
    },
  },
});
*/`);
  
  console.log('🔓 Authentication DISABLED - App runs without login');
} else {
  // Enable authentication
  const newContent = appContent
    .replace('// Amplify.configure(awsconfig);', 'Amplify.configure(awsconfig);')
    .replace('export default App;', '// export default App;')
    .replace(/\/\*[\s\S]*?\*\//m, '')
    .replace('// Export with AWS Cognito authentication wrapper (commented out for testing)', 
      'export default withAuthenticator(App, {\n  // Customize the authentication UI\n  components: {\n    Header() {\n      return (\n        <div style={{ textAlign: \'center\', padding: \'2rem\' }}>\n          <h1 style={{ \n            color: \'#8B5A83\', \n            fontSize: \'2rem\', \n            fontWeight: \'bold\',\n            marginBottom: \'0.5rem\'\n          }}>\n            Her Easy Day 💖\n          </h1>\n          <p style={{ color: \'#A78295\' }}>\n            Your personal wellness companion\n          </p>\n        </div>\n      );\n    },\n  },\n});');
  
  console.log('🔐 Authentication ENABLED - Users must login');
}

fs.writeFileSync(appPath, newContent);
console.log('✅ App configuration updated!');