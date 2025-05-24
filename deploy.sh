#!/bin/bash

# Build the application in production mode
echo "Building for production..."
npm run build

# Create a temporary directory for the deployment files
echo "Creating deployment package..."
mkdir -p deploy

# Copy the build files to the deploy directory
cp -r dist/* deploy/

# Create or update the .env.production file
cat > deploy/.env.production << EOL
VITE_API_URL=http://185.164.173.134:8085/api
VITE_MEDIA_URL=http://185.164.173.134:8085/api/file
EOL

# Zip the deployment package
echo "Creating archive..."
cd deploy
zip -r ../soundy-client-deploy.zip .
cd ..

# Optional: Deploy to the server via SSH
# (Uncomment and adjust these lines as needed)
echo "Deploying to server..."
scp soundy-client-deploy.zip user@185.164.173.134:/path/to/web/directory/
ssh user@185.164.173.134 "cd /path/to/web/directory/ && unzip -o soundy-client-deploy.zip && rm soundy-client-deploy.zip"

# Clean up
echo "Cleaning up..."
rm -rf deploy
rm soundy-client-deploy.zip

echo "Deployment completed!" 