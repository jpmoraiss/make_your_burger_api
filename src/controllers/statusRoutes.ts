import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function statusRoutes(app: FastifyInstance) {
  app.post('/status/create', async (request, reply) => {
    const bodySchema = z.object({
      status: z.string().toLowerCase(),
    });

    try {
      const { status } = bodySchema.parse(request.body);

      const statusObj = await prisma.status.create({
        data: {
          tipo: status,
        },
      });

      return statusObj;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return { error };
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code && error.code === 'P2002') {
          reply.status(400);
          return { error: 'Status already registered.' };
        }
      }
    }
  });

  app.delete('/status/remove/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    try {
      const { id } = paramsSchema.parse(request.params);

      const removedStatus = await prisma.status.delete({
        where: {
          id,
        },
      });

      return removedStatus;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return { error };
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code && error.code === 'P2025') {
          reply.status(404);
          return { error: 'Status not found.' };
        }
      }
    }
  });

  app.get('/status', async () => {
    const statuses = await prisma.status.findMany();

    return statuses;
  });
}
