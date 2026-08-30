import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createApp } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 6060;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    const app = createApp();

    app.listen(PORT, HOST, () => {
      console.log(`[Universal Enterprise Backend] Server running on http://${HOST}:${PORT}`);
      console.log(`[Universal Enterprise Backend] Health status available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Universal Enterprise Backend] Startup failure:', error);
    process.exit(1);
  }
};

startServer();
