# AWS Cognito Setup Guide for Her Easy Day

This guide will help you set up AWS Cognito authentication for your Her Easy Day application.

## Prerequisites

- AWS Account
- AWS CLI installed and configured (optional but recommended)

## Step 1: Create a Cognito User Pool

1. **Go to AWS Console**
   - Navigate to AWS Cognito service
   - Click "Create user pool"

2. **Configure Sign-in Experience**
   - Choose "Email" as the sign-in option
   - Click "Next"

3. **Configure Security Requirements**
   - Password policy: Use default or customize as needed
   - Multi-factor authentication: Choose "No MFA" for now (can be enabled later)
   - Click "Next"

4. **Configure Sign-up Experience**
   - Self-service sign-up: Enable
   - Required attributes: Select "email"
   - Click "Next"

5. **Configure Message Delivery**
   - Email provider: Choose "Send email with Cognito" for testing
   - Click "Next"

6. **Integrate Your App**
   - User pool name: `her-easy-day-users`
   - App client name: `her-easy-day-client`
   - Client secret: Choose "Don't generate a client secret"
   - Click "Next"

7. **Review and Create**
   - Review your settings
   - Click "Create user pool"

## Step 2: Get Your Configuration Values

After creating the user pool, you'll need these values:

1. **User Pool ID**: Found in the user pool overview (format: `us-east-1_XXXXXXXXX`)
2. **App Client ID**: Found in the "App integration" tab (format: long alphanumeric string)
3. **Region**: The AWS region where you created the user pool (e.g., `us-east-1`)

## Step 3: Update Your Application Configuration

1. **Update `src/aws-exports.ts`**:
   ```typescript
   const awsconfig = {
     Auth: {
       Cognito: {
         userPoolId: 'YOUR_USER_POOL_ID', // e.g., 'us-east-1_XXXXXXXXX'
         userPoolClientId: 'YOUR_APP_CLIENT_ID', // Your app client ID
         loginWith: {
           email: true,
         },
       }
     }
   };
   ```

2. **Replace the placeholder values** with your actual Cognito configuration.

## Step 4: Test Your Authentication

1. **Start your development server**:
   ```bash
   npm start
   ```

2. **Test the authentication flow**:
   - Try signing up with a new email
   - Check your email for the confirmation code
   - Confirm your account
   - Sign in with your credentials

## Optional: Configure Custom Domain (Production)

For production, you may want to:

1. **Set up a custom domain** for your Cognito hosted UI
2. **Configure email templates** for better branding
3. **Enable MFA** for additional security
4. **Set up social sign-in** (Google, Facebook, etc.)

## Troubleshooting

### Common Issues:

1. **"User does not exist" error**: Make sure the user has confirmed their email
2. **"Invalid verification code"**: Check that you're using the latest code from email
3. **CORS errors**: Ensure your domain is added to the allowed origins in Cognito settings

### Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env` file in your project root:
   ```
   REACT_APP_USER_POOL_ID=your-user-pool-id
   REACT_APP_USER_POOL_CLIENT_ID=your-client-id
   ```

2. Update `aws-exports.ts` to use environment variables:
   ```typescript
   const awsconfig = {
     Auth: {
       Cognito: {
         userPoolId: process.env.REACT_APP_USER_POOL_ID,
         userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
         loginWith: {
           email: true,
         },
       }
     }
   };
   ```

## Security Best Practices

1. **Never commit** your actual AWS credentials to version control
2. **Use environment variables** for sensitive configuration
3. **Enable MFA** for production applications
4. **Regularly rotate** your app client secrets (if using them)
5. **Monitor** your Cognito usage and set up billing alerts

## Next Steps

Once authentication is working:

1. **Sync user data** with their authenticated state
2. **Implement user profiles** with additional attributes
3. **Add password reset** functionality
4. **Consider social sign-in** options
5. **Set up proper error handling** and user feedback

Your Her Easy Day app now has secure, scalable authentication powered by AWS Cognito!