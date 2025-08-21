# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Create your account with email/password or Google/GitHub

## Step 2: Create a New Cluster

1. After logging in, click "Create a New Cluster"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Give your cluster a name (e.g., "SecureFileStorage")
5. Click "Create Cluster" (takes 1-3 minutes)

## Step 3: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's specific IP address
5. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Clusters" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

Replace the MongoDB URI in your `.env` file:

```env
# Replace this line:
MONGODB_URI=mongodb://localhost:27017/securefile_storage

# With your Atlas connection string:
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/securefile_storage?retryWrites=true&w=majority
```

**Important:** 
- Replace `your-username` with your database username
- Replace `your-password` with your database password
- Replace `your-cluster` with your cluster name
- Add `/securefile_storage` before the `?` to specify database name

## Step 7: Test Connection

1. Start your backend server:
   ```bash
   npm run server
   ```

2. You should see: "Connected to MongoDB"

## Example .env Configuration

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://myuser:mypassword@securefilestorage.abc123.mongodb.net/securefile_storage?retryWrites=true&w=majority

# Other configurations...
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here
PORT=3001
```

## Troubleshooting

**Connection Issues:**
- Verify username/password are correct
- Check Network Access allows your IP
- Ensure database name is included in URI

**Authentication Failed:**
- Double-check database user credentials
- Verify user has proper permissions

**Network Timeout:**
- Check firewall settings
- Verify IP whitelist includes your address

## Security Best Practices

1. **Never commit credentials to git**
2. **Use environment variables for all secrets**
3. **Restrict IP access in production**
4. **Use strong passwords for database users**
5. **Enable MongoDB Atlas monitoring**

## Production Deployment Notes

For cloud deployment (Railway, Render, Heroku):
1. Set `MONGODB_URI` as environment variable in your hosting platform
2. Don't include the connection string in your code
3. Use the same Atlas cluster for all environments
4. Consider creating separate databases for dev/staging/production
