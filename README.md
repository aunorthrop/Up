# InventorySync - Real-time POS & E-commerce Inventory Synchronization

Automatically sync inventory between Square POS and Shopify to eliminate overselling and stockouts.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/inventorysync.git
cd inventorysync

# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Start development servers
npm run dev:all
```

Visit http://localhost:3000 to access the application.

## 📋 Prerequisites

- Node.js 18+
- MongoDB
- Square Developer Account
- Shopify Partner Account

## 🔧 Setup

1. **Database Setup**
   ```bash
   # Install MongoDB locally or use MongoDB Atlas
   # Update MONGODB_URI in backend/.env
   ```

2. **Square Setup**
   - Create app at https://developer.squareup.com
   - Get Application ID and Access Token
   - Set up webhook endpoints

3. **Shopify Setup**
   - Create app at https://partners.shopify.com
   - Configure OAuth scopes: `read_products`, `write_products`, `read_inventory`, `write_inventory`
   - Get API key and secret

4. **Environment Variables**
   ```bash
   cp backend/.env.example backend/.env
   # Fill in all the required values
   ```

## 🐳 Docker Deployment

```bash
# Build and start containers
npm run docker:up

# Stop containers
npm run docker:down
```

## 📁 Project Structure

```
inventorysync/
├── backend/           # Node.js/Express API
├── frontend/          # React application  
├── docs/              # Documentation
├── docker-compose.yml # Container orchestration
└── README.md
```

## 🔄 How It Works

1. **Connect** your Square POS and Shopify store
2. **Map** products between platforms by SKU
3. **Sync** inventory automatically via webhooks
4. **Monitor** sync status in real-time dashboard

## 📊 Features

- ✅ Real-time inventory synchronization
- ✅ Webhook-based updates
- ✅ Manual sync trigger
- ✅ Sync history and logs
- ✅ Error handling and retries
- ✅ Multi-location support
- ✅ Dashboard with analytics

## 🛠️ Development

```bash
# Run backend only
npm run dev:backend

# Run frontend only  
npm run dev:frontend

# Run both simultaneously
npm run dev:all

# Run tests
npm test
```

## 📖 API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## 🚀 Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/yourusername/inventorysync/issues)
- Email: support@yourdomain.com
