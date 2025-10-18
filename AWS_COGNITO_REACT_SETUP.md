# AWS Cognito Authentication Setup for React

This guide implements AWS Cognito authentication using the official AWS approach adapted for React applications.

## 🚀 Quick Start

### Option 1: Use Existing AWS Cognito Pool (Recommended)

If you already have a Cognito User Pool set up:

1. **Configure your app**:
   ```bash
   npm run setup-cognito
   ```
   
2. **Start your app**:
   ```bash
   npm start
   ```

3. **Test authentication** - The app will show a login screen where you can sign up/sign in.

### Option 2: Create New Cognito User Pool

If you need to create a new User Pool:

1. **Deploy infrastructure**:
   ```bash
   npm run deploy-cognito
   ```

2. **Start your app**:
   ```bash
   npm start
   ```

## 📋 What You Need from AWS Console

To configure authentication, you need these values from your AWS Cognito User Pool:

1. **User Pool ID**: Found in Cognito > User Pools > Your Pool
   - Format: `us-east-1_XXXXXXXXX`

2. **App Client ID**: Found in User Pool > App Integration > App Clients
   - Format: Long alphanumeric string

3. **Region**: The AWS region where your User Pool is located
   - Example: `us-east-1`, `eu-west-1`, etc.

## 🔧 Manual Configuration

If you prefer to manually update the configuration:

Edit `src/aws-exports.ts`:

```typescript
const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'YOUR_USER_POOL_ID',
      userPoolClientId: 'YOUR_CLIENT_ID',
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
```

## 🎨 Authentication Features

Your app now includes:

### Built-in Authentication UI
- ✅ Sign up with email verification
- ✅ Sign in with email/password
- ✅ Password reset functionality
- ✅ Email verification flow
- ✅ Responsive design that matches your app

### User Session Management
- ✅ Automatic session persistence
- ✅ Secure token handling
- ✅ User info display in navigation
- ✅ Sign out functionality

### Security Features
- ✅ Password requirements (8+ chars, upper, lower, numbers)
- ✅ Email verification required
- ✅ Secure token storage
- ✅ Session timeout handling

## 🎯 How It Works

1. **App Wrapper**: `withAuthenticator` HOC wraps your entire app
2. **Automatic Redirect**: Unauthenticated users see login screen
3. **Session Management**: AWS Amplify handles all token management
4. **User Context**: User info is passed to your components
5. **Sign Out**: Built-in sign out functionality

## 🔒 User Pool Configuration

Your Cognito User Pool should be configured with:

### Sign-in Options
- ✅ Email address (primary)
- ❌ Username (disabled for simplicity)

### Required Attributes
- ✅ Email (required and verified)

### Password Policy
- Minimum 8 characters
- Require uppercase letters
- Require lowercase letters  
- Require numbers
- Special characters optional

### App Client Settings
- ❌ Generate client secret: **DISABLED** (required for web apps)
- ✅ Enable SRP authentication
- ✅ Enable email verification

## 🎨 Customization

### Custom Login UI
The authentication UI is customized with your app's branding:
- Her Easy Day logo and colors
- Custom welcome message
- Matches your app's design theme

### Navigation Integration
- User's email displayed in navigation
- Sign out button with proper styling
- Seamless integration with your existing UI

## 🐛 Troubleshooting

### Common Issues

1. **"User does not exist"**
   - User hasn't verified their email
   - Check spam folder for verification email

2. **"Invalid verification code"**
   - Code expired (valid for 24 hours)
   - Use the most recent code from email

3. **"NotAuthorizedException"**
   - Wrong email/password combination
   - Account may be locked after multiple failed attempts

4. **Configuration errors**
   - Double-check User Pool ID and Client ID
   - Ensure region is correct
   - Verify App Client has no secret

### Getting Help

1. Check AWS CloudWatch logs for detailed errors
2. Verify your User Pool configuration in AWS Console
3. Test with a fresh email address
4. Check network connectivity

## 💰 Cost Information

AWS Cognito pricing:
- **Free Tier**: 50,000 monthly active users
- **After Free Tier**: $0.0055 per monthly active user
- **Email verification**: Included in free tier

Most personal projects stay within the free tier.

## 🔐 Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive config
3. **Enable MFA** for your AWS account
4. **Monitor usage** through AWS CloudWatch
5. **Regularly review** user pool settings

## 🎉 You're All Set!

Your Her Easy Day app now has:
- 🔐 Secure user authentication
- 📧 Email verification
- 🔄 Session management
- 🎨 Beautiful, branded login UI
- 📱 Mobile-responsive design

Users can now securely sign up, verify their email, and access their personal wellness dashboard!