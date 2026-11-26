import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabase } from './utils/seeder.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB & Seed Initial Data
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Organization: Godhavari Nadhi Paryavarana Parishubratha`);
      console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
    });

    await seedDatabase();
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
