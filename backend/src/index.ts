import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import locationRoutes from './routes/location.routes';
import recommendationRoutes from './routes/recommendation.routes';

app.use('/api/location', locationRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Always listen so Vercel Services can bind to the allocated port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;