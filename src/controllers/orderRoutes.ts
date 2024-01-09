import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function orderRoutes(app: FastifyInstance) {
  app.post('/order/create', async (request, reply) => {
    const bodySchema = z.object({
      nome: z.string(),
      carne: z.string(),
      pao: z.string(),
      opcionais: z.string(),
      status: z.string().default('Solicitado'),
    });

    try {
      const { nome, carne, pao, opcionais, status } = bodySchema.parse(request.body);

      const order = await prisma.order.create({
        data: {
          nome,
          carne,
          pao,
          opcionais,
          status,
        },
      });

      return order;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return error.issues;
      }
    }
  });

  app.delete('/order/remove/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    try {
      const { id } = paramsSchema.parse(request.params);

      const removedOrder = await prisma.order.delete({
        where: {
          id,
        },
      });

      return removedOrder;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return error.issues;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code && error.code === 'P2025') {
          reply.status(404);
          return { error: 'Order not found.' };
        }
      }
    }
  });

  app.get('/order', async () => {
    const orders = await prisma.order.findMany();

    return orders;
  });
}
