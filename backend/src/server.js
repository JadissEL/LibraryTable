import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import app from './app.js';

const port = process.env.PORT || 3000;

import apiRoutes from './routes/index.js';

app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

app.use(process.env.API_PREFIX || '/api', apiRoutes);

const staticPath = path.resolve(__dirname, '../../frontend/build');
app.use(express.static(staticPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('API available at: http://localhost:' + port + '/api');
});
