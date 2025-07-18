import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './libs/posgreSqlDb/config/database';
import uploadRoutes from './routes/upload.routes';
import loginRoute from './routes/auth.routes';
import meRouter from './routes/me.routes';
import projectRouter from './routes/project.routes';
import postRouter from './routes/posts.routes';
import cors from 'cors';
import authentication from './middleware/authentication';

// Load environment variables
dotenv.config();


const app = express();
// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins by default, can be restricted
}));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/', (_req, res) => {
  res.send(' Welcome to the GlobeStar Backend API!');
});

// Routes
app.use('/api/v1/auth', loginRoute);
app.use(authentication);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/projects', projectRouter);



// Error Handling Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message || 'An unexpected error occurred',
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync({ alter: true }); // { force: true } for dropping and recreating tables
    console.log('Sequelize synced with models');

    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
});
