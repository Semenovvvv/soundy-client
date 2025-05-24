# Soundy Client Deployment Guide

This guide outlines the steps to deploy the Soundy client application to a VPS.

## Prerequisites

- Node.js 18+ installed on both local and remote machines
- SSH access to your VPS
- Web server (Nginx/Apache) configured on your VPS
- Domain name configured (optional)

## Configuration

The application uses environment variables to handle different deployment environments:

- Development: Points to `localhost:8085` for API endpoints
- Production: Points to your VPS IP address (`185.164.173.134:8085`) for API endpoints

## Deployment Methods

### Method 1: Using the Deployment Script

1. Update the `deploy.sh` script with your VPS credentials:
   ```bash
   # Modify these lines
   scp soundy-client-deploy.zip user@185.164.173.134:/path/to/web/directory/
   ssh user@185.164.173.134 "cd /path/to/web/directory/ && unzip -o soundy-client-deploy.zip && rm soundy-client-deploy.zip"
   ```

2. Run the deployment script:
   ```bash
   npm run deploy
   ```

### Method 2: Manual Deployment

1. Build the application for production:
   ```bash
   npm run build:prod
   ```

2. Transfer the build files to your VPS:
   ```bash
   scp -r dist/* user@185.164.173.134:/path/to/web/directory/
   ```

3. Ensure your web server is configured to serve the application correctly.

## Web Server Configuration

### Nginx Example

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    # Or if no domain, use your server IP
    # server_name 185.164.173.134;

    root /path/to/web/directory;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to your backend
    location /api {
        proxy_pass http://localhost:8085;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

1. **API Connection Issues**: If the application can't connect to the API, check:
   - The API server is running on your VPS
   - Your firewall allows connections to port 8085
   - The configuration in `src/config/index.ts` has the correct production URL

2. **Blank Page After Deployment**: This is often due to incorrect base paths. Make sure:
   - All assets are being loaded from the correct path
   - The web server is configured to serve the SPA correctly

3. **CORS Issues**: If API requests are blocked by CORS, ensure:
   - Your API is configured to accept requests from your client domain/IP
   - The correct headers are being sent with requests

## Updating the Deployment

To update an existing deployment, simply run the deployment script again or manually build and upload the files. 