import { closeDB, connectToDatabase } from 'src/db/connection'
import config from 'src/config'
import { createApp } from 'src/app'

const app = createApp();

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const terminate = async () => {
  await closeDB();
  process.exit(0);

}

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await terminate();
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await terminate();
});

startServer();
