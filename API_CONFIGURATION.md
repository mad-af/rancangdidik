# API Configuration Guide

## Overview

This project now supports flexible API base URL configuration, allowing you to easily switch between different API endpoints (local development, staging, production, etc.).

## Configuration

### Environment Variables

Set the `NEXT_PUBLIC_API_BASE_URL` environment variable to configure the API base URL:

```bash
# For local development (default - relative URLs)
NEXT_PUBLIC_API_BASE_URL=""

# For local development with explicit localhost
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"

# For staging environment
NEXT_PUBLIC_API_BASE_URL="https://staging-api.yourdomain.com"

# For production environment
NEXT_PUBLIC_API_BASE_URL="https://api.yourdomain.com"
```

### Setup Steps

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and set your API base URL:**
   ```bash
   NEXT_PUBLIC_API_BASE_URL="https://your-api-domain.com"
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Usage Examples

### Default (Relative URLs)
When `NEXT_PUBLIC_API_BASE_URL` is empty or not set:
- API calls will use relative URLs like `/api/documents`
- Perfect for local development and same-domain deployments

### External API Server
When `NEXT_PUBLIC_API_BASE_URL` is set to `https://api.example.com`:
- API calls will use full URLs like `https://api.example.com/api/documents`
- Perfect for microservices architecture or external API servers

### Local Development with Different Port
When `NEXT_PUBLIC_API_BASE_URL` is set to `http://localhost:8000`:
- API calls will use `http://localhost:8000/api/documents`
- Perfect when your API server runs on a different port

## API Configuration File

The configuration is centralized in `src/lib/config/api.ts`:

```typescript
import { API_URLS } from '@/lib/config/api';

// Use in your API functions
const response = await fetch(API_URLS.documents);
```

## Benefits

1. **Environment Flexibility**: Easy switching between development, staging, and production
2. **Centralized Configuration**: All API URLs managed in one place
3. **Type Safety**: TypeScript support for API endpoints
4. **Easy Deployment**: No code changes needed for different environments
5. **Microservices Ready**: Support for external API servers

## Troubleshooting

### CORS Issues
If you're using an external API server, make sure CORS is properly configured on your API server to allow requests from your frontend domain.

### Environment Variables Not Working
- Make sure the variable starts with `NEXT_PUBLIC_`
- Restart your development server after changing environment variables
- Check that `.env.local` is in your project root directory

### API Calls Failing
- Verify the API base URL is correct and accessible
- Check browser network tab for the actual URLs being called
- Ensure your API server is running and responding