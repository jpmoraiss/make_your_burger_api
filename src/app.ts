import 'dotenv/config';

import fastify from 'fastify';
import cors from '@fastify/cors';

import { ingredientRoutes } from './controllers/ingredientRoutes';
import { statusRoutes } from './controllers/statusRoutes';
import { orderRoutes } from './controllers/orderRoutes';

export const app = fastify();

app.register(cors);
app.register(ingredientRoutes);
app.register(statusRoutes);
app.register(orderRoutes);
