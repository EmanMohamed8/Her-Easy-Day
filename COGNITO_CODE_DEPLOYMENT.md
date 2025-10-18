# AWS Cognito Code-Based Deployment

This guide will help you deploy AWS Cognito infrastructure using code (AWS CDK) for your Her Easy Day application.

## Prerequisites

1. **AWS Account** - You need an active AWS account
2. **AWS CLI** - Install and configure AWS CLI with your credentials
3. **Node.js** - Already installed (you're running a React app)

## Quick Setup

### Step 1: Configure AWS Credentials

You have several options:

**Option A: AWS CLI (Recommended)**
```bash
# Install AWS CLI if not installed
# Then configure your credentials
aws configure
```

**Option B: Environment Variables**
```bash
# Set these in your terminal or .env file
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

**Option C: AWS Profile**
```bash
# If you have multiple AWS accounts
export AWS_PROFILE=your-profile-name
```

### Step 2: Deploy Cognito Infrastructure

Run the deployment script:

```bash
npm run deploy-cognito
```

This will:
- ✅ Create a Cognito User Pool
- ✅ Create a User Pool Client
- ✅ Create an Identity Pool
- ✅ Set up proper IAM roles
- ✅ Configure email verification
- ✅ Update your `src/aws-exports.ts` automatically

### Step 3: Test Your App

```bash
npm start
```

Your app will now have:
- 🔐 User registration with email verification
- 🔑 Secure login/logout
- 👤 User session management
- 🛡️ Protected routes

## What Gets Created

The deployment creates these AWS resources:

### Cognito User Pool
- **Name**: `her-easy-day-users`
- **Sign-in**: Email address
- **Verification**: Email verification required
- **Password Policy**: Minimum 8 characters, requires uppercase, lowercase, and numbers

### User Pool Client
- **Name**: `her-easy-day-client`
- **Type**: Public client (no secret)
- **Auth Flows**: SRP authentication
- **OAuth**: Enabled with email, openid, profile scopes

### Identity Pool
- **Name**: `her-easy-day-identity-pool`
- **Unauthenticated Access**: Disabled
- **Federated**: Connected to User Pool

### IAM Roles
- **Authenticated Role**: Basic permissions for authenticated users
- **Policies**: Cognito Sync and Identity permissions

## Configuration Output

After deployment, you'll see output like:
```
✅ Deployment successful!

📋 Your AWS Cognito configuration:
User Pool ID: us-east-1_XXXXXXXXX
User Pool Client ID: xxxxxxxxxxxxxxxxxxxxxxxxxx
Identity Pool ID: us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Region: us-east-1
```

## Troubleshooting

### Common Issues:

1. **"Unable to resolve credentials"**
   - Run `aws configure` to set up your credentials
   - Or set AWS environment variables

2. **"Access Denied"**
   - Make sure your AWS user has permissions to create Cognito resources
   - Required permissions: `cognito-idp:*`, `cognito-identity:*`, `iam:*`

3. **"Stack already exists"**
   - If you need to redeploy, first run: `npm run destroy-cognito`
   - Then run: `npm run deploy-cognito`

4. **"CDK not found"**
   - Make sure CDK is installed: `npm install -g aws-cdk`

### Getting Help

If you encounter issues:
1. Check the AWS CloudFormation console for detailed error messages
2. Verify your AWS credentials and permissions
3. Make sure you're in the correct AWS region

## Cleanup

To remove all AWS resources:
```bash
npm run destroy-cognito
```

⚠️ **Warning**: This will delete all user data and cannot be undone!

## Cost

AWS Cognito pricing:
- **Free Tier**: 50,000 monthly active users
- **After Free Tier**: $0.0055 per monthly active user
- **SMS**: Additional charges for SMS verification (if enabled)

For most personal projects, you'll stay within the free tier.

## Security Best Practices

1. **Never commit AWS credentials** to version control
2. **Use environment variables** for sensitive configuration
3. **Enable MFA** for your AWS account
4. **Regularly rotate** your AWS access keys
5. **Monitor usage** through AWS CloudWatch

Your Her Easy Day app now has enterprise-grade authentication! 🎉