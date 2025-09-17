# Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB
- Square Developer Account
- Shopify App

## Square Setup
1. Create Square application at https://developer.squareup.com
2. Get your Application ID and Access Token
3. Set up webhook endpoints for inventory changes

## Shopify Setup
1. Create Shopify app at https://partners.shopify.com
2. Configure OAuth with required scopes
3. Get API key and secret

## Environment Variables
Copy `.env.example` to `.env` and fill in your credentials.

## Running Locally
```bash
npm install
npm run dev:all
```

Visit http://localhost:3000 to access the application.
