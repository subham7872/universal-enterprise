import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createApp } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    const app = createApp();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Universal Enterprise Backend] Server running on http://0.0.0.0:${PORT}`);
      console.log(`[Universal Enterprise Backend] Health status available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Universal Enterprise Backend] Startup failure:', error);
    process.exit(1);
  }
};

startServer();
