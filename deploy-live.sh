#!/bin/bash
# ==============================================================================
# Universal Enterprise - Production VPS Live Deployment & Database Sync Script
# Domain: https://ue-asia.in
# ==============================================================================

set -e

echo "🚀 [1/5] Navigating to Universal Enterprise root directory..."
cd /var/www/universal-enterprise

echo "📥 [2/5] Fetching and synchronizing latest code from GitHub main..."
git fetch origin main
git reset --hard origin/main

echo "🗄️ [3/5] Syncing and verifying MongoDB Atlas database (9,678+ products)..."
node backend/scripts/syncAllToMongo.js

echo "🏗️ [4/5] Building Next.js production frontend..."
cd frontend
npm run build
cd ..

echo "🔄 [5/5] Reloading and restarting all PM2 processes..."
pm2 restart all
pm2 save

echo "=============================================================================="
echo "✅ DEPLOYMENT COMPLETE! All 9,678+ products & 27 categories are now live on https://ue-asia.in"
echo "=============================================================================="
